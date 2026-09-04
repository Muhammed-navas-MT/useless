"""
YOLO object detection wrapper.

The default YOLOv8n model is trained on the COCO dataset.

For "Who Moved My Stuff?", we only keep useful objects
and intentionally ignore classes that are likely to create
false positives for our use case.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
from ultralytics import YOLO


# ---------------------------------------------------------
# MODEL
# ---------------------------------------------------------

MODEL_NAME = "yolov8n.pt"

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / MODEL_NAME
)


# ---------------------------------------------------------
# DETECTION SETTINGS
# ---------------------------------------------------------

# Previous value was 0.40.
# A slightly higher threshold removes many weak detections.
CONFIDENCE_THRESHOLD = 0.55


# ---------------------------------------------------------
# COCO CLASS IDs
# ---------------------------------------------------------
#
# COCO IDs used by YOLOv8:
#
# 24  backpack
# 26  handbag
# 28  suitcase
# 39  bottle
# 41  cup
# 62  tv
# 63  laptop
# 64  mouse
# 65  remote
# 66  keyboard
# 67  cell phone
# 73  book
# 74  clock
# 76  scissors
#
# IMPORTANT:
#
# "headphones" is NOT a COCO class.
# Therefore the default YOLOv8n model cannot reliably
# detect headphones.
#
# "tv" IS a COCO class, but we intentionally exclude it
# because it produced a false positive in your test.
# ---------------------------------------------------------

ALLOWED_CLASSES = {
    "backpack",
    "handbag",
    "suitcase",
    "bottle",
    "cup",
    "laptop",
    "mouse",
    "remote",
    "keyboard",
    "cell phone",
    "book",
    "clock",
    "scissors",
}


# Explicit blacklist for classes we never want.
# This gives us an extra safety layer.
BLOCKED_CLASSES = {
    "tv",
}


# ---------------------------------------------------------
# MODEL CACHE
# ---------------------------------------------------------

_model: Optional[YOLO] = None


def get_model() -> YOLO:
    """
    Load YOLO once and reuse it for all requests.

    If a local model exists at models/yolov8n.pt,
    use it.

    Otherwise use "yolov8n.pt", which allows Ultralytics
    to download the model automatically when internet
    access is available.
    """

    global _model

    if _model is not None:
        return _model

    if MODEL_PATH.exists():
        print(f"[cv-service] Loading local YOLO model: {MODEL_PATH}")
        _model = YOLO(str(MODEL_PATH))
    else:
        print(
            "[cv-service] Local YOLO model not found. "
            "Loading yolov8n.pt through Ultralytics."
        )

        _model = YOLO(MODEL_NAME)

    return _model


# ---------------------------------------------------------
# DETECTION
# ---------------------------------------------------------


def detect_objects(image: np.ndarray) -> List[Dict[str, Any]]:
    """
    Detect useful objects in a BGR OpenCV image.

    Returns:

    [
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
    """

    if image is None or image.size == 0:
        raise ValueError("Invalid or empty image")

    model = get_model()

    image_height, image_width = image.shape[:2]

    if image_width <= 0 or image_height <= 0:
        raise ValueError("Invalid image dimensions")

    # Run YOLO.
    results = model.predict(
        source=image,
        conf=CONFIDENCE_THRESHOLD,
        verbose=False,
    )

    objects: List[Dict[str, Any]] = []

    for result in results:
        names = result.names

        if result.boxes is None:
            continue

        for box in result.boxes:

            confidence = float(box.conf[0])
            class_id = int(box.cls[0])

            # Safely get class name.
            name = names.get(class_id)

            if not name:
                continue

            name = str(name).lower().strip()

            # -------------------------------------------------
            # CLASS FILTERING
            # -------------------------------------------------

            # Ignore explicitly blocked objects.
            if name in BLOCKED_CLASSES:
                print(
                    f"[cv-service] Ignoring blocked detection: "
                    f"{name} ({confidence:.2f})"
                )
                continue

            # Ignore classes that are not useful for this app.
            if name not in ALLOWED_CLASSES:
                continue

            # -------------------------------------------------
            # BOUNDING BOX
            # -------------------------------------------------

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            # Clamp coordinates to image boundaries.
            x1 = max(0.0, min(float(x1), float(image_width)))
            y1 = max(0.0, min(float(y1), float(image_height)))
            x2 = max(0.0, min(float(x2), float(image_width)))
            y2 = max(0.0, min(float(y2), float(image_height)))

            # Ignore invalid boxes.
            if x2 <= x1 or y2 <= y1:
                continue

            # -------------------------------------------------
            # CENTER
            # -------------------------------------------------

            center_x = (x1 + x2) / 2
            center_y = (y1 + y2) / 2

            # -------------------------------------------------
            # NORMALIZED CENTER
            # -------------------------------------------------
            #
            # Instead of relying only on pixels:
            #
            # x = center_x / image_width
            # y = center_y / image_height
            #
            # This gives a value from 0 to 1.
            # -------------------------------------------------

            normalized_x = center_x / image_width
            normalized_y = center_y / image_height

            detection = {
                "name": name,
                "confidence": round(confidence, 4),

                "box": {
                    "x1": round(x1, 2),
                    "y1": round(y1, 2),
                    "x2": round(x2, 2),
                    "y2": round(y2, 2),
                },

                "center": {
                    "x": round(center_x, 2),
                    "y": round(center_y, 2),
                },

                "normalizedCenter": {
                    "x": round(normalized_x, 6),
                    "y": round(normalized_y, 6),
                },
            }

            objects.append(detection)

    return objects