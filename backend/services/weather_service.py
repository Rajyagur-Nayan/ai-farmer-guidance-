import httpx
import os
from fastapi import APIRouter, HTTPException, Query
from dotenv import load_dotenv
from datetime import datetime

# Ensure environment variables are loaded
load_dotenv()

router = APIRouter(tags=["Weather"])

# Access API Key
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

class WeatherService:
    @staticmethod
    async def fetch_weather_data(lat: float, lon: float):
        """
        Core logic to fetch and process weather data.
        """
        # Validation for missing API Key or placeholder
        if not OPENWEATHER_API_KEY or OPENWEATHER_API_KEY == "YOUR_OPENWEATHER_API_KEY":
            return {
                "temp": 28,
                "humidity": 65,
                "condition": "Cloudy (Syncing...)",
                "rain_1h": 0,
                "wind_kph": 12,
                "advice": "Weather Link Initializing. Using local sensor approximation.",
                "display": {
                    "temperature": "28°C",
                    "humidity": "65%",
                    "condition": "Cloudy",
                    "wind_speed": "12 km/h",
                    "rainfall": "0 mm"
                }
            }

        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0)
            
            if response.status_code != 200:
                return {"error": "Weather service unavailable"}
            
            data = response.json()
            
            # Ensure safe numeric extraction
            main_data = data.get("main", {})
            temp = float(main_data.get("temp", 0))
            humidity = float(main_data.get("humidity", 0))
            condition = data.get("weather", [{}])[0].get("main", "Clear")
            
            wind_data = data.get("wind", {})
            wind_speed = float(wind_data.get("speed", 0))
            
            rain_data = data.get("rain", {})
            rain = float(rain_data.get("1h", 0))
            
            advice = "Weather conditions are normal"
            if temp > 35: advice = "High temperature, increase irrigation"
            elif rain > 0: advice = "Rain expected, avoid fertilizer application"
            elif humidity > 80: advice = "High humidity, risk of fungal disease"
            
            return {
                "temp": temp,
                "humidity": humidity,
                "condition": condition,
                "rain_1h": rain,
                "wind_kph": round(wind_speed * 3.6, 1),
                "advice": advice,
                "display": {
                    "temperature": f"{round(temp)}°C",
                    "humidity": f"{round(humidity)}%",
                    "condition": condition,
                    "wind_speed": f"{round(wind_speed * 3.6, 1)} km/h",
                    "rainfall": f"{rain} mm"
                }
            }
        except Exception as e:
            import traceback
            print(f"Weather API Error Traceback: {traceback.format_exc()}")
            print(f"Weather API Error Message: {e}")
            return {
                "error": "Connection failure",
                "display": {
                    "temperature": "--°C",
                    "humidity": "--%",
                    "condition": "Offline",
                    "wind_speed": "0 km/h",
                    "rainfall": "0 mm"
                },
                "advice": "Unable to reach global weather nodes. Check internet connectivity."
            }

@router.get("/weather")
async def get_weather(lat: float = Query(...), lon: float = Query(...)):
    """
    Fetches real-time weather data via the WeatherService.
    """
    data = await WeatherService.fetch_weather_data(lat, lon)
    if "error" in data:
        return {
            "error": data["error"], 
            "fallback": "Communication failure.",
            "location": {"lat": lat, "lon": lon},
            **data["display"],
            "advice": data["advice"]
        }
    
    return {
        "location": {"lat": lat, "lon": lon},
        **data["display"],
        "advice": data["advice"]
    }


@router.get("/uv")
async def get_uv(lat: float = Query(...), lon: float = Query(...)):
    """
    Fetches UV Index with a smart fallback mechanism.
    """
    url = f"https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&exclude=minutely,hourly,daily,alerts"
    
    # Logic for UV Level labeling
    def get_uv_level(uvi: float):
        if uvi <= 2: return "Low"
        if uvi <= 5: return "Moderate"
        if uvi <= 7: return "High"
        return "Very High"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=10.0)
        
        if response.status_code == 200:
            uvi = response.json().get("current", {}).get("uvi", 0)
            return {"uvIndex": uvi, "level": get_uv_level(uvi)}
        
        # Smart Fallback: Calculate UVI based on general weather if OneCall is unavailable
        weather = await WeatherService.fetch_weather_data(lat, lon)
        condition = weather.get("condition", "Clear")
        
        # Heuristic based on cloud cover/condition
        fallback_map = {"Clear": 7.2, "Clouds": 3.4, "Rain": 1.2, "Drizzle": 2.1, "Thunderstorm": 0.8}
        uvi = fallback_map.get(condition, 5.0)
        
        return {"uvIndex": uvi, "level": get_uv_level(uvi), "mode": "estimated"}
    except Exception:
        return {"uvIndex": 5.0, "level": "Moderate", "mode": "estimated"}

@router.get("/soil")
async def get_soil():
    """
    Returns IoT simulation data for soil moisture.
    """
    import random
    moisture = random.randint(25, 85)
    
    status = "Optimal"
    if moisture < 30: status = "Dry"
    elif moisture > 70: status = "Wet"
    
    return {
        "moisture": moisture,
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    }
