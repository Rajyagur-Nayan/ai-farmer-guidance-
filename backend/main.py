import os
import math
import httpx
import base64
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
import math

# Load environment variables early
load_dotenv()

# Local imports
from database import engine, Base, get_db
from models import Profile, MedicalHistory, Consultation, Prescription
from routes.voice import router as voice_router
from routes.market import router as market_router
from services.weather_service import router as weather_router
from services.money_advisor import router as money_router
from services.scheme_service import router as scheme_router
from services.marketplace_neon.marketplace_routes import router as marketplace_router

app = FastAPI(title="Rural Health Assistant API")

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

# Mount Static Files for Uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Initialize AI Clients
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Initialize Gemini for Vision Analysis
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("Gemini_API_Key")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


# --- DATABASE INIT ---
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Add initial mock patients for Doctor Dashboard if queue is empty
    async with AsyncSession(engine) as db:
        result = await db.execute(select(Consultation).limit(1))
        if not result.scalars().first():
            db.add_all([
                Consultation(patient_name="Suresh Patel", symptoms="Cotton leaf yellowing", status="Pending", earnings=200.0),
                Consultation(patient_name="Meena Devi", symptoms="Wheat crop growth issues", status="Pending", earnings=150.0),
                Consultation(patient_name="Ramesh Singh", symptoms="Soil testing help needed", status="Pending", earnings=300.0)
            ])
            await db.commit()

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

AGRI_ADVICE_PROMPT = """You are a safe advisor for biopesticides and organic fertilizers. 
RULES:
1. Suggest natural or government-approved fertilizers (e.g., Neem cake, compost, Urea in moderate amounts).
2. For pests, suggest early-stage control like sticky traps or pheromone traps.
3. ALWAYS include a safety warning: 'Verify the solution with your local agricultural officer before full application.'
4. If the crop is severely dying, recommend immediate site inspection by an expert.
5. Provide simple ratios for application."""

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

class SmartHospitalRequest(BaseModel):
    text: str
    lat: float
    lng: float
    category: Optional[str] = "All"

class AppointmentRequest(BaseModel):
    patient_name: str
    hospital_name: str
    specialty: Optional[str] = None
    appointment_date: str
    appointment_time: str
    reason: Optional[str] = None

class ProfileSchema(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    health_info: Optional[str] = None

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

class ConsultationSchema(BaseModel):
    id: Optional[int] = None
    patient_name: str
    symptoms: Optional[str] = None
    status: str = "Pending"
    earnings: float = 0.0
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class PrescriptionSchema(BaseModel):
    consultation_id: int
    medication_details: str

# --- ENDPOINTS ---

@app.post("/chat")
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    if not client: raise HTTPException(status_code=500, detail="Groq API not initialized.")
    completion = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=[{"role": "system", "content": TEXT_CHAT_PROMPT}, {"role": "user", "content": request.message}], temperature=0.6)
    response_text = completion.choices[0].message.content
    db.add(MedicalHistory(title=f"Chat: {request.message[:20]}...", content=f"User: {request.message}\nAI: {response_text}", category="General"))
    await db.commit()
    return {"response": response_text}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """
    Analyzes medical images specifically via Gemini 1.5 Flash.
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=503, detail="Gemini API Key missing.")

        # Read and validate
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (Max 5MB).")

        # Gemini Analysis
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content([
            f"{VISION_PROMPT}\n\nAnalyze this safely.",
            {"mime_type": file.content_type, "data": contents}
        ])

        if not response.text:
            raise Exception("Empty interpretation received.")

        response_text = response.text
        
        # Format as points
        analysis_points = [line.strip() for line in response_text.split("\n") if line.strip()]
        
        # Save results
        db.add(MedicalHistory(title="Crop Vision Analysis", content=response_text, category="Consultation"))
        await db.commit()
        
        return {"analysis": analysis_points}
    except Exception as e:
        print(f"Vision Error: {e}")
        return {"analysis": ["Service Notification: Optical diagnostic systems are stabilizing.", "Please re-upload image.", "If the crop issue is severe, consult local agriculture expert."]}


@app.post("/voice")
async def voice_chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    Handles clinical voice-to-text queries with rapid AI responses.
    """
    if not client: 
        raise HTTPException(status_code=500, detail="Groq API not initialized.")
    
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
        
        # Clinical Logging
        db.add(MedicalHistory(
            title=f"Voice Query: {request.message[:20]}...", 
            content=f"Vocal Input: {request.message}\nMatrix Response: {response_text}", 
            category="Emergency" if "hospital" in response_text.lower() else "General"
        ))
        await db.commit()
        
        return {"response": response_text}
    except Exception as e:
        print(f"Voice Server Error: {e}")
        raise HTTPException(status_code=500, detail="Vocal processing pipeline failure.")

# --- DOCTOR DASHBOARD ENDPOINTS ---

@app.get("/consultations/queue", response_model=List[ConsultationSchema])
async def get_queue(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Consultation).filter(Consultation.status != "Completed").order_by(Consultation.timestamp.asc()))
    return result.scalars().all()

@app.post("/consultations/{id}/start")
async def start_consultation(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Consultation).filter(Consultation.id == id))
    consultation = result.scalars().first()
    if not consultation: raise HTTPException(status_code=404, detail="Session lost.")
    consultation.status = "Active"
    await db.commit()
    return {"status": "Active"}

@app.post("/prescriptions")
async def issue_prescription(request: PrescriptionSchema, db: AsyncSession = Depends(get_db)):
    # Save prescription
    db.add(Prescription(consultation_id=request.consultation_id, medication_details=request.medication_details))
    # Close consultation
    result = await db.execute(select(Consultation).filter(Consultation.id == request.consultation_id))
    consultation = result.scalars().first()
    if consultation: consultation.status = "Completed"
    await db.commit()
    return {"status": "Issued"}

@app.get("/doctor/earnings")
async def get_earnings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.sum(Consultation.earnings)).filter(Consultation.status == "Completed"))
    total = result.scalar() or 0.0
    return {"total": total}

@app.post("/appointments/book")
async def book_appointment(request: AppointmentRequest, db: AsyncSession = Depends(get_db)):
    from models import Appointment
    new_app = Appointment(
        patient_name=request.patient_name,
        hospital_name=request.hospital_name,
        specialty=request.specialty,
        appointment_date=request.appointment_date,
        appointment_time=request.appointment_time,
        reason=request.reason
    )
    db.add(new_app)
    await db.commit()
    return {"status": "Protocol Confirmed", "booking_id": f"RX-{datetime.now().strftime('%Y%j%H%M')}"}

# --- OTHER ENDPOINTS ---

@app.get("/profile", response_model=ProfileSchema)
async def get_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile).limit(1))
    return result.scalars().first() or ProfileSchema()

@app.post("/profile", response_model=ProfileSchema)
async def update_profile(request: ProfileSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile).limit(1))
    profile = result.scalars().first()
    if profile:
        profile.age, profile.gender, profile.weight, profile.health_info = request.age, request.gender, request.weight, request.health_info
    else:
        profile = Profile(**request.dict())
        db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile

@app.get("/history", response_model=List[HistorySchema])
async def get_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MedicalHistory).order_by(MedicalHistory.timestamp.desc()))
    return result.scalars().all()

@app.get("/")
async def root(): return {"message": "Active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
