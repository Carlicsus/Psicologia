import logging
import datetime
import time
import json
import re
import unicodedata
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from src.scrapper.config.scraper_logs import logs_scraper

class scraperNotificacion:
    def __init__(self):
        self.logger, self.formatter_message = logs_scraper('Notificacion')
        self.options = Options()
        self.correctos = []
        self.incorrectos = []
        self.options.add_argument("--no-sandbox")
        self.options.add_argument("--disable-dev-shm-usage")
        self.options.add_argument("--disable-gpu")
        self.driver = webdriver.Remote(
            command_executor='http://scraperNotificacion:4444/wd/hub',
            options=self.options
        )
        self.horarios = {}
        self.processed_exp = set()

    def start_logging(self):
        start_time = datetime.datetime.now()
        formatted_start_time = self.formatter_message.formatTime(logging.LogRecord(
            name='Notificacion',
            level=logging.INFO,
            pathname='',
            lineno=0,
            msg='',
            args=(),
            exc_info=None,
            created=start_time.timestamp()
        ))
        self.logger.info(f"INICIANDO - Fecha y Hora: {formatted_start_time}")
        self.horarios['fechaHora_inicio'] = formatted_start_time
        return start_time, formatted_start_time

    def open_website(self):
        self.driver.get('https://siga.impi.gob.mx/')
        self.logger.info('Abriendo página de SIGA')

    def click_search_tokens(self):
        time.sleep(10)
        element = WebDriverWait(self.driver, 60).until(EC.presence_of_element_located((By.XPATH, "//a[contains(text(),'Búsqueda en fichas')]")))
        element.click()
        self.logger.info('Clic en Búsqueda en fichas')

    def parse_date(self, fecha):
        try:
            date_obj = datetime.datetime.strptime(fecha, "%d/%m/%Y")
            formatted_date = date_obj.strftime("%Y-%m-%d")
            return formatted_date
        except ValueError as e:
            raise ValueError(f"Error al parsear la fecha {fecha}: {e}")

    def normalize_text(self, text):
        text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('ASCII')
        return text.lower()

    def verify_institute(self, element):
        institute_pattern = re.compile(r'INSTITUTO NACIONAL DE ASTROFISICA, OPTICA Y ELECTRONICA.* \[mx\]', re.IGNORECASE)
        try:
            solicitantes_label = element.find_element(By.XPATH, './/strong[contains(text(), "Solicitante(s)")]/following-sibling::span')
            solicitantes_text = solicitantes_label.text.strip()
            solicitantes_list = [s.strip() for s in solicitantes_text.split(';')]
            for solicitante in solicitantes_list:
                normalized_solicitante = self.normalize_text(solicitante)
                if institute_pattern.search(normalized_solicitante):
                    return True
        except Exception:
            return False
        return False

    def process_exp(self, exp):
        exp_value = exp["noExpediente"]
        fecha_circulacion = exp.get("fechaCirculacion", None)
        numero_oficio = exp.get("numeroOficio", None)
        if fecha_circulacion:
            fecha_circulacion = fecha_circulacion.split("T")[0]
            formatted_fecha_circulacion = fecha_circulacion.replace("-", "/")
        else:
            formatted_fecha_circulacion = None

        try:
            self.logger.info(f'Iniciando el proceso de búsqueda del noExpediente: {exp_value}')
            time.sleep(4)
            search_field = WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'search-term')))
            WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, 'search-term')))
            search_field.clear()
            search_field.send_keys(exp_value)
            button_xpath = '//button[@mat-raised-button and @color="success" and @type="submit"]'
            button = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, button_xpath)))
            button.click()
            self.logger.info(f'Búsqueda iniciada para el noExpediente: {exp_value}')
            time.sleep(10)
            elements = WebDriverWait(self.driver, 10).until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'div-box-shadow')))

            if numero_oficio:
                self.scrape_after_numero_oficio(elements, exp_value, numero_oficio)
            elif fecha_circulacion:
                self.scrape_after_institute(elements, exp_value)
            else:
                self.handle_elements(elements, exp_value)

            self.logger.info(f"Scrapeo exitoso para noExpediente: {exp_value}")

        except Exception as e:
            self.incorrectos.append({"noExpediente": exp_value, "msg": str(e)})
            self.logger.error(f"Scrapeo fallido para noExpediente: {exp_value}, error: {str(e)}")

    def scrape_after_numero_oficio(self, elements, exp_value, numero_oficio):
        self.logger.info("Entrando al método de scrapeo después del numeroOficio.......")
        data = []
        found_match = False
        found_notifications_after_match = False

        self.logger.info(f"Buscando notificación con número de oficio: {numero_oficio}")

        numero_oficio_str = str(numero_oficio)

        for element in reversed(elements):
            try:
                element_data = self.extract_element_data(element, exp_value)
                if element_data is None:
                    continue

                element_numero_oficio = element_data.get("numeroOficio")
                element_numero_oficio_str = str(element_numero_oficio) if element_numero_oficio is not None else None

                if element_numero_oficio_str == numero_oficio_str:
                    found_match = True
                    continue

                if found_match:
                    found_notifications_after_match = True
                    if element_data:
                        data.append(element_data)

            except Exception as e:
                self.logger.error(f"Error procesando notificación: {str(e)}")

        if not found_match:
            self.incorrectos.append({"noExpediente": exp_value, "msg": "No se encontró una notificación con el número de oficio proporcionado"})
        elif not found_notifications_after_match:
            self.incorrectos.append({"noExpediente": exp_value, "msg": "No hay más notificaciones después de la notificación coincidente"})
        else:
            if data:
                has_otorgamiento_patente = any(entry.get("descripcionGeneralAsunto") == "Otorgamiento de Patente" for entry in data)
                result = {"noExpediente": exp_value, "data": data}
                if has_otorgamiento_patente:
                    result["estatus"] = False
                self.correctos.append(result)

    def scrape_after_institute(self, elements, exp_value):
        found_institute = False
        data = []

        for element in reversed(elements):
            if self.verify_institute(element):
                found_institute = True
                continue

            if found_institute:
                try:
                    data_entry = self.extract_element_data(element, exp_value)
                    if data_entry:
                        data.append(data_entry)
                except Exception as e:
                    self.logger.error(f"Error en la extracción de datos para {exp_value}: {str(e)}")

        if data:
            has_otorgamiento_patente = any(entry.get("descripcionGeneralAsunto") == "Otorgamiento de Patente" for entry in data)
            result = {"noExpediente": exp_value, "data": data}
            if has_otorgamiento_patente:
                result["estatus"] = False
            self.correctos.append(result)

    def handle_elements(self, elements, exp_value):
        data = []

        for element in elements:
            try:
                data_entry = self.extract_element_data(element, exp_value)
                if data_entry:
                    data.append(data_entry)
            except Exception as e:
                self.logger.error(f"Error en la extracción de datos para {exp_value}: {str(e)}")

        if data:
            has_otorgamiento_patente = any(entry.get("descripcionGeneralAsunto") == "Otorgamiento de Patente" for entry in data)
            has_publicacion_solicitud = any(entry.get("descripcionGeneralAsunto") == "Publicación de solicitud" for entry in data)

            if has_otorgamiento_patente or has_publicacion_solicitud:
                data.reverse()
            result = {"noExpediente": exp_value, "data": data}
            if has_otorgamiento_patente:
                result["estatus"] = False
            self.correctos.append(result)

    def extract_element_data(self, element, exp_value):
        data_entry = {
            "ejemplar": None,
            "gaceta": None,
            "seccion": None,
            "fechaCirculacion": None,
            "descripcionGeneralAsunto": None,
            "fechaOficio": None,
            "numeroOficio": None
        }

        general_divs = element.find_elements(By.CSS_SELECTOR, '.col-12.md\\:col-6.lg\\:col-5.ng-tns-c362811556-5')

        for general_div in general_divs:
            ejemplar = self.extract_data_from_div(general_div, "Ejemplar")
            if ejemplar:
                data_entry["ejemplar"] = ejemplar

            gaceta = self.extract_data_from_div(general_div, "Gaceta")
            if gaceta:
                data_entry["gaceta"] = gaceta

            seccion = self.extract_data_from_div(general_div, "Sección")
            if seccion:
                data_entry["seccion"] = seccion

            fecha_circulacion = self.extract_data_from_div(general_div, "Fecha Puesta Circulación")
            if fecha_circulacion:
                try:
                    data_entry["fechaCirculacion"] = self.parse_date(fecha_circulacion)
                except ValueError as e:
                    self.logger.error(e)

        specific_divs = element.find_elements(By.CLASS_NAME, 'ng-tns-c362811556-5')

        for specific_div in specific_divs:
            descripcion_general_asunto = self.extract_data_from_span(specific_div, "Descripción general del asunto")
            if descripcion_general_asunto:
                data_entry["descripcionGeneralAsunto"] = descripcion_general_asunto

            fecha_oficio = self.extract_data_from_span(specific_div, "Fecha del Oficio")
            if fecha_oficio:
                data_entry["fechaOficio"] = fecha_oficio

            numero_oficio = self.extract_data_from_span(specific_div, "Número del Oficio")
            if numero_oficio:
                data_entry["numeroOficio"] = numero_oficio

        if self.verify_institute(element):
            data_entry["descripcionGeneralAsunto"] = "Publicación de solicitud"
            data_entry["fechaOficio"] = None
            data_entry["numeroOficio"] = None

        if data_entry["seccion"] == "Patentes":
            if data_entry["descripcionGeneralAsunto"] is None or data_entry["descripcionGeneralAsunto"].strip() == "":
                data_entry["descripcionGeneralAsunto"] = "Otorgamiento de Patente"

        try:
            solicitud_div = element.find_element(By.XPATH, './/strong[contains(text(), "Número de solicitud:") or contains(text(), "Expediente")]/following-sibling::span')
            solicitud_text = solicitud_div.text.strip()
            self.logger.info(f'El número de solicitud/Expediente es: {solicitud_text}')
        except Exception as e:
            self.logger.debug(f"No se encontró el elemento de solicitud: {str(e)}")
            return None

        if solicitud_text != exp_value:
            return None

        if not data_entry["fechaOficio"]:
            data_entry["fechaOficio"] = None
        if not data_entry["numeroOficio"]:
            data_entry["numeroOficio"] = None

        return data_entry

    def extract_data_from_div(self, data_div, label):
        try:
            strong_elements = data_div.find_elements(By.CSS_SELECTOR, 'strong')
            for strong_element in strong_elements:
                if label in strong_element.text:
                    parent_div = strong_element.find_element(By.XPATH, '..')
                    text = parent_div.text.replace(strong_element.text, '').strip()
                    return text
            return None
        except Exception:
            return None

    def extract_data_from_span(self, data_span, label):
        try:
            strong_elements = data_span.find_elements(By.CSS_SELECTOR, 'strong')
            for strong_element in strong_elements:
                if label in strong_element.text:
                    parent_span = strong_element.find_element(By.XPATH, '..')
                    text = parent_span.text.replace(strong_element.text, '').strip()
                    return text
            return None
        except Exception:
            return None

    def save_results(self):
        results = {
            "correctos": self.correctos,
            "incorrectos": self.incorrectos,
            "horarios": self.horarios
        }
        return results

    def close(self):
        self.driver.quit()
        self.logger.info("Cerrando el navegador")

    def scraperProcess(self, expedientes):
        start_time, formatted_start_time = self.start_logging()
        try:
            self.open_website()
            self.click_search_tokens()
            for exp in expedientes:
                self.process_exp(exp)
        except Exception as e:
            self.logger.error(f"Error general en el proceso de scraping: {str(e)}")
        finally:
            end_time = datetime.datetime.now()
            formatted_end_time = self.formatter_message.formatTime(logging.LogRecord(
                name='Notificacion',
                level=logging.INFO,
                pathname='',
                lineno=0,
                msg='',
                args=(),
                exc_info=None,
                created=end_time.timestamp()
            ))
            self.horarios['fechaHora_fin'] = formatted_end_time
            self.logger.info(f"FINALIZANDO - Fecha y Hora: {formatted_end_time}")
            results = self.save_results()
            self.close()
            return results

