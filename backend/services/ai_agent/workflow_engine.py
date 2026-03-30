import asyncio
from typing import Dict, Any, Optional
from .decision_engine import run_ai_decision
from services.weather_service import WeatherService
from services.market_hybrid_service import MarketService

async def run_ai_workflow(
    crop: str, 
    lat: float, 
    lon: float, 
    income: float,
    image_result: Optional[str] = None
):
    """
    Orchestrates the retrieval of all internal data sources 
    and pipes them into the Decision Engine.
    """
    # 1. Fetch Internal Data In Parallel
    try:
        weather_task = WeatherService.fetch_weather_data(lat, lon)
        market_task = MarketService.get_all_market_data()
        
        weather_data, market_data = await asyncio.gather(weather_task, market_task)
    except Exception as e:
        print(f"Workflow Data Sync Failure: {e}")
        weather_data, market_data = None, None

    # 2. Execute Decision Logic
    final_output = await run_ai_decision(
        crop=crop,
        location={"lat": lat, "lon": lon},
        income=income,
        market_data=market_data,
        weather_data=weather_data,
        image_result=image_result
    )

    return {
        "workflow_status": "completed",
        "timestamp": asyncio.get_event_loop().time(),
        "final_output": final_output
    }
