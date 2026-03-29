import os
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from cachetools import TTLCache
from groq import Groq
import httpx
import asyncio
import random

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
    def get_global_trend(crop: str):
        """
        Fetches global trend from Yahoo Finance.
        """
        ticker_symbol = TICKER_MAP.get(crop, "DBA")
        try:
            ticker = yf.Ticker(ticker_symbol)
            # Fetch minimal data for speed
            hist = ticker.history(period="7d")
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
            
        result = {}
        for cat, crops in categories.items():
            result[cat] = []
            for crop in crops:
                # We can run these in parallel if needed, but simple loop for stability
                mandi = await MarketService.get_mandi_price(crop)
                global_data = MarketService.get_global_trend(crop)
                advice = await MarketService.get_ai_advice(crop, mandi["price"], global_data["trend"])
                
                result[cat].append({
                    "crop": crop,
                    "mandi_price": mandi["price"],
                    "mandi_name": mandi["mandi"],
                    "trend": global_data["trend"],
                    "global_price": global_data["current"],
                    "advice": advice,
                    "history": global_data["history"]
                })
        
        market_cache["all_market_data"] = result
        return result
