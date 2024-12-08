import logging
import datetime
import time
import requests
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from src.scrapper.config.scraper_logs import logs_scraper

def download_pdf(url, folder, filename):
    response = requests.get(url)
    os.makedirs(folder, exist_ok=True)
    filepath = os.path.join(folder, filename)
    with open(filepath, 'wb') as f:
        f.write(response.content)

def parse_date(fecha):
    try:
        date_obj = datetime.datetime.strptime(fecha, "%d-%m-%Y")
        formatted_date = date_obj.strftime("%Y-%m-%d")
        return formatted_date
    except ValueError as e:
        raise ValueError(f"Error al parsear la fecha {fecha}: {e}")

class VidocScraper:
    def __init__(self):
        self.logger, self.formatter_message = logs_scraper('Historico')
        self.options = webdriver.ChromeOptions()
        self.options.add_argument("--no-sandbox")
        self.options.add_argument("--disable-dev-shm-usage")
        self.options.add_argument("--disable-gpu")
        self.driver_vidoc = webdriver.Remote(
            command_executor='http://scraperHistorico:4444/wd/hub',
            options=self.options
        )

    def init_session(self, expVidoc):
        self.driver_vidoc.get(f'https://vidoc.impi.gob.mx/visor?usr=SIGA&texp=SI&tdoc=E&id={expVidoc["noExpediente"]}')
        time.sleep(10)

    def getTable(self):
        try:
            table = WebDriverWait(self.driver_vidoc, 15).until(
                EC.visibility_of_element_located((By.ID, "MainContent_gdDoctosExpediente"))
            )
            return table
        except Exception:
            return None

    def getRows(self, table):
        return table.find_elements(By.TAG_NAME, "tr")[1:]

    def process_table(self, row, noExpediente, noDocumento_filter, encontrado_punto_partida):
        cols = row.find_elements(By.TAG_NAME, "td")
        if len(cols) < 6:
            return None, encontrado_punto_partida

        codigoBarras = cols[1].text
        noDocumento_raw = cols[2].text
        noDocumento = noDocumento_raw.replace("/", "_")
        descripcion = cols[3].text
        tipo = cols[4].text
        fecha = cols[5].text

        fecha_formateada = parse_date(fecha) if fecha else "0000-00-00"

        documento = {
            "noDocumento": noDocumento_raw,
            "codigoBarras": codigoBarras,
            "descripcion": descripcion,
            "tipo": tipo,
            "fecha": fecha_formateada
        }

        # Cuando `noDocumento` tiene valor
        if noDocumento_filter:
            if not encontrado_punto_partida:
                if noDocumento_raw == noDocumento_filter:
                    self.logger.info(f'Documento coincidente encontrado y será el punto de partida: {documento}')
                    encontrado_punto_partida = True
                return None, encontrado_punto_partida
            else:
                # Procesar documentos después del punto de partida
                if noDocumento_raw != noDocumento_filter:
                    self.pdf_download(cols, noDocumento, noExpediente)
                    return documento, encontrado_punto_partida
        else:
            # Cuando `noDocumento` es nulo
            self.pdf_download(cols, noDocumento, noExpediente)
            return documento, encontrado_punto_partida

        return None, encontrado_punto_partida

    def pdf_download(self, cols, noDocumento, noExpediente):
        try:
            pdf_button = cols[-1].find_element(By.TAG_NAME, "input")
            pdf_button.click()
            time.sleep(8)

            modal = WebDriverWait(self.driver_vidoc, 15).until(
                EC.visibility_of_element_located((By.XPATH, '//*[@id="idModalTitle"]'))
            )

            iframes = self.driver_vidoc.find_elements(By.TAG_NAME, 'iframe')
            if iframes:
                iframe = iframes[0]
                self.driver_vidoc.switch_to.frame(iframe)
                pdf_url = self.driver_vidoc.find_element(By.XPATH, "//a").get_attribute("href")
                folder = os.path.join('src', 'common', 'PDFS', 'historico', noExpediente)
                filename = f"{noDocumento}.pdf"
                download_pdf(pdf_url, folder, filename)
                self.logger.info(f"PDF descargado y guardado como {filename}, Scrapeo Correcto")
                self.driver_vidoc.switch_to.default_content()
                self.driver_vidoc.execute_script("document.querySelector('#idModalTitle > button').click();")
                time.sleep(2)
            else:
                self.logger.error(f"No se encontraron iframes en la página.")
        except Exception as e:
            self.logger.error(f'Error al interactuar con la modal para el documento {noDocumento}: {e}')
            raise

    def process_exp(self, expVidoc):
        noExpediente = expVidoc["noExpediente"].replace("/", "_")
        noDocumento_filter = expVidoc.get("noDocumento")

        self.logger.info(f"INICIANDO scraping para el expediente {expVidoc['noExpediente']}")
        self.init_session(expVidoc)

        table = self.getTable()
        if not table:
            self.logger.info(f'noExpediente {expVidoc["noExpediente"]} sin Historico.')
            return {"noExpediente": expVidoc["noExpediente"], "data": {"msg": "noExpediente sin Historico"}}, None

        rows = self.getRows(table)
        self.logger.info(f'Encontradas {len(rows)} filas en la tabla.')

        documentos = []
        encontrado_punto_partida = False

        for row_index in range(len(rows)):
            retries_row = 3
            for attempt_row in range(retries_row):
                try:
                    table = self.getTable()
                    rows = self.getRows(table)
                    row = rows[row_index]

                    documento, encontrado_punto_partida = self.process_table(row, noExpediente, noDocumento_filter, encontrado_punto_partida)
                    if documento:
                        documentos.append(documento)
                    break
                except Exception as e:
                    self.logger.error(f'Error al interactuar con la fila en el intento {attempt_row + 1}: {e}')
                    if attempt_row == retries_row - 1:
                        return {"noExpediente": expVidoc["noExpediente"], "data": {"msg": "Error al interactuar con la fila", "error": str(e)}}, None
                    time.sleep(2)

        if documentos:
            last_document = documentos[-1]
            self.logger.info(f"Último scrapeo de {expVidoc['noExpediente']} con el noDocumento: {last_document['noDocumento']}, y la fecha: {last_document['fecha']}")

        return {"noExpediente": expVidoc["noExpediente"], "data": documentos}, documentos

    def scraperVidoc(self, patentesVidoc):
        resultado = {"correctos": [], "incorrectos": [], "horarios": {}}
        start_time = datetime.datetime.now()
        formatted_start_time = self.formatter_message.formatTime(logging.LogRecord(
            name='Historico',
            level=logging.INFO,
            pathname='',
            lineno=0,
            msg='',
            args=(),
            exc_info=None,
            created=start_time.timestamp()
        ))
        resultado["horarios"]["fechaHora_inicio"] = start_time.strftime("%Y-%m-%d %H:%M:%S")

        for expVidoc in patentesVidoc:
            try:
                correcto, documentos = self.process_exp(expVidoc)
                if documentos:
                    resultado["correctos"].append(correcto)
                else:
                    resultado["incorrectos"].append(correcto)
            except Exception as e:
                self.logger.error(f"Error al procesar el expediente {expVidoc['noExpediente']}: {e}")
                resultado["incorrectos"].append({"noExpediente": expVidoc["noExpediente"], "data": {"msg": "Error en el procesamiento del expediente", "error": str(e)}})

        end_time = datetime.datetime.now()
        formatted_end_time = self.formatter_message.formatTime(logging.LogRecord(
            name='Historico',
            level=logging.INFO,
            pathname='',
            lineno=0,
            msg='',
            args=(),
            exc_info=None,
            created=end_time.timestamp()
        ))
        resultado["horarios"]["fechaHora_fin"] = end_time.strftime("%Y-%m-%d %H:%M:%S")

        self.driver_vidoc.quit()
        return resultado
