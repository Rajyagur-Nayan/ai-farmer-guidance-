import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

# Locate the data file relative to this script
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMES_FILE = os.path.join(BASE_DIR, "data", "schemes.json")

class SchemeRequest(BaseModel):
    state: str = "Gujarat"
    crop: Optional[str] = None
    farmer_type: str = "small" # small | medium | large

@router.post("/")
async def get_schemes(request: SchemeRequest):
    """
    Fetches government schemes based on the farmer's profile.
    """
    if not os.path.exists(SCHEMES_FILE):
        raise HTTPException(status_code=500, detail="Schemes Data Vault Offline.")

    try:
        with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            all_schemes = data.get("schemes", [])

        # Filter Logic
        filtered = []
        for s in all_schemes:
            # Match State (National schemes apply to all)
            state_match = s["state"] == "National" or s.get("state", "").lower() == request.state.lower()
            
            # Match Farmer Type
            farmer_match = s.get("farmer_type") == "all" or s.get("farmer_type", "").lower() == request.farmer_type.lower()
            
            if state_match and farmer_match:
                filtered.append(s)

        return {"schemes": filtered}
    except Exception as e:
        print(f"Schemes Service Error: {e}")
        raise HTTPException(status_code=500, detail="Data Extraction Failure.")
