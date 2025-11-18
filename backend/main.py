from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests, gzip, json

app = FastAPI()

# Enable CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load city list once
with gzip.open("city.list.min.json.gz", "rt", encoding="utf-8") as f:
    cities = json.load(f)

# Make a lookup dict with lowercase city names
city_lookup = {c['name'].lower(): c for c in cities}

API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"  # Replace with your key

@app.get("/weather")
def get_weather(city: str):
    city_lower = city.strip().lower()
    
    if city_lower not in city_lookup:
        raise HTTPException(status_code=404, detail="City not found")
    
    city_data = city_lookup[city_lower]
    city_name = city_data['name']
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={API_KEY}&units=metric"
    
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching weather")
    
    return response.json()

