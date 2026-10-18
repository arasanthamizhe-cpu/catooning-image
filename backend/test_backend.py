import os
import io
from fastapi.testclient import TestClient
from app import app, IMAGE_STORE

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "opencv_version" in data
    print("Health check passed:", data["opencv_version"])

def test_sample_images_and_load():
    res = client.get("/api/sample-images")
    assert res.status_code == 200
    samples = res.json()["samples"]
    assert len(samples) >= 3
    print(f"Sample images loaded: {len(samples)}")

    # Load first sample
    sample_id = samples[0]["id"]
    load_res = client.post(f"/api/sample-images/load/{sample_id}")
    assert load_res.status_code == 200
    data = load_res.json()
    assert "image_id" in data
    assert "preview" in data
    assert data["preview"].startswith("data:image/png;base64,")
    print("Sample loaded into session:", data["image_id"])
    return data["image_id"]

def test_preprocess(image_id):
    res = client.post("/api/image/preprocess", json={"image_id": image_id})
    assert res.status_code == 200
    data = res.json()
    assert len(data["stages"]) == 4
    for stage in data["stages"]:
        assert "stage_number" in stage
        assert "title" in stage
        assert "preview" in stage
        assert stage["preview"].startswith("data:image/")
    print("Preprocessing stages verified (4 stages returned)")

def test_cartoonify_all_styles(image_id):
    styles = ["classic", "comic_bold", "pencil_sketch", "soft_pastel", "watercolor"]
    for style in styles:
        payload = {
            "image_id": image_id,
            "bilateral_d": 9,
            "bilateral_sigma_color": 75,
            "bilateral_sigma_space": 75,
            "median_blur_ksize": 7,
            "adaptive_thresh_block_size": 9,
            "adaptive_thresh_c": 9,
            "style": style
        }
        res = client.post("/api/image/cartoonify", json=payload)
        assert res.status_code == 200, f"Failed style {style}: {res.text}"
        data = res.json()
        assert "cartoon_image" in data
        assert data["cartoon_image"].startswith("data:image/png;base64,")
        assert "duration_ms" in data
        assert data["parameters"]["style"] == style
        print(f"Style '{style}' tested successfully (rendered in {data['duration_ms']}ms)")

def test_download(image_id):
    # Test PNG download
    res_png = client.get(f"/api/image/download/{image_id}?format=png")
    assert res_png.status_code == 200
    assert res_png.headers["content-type"] == "image/png"
    assert len(res_png.content) > 1000

    # Test JPG download
    res_jpg = client.get(f"/api/image/download/{image_id}?format=jpg")
    assert res_jpg.status_code == 200
    assert res_jpg.headers["content-type"] == "image/jpeg"
    assert len(res_jpg.content) > 1000
    print("Download endpoints verified for both PNG and JPEG formats")

def test_upload_real_and_invalid():
    # 1. Upload a real generated JPG
    with open("sample_images/sample_landscape.jpg", "rb") as f:
        file_bytes = f.read()

    res = client.post(
        "/api/image/upload",
        files={"file": ("test_upload.jpg", file_bytes, "image/jpeg")},
    )
    assert res.status_code == 200
    uploaded_id = res.json()["image_id"]
    print("File upload test passed with ID:", uploaded_id)

    # 2. Upload invalid text file pretending to be image
    res_invalid = client.post(
        "/api/image/upload",
        files={"file": ("fake.jpg", b"This is not a real image at all", "image/jpeg")},
    )
    assert res_invalid.status_code == 400
    print("Invalid file correctly rejected with 400:", res_invalid.json()["detail"])

if __name__ == "__main__":
    print("--- Running Cartoonify Backend Tests ---")
    test_health()
    img_id = test_sample_images_and_load()
    test_preprocess(img_id)
    test_cartoonify_all_styles(img_id)
    test_download(img_id)
    test_upload_real_and_invalid()
    print("--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---")
