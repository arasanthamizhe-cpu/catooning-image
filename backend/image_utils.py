import io
import base64
import numpy as np
import cv2
from PIL import Image
from typing import Tuple, Optional, Dict, Any

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
SUPPORTED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP"}
MAX_PROCESSING_DIMENSION = 1920  # Max dimension to ensure responsive processing


def validate_image_bytes(image_bytes: bytes) -> Dict[str, Any]:
    """
    Validates uploaded image bytes. Checks size, format, integrity, and dimensions.
    Returns metadata dictionary or raises ValueError.
    """
    if not image_bytes:
        raise ValueError("Empty image data received.")

    size_bytes = len(image_bytes)
    if size_bytes > MAX_FILE_SIZE_BYTES:
        raise ValueError(
            f"Image size exceeds 15 MB limit (Current: {size_bytes / (1024 * 1024):.2f} MB)."
        )

    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        pil_img.verify()  # Verify integrity
        
        # Re-open because verify() may alter internal pointer
        pil_img = Image.open(io.BytesIO(image_bytes))
        img_format = (pil_img.format or "UNKNOWN").upper()
        if img_format not in SUPPORTED_FORMATS:
            raise ValueError(
                f"Unsupported format '{img_format}'. Please upload JPG, JPEG, or PNG."
            )
        width, height = pil_img.size
        aspect_ratio = round(width / max(height, 1), 2)
        mode = pil_img.mode

        return {
            "format": img_format,
            "width": width,
            "height": height,
            "aspect_ratio": f"{aspect_ratio}:1 ({width}x{height})",
            "size_kb": round(size_bytes / 1024, 2),
            "color_mode": mode,
        }
    except Exception as e:
        if isinstance(e, ValueError):
            raise e
        raise ValueError(f"Corrupted or invalid image file: {str(e)}")


def decode_image_to_cv2(image_bytes: bytes) -> np.ndarray:
    """
    Decodes raw image bytes into an OpenCV BGR numpy array.
    Correctly handles transparency (RGBA -> BGR composite with white background).
    """
    # Use Pillow first to handle alpha transparency cleanly
    pil_img = Image.open(io.BytesIO(image_bytes))
    
    if pil_img.mode in ("RGBA", "LA") or (pil_img.mode == "P" and "transparency" in pil_img.info):
        # Convert transparent background to clean white
        pil_rgba = pil_img.convert("RGBA")
        background = Image.new("RGBA", pil_rgba.size, (255, 255, 255, 255))
        composite = Image.alpha_composite(background, pil_rgba)
        rgb_img = composite.convert("RGB")
    else:
        rgb_img = pil_img.convert("RGB")

    np_img = np.array(rgb_img)
    # Convert RGB (Pillow) to BGR (OpenCV)
    bgr_img = cv2.cvtColor(np_img, cv2.COLOR_RGB2BGR)
    return bgr_img


def resize_if_needed(bgr_img: np.ndarray, max_dim: int = MAX_PROCESSING_DIMENSION) -> Tuple[np.ndarray, bool]:
    """
    Resizes image maintaining aspect ratio if height or width exceeds max_dim.
    """
    h, w = bgr_img.shape[:2]
    if max(h, w) <= max_dim:
        return bgr_img, False

    if w >= h:
        new_w = max_dim
        new_h = int(h * (max_dim / w))
    else:
        new_h = max_dim
        new_w = int(w * (max_dim / h))

    resized = cv2.resize(bgr_img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return resized, True


def cv2_to_base64(img: np.ndarray, format_ext: str = ".png", quality: int = 90) -> str:
    """
    Encodes an OpenCV image (BGR or Grayscale) to a base64 Data URL.
    """
    if format_ext.lower() in (".jpg", ".jpeg"):
        encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        ext = ".jpg"
        mime = "image/jpeg"
    else:
        encode_params = [int(cv2.IMWRITE_PNG_COMPRESSION), 4]
        ext = ".png"
        mime = "image/png"

    success, buffer = cv2.imencode(ext, img, encode_params)
    if not success:
        raise ValueError("Failed to encode image to base64.")

    b64_str = base64.b64encode(buffer).decode("utf-8")
    return f"data:{mime};base64,{b64_str}"


def cv2_to_bytes(img: np.ndarray, format_name: str = "PNG", quality: int = 95) -> bytes:
    """
    Encodes an OpenCV image to binary bytes for file download.
    """
    fmt = format_name.upper()
    if fmt in ("JPG", "JPEG"):
        encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        ext = ".jpg"
    else:
        encode_params = [int(cv2.IMWRITE_PNG_COMPRESSION), 4]
        ext = ".png"

    success, buffer = cv2.imencode(ext, img, encode_params)
    if not success:
        raise ValueError("Failed to encode image to binary bytes.")
    return buffer.tobytes()
