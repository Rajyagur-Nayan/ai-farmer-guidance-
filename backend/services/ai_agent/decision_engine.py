import os
import json
from groq import Groq
from typing import Dict, Any, List
from .guardrails import validate_response
from .decision_logger import log_decision

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

async def run_ai_decision(
    crop: str, 
    location: Dict[str, float], 
    income: float, 
    market_data: List[Dict[str, Any]] = None,
    weather_data: Dict[str, Any] = None,
    image_result: str = ""
):
    """
    Synthesizes multi-source data into a final agricultural decision.
    """
    if not client:
        return {"error": "Groq Uplink Offline. Check API Key."}

    # Data Synthesizer Prompt
    prompt = f"""
    You are an advanced agricultural AI agent. You MUST analyze:
    - Crop: {crop}
    - Location: {location}
    - Weather Summary: {json.dumps(weather_data) if weather_data else "Not Available"}
    - Market Data: {json.dumps(market_data) if market_data else "Not Available"}
    - Farmer Monthly Income: {income}
    - Visual Analysis: {image_result if image_result else "No Image Provided"}

    Decide accurately:
    1. What should farmer DO right now
    2. Sell now or wait
    3. Disease risk (if any)
    4. Next crop recommendation
    5. Income improvement tips

    Response format: JSON ONLY. Use PURE NUMBERS for confidence (0.0 to 1.0) and other numeric fields.
    {{
       "final_action": "...",
       "sell_decision": "Selling now/Wait for higher prices/Partial sell",
       "crop_advice": "...",
       "risk_alert": "Low/Medium/High + reason",
       "next_crop": "...",
       "confidence": 0.95,
       "ai_reasoning": "..."
    }}
    """

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        output = json.loads(response.choices[0].message.content)
        reasoning = output.pop("ai_reasoning", "Standard AI reasoning applied.")
        
        # Apply Guardrails
        output = validate_response(output)
        
        # Log Logic
        log_decision(
            inputs={"crop": crop, "location": location, "income": income},
            data_sources=["weather", "market", "image"] if weather_data else ["manual"],
            rules_applied=["Economic Filter", "Confidence Threshold"],
            ai_reasoning=reasoning,
            final_decision=output
        )
        
        return output
    except Exception as e:
        print(f"AI Decision Logic Failure: {e}")
        return {"error": "Decision Engine Unstable. Possible API timeout."}
