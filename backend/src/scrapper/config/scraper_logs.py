import os
import logging
from datetime import datetime, timezone, timedelta

target_timezone = timezone(timedelta(hours=-6))

class CustomFormatter(logging.Formatter):
    def converter(self, timestamp):
        dt = datetime.fromtimestamp(timestamp, timezone.utc)
        return dt.astimezone(target_timezone)
    
    def formatTime(self, record, datefmt=None):
        dt = self.converter(record.created)
        if datefmt:
            s = dt.strftime(datefmt)
        else:
            try:
                s = dt.strftime('%Y-%m-%d %H:%M:%S')
            except TypeError:
                s = dt.isoformat()
        return s

def logs_scraper(scraper_name):
    logs_dir = 'src/common/logs'
    os.makedirs(logs_dir, exist_ok=True)

    logger = logging.getLogger(f'scrapper - [{scraper_name}]')

    logger.setLevel(logging.INFO)

    if not logger.handlers:
        formatter_message = CustomFormatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

        file_handler = logging.FileHandler(os.path.join(logs_dir, 'Daly.log'), encoding='utf-8')
        file_handler.setFormatter(formatter_message)
        
        file_system_handler = logging.FileHandler(os.path.join(logs_dir, 'System.log'), encoding='utf-8')
        file_system_handler.setFormatter(formatter_message)
        logger.addHandler(file_handler)
        logger.addHandler(file_system_handler)
    else:
        formatter_message = logger.handlers[0].formatter
        
    return logger, formatter_message

seeders_logger, formatter_message = logs_scraper('Seeders')
historico_logger, _ = logs_scraper('Historico')
expediente_logger, _ = logs_scraper('Notificacion')