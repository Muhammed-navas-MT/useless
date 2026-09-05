FROM python:3.11-slim

# Fix: Use libgl1-mesa-glx or libglvnd0 to properly provide libGL.so.1 in slim images
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway / Render runtime fix applied perfectly
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
