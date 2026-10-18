import React, { useEffect, useState } from "react";
import {
  Layers,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Maximize2,
  Info,
  RefreshCw,
  Eye,
} from "lucide-react";
import { fetchPreprocessingStages } from "../services/api";

export default function PreprocessingPage({
  imageSession,
  onNavigate,
  onSetCartoonParams,
}) {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    if (!imageSession) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchPreprocessingStages(imageSession.image_id)
      .then((data) => {
        if (isMounted) {
          setStages(data.stages || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [imageSession]);

  if (!imageSession) {
    return (
      <div className="page-container empty-state">
        <Layers size={48} className="text-purple empty-icon" />
        <h2>No Image Loaded</h2>
        <p>Please upload an image or select a sample image first.</p>
        <button className="btn-primary" onClick={() => onNavigate("upload")}>
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="page-container preprocessing-page">
      <div className="page-header flex-header">
        <div>
          <h1 className="page-title">Computer Vision Preprocessing Pipeline</h1>
          <p className="page-subtitle">
            Inspect every intermediate mathematical representation produced by OpenCV before blending.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => onNavigate("studio")}
        >
          <span>Continue to Cartoon Studio</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner large"></div>
          <p>Computing intermediate OpenCV matrix stages...</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>Failed to load preprocessing stages: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="stages-grid">
          {stages.map((stage) => (
            <div key={stage.stage_number} className="stage-card">
              {/* Stage Card Header */}
              <div className="stage-card-header">
                <div className="stage-badge-group">
                  <span className="stage-number-pill">Stage 0{stage.stage_number}</span>
                  <span className="stage-status-pill">
                    <CheckCircle2 size={13} className="text-emerald" />
                    <span>{stage.status}</span>
                  </span>
                </div>
                <h3 className="stage-title">{stage.title}</h3>
              </div>

              {/* Stage Image Preview */}
              <div
                className="stage-preview-wrap"
                onClick={() => setSelectedPreview(stage)}
                title="Click to zoom stage image"
              >
                <img
                  src={stage.preview}
                  alt={stage.title}
                  className="stage-preview-img"
                />
                <div className="stage-zoom-hint">
                  <Eye size={16} />
                  <span>Inspect Full Size</span>
                </div>
              </div>

              {/* Stage Explanation & Metrics */}
              <div className="stage-body">
                <p className="stage-desc">{stage.description}</p>

                {stage.metrics && (
                  <div className="stage-metrics-row">
                    {Object.entries(stage.metrics).map(([k, v]) => (
                      <div key={k} className="metric-tag">
                        <span className="metric-tag-key">{k.replace("_", " ")}:</span>
                        <span className="metric-tag-val">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Modal for enlarged inspection */}
      {selectedPreview && (
        <div className="modal-backdrop" onClick={() => setSelectedPreview(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Stage 0{selectedPreview.stage_number}: {selectedPreview.title}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedPreview(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-image-wrap">
              <img
                src={selectedPreview.preview}
                alt={selectedPreview.title}
                className="modal-full-img"
              />
            </div>
            <p className="modal-desc">{selectedPreview.description}</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation CTA */}
      <div className="pipeline-cta-bar">
        <div className="cta-bar-text">
          <strong>Edges & Luminance Extracted!</strong>
          <span>Next, tune the bilateral smoothing filter and combine layers in Cartoon Studio.</span>
        </div>
        <button
          className="btn-primary btn-large"
          onClick={() => onNavigate("studio")}
        >
          <Sliders size={18} />
          <span>Open Cartoon Studio</span>
        </button>
      </div>
    </div>
  );
}
