import sys
import os
import json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))
from utils.functions.fn_scrapperVidoc import VidocScraper

def main():
    dataVidoc = sys.stdin.read()
    patentesVidoc = json.loads(dataVidoc)
    
    scraper = VidocScraper()
    resultado = scraper.scraperVidoc(patentesVidoc)

    print(json.dumps(resultado))

if __name__ == "__main__":
    main()