import uvicorn
import os
from main import app as original_app
from routes.ai_agent_router import router as ai_agent_router

# Clone the original app or just reference it
# Since we can't modify main.py, we just import and include the new router
app = original_app

# Add the New AI Agent Router
app.include_router(ai_agent_router)

# Metadata Update
app.title = "Smart Farmer AI Platform (Agent Powered)"

if __name__ == "__main__":
    # Standard Uvicorn startup
    uvicorn.run("main_agent:app", host="0.0.0.0", port=8000, reload=True)
