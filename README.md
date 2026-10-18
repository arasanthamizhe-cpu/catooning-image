# Cartoonify AI — Image Cartooning Using OpenCV & Python

A full-stack computer vision web application that transforms photographic images into cartoon-style artwork using classical digital image processing techniques from **OpenCV** and **Python**, with an interactive **React + Vite** frontend.

---

## 1. Project Overview & Aim

**Aim:** To develop an image cartooning application using Python and OpenCV that converts ordinary photographs into cartoon-style images through image smoothing, edge detection, thresholding, and bitwise image blending.

The application decomposes the computer vision pipeline into discrete, observable stages, allowing users to understand the mathematical mechanics behind image stylization and interactively fine-tune algorithmic parameters.

---

## 2. Problem Statement

Transforming real-world photographs into cartoon drawings manually requires significant digital illustration skill and time. Modern commercial filter apps typically rely on closed-source, cloud-hosted neural networks that introduce privacy risks and high computational latency. 

**Cartoonify AI** delivers a localized, privacy-preserving, high-speed solution using deterministic image processing algorithms—achieving sub-second rendering without relying on external cloud APIs or GPUs.

---

## 3. Key Objectives & Features

- **Multi-Format Upload:** Supports JPG, JPEG, and PNG images up to 15 MB with aspect-ratio-preserving normalization and automatic alpha-channel flattening.
- **Stage-by-Stage Preprocessing Breakdown:**
  1. *Stage 1:* Dimension validation and color-space normalization.
  2. *Stage 2:* Color matrix conversion from BGR to single-channel Grayscale (`cv2.cvtColor`).
  3. *Stage 3:* Noise attenuation using median filtering (`cv2.medianBlur`).
  4. *Stage 4:* Outline extraction via adaptive thresholding (`cv2.adaptiveThreshold`).
- **Interactive Cartoon Studio:**
  - Bilateral filter diameter ($d$), color sigma ($\sigma_{\text{color}}$), and spatial sigma ($\sigma_{\text{space}}$) controls.
  - Median blur aperture ($k$) and adaptive threshold block size / constant ($C$) controls.
  - Live parameter sanitization preventing OpenCV assertion crashes.
- **5 Algorithmic Style Presets:**
  - **Classic Cartoon:** Iterative bilateral smoothing + adaptive threshold pen outlines.
  - **Comic Book / Pop Art:** $K$-Means color quantization ($k=8$) + bold eroded ink edges.
  - **Pencil Sketch:** Inverted Gaussian blur + color dodge division.
  - **Soft Pastel:** Color diffusion + HSV saturation boosting + softened edges.
  - **Watercolor:** Multi-pass bilateral wash + subtle outline overlay.
- **Dual-Mode Image Comparison:**
  - Interactive split slider with draggable boundary.
  - Parallel side-by-side comparison view.
  - Telemetry metrics: latency (ms), resolution, and applied parameters.
- **Lossless & Optimized Export:** Download processed artwork in high-fidelity PNG or customizable JPEG format.
- **Built-in Curated Test Samples:** Instant one-click testing with portrait, landscape, and object samples.
- **Academic Documentation:** Complete theoretical reference with mathematical formulations, hardware/software specifications, and OpenCV function catalog.

---

## 4. Technology Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6 / 8
- **Language:** Modern JavaScript (ES Modules)
- **Styling:** Custom CSS Design System with Light/Dark theme support
- **Icons:** Lucide Icons (`lucide-react`)

### Backend
- **Language:** Python 3.10+ (tested on Python 3.12)
- **Framework:** FastAPI
- **Server:** Uvicorn (ASGI)
- **Computer Vision:** OpenCV (`opencv-python` 5.0.0 / 4.9+)
- **Numerical Computing:** NumPy
- **Image Decoding & Verification:** Pillow (PIL)

---

## 5. Image Processing Pipeline & Mathematical Formulation

```
Raw Photograph (RGB/RGBA)
           │
           ▼
[ Alpha Channel Flattening & Resizing ]
           │
   ┌───────┴────────────────────────┐
   ▼                                ▼
[ BGR to Grayscale ]      [ Bilateral Filtering ]
   │                        (Preserves edges while
   ▼                         smoothing flat color)
[ Median Blur (Noise) ]             │
   │                                │
   ▼                                │
[ Adaptive Threshold ]              │
   (Creates Edge Mask)              │
   │                                │
   └───────┬────────────────────────┘
           ▼
[ Bitwise AND Combination ]
           │
           ▼
  Final Cartoon Output
```

### Mathematical Definitions:

1. **Grayscale Luminance:**
   $$Y = 0.299 \cdot R + 0.587 \cdot G + 0.114 \cdot B$$

2. **Median Filtering:**
   $$I_{\text{blurred}}(x, y) = \text{median} \{ I(x+i, y+j) \mid i,j \in [-k/2, k/2] \}$$

3. **Adaptive Thresholding (Mean-C):**
   $$T(x,y) = \mu_{\text{local}}(x, y) - C$$
   $$\text{EdgeMask}(x,y) = \begin{cases} 255 & \text{if } I(x,y) > T(x,y) \\ 0 & \text{otherwise} \end{cases}$$

4. **Bilateral Filtering:**
   $$I_{\text{bilateral}}(p) = \frac{1}{W_p} \sum_{q \in \Omega} I(q) \cdot \exp\left(-\frac{\|p-q\|^2}{2\sigma_s^2}\right) \cdot \exp\left(-\frac{\|I(p)-I(q)\|^2}{2\sigma_c^2}\right)$$

5. **Bitwise Combination:**
   $$I_{\text{cartoon}} = I_{\text{bilateral}} \ \& \ I_{\text{edge\_mask\_3ch}}$$

---

## 6. Project Directory Structure

```
cartoonify-ai/
├── backend/
│   ├── app.py                 # FastAPI application routes & state cache
│   ├── cartoonizer.py         # OpenCV image processing engine & 5 styles
│   ├── image_utils.py         # Image decoding, validation, base64 encoding
│   ├── requirements.txt       # Python dependencies
│   └── test_backend.py        # Automated test suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Top navigation & theme toggle
│   │   │   ├── ComparisonSlider.jsx   # Interactive split before-and-after slider
│   │   │   └── ParameterControls.jsx  # OpenCV sliders & preset selectors
│   │   ├── pages/
│   │   │   ├── HomeDashboard.jsx      # Page 1: Landing dashboard & dropzone
│   │   │   ├── ImageUploadPage.jsx    # Page 2: Upload, metadata & validation
│   │   │   ├── PreprocessingPage.jsx  # Page 3: 4-stage pipeline inspection
│   │   │   ├── CartoonStudioPage.jsx  # Page 4: Parameter tuning & live canvas
│   │   │   ├── ImageComparisonPage.jsx# Page 5: Split slider comparison
│   │   │   ├── EffectsGalleryPage.jsx # Page 6: 5 artistic OpenCV styles
│   │   │   ├── DownloadResultsPage.jsx# Page 7: Lossless export & summary
│   │   │   └── AboutProjectPage.jsx   # Page 8: Academic project report
│   │   ├── services/
│   │   │   └── api.js                 # Frontend API client
│   │   ├── App.jsx                    # Root component & page routing
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Modern responsive design system
│   ├── package.json
│   └── vite.config.js
├── sample_images/                     # Curated sample images for testing
│   ├── sample_portrait.jpg
│   ├── sample_landscape.jpg
│   ├── sample_car.jpg
│   └── generate_samples.py
└── README.md                          # Comprehensive documentation
```

---

## 7. How to Run the Application Locally

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm

---

### Step 1: Start the Backend Server

Open a terminal in the project directory:

```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```

The backend server will start at:
- **API Base URL:** `http://127.0.0.1:8000`
- **Interactive Swagger Documentation:** `http://127.0.0.1:8000/docs`

---

### Step 2: Start the Frontend Application

Open a second terminal in the project directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start at:
- **Web App URL:** `http://localhost:5173`

Open `http://localhost:5173` in any modern web browser.

---

### Step 3: Run the Automated Backend Tests

To verify that all OpenCV algorithms, endpoints, and error handling pass:

```bash
cd backend
python test_backend.py
```

---

## 8. Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and OpenCV/Pillow versions |
| `POST` | `/api/image/upload` | Multipart file upload, validation, and session creation |
| `POST` | `/api/image/preprocess` | Returns the 4 preprocessing stage images and metrics |
| `POST` | `/api/image/cartoonify` | Executes OpenCV cartooning with custom parameters |
| `GET` | `/api/image/download/{id}` | Binary image file download (PNG / JPEG) |
| `POST` | `/api/image/download` | POST download endpoint matching specification |
| `GET` | `/api/sample-images` | Returns pre-bundled sample images with thumbnails |
| `POST` | `/api/sample-images/load/{id}` | Loads a sample image directly into active session |

---

## 9. Academic Project Deliverables

This project fulfills all criteria for academic and engineering evaluation:
- Fully working full-stack implementation (no mockups or static placeholders).
- Real OpenCV mathematical operations executing locally on CPU.
- Visual demonstration of each intermediate step in the digital image processing workflow.
- Clean separation of concerns between computer vision processing, REST API layer, and client UI.

---

## 10. Deployment Guide (Vercel + Render)

Because the project consists of a **React frontend** and a **Python OpenCV backend**, they should be hosted according to their architectures:

### 1. Deploy the Backend (Render.com — Free)
1. Go to [render.com](https://render.com) and create a free account.
2. Click **New +** > **Web Service** and connect your GitHub repository (`catooning-image`).
3. Set the following configuration:
   - **Name:** `cartoonify-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Click **Deploy Web Service**.
5. Once deployed, copy your backend URL (e.g. `https://cartoonify-backend.onrender.com`).

### 2. Connect the Frontend (Vercel)
1. In your [Vercel Dashboard](https://vercel.com), navigate to your deployed project.
2. Go to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-name.onrender.com/api` (replace with your actual Render URL)
4. Go to the **Deployments** tab, click the three dots `...` on your latest deployment, and click **Redeploy**.
5. Your Vercel frontend is now connected to your live cloud OpenCV backend!

