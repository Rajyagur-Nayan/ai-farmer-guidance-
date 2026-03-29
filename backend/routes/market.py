from fastapi import APIRouter, HTTPException
from services.market_hybrid_service import MarketService

router = APIRouter(prefix="/market", tags=["Market"])

@router.get("/market-prices")
async def get_market_prices():
    """
    Get aggregated market prices and trends for all crop categories.
    """
    try:
        data = await MarketService.get_all_market_data()
        return {"categories": data}
    except Exception as e:
        print(f"Market Route Error: {e}")
        raise HTTPException(status_code=500, detail="Failure in synchronizing market data.")
