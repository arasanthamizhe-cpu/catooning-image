import React, { useState } from "react";
import {
  Palette,
  Sparkles,
  Layers,
  CheckCircle2,
  Sliders,
  Download,
  ArrowRight,
  Eye,
} from "lucide-react";
import { generateCartoon } from "../services/api";
import { STYLE_PRESETS } from "../components/ParameterControls";

export default function EffectsGalleryPage({
  imageSession,
  cartoonResult,
  onNavigate,
  onApplyStyle,
  isProcessing,
}) {
  const [selectedStyle, setSelectedStyle] = useState(
    cartoonResult?.parameters?.style || "classic"
  );
  const [styleResults, setStyleResults] = useState({});
  const [loadingStyle, setLoadingStyle] = useState(null);

  const handleRunStyle = async (styleId) => {
    if (!imageSession) return;
    setSelectedStyle(styleId);

    const preset = STYLE_PRESETS.find((p) => p.id === styleId);
    if (!preset) return;

    setLoadingStyle(styleId);
    try {
      const res = await generateCartoon(imageSession.image_id, preset.params);
      setStyleResults((prev) => ({ ...prev, [styleId]: res }));
      onApplyStyle(res);
    } catch (err) {
      alert(`Error applying style: ${err.message}`);
    } finally {
      setLoadingStyle(null);
    }
  };

  if (!imageSession) {
    return (
      <div className="page-container empty-state">
        <Palette size={48} className="text-purple empty-icon" />
        <h2>No Image Loaded</h2>
        <p>Please upload an image first to explore the effects gallery.</p>
        <button className="btn-primary" onClick={() => onNavigate("upload")}>
          Go to Upload
        </button>
      </div>
    );
  }

  // Active result displayed
  const currentDisplay = styleResults[selectedStyle] || cartoonResult;

  return (
    <div className="page-container gallery-page">
      <div className="page-header flex-header">
        <div>
          <h1 className="page-title">OpenCV Cartoon Effects Gallery</h1>
          <p className="page-subtitle">
            Explore 5 distinct algorithmic styles powered by computer vision filters and mathematical morphology.
          </p>
        </div>

        {currentDisplay && (
          <button
            className="btn-primary"
            onClick={() => onNavigate("download")}
          >
            <Download size={16} />
            <span>Download This Effect</span>
          </button>
        )}
      </div>

      {/* Style Selector Grid */}
      <div className="gallery-styles-grid">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = selectedStyle === preset.id;
          const isLoading = loadingStyle === preset.id;
          return (
            <div
              key={preset.id}
              className={`style-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleRunStyle(preset.id)}
            >
              <div className="style-card-header">
                <h3 className="style-card-title">{preset.name}</h3>
                {isSelected && <CheckCircle2 size={16} className="text-purple" />}
              </div>
              <p className="style-card-desc">{preset.description}</p>
              <button
                className={`style-action-btn ${isSelected ? "active" : ""}`}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <>
                    <span className="spinner small"></span>
                    <span>Rendering...</span>
                  </>
                ) : isSelected ? (
                  "Currently Active"
                ) : (
                  "Apply Effect"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Showcase of the Selected Effect */}
      {currentDisplay && (
        <div className="gallery-main-showcase">
          <div className="showcase-card">
            <div className="showcase-header">
              <div>
                <span className="badge-pill highlight-purple">Active Style</span>
                <h2 className="showcase-title">
                  {selectedStyle.replace("_", " ").toUpperCase()} Render
                </h2>
              </div>
              <div className="showcase-actions">
                <button
                  className="btn-outline"
                  onClick={() => onNavigate("studio")}
                >
                  <Sliders size={16} />
                  <span>Customize in Studio</span>
                </button>
                <button
                  className="btn-primary"
                  onClick={() => onNavigate("download")}
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="showcase-img-wrap">
              <img
                src={currentDisplay.cartoon_image}
                alt="Selected Cartoon Style"
                className="showcase-img"
              />
            </div>
          </div>
        </div>
      )}

      {/* Breakdown of Intermediate Pipeline Layers */}
      {currentDisplay && (
        <section className="section-block">
          <div className="section-header">
            <h2 className="section-title">Algorithmic Layer Breakdown</h2>
            <p className="section-subtitle">
              Every cartoon consists of multi-layer mathematical transformations.
            </p>
          </div>

          <div className="layers-quad-grid">
            {/* Layer 1: Original */}
            <div className="quad-card">
              <div className="quad-header">
                <span className="quad-number">1</span>
                <h4>Original Photograph</h4>
              </div>
              <div className="quad-img-wrap">
                <img
                  src={currentDisplay.original_image || imageSession.preview}
                  alt="Original"
                />
              </div>
              <p className="quad-desc">Input RGB matrix before color decomposition</p>
            </div>

            {/* Layer 2: Grayscale */}
            <div className="quad-card">
              <div className="quad-header">
                <span className="quad-number">2</span>
                <h4>Grayscale Luminance</h4>
              </div>
              <div className="quad-img-wrap">
                <img src={currentDisplay.grayscale} alt="Grayscale" />
              </div>
              <p className="quad-desc">Single-channel luminance via cv2.COLOR_BGR2GRAY</p>
            </div>

            {/* Layer 3: Edge Mask */}
            <div className="quad-card">
              <div className="quad-header">
                <span className="quad-number">3</span>
                <h4>Adaptive Edge Mask</h4>
              </div>
              <div className="quad-img-wrap">
                <img src={currentDisplay.edge_mask} alt="Edge Mask" />
              </div>
              <p className="quad-desc">Pen-ink outlines via cv2.adaptiveThreshold</p>
            </div>

            {/* Layer 4: Smoothed Color */}
            <div className="quad-card">
              <div className="quad-header">
                <span className="quad-number">4</span>
                <h4>Smoothed Color Palette</h4>
              </div>
              <div className="quad-img-wrap">
                <img src={currentDisplay.color_smoothed} alt="Smoothed Color" />
              </div>
              <p className="quad-desc">Edge-preserving smoothing via cv2.bilateralFilter</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
