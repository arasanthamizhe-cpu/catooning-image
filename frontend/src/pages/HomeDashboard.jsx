import React, { useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  Layers,
  Sliders,
  SplitSquareVertical,
  Palette,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Image as ImageIcon,
} from "lucide-react";

export default function HomeDashboard({
  onNavigate,
  onFileUpload,
  sampleImages,
  onSelectSample,
  hasImage,
  hasCartoon,
  recentHistory,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-container dashboard-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="badge-sparkle" />
            <span>Computer Vision & Image Processing Engine</span>
          </div>

          <h1 className="hero-title">
            Transform Photographs into Art with{" "}
            <span className="gradient-text">Cartoonify AI</span>
          </h1>

          <p className="hero-description">
            Experience real-time computer vision in action. Powered by Python and OpenCV,
            this system automates the classical cartoon pipeline—converting raw photos into
            stylized artwork using bilateral filtering, median noise attenuation, and adaptive
            threshold edge extraction.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-primary btn-large"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={20} />
              <span>Upload Your Photograph</span>
            </button>

            {hasImage && (
              <button
                className="btn-secondary btn-large"
                onClick={() => onNavigate("studio")}
              >
                <Sliders size={18} />
                <span>Open Cartoon Studio</span>
              </button>
            )}

            <button
              className="btn-outline btn-large"
              onClick={() => onNavigate("about")}
            >
              <Cpu size={18} />
              <span>View Project Documentation</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileUpload(e.target.files[0]);
              }
            }}
          />

          <div className="hero-meta-badges">
            <span className="meta-badge">
              <ShieldCheck size={14} /> 100% Local OpenCV Processing
            </span>
            <span className="meta-badge">
              <Zap size={14} /> Sub-Second Execution
            </span>
            <span className="meta-badge">
              <ImageIcon size={14} /> Formats: JPG, JPEG, PNG
            </span>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          className="hero-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-inner">
            <div className="dropzone-icon-circle">
              <UploadCloud size={38} className="text-purple" />
            </div>
            <h3 className="dropzone-heading">Drag and drop your image here</h3>
            <p className="dropzone-sub">or click to browse from local computer</p>
            <div className="format-tags">
              <span className="format-tag">.JPG</span>
              <span className="format-tag">.JPEG</span>
              <span className="format-tag">.PNG</span>
            </div>
            <div className="dropzone-footer-note">Max file size: 15 MB</div>
          </div>
        </div>
      </section>

      {/* One-Click Sample Images */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Try Instantly with Curated Samples</h2>
            <p className="section-subtitle">
              Don't have a photo handy? Click any sample below to load and run the pipeline immediately.
            </p>
          </div>
        </div>

        <div className="samples-grid">
          {sampleImages && sampleImages.length > 0 ? (
            sampleImages.map((s) => (
              <div
                key={s.id}
                className="sample-card"
                onClick={() => onSelectSample(s.id)}
              >
                <div className="sample-thumbnail-wrap">
                  <img src={s.preview} alt={s.title} className="sample-thumbnail" />
                  <span className="sample-category-badge">{s.category}</span>
                </div>
                <div className="sample-info">
                  <h4 className="sample-title">{s.title}</h4>
                  <p className="sample-desc">{s.description}</p>
                  <button className="sample-load-btn">
                    <span>Load & Cartoonify</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="loading-placeholder">Loading sample images...</div>
          )}
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Application Features</h2>
            <p className="section-subtitle">
              Comprehensive tools designed for computer vision exploration and demonstration.
            </p>
          </div>
        </div>

        <div className="features-grid">
          <div
            className={`feature-card ${!hasImage ? "inactive" : ""}`}
            onClick={() => hasImage && onNavigate("preprocessing")}
          >
            <div className="feature-icon bg-blue">
              <Layers size={24} />
            </div>
            <h3 className="feature-title">Step-by-Step Preprocessing</h3>
            <p className="feature-desc">
              Inspect each computer vision stage: Grayscale conversion, Median blur noise filtering, and Adaptive edge thresholding.
            </p>
            <span className="feature-link">
              Inspect Pipeline <ArrowRight size={14} />
            </span>
          </div>

          <div
            className={`feature-card ${!hasImage ? "inactive" : ""}`}
            onClick={() => hasImage && onNavigate("studio")}
          >
            <div className="feature-icon bg-purple">
              <Sliders size={24} />
            </div>
            <h3 className="feature-title">Cartoon Studio & Tuning</h3>
            <p className="feature-desc">
              Adjust OpenCV mathematical parameters: Bilateral diameter, color/space sigmas, and threshold constants in real time.
            </p>
            <span className="feature-link">
              Tune Parameters <ArrowRight size={14} />
            </span>
          </div>

          <div
            className={`feature-card ${!hasCartoon ? "inactive" : ""}`}
            onClick={() => hasCartoon && onNavigate("comparison")}
          >
            <div className="feature-icon bg-emerald">
              <SplitSquareVertical size={24} />
            </div>
            <h3 className="feature-title">Interactive Comparison</h3>
            <p className="feature-desc">
              Slide back and forth between the raw photograph and the cartoonified result with the split slider.
            </p>
            <span className="feature-link">
              Compare Images <ArrowRight size={14} />
            </span>
          </div>

          <div
            className={`feature-card ${!hasImage ? "inactive" : ""}`}
            onClick={() => hasImage && onNavigate("gallery")}
          >
            <div className="feature-icon bg-amber">
              <Palette size={24} />
            </div>
            <h3 className="feature-title">Artistic Effects Gallery</h3>
            <p className="feature-desc">
              Switch between Classic Cartoon, Comic Book Pop Art, Graphite Pencil Sketch, Soft Pastel, and Watercolor styles.
            </p>
            <span className="feature-link">
              Explore Gallery <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </section>

      {/* Recent Processing History */}
      {recentHistory && recentHistory.length > 0 && (
        <section className="section-block">
          <div className="section-header">
            <h2 className="section-title">Recently Processed in Session</h2>
          </div>
          <div className="history-grid">
            {recentHistory.map((h, i) => (
              <div key={i} className="history-item">
                <img src={h.thumb} alt={h.filename} className="history-thumb" />
                <div className="history-meta">
                  <div className="history-name">{h.filename}</div>
                  <div className="history-time">{h.time} • Style: {h.style}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
