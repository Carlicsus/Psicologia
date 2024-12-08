import sys
import os
import json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from utils.functions.fn_scraperVigilante import scraperNotificacion

def main():
    dataNoti = sys.stdin.read()
    patentesNoti = json.loads(dataNoti)
    
    scraper = scraperNotificacion()
    resultadoNoti = scraper.scraperProcess(patentesNoti)

    print(json.dumps(resultadoNoti, ensure_ascii=False, indent=4))

if __name__ == "__main__":
    main()