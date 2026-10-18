import React from "react";
import {
  SplitSquareVertical,
  RotateCcw,
  Wand2,
  Download,
  Clock,
  Maximize2,
  Sliders,
  CheckCircle,
} from "lucide-react";
import ComparisonSlider from "../components/ComparisonSlider";

export default function ImageComparisonPage({
  imageSession,
  cartoonResult,
  onNavigate,
  onResetParams,
  onGenerateCartoon,
}) {
  if (!cartoonResult || !imageSession) {
    return (
      <div className="page-container empty-state">
        <SplitSquareVertical size={48} className="text-purple empty-icon" />
        <h2>No Cartoon Generated Yet</h2>
        <p>Please generate a cartoon in the Cartoon Studio first.</p>
        <button className="btn-primary" onClick={() => onNavigate("studio")}>
          Go to Cartoon Studio
        </button>
      </div>
    );
  }

  const p = cartoonResult.parameters || {};

  return (
    <div className="page-container comparison-page">
      <div className="page-header flex-header">
        <div>
          <h1 className="page-title">Before & After Comparison</h1>
          <p className="page-subtitle">
            Inspect the transformation from raw photographic pixels to stylized cartoon rendering.
          </p>
        </div>

        <div className="header-action-group">
          <button className="btn-outline" onClick={() => onNavigate("studio")}>
            <Sliders size={16} />
            <span>Process Again / Adjust</span>
          </button>

          <button
            className="btn-primary"
            onClick={() => onNavigate("download")}
          >
            <Download size={16} />
            <span>Download Cartoon</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison View */}
      <div className="comparison-main-card">
        <ComparisonSlider
          originalUrl={cartoonResult.original_image || imageSession.preview}
          cartoonUrl={cartoonResult.cartoon_image}
          originalLabel="Original Photograph"
          cartoonLabel={`Cartoonified (${(p.style || "Classic").toUpperCase()})`}
        />
      </div>

      {/* Analytics & Configuration Summary Bar */}
      <div className="comparison-meta-grid">
        <div className="comp-meta-card">
          <span className="comp-meta-label">Processing Duration</span>
          <div className="comp-meta-value highlight-emerald">
            <Clock size={18} />
            <span>{cartoonResult.duration_ms} ms</span>
          </div>
          <span className="comp-meta-sub">Real-time local OpenCV execution</span>
        </div>

        <div className="comp-meta-card">
          <span className="comp-meta-label">Image Resolution</span>
          <div className="comp-meta-value">
            {cartoonResult.dimensions.width} × {cartoonResult.dimensions.height} px
          </div>
          <span className="comp-meta-sub">Aspect ratio preserved</span>
        </div>

        <div className="comp-meta-card">
          <span className="comp-meta-label">Selected Style</span>
          <div className="comp-meta-value highlight-purple">
            {(p.style || "Classic").replace("_", " ").toUpperCase()}
          </div>
          <span className="comp-meta-sub">Preset OpenCV architecture</span>
        </div>

        <div className="comp-meta-card">
          <span className="comp-meta-label">Bilateral Parameters</span>
          <div className="comp-meta-value small">
            d={p.bilateral_d}, σ_c={p.bilateral_sigma_color}, σ_s={p.bilateral_sigma_space}
          </div>
          <span className="comp-meta-sub">Color smoothing filter</span>
        </div>

        <div className="comp-meta-card">
          <span className="comp-meta-label">Edge Parameters</span>
          <div className="comp-meta-value small">
            Block={p.adaptive_thresh_block_size}, C={p.adaptive_thresh_c}, K={p.median_blur_ksize}
          </div>
          <span className="comp-meta-sub">Adaptive threshold & median blur</span>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="comparison-actions-footer">
        <button className="btn-secondary" onClick={onResetParams}>
          <RotateCcw size={16} />
          <span>Reset Parameters</span>
        </button>

        <button className="btn-outline" onClick={() => onNavigate("studio")}>
          <Wand2 size={16} />
          <span>Tune in Studio</span>
        </button>

        <button
          className="btn-primary btn-large"
          onClick={() => onNavigate("download")}
        >
          <Download size={18} />
          <span>Proceed to Download</span>
        </button>
      </div>
    </div>
  );
}
