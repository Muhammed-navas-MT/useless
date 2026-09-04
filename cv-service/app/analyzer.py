"""
OpenCV image utilities.

This module is intentionally small.

Its responsibility is to:
- Decode uploaded image bytes.
- Validate the image.
- Provide image dimensions.

It does NOT perform object comparison.
"""

import cv2
import numpy as np


def decode_image(image_bytes: bytes) -> np.ndarray:
    """
    Decode raw image bytes into a BGR OpenCV image.

    Supports common formats such as:
    - JPEG
    - PNG
    - WEBP

    Raises:
        ValueError: if the image cannot be decoded.
    """

    if not image_bytes:
        raise ValueError("Image data is empty")

    # Convert bytes → NumPy uint8 array.
    np_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8,
    )

    if np_array.size == 0:
        raise ValueError("Image data is empty")

    # Decode using OpenCV.
    image = cv2.imdecode(
        np_array,
        cv2.IMREAD_COLOR,
    )

    if image is None:
        raise ValueError(
            "Could not decode image. "
            "Is the file a valid JPEG, PNG, or WEBP image?"
        )

    if image.size == 0:
        raise ValueError("Decoded image is empty")

    return image


def get_image_dimensions(
    image: np.ndarray,
) -> tuple[int, int]:
    """
    Return image dimensions as:

        height, width
    """

    if image is None or image.size == 0:
        raise ValueError("Invalid image")

    height, width = image.shape[:2]

    return height, width