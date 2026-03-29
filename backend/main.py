import os
import httpx
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai

# Load environment variables early
load_dotenv()

# Local imports
from database import engine, Base, get_db
from models import FarmerProfile, ActivityLog, AdvisorySession
from routes.voice import router as voice_router
from routes.market import router as market_router
from services.weather_service import router as weather_router
from services.money_advisor import router as money_router
from services.scheme_service import router as scheme_router
from services.marketplace_neon.marketplace_routes import router as marketplace_router

app = FastAPI(title="Smart Farmer AI Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router)
app.include_router(market_router)
app.include_router(weather_router)
app.include_router(money_router)
app.include_router(scheme_router)
app.include_router(marketplace_router)

# --- DIRECTORY INITIALIZATION ---
# Create 'uploads' folder explicitly to prevent startup failures on Render.
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount Static Files for Uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Initialize AI Clients
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Initialize Gemini for Vision Analysis
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("Gemini_API_Key")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


# --- DATABASE STARTUP ENGINES ---
@app.on_event("startup")
async def startup():
    """
    Stabilizes the database on startup.
    Will output errors specifically in the logs if connection fails.
    """
    try:
        async with engine.begin() as conn:
            # Sync metadata to the database
            await conn.run_sync(Base.metadata.create_all)
        print("DATABASE PROTOCOL: Table Metadata Synced Successfully.")
        
        # Add initial mock data for advisory history if empty
        async with AsyncSession(engine) as db:
            result = await db.execute(select(AdvisorySession).limit(1))
            if not result.scalars().first():
                db.add_all([
                    AdvisorySession(farmer_name="Suresh Patel", issue_description="Cotton leaf yellowing", status="Pending", cost=200.0),
                    AdvisorySession(farmer_name="Meena Devi", issue_description="Wheat crop growth issues", status="Pending", cost=150.0),
                    AdvisorySession(farmer_name="Ramesh Singh", issue_description="Soil testing help needed", status="Pending", cost=300.0)
                ])
                await db.commit()
    except Exception as e:
        # Critical for Render Troubleshooting
        print(f"CRITICAL STARTUP FAILURE: {e}")
        # We don't raise the error here to allow the server to potentially stay alive for log inspection.

# --- AI PROMPTS ---

TEXT_CHAT_PROMPT = """You are a senior agricultural advisor for rural farmers. Provide professional, practical guidance in Hindi/Hinglish.
RULES:
1. Provide clear, actionable advice for crop symptoms, pest issues, or soil health.
2. If it's a major pest outbreak, suggest consulting a local Krishi Vigyan Kendra (KVK).
3. For soil enrichment, suggest organic or specific fertilizer mixtures based on crop type.
4. Keep it structured and easy to read on mobile."""

VOICE_CHAT_PROMPT = """You are a concise agricultural voice assistant. Use simple Hindi/Hinglish. 
RULES: 
1. Maximum 1 short sentence. 
2. Be direct and clear for audio playback. 
3. Focus on simple farming advice."""

VISION_PROMPT = """You are an agricultural expert AI that analyzes crop and plant images.

Your job is to:
- Identify the crop type (if possible)
- Detect plant diseases or issues
- Assess plant health
- Suggest solutions for farmers

Rules:
- Give output ONLY in point-wise format
- Keep points short and clear
- Use simple farmer-friendly language
- Avoid technical jargon
- If unsure, say 'Not clearly visible'

Output format STRICTLY:

1. Crop Type: <name or unknown>
2. Plant Health: <Good / Average / Poor>
3. Issue Detected: <disease/pest/none>
4. Possible Cause: <reason>
5. Recommendation: <action farmer should take>

Do NOT return paragraphs.
Do NOT include medical-related terms."""

# --- PYDANTIC SCHEMAS ---

class ChatRequest(BaseModel):
    message: str

class ProfileSchema(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    farming_type: Optional[str] = None

    class Config:
        from_attributes = True

class HistorySchema(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    category: str = "General"
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- ENDPOINTS ---

@app.post("/chat")
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    if not client: raise HTTPException(status_code=500, detail="AI link not initialized.")
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile", 
        messages=[{"role": "system", "content": TEXT_CHAT_PROMPT}, {"role": "user", "content": request.message}], 
        temperature=0.6
    )
    response_text = completion.choices[0].message.content
    db.add(ActivityLog(title=f"Chat: {request.message[:20]}...", content=f"User: {request.message}\nAI: {response_text}", category="General"))
    await db.commit()
    return {"response": response_text}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """
    Analyzes crop images specifically via Gemini.
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=503, detail="Stability failure: Vision uplink offline.")

        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Data packet too large (Max 5MB).")

        # Gemini Analysis
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([
            f"{VISION_PROMPT}\n\nAnalyze this crop image.",
            {"mime_type": file.content_type, "data": contents}
        ])

        if not response.text:
            raise Exception("No interpretation received.")

        response_text = response.text
        analysis_points = [line.strip() for line in response_text.split("\n") if line.strip()]
        
        # Save results to ActivityLog
        db.add(ActivityLog(title="Crop Vision Analysis", content=response_text, category="Consultation"))
        await db.commit()
        
        return {"analysis": analysis_points}
    except Exception as e:
        print(f"Vision Analysis Core Error: {e}")
        return {"analysis": ["System Status: Analysis engine stabilizing.", "Please attempt re-upload.", "Manual verification required."]}


@app.post("/voice")
async def voice_chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    Handles voice-to-text queries with rapid AI responses.
    """
    if not client: 
        raise HTTPException(status_code=500, detail="Core AI offline.")
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": VOICE_CHAT_PROMPT}, 
                {"role": "user", "content": request.message}
            ], 
            max_tokens=150,
            temperature=0.5
        )
        response_text = completion.choices[0].message.content
        
        # Advisory Logging
        db.add(ActivityLog(
            title=f"Voice Query: {request.message[:20]}...", 
            content=f"Vocal Input: {request.message}\nAdvisor Response: {response_text}", 
            category="General"
        ))
        await db.commit()
        
        return {"response": response_text}
    except Exception as e:
        print(f"Voice Server Error: {e}")
        raise HTTPException(status_code=500, detail="Vocal processing pipeline failure.")

# --- PROFILE ENDPOINTS ---

@app.get("/profile", response_model=ProfileSchema)
async def get_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FarmerProfile).limit(1))
    return result.scalars().first() or ProfileSchema()

@app.post("/profile", response_model=ProfileSchema)
async def update_profile(request: ProfileSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FarmerProfile).limit(1))
    profile = result.scalars().first()
    if profile:
        profile.age, profile.gender, profile.location, profile.farming_type = request.age, request.gender, request.location, request.farming_type
    else:
        profile = FarmerProfile(**request.dict())
        db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile

@app.get("/history", response_model=List[HistorySchema])
async def get_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ActivityLog).order_by(ActivityLog.timestamp.desc()))
    return result.scalars().all()

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root(): return {"message": "Smart Farmer AI System Active"}

if __name__ == "__main__":
    import uvicorn
    # Use port from environment for local testing flexibility
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
