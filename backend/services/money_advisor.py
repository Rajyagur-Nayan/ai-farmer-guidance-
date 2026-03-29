import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
from typing import List, Optional

router = APIRouter(prefix="/financial", tags=["Financial Advisor"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

class Location(BaseModel):
    lat: float
    lon: float

class MoneyAdvisorRequest(BaseModel):
    crop: str
    location: Location
    market_price: Optional[float] = None
    land_area: float
    farmer_income: Optional[float] = None
    weather: Optional[dict] = None

@router.post("/money-advisor")
async def get_money_advice(request: MoneyAdvisorRequest):
    """
    AI-driven financial advisor for farmers based on market trends and crop data.
    """
    if not client:
        raise HTTPException(status_code=500, detail="Groq Intelligence Unit Offline.")

    # AI Prompt Construction
    prompt = f"""You are a senior agricultural financial advisor for rural farmers.
    
    Task: Provide financial guidance based on the following context.
    
    Context:
    - Target Crop: {request.crop}
    - Cultivation Area: {request.land_area} acres
    - Reported Mandi Price: {request.market_price if request.market_price else 'Not Specified'}
    - Farmer Income Bracket: {request.farmer_income if request.farmer_income else 'Average'}
    - Environmental Context: {request.weather if request.weather else 'Stable Conditions'}
    
    Process Requirements:
    1. Analyze market dynamics for the specific crop.
    2. Determine SELL vs WAIT decision.
    3. Identify historical price trend (increasing/decreasing).
    4. Propose a high-yield successor crop.
    5. Generate 3 income optimization tips.
    6. Generate 2 structural investment suggestions.
    
    STRICT Rules:
    - Never hallucinate profits higher than 20% of base.
    - If price is missing, explicitly advise checking Agmarknet or local Mandi.
    - Format response as JSON ONLY.
    
    JSON Template:
    {{
        "sell_advice": "...",
        "price_trend": "...",
        "next_crop_recommendation": "...",
        "income_tips": ["...", "...", "..."],
        "investment_advice": ["...", "..."],
        "reasoning": "..."
    }}
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        advice_data = json.loads(completion.choices[0].message.content)
        
        return {
            "sell_advice": advice_data.get("sell_advice"),
            "price_trend": advice_data.get("price_trend"),
            "next_crop_recommendation": advice_data.get("next_crop_recommendation"),
            "income_tips": advice_data.get("income_tips"),
            "investment_advice": advice_data.get("investment_advice"),
            "decision_log": {
                "inputs": request.dict(),
                "reasoning": advice_data.get("reasoning"),
                "final_decision": advice_data.get("sell_advice")
            }
        }
    except Exception as e:
        print(f"Money Advisor Error: {e}")
        raise HTTPException(status_code=500, detail="AI Financial Core Synchronization Failure.")
