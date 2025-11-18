import gzip, json
import os

input_file = "city.list.min.json.gz"
output_file = os.path.join("frontend", "public", "cities.json")

with gzip.open(input_file, "rt", encoding="utf-8") as f:
    cities = json.load(f)

cities_for_frontend = [{"name": c["name"]} for c in cities]

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(cities_for_frontend, f)

print(f"Generated {output_file} with {len(cities_for_frontend)} cities.")
