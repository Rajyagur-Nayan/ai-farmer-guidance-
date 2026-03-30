from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from services.ai_agent.decision_engine import run_ai_decision
from services.ai_agent.workflow_engine import run_ai_workflow
from services.ai_agent.decision_logger import get_logs

router = APIRouter(prefix="/ai-agent", tags=["AI Agent"])

class DecisionInput(BaseModel):
    crop: str
    location: Dict[str, float]
    image_result: Optional[str] = None
    monthly_income: float

@router.post("/ai-decision")
async def ai_decision(data: DecisionInput):
    """
    Executes a high-level agricultural decision logic based on direct inputs.
    """
    try:
        result = await run_ai_decision(
            crop=data.crop,
            location=data.location,
            income=data.monthly_income,
            image_result=data.image_result
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai-workflow")
async def ai_workflow(data: DecisionInput):
    """
    Automatically fetches internal data (weather/market) and runs the decision engine.
    """
    try:
        result = await run_ai_workflow(
            crop=data.crop,
            lat=data.location.get("lat", 0.0),
            lon=data.location.get("lon", 0.0),
            income=data.monthly_income,
            image_result=data.image_result
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai-logs")
async def ai_logs():
    """
    Retrieves the reasoning history of the AI Agent.
    """
    return get_logs()
