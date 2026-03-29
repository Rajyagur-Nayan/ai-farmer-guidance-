import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from .database import get_market_db, engine, Base
from .models import Product

router = APIRouter(prefix="/marketplace", tags=["Farmer Marketplace"])

# Ensure database tables exist for Neon PostgreSQL on start
@router.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Persistent storage for product imagery
# Path relative to project root for static serving
UPLOAD_DIR = "uploads" 
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/add-product")
async def add_product(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    location: str = Form(...),
    seller_name: str = Form(...),
    contact: str = Form(...),
    image: UploadFile = File(...),
    quantity: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_market_db)
):
    """
    Registers a new product in the marketplace with image persistence.
    """
    # Security: Validate file type
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="High-fidelity agricultural records require valid image formats.")
    
    # Save image to local uploads directory
    file_ext = os.path.splitext(image.filename)[1]
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as f:
            f.write(await image.read())
        
        # Construct relative URL for the frontend
        image_url = f"/uploads/{filename}"
        
        # Insert metadata into Neon PostgreSQL
        new_product = Product(
            name=name,
            category=category,
            price=price,
            location=location,
            image_url=image_url,
            seller_name=seller_name,
            contact=contact,
            quantity=quantity,
            description=description
        )
        
        db.add(new_product)
        await db.commit()
        await db.refresh(new_product)
        
        return new_product
    except Exception as e:
        print(f"Marketplace Persistence Error: {e}")
        raise HTTPException(status_code=500, detail="Data sync failure across neural link.")

@router.get("/products")
async def get_products(
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_market_db)
):
    """
    Fetches all available products with optional filtering.
    """
    query = select(Product)
    if category:
        query = query.where(Product.category == category)
    if location:
        query = query.where(Product.location.ilike(f"%{location}%"))
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/product/{id}")
async def get_product(id: int, db: AsyncSession = Depends(get_market_db)):
    """
    Retrieves high-fidelity details for a specific product.
    """
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Entity not found in marketplace registry.")
    return product

@router.delete("/product/{id}")
async def delete_product(id: int, db: AsyncSession = Depends(get_market_db)):
    """
    Purges a product record from the market sequence.
    """
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Purge target does not exist.")
    
    await db.delete(product)
    await db.commit()
    return {"message": "Protocol confirmed: Product purged."}
