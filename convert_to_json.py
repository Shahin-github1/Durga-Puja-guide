import re
import json
import os

with open('js/data/pandals.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Match each object block
pandal_blocks = re.findall(r'\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*bengaliName:\s*"([^"]+)",\s*zone:\s*"([^"]+)",\s*lat:\s*([0-9.]+),\s*lng:\s*([0-9.]+),\s*address:\s*"([^"]+)",\s*nearestMetro:\s*"([^"]+)",\s*nearestBusStop:\s*"([^"]+)",\s*famousFor:\s*"([^"]+)",\s*crowdRating:\s*"([^"]+)",\s*bestTimeToVisit:\s*"([^"]+)",\s*iconicHeritage:\s*(true|false),\s*entryGate:\s*"([^"]+)",\s*tagline:\s*"([^"]+)"\s*\}', text)

pandals = []
for p in pandal_blocks:
    pandals.append({
        "id": p[0],
        "name": p[1],
        "bengaliName": p[2],
        "zone": p[3],
        "lat": float(p[4]),
        "lng": float(p[5]),
        "address": p[6],
        "nearestMetro": p[7],
        "nearestBusStop": p[8],
        "famousFor": p[9],
        "crowdRating": p[10],
        "bestTimeToVisit": p[11],
        "iconicHeritage": p[12] == "true",
        "entryGate": p[13],
        "tagline": p[14]
    })

os.makedirs('data', exist_ok=True)
with open('data/pandals.json', 'w', encoding='utf-8') as f:
    json.dump(pandals, f, ensure_ascii=False, indent=2)

print(f"Successfully converted {len(pandals)} pandals into data/pandals.json")
