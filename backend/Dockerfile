FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements.txt first (for caching)
COPY requirements.txt ./requirements.txt

# Install dependencies with no cache
RUN pip install --no-cache-dir -r requirements.txt

# Copy full project
COPY . .

# Navigate to backend folder
WORKDIR /app/backend

# Use PORT=10000
ENV PORT=8000

# Fix Uvicorn Start Command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
