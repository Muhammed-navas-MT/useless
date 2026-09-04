"""
FastAPI entrypoint for the computer vision service.

POST /detect
    Accepts an uploaded image and returns YOLO detections.

The service is responsible only for:
    - Receiving the image
    - Decoding the image
    - Running YOLO
    - Returning structured detection data

It does NOT:
    - Compare BEFORE vs AFTER
    - Calculate movement in centimeters
    - Generate the Gemini report
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile

from app.analyzer import decode_image, get_image_dimensions
from app.detector import detect_objects, get_model


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """
    Warm up the YOLO model when the service starts.

    If the model cannot be loaded during startup, the application
    will still start and get_model() will retry when /detect is called.
    """
    try:
        get_model()
        print("[cv-service] YOLO model loaded successfully")
    except Exception as exc:
        print(f"[cv-service] YOLO warm-up skipped: {exc}")

    yield


app = FastAPI(
    title="Who Moved My Stuff - CV Service",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health")
def health() -> dict:
    """Health-check endpoint."""
    return {
        "success": True,
        "status": "ok",
    }


@app.post("/detect")
async def detect(file: UploadFile = File(...)) -> dict:
    """
    Detect objects in an uploaded image.

    Response:

    {
        "success": true,
        "image": {
            "width": 1920,
            "height": 1080
        },
        "objects": [
            {
                "name": "laptop",
                "confidence": 0.91,
                "box": {
                    "x1": 100,
                    "y1": 120,
                    "x2": 500,
                    "y2": 500
                },
                "center": {
                    "x": 300,
                    "y": 310
                },
                "normalizedCenter": {
                    "x": 0.15625,
                    "y": 0.28704
                }
            }
        ]
    }
    """

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Empty file upload",
        )

    # Decode image using OpenCV.
    try:
        image = decode_image(image_bytes)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    # Get original image dimensions.
    height, width = get_image_dimensions(image)

    # Run YOLO.
    try:
        objects = detect_objects(image)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {exc}",
        ) from exc

    return {
        "success": True,
        "image": {
            "width": width,
            "height": height,
        },
        "objects": objects,
    }