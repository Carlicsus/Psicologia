import datetime
import json
import logging
import time
import unicodedata
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from src.scrapper.config.scraper_logs import logs_scraper

class SeederScraper:
    def __init__(self, patentes):
        self.seeders_logger, self.formatter_message = logs_scraper('Seeders')
        self.patentes = patentes
        self.correctos = []
        self.incorrectos = []
        self.driver = None

    def initialize_driver(self):
        self.seeders_logger.info("Inicializando el WebDriver...")
        options = webdriver.ChromeOptions()
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Remote(
            command_executor='http://scraperSeeder:4444/wd/hub',
            options=options
        )

    def start_logging(self):
        start_time = datetime.datetime.now()
        formatted_start_time = self.formatter_message.formatTime(logging.LogRecord(
            name='Seeders',
            level=logging.INFO,
            pathname='',
            lineno=0,
            msg='',
            args=(),
            exc_info=None,
            created=start_time.timestamp()
        ))
        self.seeders_logger.info(f"INICIANDO - Fecha y Hora: {formatted_start_time}")
        return start_time, formatted_start_time

    def open_website(self):
        self.seeders_logger.info("Abriendo la página web...")
        self.driver.get('https://siga.impi.gob.mx/')
        if "502 Bad Gateway" in self.driver.page_source or "504 Gateway Time-out" in self.driver.page_source:
            raise Exception("Error 502/504 Gateway al intentar cargar la página.")
        self.seeders_logger.info("Sitio Iniciado Correctamente.")

    def click_search_tokens(self):
        self.seeders_logger.info("Esperando y clicando en 'Búsqueda en fichas'...")
        element = WebDriverWait(self.driver, 60).until(EC.presence_of_element_located((By.XPATH, "//a[contains(text(),'Búsqueda en fichas')]")))
        element.click()
        self.seeders_logger.info("Click en 'Búsqueda en fichas' realizado.")

    def process_exp(self, exp):
        self.seeders_logger.info(f"Procesando expediente: {exp['noExpediente']}...")
        try:
            time.sleep(3)
            search_field = WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'search-term')))
            WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, 'search-term')))
            search_field.clear()
            exp_value = exp["noExpediente"]
            search_field.send_keys(exp_value)
            button = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//button[@mat-raised-button and @color="success" and @type="submit"]')))
            button.click()
            time.sleep(10)
            elements = WebDriverWait(self.driver, 10).until(EC.visibility_of_all_elements_located((By.CLASS_NAME, 'div-box-shadow')))
            self.handle_elements(elements, exp_value)
        except Exception as e:
            self.seeders_logger.error(f"Error al buscar el expediente {exp['noExpediente']}: No existe")
            self.incorrectos.append({"noExpediente": exp['noExpediente'], "msg": "No existe"})

    def handle_elements(self, elements, exp_value):
        self.seeders_logger.info(f"Manejando elementos para el expediente: {exp_value}")
        found = False
        for element in reversed(elements):
            try:
                nExp_text = element.find_element(By.XPATH, './/span[contains(@class, "ng-tns-c")]').text.strip()
                if exp_value == nExp_text:
                    found = True
                    expediente_info = self.extract_info(element)
                    if expediente_info:
                        if self.check_fields(expediente_info):
                            self.correctos.append(expediente_info)
                        else:
                            self.incorrectos.append({"noExpediente": exp_value, "msg": "No pertenece al instituto"})
                    break
            except Exception as e:
                self.seeders_logger.error(f"Error en la comparación del Número Expediente")

        if not found:
            self.seeders_logger.info(f"No se encontró ningún elemento con el exp {exp_value} dado.")
            self.incorrectos.append({"noExpediente": exp_value, "msg": "No existe"})

    def check_fields(self, expediente_info):
        required_fields = ['noExpediente', 'fechaPresentacion', 'solicitantes', 'inventores', 'titulo', 'resumen']
        for field in required_fields:
            if field not in expediente_info:
                return False
        return True

    def extract_info(self, element):
        self.seeders_logger.info("Extrayendo información del elemento...")
        spans = element.find_elements(By.TAG_NAME, 'span')
        strongs = element.find_elements(By.TAG_NAME, 'strong')
        result = {}

        solicitantes = []
        inventores = []

        for strong in strongs:
            label = strong.text.strip()
            if 'Número de solicitud' in label:
                result['noExpediente'] = strong.find_element(By.XPATH, './following-sibling::span').text.strip()
            elif 'Fecha de presentación' in label:
                fecha_texto = strong.find_element(By.XPATH, './following-sibling::span').text.strip()
                fecha = datetime.datetime.strptime(fecha_texto, '%d/%m/%Y').date()
                dia, mes, año = fecha.strftime('%d/%m/%Y').split('/')
                fecha_formateada = f"{año}-{mes}-{dia}"
                result['fechaPresentacion'] = fecha_formateada
            elif 'Solicitante(s)' in label:
                solicitantes_list = strong.find_element(By.XPATH, './following-sibling::span').text.strip().split(';')
                solicitantes.extend([s.strip() for s in solicitantes_list])
            elif 'Inventor(es)' in label:
                inventores_list = strong.find_element(By.XPATH, './following-sibling::span').text.strip().split(';')
                inventores.extend([i.strip() for i in inventores_list])
            elif 'Título' in label:
                result['titulo'] = strong.find_element(By.XPATH, './following-sibling::span').text.strip()
            elif 'Resumen' in label:
                result['resumen'] = strong.find_element(By.XPATH, './following-sibling::span').text.strip()

        if solicitantes:
            result['solicitantes'] = solicitantes
        if inventores:
            result['inventores'] = inventores

        if result:
            return result
        else:
            return None

    def normalize_text(self, text):
        return ''.join(
            c for c in unicodedata.normalize('NFD', text)
            if unicodedata.category(c) != 'Mn'
        ).lower()

    def run(self):
        self.seeders_logger.info("Iniciando el proceso del scraper...")
        self.initialize_driver()
        start_time, formatted_start_time = self.start_logging()
        max_global_attempts = 5
        global_attempts = 0

        while global_attempts < max_global_attempts:
            global_attempts += 1
            try:
                self.open_website()
                self.click_search_tokens()
                for exp in self.patentes:
                    self.process_exp(exp)
                break
            except Exception as e:
                self.seeders_logger.error(f"Error durante el scraping: {e}")
                self.seeders_logger.info("Reintentando...")
                self.driver.quit()

        end_time = datetime.datetime.now()
        formatted_end_time = self.formatter_message.formatTime(logging.LogRecord(
            name='Seeders',
            level=logging.INFO,
            pathname='',
            lineno=0,
            msg='',
            args=(),
            exc_info=None,
            created=end_time.timestamp()
        ))
        self.seeders_logger.info(f"FINALIZADO - Fecha y Hora: {formatted_end_time}")
        self.seeders_logger.info("Cerrando el WebDriver...")
        self.driver.quit()

        horarios = {
            "fechaHora_inicio": formatted_start_time,
            "fechaHora_fin": formatted_end_time
        }

        resultados = {
            'correctos': self.correctos,
            'incorrectos': self.incorrectos,
            'horarios': horarios
        }

        print(json.dumps(resultados))
        exit()
