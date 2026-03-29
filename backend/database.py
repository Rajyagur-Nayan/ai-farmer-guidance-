import os
import socket
import httpx
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# --- DNS Patch for Neon on Windows ---
# Some ISPs block or fail to return A records for neon.tech pooler domains.
# This intercepts the DNS resolution and securely asks Google DNS-over-HTTPS.
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
raw_url = os.getenv("DATABASE_URL", "").strip()
DATABASE_URL = raw_url.replace("postgresql://", "postgresql+asyncpg://")

# Neon/asyncpg fix: 'sslmode' and other libpq parameters can cause TypeError in asyncpg.connect()
# We strip them and pass ssl=True explicitly if required.
if "?" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]

engine = create_async_engine(
    DATABASE_URL, 
    echo=True,
    connect_args={"ssl": True} if "neon.tech" in raw_url else {}
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
