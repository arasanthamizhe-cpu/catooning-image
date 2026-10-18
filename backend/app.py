import os
import uuid
import time
import cv2
import numpy as np
from typing import Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, Field

from image_utils import (
    validate_image_bytes,
    decode_image_to_cv2,
    resize_if_needed,
    cv2_to_base64,
    cv2_to_bytes,
)
from cartoonizer import Cartoonizer

app = FastAPI(
    title="Cartoonify AI API",
    description="Computer Vision Backend for Image Cartooning using OpenCV",
    version="1.0.0",
)

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session cache for processed images
# Structure: { image_id: { "bgr": ndarray, "cartoon_bgr": ndarray, "metadata": dict, "last_params": dict } }
IMAGE_STORE: Dict[str, Dict[str, Any]] = {}

import tempfile
import json

TEMP_DIR = os.path.join(tempfile.gettempdir(), "cartoonify_sessions")
try:
    os.makedirs(TEMP_DIR, exist_ok=True)
except Exception:
    pass


def save_to_disk_cache(image_id: str, bgr: np.ndarray, filename: str, metadata: dict):
    try:
        cv2.imwrite(os.path.join(TEMP_DIR, f"{image_id}.png"), bgr)
        with open(os.path.join(TEMP_DIR, f"{image_id}.json"), "w") as f:
            json.dump({"filename": filename, "metadata": metadata}, f)
    except Exception:
        pass


def get_session(image_id: str) -> Optional[Dict[str, Any]]:
    if image_id in IMAGE_STORE:
        return IMAGE_STORE[image_id]
    img_path = os.path.join(TEMP_DIR, f"{image_id}.png")
    meta_path = os.path.join(TEMP_DIR, f"{image_id}.json")
    if os.path.exists(img_path):
        bgr = cv2.imread(img_path)
        if bgr is not None:
            filename = "cached_image.png"
            metadata = {"current_width": bgr.shape[1], "current_height": bgr.shape[0]}
            if os.path.exists(meta_path):
                try:
                    with open(meta_path, "r") as f:
                        data = json.load(f)
                        filename = data.get("filename", filename)
                        metadata = data.get("metadata", metadata)
                except Exception:
                    pass
            cartoon_bgr = None
            cartoon_path = os.path.join(TEMP_DIR, f"{image_id}_cartoon.png")
            if os.path.exists(cartoon_path):
                cartoon_bgr = cv2.imread(cartoon_path)
            session = {
                "bgr": bgr,
                "filename": filename,
                "metadata": metadata,
                "cartoon_bgr": cartoon_bgr,
                "last_params": {},
                "created_at": time.time(),
            }
            IMAGE_STORE[image_id] = session
            return session
    return None

# Sample image directory path
SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_images"))
if not os.path.exists(SAMPLES_DIR):
    SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sample_images"))


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Cartoonify AI — OpenCV Engine",
        "health": "/api/health",
        "docs": "/docs",
    }


class CartoonParamsRequest(BaseModel):
    image_id: str
    bilateral_d: Optional[int] = 9
    bilateral_sigma_color: Optional[float] = 75.0
    bilateral_sigma_space: Optional[float] = 75.0
    median_blur_ksize: Optional[int] = 7
    adaptive_thresh_block_size: Optional[int] = 9
    adaptive_thresh_c: Optional[float] = 9.0
    style: Optional[str] = "classic"


@app.get("/api/health")
def health_check():
    """Verify backend status and library versions."""
    import cv2
    import numpy as np
    import PIL

    return {
        "status": "healthy",
        "service": "Cartoonify AI — OpenCV Engine",
        "version": "1.0.0",
        "opencv_version": cv2.__version__,
        "numpy_version": np.__version__,
        "pillow_version": PIL.__version__,
        "timestamp": time.time(),
        "active_sessions": len(IMAGE_STORE),
    }


@app.post("/api/image/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Validates, loads, and normalizes an uploaded image.
    Stores it in active memory session and returns preview with metadata.
    """
    try:
        content = await file.read()
        metadata = validate_image_bytes(content)
        bgr_image = decode_image_to_cv2(content)
        bgr_image, was_resized = resize_if_needed(bgr_image)

        h, w = bgr_image.shape[:2]
        image_id = str(uuid.uuid4())

        IMAGE_STORE[image_id] = {
            "bgr": bgr_image,
            "filename": file.filename or "uploaded_image",
            "metadata": {
                **metadata,
                "current_width": w,
                "current_height": h,
                "was_resized": was_resized,
            },
            "cartoon_bgr": None,
            "last_params": {},
            "created_at": time.time(),
        }

        save_to_disk_cache(image_id, bgr_image, file.filename or "uploaded_image", IMAGE_STORE[image_id]["metadata"])

        # Keep cache manageable (keep latest 30 sessions)
        if len(IMAGE_STORE) > 30:
            oldest_key = min(IMAGE_STORE.keys(), key=lambda k: IMAGE_STORE[k]["created_at"])
            del IMAGE_STORE[oldest_key]

        preview_b64 = cv2_to_base64(bgr_image)

        return {
            "success": True,
            "image_id": image_id,
            "filename": file.filename,
            "metadata": IMAGE_STORE[image_id]["metadata"],
            "preview": preview_b64,
            "message": "Image uploaded, validated, and normalized successfully.",
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing error: {str(e)}")


@app.post("/api/image/preprocess")
def preprocess_image(req: CartoonParamsRequest):
    """
    Executes each distinct preprocessing stage and returns stage cards
    (Original, Grayscale, Noise Reduction, Adaptive Edge Mask).
    """
    session = get_session(req.image_id)
    if not session:
        raise HTTPException(status_code=404, detail="Image session not found or expired. Please upload again.")

    bgr_image = session["bgr"]

    stages_data = Cartoonizer.get_preprocessing_stages(bgr_image, req.dict())
    return {
        "success": True,
        "image_id": req.image_id,
        "filename": session["filename"],
        **stages_data,
    }


@app.post("/api/image/cartoonify")
def cartoonify_image(req: CartoonParamsRequest):
    """
    Applies the full OpenCV cartoonization algorithm with user-specified parameters.
    """
    session = get_session(req.image_id)
    if not session:
        raise HTTPException(status_code=404, detail="Image session not found or expired. Please upload again.")

    bgr_image = session["bgr"]

    result = Cartoonizer.cartoonify(bgr_image, req.dict())

    # Cache raw cv2 cartoon image for quick binary download
    session["cartoon_bgr"] = result["cv2_raw_cartoon"]
    session["last_params"] = result["parameters"]
    try:
        cv2.imwrite(os.path.join(TEMP_DIR, f"{req.image_id}_cartoon.png"), result["cv2_raw_cartoon"])
    except Exception:
        pass

    return {
        "success": True,
        "image_id": req.image_id,
        "filename": session["filename"],
        "cartoon_image": result["cartoon_image"],
        "original_image": result["original_image"],
        "color_smoothed": result["color_smoothed"],
        "edge_mask": result["edge_mask"],
        "grayscale": result["grayscale"],
        "duration_ms": result["duration_ms"],
        "dimensions": result["dimensions"],
        "parameters": result["parameters"],
    }


@app.get("/api/image/download/{image_id}")
def download_image_get(
    image_id: str,
    format: str = Query("png", pattern="^(png|jpg|jpeg)$"),
    quality: int = Query(95, ge=50, le=100),
):
    """
    Direct binary download of the processed cartoon image.
    """
    session = get_session(image_id)
    if not session or session["cartoon_bgr"] is None:
        raise HTTPException(status_code=404, detail="Cartoon image not found. Please generate the cartoon first.")

    session = IMAGE_STORE[image_id]
    cartoon_bgr = session["cartoon_bgr"]

    format_clean = format.lower()
    ext = "jpg" if format_clean in ("jpg", "jpeg") else "png"
    media_type = "image/jpeg" if ext == "jpg" else "image/png"

    img_bytes = cv2_to_bytes(cartoon_bgr, format_name=ext.upper(), quality=quality)
    base_name = os.path.splitext(session["filename"])[0]
    download_filename = f"cartoonify_{base_name}.{ext}"

    return Response(
        content=img_bytes,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{download_filename}"',
            "Cache-Control": "no-cache",
        },
    )


@app.post("/api/image/download")
def download_image_post(req: CartoonParamsRequest, format: str = "png"):
    """POST download endpoint matching specification."""
    return download_image_get(req.image_id, format=format)


@app.get("/api/sample-images")
def list_sample_images():
    """
    Returns available pre-bundled sample images with thumbnails for instant testing.
    """
    sample_files = [
        {
            "id": "sample_portrait",
            "title": "Character Portrait",
            "category": "Portraits & People",
            "filename": "sample_portrait.jpg",
            "description": "Artistic face portrait ideal for fine facial edge and skin-tone smoothing test.",
        },
        {
            "id": "sample_landscape",
            "title": "Mountain Sunset",
            "category": "Nature & Landscape",
            "filename": "sample_landscape.jpg",
            "description": "Vibrant landscape with rich gradients, mountains, lake, and tree silhouettes.",
        },
        {
            "id": "sample_car",
            "title": "Sports Car & Road",
            "category": "Vehicles & Objects",
            "filename": "sample_car.jpg",
            "description": "Bold contours, metallic reflection, and high-contrast geometric curves.",
        },
    ]

    samples_with_preview = []
    for s in sample_files:
        full_path = os.path.join(SAMPLES_DIR, s["filename"])
        if os.path.exists(full_path):
            with open(full_path, "rb") as f:
                raw_bytes = f.read()
            bgr = decode_image_to_cv2(raw_bytes)
            # Create lightweight thumbnail
            thumb = cv2.resize(bgr, (200, int(200 * bgr.shape[0] / bgr.shape[1])))
            samples_with_preview.append({
                **s,
                "preview": cv2_to_base64(thumb),
                "width": bgr.shape[1],
                "height": bgr.shape[0],
            })

    return {"samples": samples_with_preview}


@app.post("/api/sample-images/load/{sample_id}")
def load_sample_image(sample_id: str):
    """
    Loads a selected sample image into an active session.
    """
    filename_map = {
        "sample_portrait": "sample_portrait.jpg",
        "sample_landscape": "sample_landscape.jpg",
        "sample_car": "sample_car.jpg",
    }
    if sample_id not in filename_map:
        raise HTTPException(status_code=404, detail=f"Sample '{sample_id}' not found.")

    filename = filename_map[sample_id]
    full_path = os.path.join(SAMPLES_DIR, filename)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Sample image file missing on disk.")

    with open(full_path, "rb") as f:
        content = f.read()

    metadata = validate_image_bytes(content)
    bgr_image = decode_image_to_cv2(content)
    h, w = bgr_image.shape[:2]
    image_id = str(uuid.uuid4())

    IMAGE_STORE[image_id] = {
        "bgr": bgr_image,
        "filename": filename,
        "metadata": {
            **metadata,
            "current_width": w,
            "current_height": h,
            "was_resized": False,
        },
        "cartoon_bgr": None,
        "last_params": {},
        "created_at": time.time(),
    }

    save_to_disk_cache(image_id, bgr_image, filename, IMAGE_STORE[image_id]["metadata"])

    return {
        "success": True,
        "image_id": image_id,
        "filename": filename,
        "metadata": IMAGE_STORE[image_id]["metadata"],
        "preview": cv2_to_base64(bgr_image),
        "message": f"Sample '{filename}' loaded into session successfully.",
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("app:app", host=host, port=port, reload=False)
