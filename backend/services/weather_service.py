import os
import requests
from fastapi import APIRouter, HTTPException, Query
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

router = APIRouter(tags=["Weather"])

# Access API Key
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@router.get("/weather")
async def get_weather(lat: float = Query(...), lon: float = Query(...)):
    """
    Fetches real-time weather data and provides agricultural advice for farmers.
    """
    # Validation for missing API Key or placeholder
    if not OPENWEATHER_API_KEY or OPENWEATHER_API_KEY == "YOUR_OPENWEATHER_API_KEY":
        # Professional fallback for demonstration purposes
        return {
            "location": {"lat": lat, "lon": lon},
            "temperature": "28°C",
            "humidity": "65%",
            "condition": "Clear Sky",
            "wind_speed": "12 km/h",
            "rainfall": "0 mm",
            "advice": "Weather conditions are normal. Suitable for general field work."
        }

    # OpenWeatherMap API Endpoint
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    
    try:
        # Fetching data using requests library as requested
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return {
                "error": "Weather service unavailable",
                "fallback": "Invalid API Key or Service Issue. Please try again later."
            }
        
        data = response.json()
        temp = data.get("main", {}).get("temp", 0)
        humidity = data.get("main", {}).get("humidity", 0)
        condition = data.get("weather", [{}])[0].get("main", "Clear")
        wind_speed = data.get("wind", {}).get("speed", 0)
        # Check for rain in the last hour
        rain = data.get("rain", {}).get("1h", 0)
        
        # 4. BASIC WEATHER ADVICE LOGIC
        advice = "Weather conditions are normal"
        
        if temp > 35:
            advice = "High temperature, increase irrigation"
        elif rain > 0:
            advice = "Rain expected, avoid fertilizer application"
        elif humidity > 80:
            advice = "High humidity, risk of fungal disease"
        
        # Final Format Response
        return {
            "location": {
                "lat": lat,
                "lon": lon
            },
            "temperature": f"{round(temp)}°C",
            "humidity": f"{humidity}%",
            "condition": condition,
            "wind_speed": f"{round(wind_speed * 3.6, 1)} km/h", # Convert m/s to km/h for farmer friendliness
            "rainfall": f"{rain} mm",
            "advice": advice
        }
        
    except Exception as e:
        print(f"Weather API Error: {e}")
        return {
            "error": "Weather service unavailable",
            "fallback": "Communication failure with external meteorological systems."
        }
