import React from "react";
import { Sliders, RotateCcw, Wand2, Info, CheckCircle2 } from "lucide-react";

export const DEFAULT_PARAMS = {
  bilateral_d: 9,
  bilateral_sigma_color: 75,
  bilateral_sigma_space: 75,
  median_blur_ksize: 7,
  adaptive_thresh_block_size: 9,
  adaptive_thresh_c: 9,
  style: "classic",
};

export const STYLE_PRESETS = [
  {
    id: "classic",
    name: "Classic Cartoon",
    description: "Traditional cartoon with smooth painted colors & clear inked outlines",
    params: {
      bilateral_d: 9,
      bilateral_sigma_color: 75,
      bilateral_sigma_space: 75,
      median_blur_ksize: 7,
      adaptive_thresh_block_size: 9,
      adaptive_thresh_c: 9,
      style: "classic",
    },
  },
  {
    id: "comic_bold",
    name: "Comic Book / Pop Art",
    description: "K-Means quantized color palette with bold ink outlines",
    params: {
      bilateral_d: 11,
      bilateral_sigma_color: 120,
      bilateral_sigma_space: 100,
      median_blur_ksize: 7,
      adaptive_thresh_block_size: 7,
      adaptive_thresh_c: 7,
      style: "comic_bold",
    },
  },
  {
    id: "pencil_sketch",
    name: "Pencil Sketch",
    description: "Fine graphite grayscale sketch using Gaussian color dodge division",
    params: {
      bilateral_d: 9,
      bilateral_sigma_color: 75,
      bilateral_sigma_space: 75,
      median_blur_ksize: 5,
      adaptive_thresh_block_size: 9,
      adaptive_thresh_c: 9,
      style: "pencil_sketch",
    },
  },
  {
    id: "soft_pastel",
    name: "Soft Pastel",
    description: "High color diffusion with saturated tones and gentle edge shading",
    params: {
      bilateral_d: 13,
      bilateral_sigma_color: 150,
      bilateral_sigma_space: 120,
      median_blur_ksize: 9,
      adaptive_thresh_block_size: 11,
      adaptive_thresh_c: 12,
      style: "soft_pastel",
    },
  },
  {
    id: "watercolor",
    name: "Watercolor Flow",
    description: "Iterative bilateral wash with soft translucent edge blending",
    params: {
      bilateral_d: 9,
      bilateral_sigma_color: 90,
      bilateral_sigma_space: 90,
      median_blur_ksize: 7,
      adaptive_thresh_block_size: 9,
      adaptive_thresh_c: 11,
      style: "watercolor",
    },
  },
];

export default function ParameterControls({
  params,
  setParams,
  onGenerate,
  onReset,
  isProcessing,
  lastDuration,
}) {
  const handleChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyPreset = (preset) => {
    setParams({ ...preset.params });
  };

  return (
    <div className="params-panel">
      {/* Header */}
      <div className="params-header">
        <div className="params-title-wrap">
          <Sliders className="text-purple" size={20} />
          <h3 className="params-title">OpenCV Cartoon Controls</h3>
        </div>
        <button
          className="btn-text reset-btn"
          onClick={onReset}
          title="Reset to default values"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Style Selectors */}
      <div className="presets-section">
        <label className="section-label">Select Style Preset</label>
        <div className="preset-chips">
          {STYLE_PRESETS.map((p) => {
            const isSelected = params.style === p.id;
            return (
              <button
                key={p.id}
                className={`preset-chip ${isSelected ? "selected" : ""}`}
                onClick={() => handleApplyPreset(p)}
                type="button"
              >
                <span>{p.name}</span>
                {isSelected && <CheckCircle2 size={13} className="chip-check" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="sliders-list">
        {/* Bilateral Diameter */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span className="slider-title">
              Bilateral Diameter (d)
              <span className="info-tooltip" title="Pixel neighborhood diameter for bilateral filter. Larger values give stronger painterly smoothing.">
                <Info size={13} />
              </span>
            </span>
            <span className="slider-value-badge">{params.bilateral_d}</span>
          </div>
          <input
            type="range"
            min="3"
            max="25"
            step="1"
            value={params.bilateral_d}
            onChange={(e) => handleChange("bilateral_d", parseInt(e.target.value, 10))}
            className="slider-input"
          />
          <div className="slider-bounds">
            <span>3 (Sharp)</span>
            <span>25 (Very Smooth)</span>
          </div>
        </div>

        {/* Bilateral Sigma Color */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span className="slider-title">
              Color Sigma (σ_color)
              <span className="info-tooltip" title="Filter sigma in color space. Larger values blend farther color shades together, creating cartoon posterization.">
                <Info size={13} />
              </span>
            </span>
            <span className="slider-value-badge">{params.bilateral_sigma_color}</span>
          </div>
          <input
            type="range"
            min="15"
            max="250"
            step="5"
            value={params.bilateral_sigma_color}
            onChange={(e) => handleChange("bilateral_sigma_color", parseFloat(e.target.value))}
            className="slider-input"
          />
          <div className="slider-bounds">
            <span>15 (Subtle)</span>
            <span>250 (Strong Poster)</span>
          </div>
        </div>

        {/* Bilateral Sigma Space */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span className="slider-title">
              Space Sigma (σ_space)
              <span className="info-tooltip" title="Filter sigma in coordinate space. Larger values spread smoothing across larger physical pixel distances.">
                <Info size={13} />
              </span>
            </span>
            <span className="slider-value-badge">{params.bilateral_sigma_space}</span>
          </div>
          <input
            type="range"
            min="15"
            max="250"
            step="5"
            value={params.bilateral_sigma_space}
            onChange={(e) => handleChange("bilateral_sigma_space", parseFloat(e.target.value))}
            className="slider-input"
          />
          <div className="slider-bounds">
            <span>15 (Tight)</span>
            <span>250 (Broad)</span>
          </div>
        </div>

        {/* Median Blur Kernel */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span className="slider-title">
              Median Blur Kernel (Noise)
              <span className="info-tooltip" title="Kernel aperture for cv2.medianBlur. Must be odd (e.g. 3, 5, 7, 9). Removes salt-and-pepper noise before edge detection.">
                <Info size={13} />
              </span>
            </span>
            <span className="slider-value-badge">{params.median_blur_ksize} px</span>
          </div>
          <input
            type="range"
            min="3"
            max="21"
            step="2"
            value={params.median_blur_ksize}
            onChange={(e) => handleChange("median_blur_ksize", parseInt(e.target.value, 10))}
            className="slider-input"
          />
          <div className="slider-bounds">
            <span>3x3 (Fine)</span>
            <span>21x21 (Heavy Blur)</span>
          </div>
        </div>

        {/* Adaptive Threshold Block Size */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span className="slider-title">
              Adaptive Block Size
              <span className="info-tooltip" title="Size of a pixel neighborhood used to calculate threshold for cv2.adaptiveThreshold. Must be odd (3, 5, 7, 9...).">
                <Info size={13} />
              </span>
            </span>
            <span className="slider-value-badge">{params.adaptive_thresh_block_size} px</span>
          </div>
          <input
            type="range"
            min="3"
            max="25"
            step="2"
            value={params.adaptive_thresh_block_size}
            onChange={(e) =>
              handleChange("adaptive_thresh_block_size", parseInt(e.target.value, 10))
            }
            className="slider-input"
          />
          <div className="slider-bounds">
            <span>3 (Micro Edges)</span>
            <span>25 (Macro Contours)</span>
          </div>
        </div>

        {/* Adaptive Threshold Constant C */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span className="slider-title">
              Threshold Constant (C)
              <span className="info-tooltip" title="Constant subtracted from the mean in cv2.adaptiveThreshold. Higher C yields thinner, crisper cartoon outlines.">
                <Info size={13} />
              </span>
            </span>
            <span className="slider-value-badge">{params.adaptive_thresh_c}</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            value={params.adaptive_thresh_c}
            onChange={(e) => handleChange("adaptive_thresh_c", parseFloat(e.target.value))}
            className="slider-input"
          />
          <div className="slider-bounds">
            <span>1 (Heavy Ink)</span>
            <span>25 (Minimal Lines)</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="params-footer">
        <button
          className="btn-primary generate-btn"
          onClick={onGenerate}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              <span>Applying OpenCV Pipeline...</span>
            </>
          ) : (
            <>
              <Wand2 size={18} />
              <span>Generate Cartoon Effect</span>
            </>
          )}
        </button>

        {lastDuration !== null && !isProcessing && (
          <div className="timing-notice">
            ⚡ Processed by OpenCV in <strong>{lastDuration} ms</strong>
          </div>
        )}
      </div>
    </div>
  );
}
