import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from typing import List, Optional

router = APIRouter(prefix="/financial", tags=["Financial Advisor"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

from services.market_hybrid_service import MarketService
from services.weather_service import WeatherService
from services.location_service import LocationService
from services.crop_recommendation import CropRecommendationService

class LocationClass(BaseModel):
    lat: float
    lon: float

class MoneyAdvisorRequest(BaseModel):
    crop: str
    location: LocationClass
    monthly_income: float
    land_size: Optional[float] = None
    market_price: Optional[float] = None
    weather: Optional[dict] = None

@router.post("/money-advisor")
async def get_money_advice(request: MoneyAdvisorRequest):
    """
    Enhanced AI financial advisor for farmers integrating market trends, price, and weather.
    """
    if not client:
        raise HTTPException(status_code=500, detail="Groq Intelligence Unit Offline.")

    # 1. Fetch Market Data if missing
    mandi_price = request.market_price
    trend = "stable"
    if not mandi_price:
        mandi = await MarketService.get_mandi_price(request.crop)
        mandi_price = float(mandi["price"].replace("₹", "").split("/")[0])
    
    global_data = await MarketService.get_global_trend(request.crop)
    trend = global_data.get("trend", "stable")

    # 2. Fetch Weather Data if missing
    weather_info = request.weather
    if not weather_info:
        weather_res = await WeatherService.fetch_weather_data(request.location.lat, request.location.lon)
        weather_info = weather_res.get("display", {"condition": "Stable"})

    # 3. Fetch Regional Location Info
    loc_data = await LocationService.reverse_geocode(request.location.lat, request.location.lon)
    state = loc_data.get("state", "India")
    district = loc_data.get("district", "Your Region")

    # 4. Generate Regional Crop Recommendations
    rec_data = CropRecommendationService.get_recommendations(state, weather_info.get("condition", "Stable"))

    # 5. AI Prompt Construction (Updated with Location Intelligence)
    prompt = f"""You are a smart agricultural financial advisor.
    
Analyze:
* Crop: {request.crop}
* Location: {state}, {district}
* Current price: ₹{mandi_price}/quintal
* Market trend: {trend}
* Weather: {weather_info.get('condition', 'Clear')}
* Farmer monthly income: ₹{request.monthly_income}

Decide:
1. Should farmer SELL NOW or WAIT
2. Suggest 2-3 specific regional advice points for {state}
3. Give 2–3 income improvement tips
4. Give simple investment advice (safe and realistic for farmers)

Rules:
* ALWAYS respond EXCLUSIVELY in Hindi (Devanagari script) for all text fields.
* Reference the state '{state}' in your reasoning.
* Keep advice simple
* Do NOT suggest risky investments

Format response as JSON ONLY.
{{
    "location": {{"state": "{state}", "district": "{district}"}},
    "sell_advice": "SELL NOW | WAIT",
    "reason": "short explanation in Hindi mentioning {state}",
    "next_crop": "{rec_data['recommended_crops'][0]} (Recommended for {state})",
    "recommended_crops": {json.dumps(rec_data['recommended_crops'])},
    "income_tips": ["tip1", "tip2"],
    "investment_advice": ["adv1", "adv2"],
    "confidence": "high",
    "location_based_advice": "Advice specific to {state} in Hindi"
}}"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        advice_data = json.loads(completion.choices[0].message.content)
        
        return advice_data
    except Exception as e:
        print(f"Money Advisor Error: {e}")
        raise HTTPException(status_code=500, detail="AI Financial Core Synchronization Failure.")
