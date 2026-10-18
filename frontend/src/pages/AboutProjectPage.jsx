import React from "react";
import {
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
  Cpu,
  Layers,
  Wand2,
  Table,
  Sparkles,
  ArrowRight,
  Code,
  ShieldAlert,
} from "lucide-react";

export default function AboutProjectPage({ onNavigate }) {
  return (
    <div className="page-container about-page">
      <div className="page-header">
        <div className="hero-badge">
          <BookOpen size={14} className="badge-sparkle" />
          <span>Academic Project Report & Theoretical Foundation</span>
        </div>
        <h1 className="page-title">
          Cartoonify AI — Image Cartooning Using OpenCV & Python
        </h1>
        <p className="page-subtitle">
          An engineering-grade computer vision system for automated non-photorealistic rendering
          and edge-preserving color quantization.
        </p>
      </div>

      <div className="about-sections-wrapper">
        {/* 1. Aim */}
        <section className="doc-card">
          <div className="doc-card-header">
            <Target className="text-purple" size={22} />
            <h2>1. Project Aim</h2>
          </div>
          <p className="doc-text">
            To develop an interactive, full-stack computer vision application using Python and OpenCV that
            transforms ordinary digital photographs into artistic cartoon-style images through classical
            image processing techniques—specifically bilateral color smoothing, median noise attenuation,
            adaptive threshold edge detection, and bitwise matrix blending.
          </p>
        </section>

        {/* 2. Problem Statement */}
        <section className="doc-card">
          <div className="doc-card-header">
            <AlertCircle className="text-amber" size={22} />
            <h2>2. Problem Statement</h2>
          </div>
          <p className="doc-text">
            Manually illustrating cartoon effects or converting photographs into comic artwork requires
            advanced graphic design expertise, digital drawing tablets, and extensive manual effort per image.
            Existing consumer mobile applications often rely on heavy proprietary cloud neural networks that
            compromise user data privacy and require persistent high-bandwidth internet connectivity.
            This project solves the problem by providing an automated, privacy-preserving, fast local system
            built upon mathematical computer vision algorithms that produce consistent, controllable cartoon
            stylization without deep-learning latency or external cloud dependency.
          </p>
        </section>

        {/* 3. Objectives */}
        <section className="doc-card">
          <div className="doc-card-header">
            <CheckCircle className="text-emerald" size={22} />
            <h2>3. Project Objectives</h2>
          </div>
          <ul className="doc-list">
            <li>
              <strong>Cross-Format Image Ingestion:</strong> Provide robust upload and validation for standard formats (JPG, JPEG, PNG, WEBP) handling arbitrary resolutions and alpha channels.
            </li>
            <li>
              <strong>Luminance Extraction:</strong> Transform 3-channel BGR color matrices into single-channel grayscale space using calibrated luminance weights.
            </li>
            <li>
              <strong>Salt-and-Pepper Noise Reduction:</strong> Implement non-linear median filtering to suppress high-frequency noise spikes while keeping boundary gradients intact.
            </li>
            <li>
              <strong>Dynamic Edge Extraction:</strong> Apply adaptive thresholding to produce sharp, pen-and-ink cartoon outlines invariant to regional lighting gradients.
            </li>
            <li>
              <strong>Edge-Preserving Color Smoothing:</strong> Utilize iterative bilateral filtering to smooth color textures within homogeneous regions while strictly retaining boundary sharpness.
            </li>
            <li>
              <strong>Bitwise Matrix Fusion:</strong> Synthesize the final cartoon composition by applying bitwise AND logic between the smoothed color array and the edge mask.
            </li>
            <li>
              <strong>Interactive Visual Inspection:</strong> Expose every intermediate matrix transformation stage in an educational React interface with side-by-side and split before-and-after sliders.
            </li>
            <li>
              <strong>Real-Time Parameter Customization:</strong> Empower users to adjust mathematical filter radii, sigmas, and thresholds with immediate visual feedback.
            </li>
          </ul>
        </section>

        {/* 4. Software & Hardware Requirements */}
        <section className="doc-card">
          <div className="doc-card-header">
            <Cpu className="text-blue" size={22} />
            <h2>4. System Specifications & Requirements</h2>
          </div>
          <div className="specs-grid">
            <div className="specs-box">
              <h3 className="specs-subheading">Software Requirements</h3>
              <ul className="specs-list">
                <li><strong>Operating System:</strong> Windows 10/11, Linux, or macOS</li>
                <li><strong>Backend Framework:</strong> Python 3.10+ / FastAPI</li>
                <li><strong>Computer Vision Library:</strong> OpenCV (opencv-python 4.9+)</li>
                <li><strong>Numerical Computing:</strong> NumPy 1.26+</li>
                <li><strong>Image Manipulation:</strong> Pillow (PIL) 10.2+</li>
                <li><strong>Frontend Framework:</strong> React 19 + Vite 6+</li>
                <li><strong>Iconography & UI:</strong> Lucide Icons + Pure Modular CSS</li>
              </ul>
            </div>

            <div className="specs-box">
              <h3 className="specs-subheading">Hardware Requirements</h3>
              <ul className="specs-list">
                <li><strong>Processor:</strong> Dual-Core 2.0 GHz or higher (x86_64 / ARM64)</li>
                <li><strong>RAM:</strong> 4 GB minimum (8 GB recommended for 4K images)</li>
                <li><strong>Storage:</strong> 250 MB available disk space</li>
                <li><strong>Display:</strong> 1280 × 720 minimum screen resolution</li>
                <li><strong>GPU:</strong> Optional (CPU multithreaded OpenCV acceleration enabled)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Algorithm & Mathematical Workflow */}
        <section className="doc-card">
          <div className="doc-card-header">
            <Layers className="text-purple" size={22} />
            <h2>5. Image Processing Algorithm & Mathematical Formulation</h2>
          </div>

          <div className="algorithm-steps-box">
            <div className="algo-step">
              <span className="step-num">Step 1</span>
              <div>
                <h4>Image Ingestion & Alpha Handling</h4>
                <p>
                  Decode raw bytes into a NumPy array. If an alpha channel exists (RGBA), composite it over a white background prior to BGR conversion.
                </p>
              </div>
            </div>

            <div className="algo-step">
              <span className="step-num">Step 2</span>
              <div>
                <h4>Grayscale Luminance Conversion</h4>
                <p>
                  Converts 3-channel BGR image into single-channel luminance using standard Rec. 601 weighting:
                  <code className="math-code">Y = 0.299 × R + 0.587 × G + 0.114 × B</code>
                </p>
              </div>
            </div>

            <div className="algo-step">
              <span className="step-num">Step 3</span>
              <div>
                <h4>Noise Filtering via Median Blur</h4>
                <p>
                  Replaces each pixel with the statistical median of neighboring pixels within an odd window <em>k × k</em>:
                  <code className="math-code">{"I_blurred(x, y) = median { I(x + i, y + j) | i, j ∈ [-k/2, k/2] }"}</code>
                </p>
              </div>
            </div>

            <div className="algo-step">
              <span className="step-num">Step 4</span>
              <div>
                <h4>Adaptive Thresholding for Edge Mask Extraction</h4>
                <p>
                  Calculates local threshold <em>T(x,y)</em> over an <em>N × N</em> neighborhood subtracted by constant <em>C</em>:
                  <code className="math-code">{"T(x, y) = Local_Mean(x, y) - C"}</code>
                  Produces a binary edge mask where outlines are mapped to black (0) and flat surfaces to white (255).
                </p>
              </div>
            </div>

            <div className="algo-step">
              <span className="step-num">Step 5</span>
              <div>
                <h4>Edge-Preserving Color Smoothing (Bilateral Filter)</h4>
                <p>
                  A non-linear filter where spatial closeness is weighted alongside color intensity similarity:
                  <code className="math-code">{"I_bilateral(p) = (1 / W_p) × Σ [ I(q) × G_σs(||p - q||) × G_σc(||I(p) - I(q)||) ]"}</code>
                </p>
              </div>
            </div>

            <div className="algo-step">
              <span className="step-num">Step 6</span>
              <div>
                <h4>Bitwise Array Combination</h4>
                <p>
                  The binary edge mask is duplicated across 3 color channels, and combined with the smoothed color image:
                  <code className="math-code">{"I_cartoon = I_bilateral BITWISE_AND I_edge_mask"}</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. OpenCV Functions Reference Table */}
        <section className="doc-card">
          <div className="doc-card-header">
            <Table className="text-emerald" size={22} />
            <h2>6. Key OpenCV Functions & Roles</h2>
          </div>
          <div className="table-responsive">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>OpenCV Function</th>
                  <th>Mathematical Role</th>
                  <th>Key Parameters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>cv2.cvtColor()</code></td>
                  <td>Color space transformation</td>
                  <td><code>COLOR_BGR2GRAY</code>, <code>COLOR_RGB2BGR</code></td>
                </tr>
                <tr>
                  <td><code>cv2.medianBlur()</code></td>
                  <td>Non-linear noise suppression preserving edges</td>
                  <td><code>ksize</code> (must be odd integer &gt; 1)</td>
                </tr>
                <tr>
                  <td><code>cv2.adaptiveThreshold()</code></td>
                  <td>Local illumination-invariant edge outline extraction</td>
                  <td><code>ADAPTIVE_THRESH_MEAN_C</code>, <code>blockSize</code>, <code>C</code></td>
                </tr>
                <tr>
                  <td><code>cv2.bilateralFilter()</code></td>
                  <td>Range & domain filtered color smoothing</td>
                  <td><code>d</code>, <code>sigmaColor</code>, <code>sigmaSpace</code></td>
                </tr>
                <tr>
                  <td><code>cv2.bitwise_and()</code></td>
                  <td>Matrix pixel-wise conjunction for layer blending</td>
                  <td><code>src1</code>, <code>src2</code></td>
                </tr>
                <tr>
                  <td><code>cv2.imencode()</code></td>
                  <td>In-memory binary image compression for web streaming</td>
                  <td><code>.png</code>, <code>.jpg</code>, <code>IMWRITE_JPEG_QUALITY</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. Applications & Limitations */}
        <section className="doc-card">
          <div className="doc-card-header">
            <ShieldAlert className="text-amber" size={22} />
            <h2>7. Practical Applications & Limitations</h2>
          </div>
          <div className="specs-grid">
            <div className="specs-box">
              <h3 className="specs-subheading">Practical Applications</h3>
              <ul className="doc-list">
                <li><strong>Graphic Novels & Storyboarding:</strong> Rapidly turn on-location reference photos into stylized story panels.</li>
                <li><strong>Privacy & Anonymization:</strong> Obfuscate subtle facial micro-features in public photos while preserving recognizability and expression.</li>
                <li><strong>Digital Gaming & Avatars:</strong> Automate personalized profile picture and stylized avatar creation.</li>
                <li><strong>Educational Computer Vision:</strong> Visualizing spatial and range filtering concepts for engineering coursework.</li>
              </ul>
            </div>

            <div className="specs-box">
              <h3 className="specs-subheading">Engineering Limitations</h3>
              <ul className="specs-list">
                <li><strong>High Computational Intensity of Bilateral Filtering:</strong> Large diameter filters on 4K resolutions can increase latency without GPU acceleration.</li>
                <li><strong>Low-Contrast Edge Sensitivity:</strong> Extremely dark regions or low lighting may produce sparse edge outlines if adaptive threshold C is not tuned.</li>
                <li><strong>Absence of Semantic Segmentation:</strong> Classical filters operate uniformly without understanding high-level concepts like hair vs background.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pipeline-cta-bar">
          <div className="cta-bar-text">
            <strong>Ready to Experiment?</strong>
            <span>Test the mathematical algorithms on live photos in the Cartoon Studio.</span>
          </div>
          <button className="btn-primary" onClick={() => onNavigate("studio")}>
            <Wand2 size={18} />
            <span>Launch Cartoon Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
