import sys
import os
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from utils.functions.fn_scrapeo import SeederScraper

if __name__ == "__main__":
    data = sys.stdin.read()
    patentes = json.loads(data)
    scraper = SeederScraper(patentes)
    scraper.run()