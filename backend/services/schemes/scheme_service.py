import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

# Locate the data file relative to this script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCHEMES_FILE = os.path.join(BASE_DIR, "data", "schemes.json")

class SchemeRequest(BaseModel):
    state: str = "Gujarat"
    crop: Optional[str] = None
    farmer_type: str = "small" # small | medium | large

@router.post("/")
async def get_schemes(request: SchemeRequest):
    """
    Fetches government schemes categorized by type.
    """
    if not os.path.exists(SCHEMES_FILE):
        raise HTTPException(status_code=500, detail="Schemes Data Vault Offline.")

    try:
        with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Categories
        categories = ["subsidies", "insurance", "financial_help"]
        result = {}
        total_count = 0

        for cat in categories:
            schemes = data.get(cat, [])
            filtered = []
            for s in schemes:
                # Basic Filtering Logic
                state_match = s["state"] == "National" or s.get("state", "").lower() == request.state.lower()
                farmer_match = s.get("farmer_type") == "all" or s.get("farmer_type", "").lower() == request.farmer_type.lower()
                
                if state_match and farmer_match:
                    filtered.append(s)
            
            result[cat] = filtered
            total_count += len(filtered)

        # Summary Generation
        recommendation = "You are eligible for multiple support programs."
        if total_count == 0:
            recommendation = "No specific schemes found for your profile. Please check back later."
        elif len(result["insurance"]) > 0:
            recommendation = "Priority: Ensure your crops are protected with available insurance."

        result["summary"] = {
            "total_schemes": total_count,
            "recommendation": recommendation
        }

        if total_count == 0:
            return {"message": "No schemes available for your profile"}

        return result
    except Exception as e:
        print(f"Schemes Service Error: {e}")
        raise HTTPException(status_code=500, detail="Data Extraction Failure.")
