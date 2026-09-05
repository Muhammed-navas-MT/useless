FROM python:3.11-slim

# opencv-python-headless still dynamically links libGL/libglib at import time,
# even though it's the "headless" build. Without these OS packages, `import cv2`
# fails with: ImportError: libGL.so.1: cannot open shared object file.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway (and Render) inject PORT at runtime; bind to it and to 0.0.0.0
# so the platform's proxy can reach the container.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
