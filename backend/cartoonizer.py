import cv2
import numpy as np
import time
from typing import Dict, Any, Tuple
from image_utils import cv2_to_base64


class Cartoonizer:
    """
    Core Computer Vision engine for cartooning images using OpenCV.
    Implements each distinct stage of the cartooning pipeline:
    - Grayscale conversion
    - Noise reduction via Median Filtering
    - Edge detection via Adaptive Thresholding
    - Color smoothing via Bilateral Filtering
    - Mask combination via Bitwise AND
    - Multi-style rendering (Classic, Comic Book, Pencil Sketch, Pastel, Watercolor)
    """

    @staticmethod
    def validate_and_sanitize_params(params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates and sanitizes parameters for OpenCV functions to prevent crashes.
        OpenCV requires specific constraints:
        - median_blur_ksize must be an ODD integer >= 3
        - adaptive_thresh_block_size must be an ODD integer >= 3
        - bilateral_d must be >= 1
        - sigmas must be > 0
        """
        # Bilateral filter diameter
        d = int(params.get("bilateral_d", 9))
        d = max(1, min(25, d))

        # Bilateral filter sigma color
        sigma_color = float(params.get("bilateral_sigma_color", 75))
        sigma_color = max(10.0, min(300.0, sigma_color))

        # Bilateral filter sigma space
        sigma_space = float(params.get("bilateral_sigma_space", 75))
        sigma_space = max(10.0, min(300.0, sigma_space))

        # Median blur kernel size (MUST BE ODD >= 3)
        ksize = int(params.get("median_blur_ksize", 7))
        ksize = max(3, min(25, ksize))
        if ksize % 2 == 0:
            ksize += 1

        # Adaptive threshold block size (MUST BE ODD >= 3)
        block_size = int(params.get("adaptive_thresh_block_size", 9))
        block_size = max(3, min(31, block_size))
        if block_size % 2 == 0:
            block_size += 1

        # Adaptive threshold constant C
        c_val = float(params.get("adaptive_thresh_c", 9))
        c_val = max(1.0, min(30.0, c_val))

        style = str(params.get("style", "classic")).lower()
        if style not in ("classic", "comic_bold", "pencil_sketch", "soft_pastel", "watercolor"):
            style = "classic"

        return {
            "bilateral_d": d,
            "bilateral_sigma_color": sigma_color,
            "bilateral_sigma_space": sigma_space,
            "median_blur_ksize": ksize,
            "adaptive_thresh_block_size": block_size,
            "adaptive_thresh_c": c_val,
            "style": style,
        }

    @staticmethod
    def get_preprocessing_stages(bgr_image: np.ndarray, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Executes each individual preprocessing step and returns images & metadata
        for Page 3 (Image Preprocessing breakdown).
        """
        clean_params = Cartoonizer.validate_and_sanitize_params(params or {})
        ksize = clean_params["median_blur_ksize"]
        block_size = clean_params["adaptive_thresh_block_size"]
        c_val = clean_params["adaptive_thresh_c"]

        h, w = bgr_image.shape[:2]

        # Stage 1: Original Image
        stage1_b64 = cv2_to_base64(bgr_image)

        # Stage 2: Grayscale Conversion
        # Transforms 3-channel color image (BGR) into single luminance channel
        gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
        stage2_b64 = cv2_to_base64(gray)

        # Stage 3: Noise Reduction via Median Blur
        # Median filtering replaces each pixel value with the median of neighboring pixels,
        # preserving edge boundaries while eliminating salt-and-pepper noise.
        blurred = cv2.medianBlur(gray, ksize)
        stage3_b64 = cv2_to_base64(blurred)

        # Stage 4: Edge Detection via Adaptive Thresholding
        # Dynamically calculates threshold values across local neighborhoods of size `block_size`,
        # identifying prominent contours and sketching outlines like a cartoonist's pen.
        edge_mask = cv2.adaptiveThreshold(
            blurred,
            255,
            cv2.ADAPTIVE_THRESH_MEAN_C,
            cv2.THRESH_BINARY,
            block_size,
            c_val,
        )
        stage4_b64 = cv2_to_base64(edge_mask)

        return {
            "stages": [
                {
                    "stage_number": 1,
                    "title": "Original Image Loading & Resizing",
                    "description": "Validated dimensions and color space. High resolution normalized preserving aspect ratio.",
                    "status": "Completed",
                    "preview": stage1_b64,
                    "metrics": {"dimensions": f"{w}x{h}", "channels": 3},
                },
                {
                    "stage_number": 2,
                    "title": "BGR to Grayscale Conversion",
                    "description": "Converted color matrix into single luminance channel using cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).",
                    "status": "Completed",
                    "preview": stage2_b64,
                    "metrics": {"color_space": "Grayscale", "channels": 1},
                },
                {
                    "stage_number": 3,
                    "title": "Noise Reduction (Median Filtering)",
                    "description": f"Applied cv2.medianBlur(gray, {ksize}) to remove high-frequency noise while preserving edge boundaries.",
                    "status": "Completed",
                    "preview": stage3_b64,
                    "metrics": {"kernel_size": f"{ksize}x{ksize}"},
                },
                {
                    "stage_number": 4,
                    "title": "Adaptive Threshold Edge Detection",
                    "description": f"Extracted binary edge mask using cv2.adaptiveThreshold with block size {block_size} and C={c_val}.",
                    "status": "Completed",
                    "preview": stage4_b64,
                    "metrics": {"method": "ADAPTIVE_THRESH_MEAN_C", "block_size": block_size, "constant_C": c_val},
                },
            ]
        }

    @staticmethod
    def cartoonify(bgr_image: np.ndarray, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Executes the complete Cartooning algorithm with customizable parameters.
        Returns cartoon image, intermediate representations, timings, and metadata.
        """
        start_time = time.time()
        p = Cartoonizer.validate_and_sanitize_params(params or {})

        h, w = bgr_image.shape[:2]

        # 1. Grayscale & Blur
        gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
        blurred_gray = cv2.medianBlur(gray, p["median_blur_ksize"])

        # 2. Adaptive Thresholding to extract Edge Mask
        edge_mask = cv2.adaptiveThreshold(
            blurred_gray,
            255,
            cv2.ADAPTIVE_THRESH_MEAN_C,
            cv2.THRESH_BINARY,
            p["adaptive_thresh_block_size"],
            p["adaptive_thresh_c"],
        )

        # 3. Bilateral Filter Color Smoothing
        # Bilateral filter smoothes flat regions while sharply preserving edges
        color_smoothed = cv2.bilateralFilter(
            bgr_image,
            d=p["bilateral_d"],
            sigmaColor=p["bilateral_sigma_color"],
            sigmaSpace=p["bilateral_sigma_space"],
        )

        style = p["style"]
        final_cartoon = None

        if style == "classic":
            # Extra smoothing pass for richer paint-like look
            color_smooth2 = cv2.bilateralFilter(
                color_smoothed,
                d=p["bilateral_d"],
                sigmaColor=p["bilateral_sigma_color"],
                sigmaSpace=p["bilateral_sigma_space"],
            )
            # Combine edge mask with smoothed color using bitwise AND
            edge_mask_3ch = cv2.cvtColor(edge_mask, cv2.COLOR_GRAY2BGR)
            final_cartoon = cv2.bitwise_and(color_smooth2, edge_mask_3ch)

        elif style == "comic_bold":
            # Color quantization using K-Means (8 dominant colors)
            data = np.float32(color_smoothed).reshape((-1, 3))
            k = 8
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            _, labels, centers = cv2.kmeans(data, k, None, criteria, 3, cv2.KMEANS_RANDOM_CENTERS)
            quantized = np.uint8(centers)[labels.flatten()].reshape(color_smoothed.shape)

            # Stronger edge mask with morphological dilation
            kernel = np.ones((2, 2), np.uint8)
            eroded_edges = cv2.erode(edge_mask, kernel, iterations=1)
            eroded_edges_3ch = cv2.cvtColor(eroded_edges, cv2.COLOR_GRAY2BGR)
            final_cartoon = cv2.bitwise_and(quantized, eroded_edges_3ch)

        elif style == "pencil_sketch":
            # Realistic graphite sketch using color dodge: divide(gray, 255 - gaussian_blur)
            inverted_gray = 255 - gray
            blurred_inv = cv2.GaussianBlur(inverted_gray, (21, 21), 0)
            sketch = cv2.divide(gray, 255 - blurred_inv, scale=256)
            final_cartoon = cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)

        elif style == "soft_pastel":
            # Soft pastel painting: bilateral with higher space + boost HSV saturation
            hsv = cv2.cvtColor(color_smoothed, cv2.COLOR_BGR2HSV).astype(np.float32)
            hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.3, 0, 255)  # boost saturation
            pastel_color = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
            # Soft edge overlay
            edge_soft = cv2.GaussianBlur(edge_mask, (3, 3), 0)
            edge_soft_3ch = cv2.cvtColor(edge_soft, cv2.COLOR_GRAY2BGR)
            final_cartoon = cv2.bitwise_and(pastel_color, edge_soft_3ch)

        elif style == "watercolor":
            # Multi-pass bilateral filter + slight unsharp mask
            watercolor = color_smoothed.copy()
            for _ in range(2):
                watercolor = cv2.bilateralFilter(watercolor, d=7, sigmaColor=50, sigmaSpace=50)
            # Gentle edge overlay
            edge_mask_3ch = cv2.cvtColor(edge_mask, cv2.COLOR_GRAY2BGR)
            blended = cv2.addWeighted(watercolor, 0.9, edge_mask_3ch, 0.1, 0)
            final_cartoon = cv2.bitwise_and(blended, edge_mask_3ch)

        else:
            edge_mask_3ch = cv2.cvtColor(edge_mask, cv2.COLOR_GRAY2BGR)
            final_cartoon = cv2.bitwise_and(color_smoothed, edge_mask_3ch)

        duration_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "cartoon_image": cv2_to_base64(final_cartoon),
            "original_image": cv2_to_base64(bgr_image),
            "color_smoothed": cv2_to_base64(color_smoothed),
            "edge_mask": cv2_to_base64(edge_mask),
            "grayscale": cv2_to_base64(gray),
            "duration_ms": duration_ms,
            "dimensions": {"width": w, "height": h},
            "parameters": p,
            "cv2_raw_cartoon": final_cartoon,  # Kept in memory or used by caller
        }
