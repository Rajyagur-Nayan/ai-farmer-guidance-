from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from .database import Base

class Product(Base):
    """
    Marketplace Product model for Neon PostgreSQL storage.
    Includes farmer contact information and product metadata.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=False)
    location = Column(String, nullable=False)
    seller_name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
