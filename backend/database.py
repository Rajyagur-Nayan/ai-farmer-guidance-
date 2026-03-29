import os
import socket
import httpx
import platform
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# --- DNS Patch for Neon (Windows Only) ---
# Some ISPs block or fail to return A records for neon.tech pooler domains on Windows.
if platform.system() == 'Windows':
    _orig_getaddrinfo = socket.getaddrinfo

    def patched_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
        if host and "neon.tech" in host:
            try:
                url = f"https://dns.google/resolve?name={host}&type=A"
                r = httpx.get(url, timeout=5.0)
                if r.status_code == 200:
                    data = r.json()
                    for answer in data.get("Answer", []):
                        if answer.get("type") == 1: # A record
                            ip = answer.get("data")
                            return [(socket.AF_INET, type if type else socket.SOCK_STREAM, 
                                     proto if proto else socket.IPPROTO_TCP, '', (ip, port))]
            except Exception:
                pass
        return _orig_getaddrinfo(host, port, family, type, proto, flags)

    socket.getaddrinfo = patched_getaddrinfo
# ------------------------------------

# Use asyncpg for async PostgreSQL
# Defaulting to an empty string if not found to prevent attribute errors
raw_url = os.getenv("DATABASE_URL", "").strip()

if not raw_url:
    print("WARNING: DATABASE_URL not found. System will fail on database operations.")
    DATABASE_URL = "sqlite+aiosqlite:///./test.db" # Local fallback for stability
else:
    DATABASE_URL = raw_url.replace("postgresql://", "postgresql+asyncpg://")
    # Strip query parameters that cause issues with asyncpg
    if "?" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.split("?")[0]

engine = create_async_engine(
    DATABASE_URL, 
    echo=False, # Disable massive logs in production
    connect_args={"ssl": True} if "neon.tech" in raw_url else {}
)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
