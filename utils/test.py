import json
from cities import CITIES

with open("cities.json", "w", encoding="utf-8") as f:
    json.dump(CITIES, f, ensure_ascii=False, indent=2)