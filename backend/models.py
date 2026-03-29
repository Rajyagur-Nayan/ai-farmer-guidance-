from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from datetime import datetime
from database import Base

class FarmerProfile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    farming_type = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "history"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    category = Column(String(50), default="General")
    timestamp = Column(DateTime, default=datetime.utcnow)

class AdvisorySession(Base):
    __tablename__ = "consultations"
    id = Column(Integer, primary_key=True, index=True)
    farmer_name = Column(String(255), nullable=False)
    issue_description = Column(Text, nullable=True)
    status = Column(String(50), default="Pending") # Pending, Active, Completed
    cost = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "prescriptions"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("consultations.id"))
    advice_details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
