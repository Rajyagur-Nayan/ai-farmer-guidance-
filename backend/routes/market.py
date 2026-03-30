from fastapi import APIRouter, HTTPException
from services.market_hybrid_service import MarketService

router = APIRouter(prefix="/market", tags=["Market"])

from typing import Optional

@router.get("/market-prices")
async def get_market_prices(
    crop: Optional[str] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None
):
    """
    Get aggregated market prices and trends. If crop is provided, includes AI Smart Advice.
    """
    try:
        data = await MarketService.get_all_market_data()
        
        advice = None
        if crop:
            advice = await MarketService.get_smart_money_advice(crop, lat, lon)
            
        return {
            "categories": data,
            "smart_advice": advice
        }
    except Exception as e:
        print(f"Market Route Error: {e}")
        raise HTTPException(status_code=500, detail="Failure in synchronizing market data.")
