import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# Neon/asyncpg fix: 'sslmode' and other libpq parameters can cause TypeError in asyncpg.connect()
if "?" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]

if "postgresql://" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# Create Async Engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
    connect_args={"ssl": True} if "neon.tech" in DATABASE_URL else {}
)

# Session factory for marketplace transactions
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_market_db():
    """
    Dependency to provide an asynchronous database session for marketplace operations.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
