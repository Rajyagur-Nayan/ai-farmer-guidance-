import os
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from cachetools import TTLCache
from groq import Groq
import httpx
import asyncio
import random
from services.weather_service import WeatherService

# Cache for 10 minutes
market_cache = TTLCache(maxsize=100, ttl=600)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Ticker mapping for Global Trends
TICKER_MAP = {
    "Wheat": "ZW=F",
    "Rice": "ZR=F",
    "Maize": "ZC=F",
    "Cotton": "CT=F",
    "Sugarcane": "SB=F",
    "Tomato": "DBA", # Proxy
    "Potato": "DBA", # Proxy
    "Onion": "DBA",  # Proxy
    "Banana": "DBA", # Proxy
    "Mango": "DBA"   # Proxy
}

class MarketService:
    @staticmethod
    async def get_mandi_price(crop: str, state: str = "Maharashtra", district: str = "Pune"):
        """
        Fetches mandi price from data.gov.in (simulated fallback for demonstration).
        """
        # In a real scenario, we'd use: 
        # https://api.data.gov.in/resource/<resource_id>?api-key=<key>&format=json&filters[commodity]=<crop>
        
        # Simulated logic based on crop types for demonstration
        base_prices = {
            "Wheat": 2400, "Rice": 2200, "Maize": 2000,
            "Tomato": 1800, "Potato": 1500, "Onion": 1600,
            "Banana": 2500, "Mango": 6000,
            "Cotton": 7500, "Sugarcane": 350
        }
        
        price = base_prices.get(crop, 2000)
        price += random.randint(-100, 100)
        
        return {
            "price": f"₹{price}/quintal",
            "mandi": f"{district} Central Mandi",
            "date": datetime.now().strftime("%Y-%m-%d")
        }

    @staticmethod
    async def get_global_trend(crop: str):
        """
        Fetches global trend from Yahoo Finance (Thread-safe).
        """
        ticker_symbol = TICKER_MAP.get(crop, "DBA")
        try:
            # Run blocking yfinance in a thread
            def fetch():
                ticker = yf.Ticker(ticker_symbol)
                return ticker.history(period="7d")
            
            hist = await asyncio.to_thread(fetch)
            
            if hist.empty or len(hist) < 2:
                return {"current": "N/A", "trend": "steady", "history": []}
            
            current_price = hist['Close'].iloc[-1]
            prev_price = hist['Close'].iloc[-2]
            trend = "up" if current_price > prev_price else "down"
            
            # Format history for chart
            history_data = [
                {"date": d.strftime("%m-%d"), "price": round(p, 2)}
                for d, p in zip(hist.index, hist['Close'])
            ]
            
            return {
                "current": f"${round(current_price, 2)}",
                "trend": trend,
                "history": history_data
            }
        except Exception as e:
            print(f"YFinance Error for {crop}: {e}")
            return {"current": "N/A", "trend": "steady", "history": []}

    @staticmethod
    async def get_ai_advice(crop: str, mandi_price: str, trend: str):
        """
        Generates AI advice using Groq.
        """
        if not client:
            return "Market data stable. Plan your harvest accordingly."
            
        prompt = f"You are a farmer assistant. The current mandi price for {crop} is {mandi_price} and the global trend is {trend}. Give short advice (max 1 sentence) in simple language for a farmer on whether to sell or wait."
        
        try:
            # Using asyncio to prevent blocking if needed, but groq client is sync by default here
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=80
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq Error: {e}")
            return "Analyze local demand before finalizing your sale."

    @staticmethod
    async def get_all_market_data():
        categories = {
            "Grains": ["Wheat", "Rice", "Maize"],
            "Vegetables": ["Tomato", "Potato", "Onion"],
            "Fruits": ["Banana", "Mango"],
            "Cash Crops": ["Cotton", "Sugarcane"]
        }
        
        # Check cache
        if "all_market_data" in market_cache:
            return market_cache["all_market_data"]
            
        async def fetch_single_crop(crop):
            mandi = await MarketService.get_mandi_price(crop)
            global_data = await MarketService.get_global_trend(crop)
            # Use faster model for batch list or just heuristic for the main list
            advice = f"Market for {crop} is currently {global_data['trend']}."
            
            return {
                "crop": crop,
                "mandi_price": mandi["price"],
                "mandi_name": mandi["mandi"],
                "trend": global_data["trend"],
                "global_price": global_data["current"],
                "advice": advice,
                "history": global_data["history"]
            }

        tasks = []
        for cat, crops in categories.items():
            for crop in crops:
                tasks.append(fetch_single_crop(crop))
        
        # Parallelize all 10 crops
        all_crops_data = await asyncio.gather(*tasks)
        
        # Reconstruct categories
        result = {cat: [] for cat in categories}
        data_map = {d["crop"]: d for d in all_crops_data}
        
        for cat, crops in categories.items():
            for crop in crops:
                if crop in data_map:
                    result[cat].append(data_map[crop])
        
        market_cache["all_market_data"] = result
        return result

    @staticmethod
    async def get_smart_money_advice(crop: str, lat: float = None, lon: float = None):
        """
        Comprehensive financial advisor for farmers.
        """
        # 1. Fetch Basic Data
        mandi = await MarketService.get_mandi_price(crop)
        global_data = await MarketService.get_global_trend(crop)
        
        # 2. Trend Logic
        current_val = 0
        prev_val = 0
        history = global_data.get("history", [])
        if len(history) >= 2:
            current_val = history[-1]["price"]
            prev_val = history[-2]["price"]
        
        if current_val > prev_val: trend = "increasing"
        elif current_val < prev_val: trend = "decreasing"
        else: trend = "stable"
        
        # 3. Weather Integration
        weather_condition = "Unknown"
        weather_impact = "Stable production expected"
        rules_applied = ["Market trend analysis"]
        
        if lat and lon:
            weather = await WeatherService.fetch_weather_data(lat, lon)
            if "error" not in weather:
                weather_condition = weather["condition"]
                rain = weather.get("rain_1h", 0)
                temp = weather.get("temp", 0)
                
                if rain > 5:
                    weather_impact = "Prices may drop due to supply issues (Heavy Rain)"
                    rules_applied.append("Heavy rain alert")
                elif temp > 35:
                    weather_impact = "Crop stress may affect supply (High Heat)"
                    rules_applied.append("Extreme heat alert")
                else:
                    weather_impact = "Good weather: Stable production expected"
                    rules_applied.append("Favorable weather check")

        # 4. Groq AI Reasoning
        advice = "WAIT"
        reason = "Market data stabilizing."
        next_crop = "Consider pulses or seasonal vegetables."
        ai_reasoning = ""
        
        if client:
            prompt = f"""You are an agricultural financial advisor.
Based on:
* crop: {crop}
* current price: {mandi['price']}
* market trend: {trend}
* weather: {weather_condition}

Decide:
1. Should farmer SELL NOW or WAIT
2. Give short reason (1-2 lines)
3. Suggest next crop (optional)"""

            try:
                completion = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.4
                )
                ai_reasoning = completion.choices[0].message.content.strip()
                
                # Basic parsing for structured fields (fallback if LLM doesn't follow perfectly)
                if "SELL NOW" in ai_reasoning.upper(): advice = "SELL NOW"
                else: advice = "WAIT"
                
                # Extract reason (simplistic parsing)
                lines = ai_reasoning.split('\n')
                reason = next((l for l in lines if any(x in l for x in ["Reason:", "2.", "because"])), "Analysis based on market trends.")
                next_crop = next((l for l in lines if any(x in l for x in ["Next crop:", "3.", "Suggest"])), "Climate-resilient varieties.")
            except Exception as e:
                print(f"Groq Advisor Error: {e}")

        # 5. Final Output Construction
        return {
            "crop": crop,
            "current_price": mandi["price"],
            "global_price": global_data.get("current", "N/A"),
            "trend": trend,
            "weather_impact": weather_impact,
            "sell_advice": advice,
            "reason": reason.replace("2. ", "").replace("Reason: ", ""),
            "next_crop": next_crop.replace("3. ", "").replace("Next crop: ", ""),
            "confidence": "high" if lat and lon else "medium",
            "history": global_data.get("history", []),
            "decision_log": {
                "inputs": {
                    "price": mandi["price"],
                    "trend": trend,
                    "weather": weather_condition
                },
                "rules_applied": rules_applied,
                "ai_reasoning": ai_reasoning,
                "final_decision": advice
            }
        }
