import React, { useState } from "react";
import {
  Download,
  CheckCircle2,
  FileImage,
  Sliders,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { getDownloadUrl } from "../services/api";

export default function DownloadResultsPage({
  imageSession,
  cartoonResult,
  onNavigate,
  onProcessAnother,
}) {
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(95);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!cartoonResult || !imageSession) {
    return (
      <div className="page-container empty-state">
        <Download size={48} className="text-purple empty-icon" />
        <h2>No Cartoon to Download</h2>
        <p>Please generate a cartoon first before accessing the download page.</p>
        <button className="btn-primary" onClick={() => onNavigate("studio")}>
          Go to Cartoon Studio
        </button>
      </div>
    );
  }

  const p = cartoonResult.parameters || {};

  const handleDownload = () => {
    const url = getDownloadUrl(imageSession.image_id, format, quality);
    const link = document.createElement("a");
    link.href = url;
    const baseName = imageSession.filename.replace(/\.[^/.]+$/, "");
    link.download = `cartoonify_${baseName}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="page-container download-page">
      <div className="page-header">
        <h1 className="page-title">Download & Export Cartoon Image</h1>
        <p className="page-subtitle">
          Export your processed OpenCV cartoon in lossless PNG or optimized JPEG format.
        </p>
      </div>

      <div className="download-layout">
        {/* Left Column: Final Image Showcase */}
        <div className="download-preview-card">
          <div className="download-card-badge">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>Processing Status: Completed Successfully</span>
          </div>

          <div className="download-img-container">
            <img
              src={cartoonResult.cartoon_image}
              alt="Final Cartoon Output"
              className="download-preview-img"
            />
          </div>

          <div className="download-img-caption">
            <span>Output Resolution: {cartoonResult.dimensions.width} × {cartoonResult.dimensions.height} px</span>
            <span>Render Time: {cartoonResult.duration_ms} ms</span>
          </div>
        </div>

        {/* Right Column: Download Configuration & Metadata */}
        <div className="download-controls-panel">
          <h3 className="panel-title">Export Options</h3>

          {/* Format Selection */}
          <div className="control-group">
            <label className="group-label">Choose File Format</label>
            <div className="format-picker">
              <button
                type="button"
                className={`format-option ${format === "png" ? "selected" : ""}`}
                onClick={() => setFormat("png")}
              >
                <div className="format-ext">PNG</div>
                <div className="format-desc">Lossless Quality (Recommended)</div>
              </button>

              <button
                type="button"
                className={`format-option ${format === "jpg" ? "selected" : ""}`}
                onClick={() => setFormat("jpg")}
              >
                <div className="format-ext">JPEG</div>
                <div className="format-desc">Compact File Size</div>
              </button>
            </div>
          </div>

          {/* JPEG Quality Slider (if JPEG selected) */}
          {format === "jpg" && (
            <div className="control-group">
              <div className="slider-label-row">
                <span className="slider-title">JPEG Quality</span>
                <span className="slider-value-badge">{quality}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="slider-input"
              />
            </div>
          )}

          {/* Processing Settings Summary Table */}
          <div className="settings-summary-box">
            <h4 className="summary-title">Applied OpenCV Settings</h4>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Preset Style:</span>
                <strong>{(p.style || "Classic").toUpperCase()}</strong>
              </div>
              <div className="summary-row">
                <span>Bilateral Filter:</span>
                <span>d={p.bilateral_d}, σ_color={p.bilateral_sigma_color}, σ_space={p.bilateral_sigma_space}</span>
              </div>
              <div className="summary-row">
                <span>Median Blur Kernel:</span>
                <span>{p.median_blur_ksize} × {p.median_blur_ksize}</span>
              </div>
              <div className="summary-row">
                <span>Adaptive Edge Mask:</span>
                <span>Block={p.adaptive_thresh_block_size}, C={p.adaptive_thresh_c}</span>
              </div>
              <div className="summary-row">
                <span>Original File:</span>
                <span>{imageSession.filename}</span>
              </div>
            </div>
          </div>

          {/* Download Action Buttons */}
          <div className="download-buttons-group">
            <button
              className="btn-primary btn-large w-full download-cta"
              onClick={handleDownload}
            >
              <Download size={20} />
              <span>Download Cartoon Image ({format.toUpperCase()})</span>
            </button>

            {downloadSuccess && (
              <div className="success-toast-inline">
                <CheckCircle2 size={16} />
                <span>Download started! Check your browser downloads folder.</span>
              </div>
            )}

            <div className="secondary-actions-row">
              <button
                className="btn-outline flex-1"
                onClick={() => onNavigate("comparison")}
              >
                <span>View Comparison</span>
              </button>
              <button
                className="btn-secondary flex-1"
                onClick={onProcessAnother}
              >
                <RotateCcw size={15} />
                <span>Process Another Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
