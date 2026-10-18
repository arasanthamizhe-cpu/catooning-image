import React, { useRef } from "react";
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Trash2,
  ArrowRight,
  Maximize2,
  FileText,
  Sparkles,
  Layers,
} from "lucide-react";

export default function ImageUploadPage({
  imageSession,
  onFileUpload,
  onClearImage,
  onProcessImage,
  sampleImages,
  onSelectSample,
  errorMessage,
  isUploading,
}) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="page-container upload-page">
      <div className="page-header">
        <h1 className="page-title">Upload & Validate Image</h1>
        <p className="page-subtitle">
          Select or drop a photograph. The backend validates format integrity, dimensions, and color space using OpenCV.
        </p>
      </div>

      {errorMessage && (
        <div className="error-banner">
          <AlertTriangle size={20} className="error-icon" />
          <div className="error-content">
            <strong>Validation Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {!imageSession ? (
        /* Empty State / Upload Dropzone */
        <div className="upload-box-wrapper">
          <div
            className="dropzone-large"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-inner">
              <div className="dropzone-icon-circle large">
                <UploadCloud size={48} className="text-purple" />
              </div>
              <h2 className="dropzone-heading">Choose an image or drag it here</h2>
              <p className="dropzone-sub">
                Supports standard formats: JPG, JPEG, and PNG (up to 15 MB)
              </p>
              <button
                type="button"
                className="btn-primary"
                disabled={isUploading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {isUploading ? "Validating Image..." : "Browse Local Files"}
              </button>
            </div>
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

          {/* Quick sample pickers */}
          <div className="sample-quick-pick">
            <span className="quick-label">Or quickly test with a sample:</span>
            <div className="quick-buttons">
              {sampleImages.map((s) => (
                <button
                  key={s.id}
                  className="quick-sample-btn"
                  onClick={() => onSelectSample(s.id)}
                >
                  <Sparkles size={14} className="text-purple" />
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Loaded & Validated State */
        <div className="uploaded-preview-layout">
          {/* Left Column: Image Preview */}
          <div className="preview-card">
            <div className="preview-card-header">
              <div className="preview-status-tag">
                <FileCheck size={16} className="text-emerald" />
                <span>Verified by OpenCV</span>
              </div>
              <button
                className="btn-danger-outline"
                onClick={onClearImage}
                title="Remove image and upload another"
              >
                <Trash2 size={16} />
                <span>Clear Image</span>
              </button>
            </div>

            <div className="preview-image-wrap">
              <img
                src={imageSession.preview}
                alt={imageSession.filename}
                className="preview-image"
              />
            </div>

            <div className="preview-footer-info">
              <span className="filename-text">{imageSession.filename}</span>
            </div>
          </div>

          {/* Right Column: Metadata and Actions */}
          <div className="metadata-panel">
            <h3 className="panel-title">Image Specifications</h3>
            
            <div className="meta-grid">
              <div className="meta-box">
                <span className="meta-key">Dimensions</span>
                <span className="meta-val">
                  {imageSession.metadata.current_width} × {imageSession.metadata.current_height} px
                </span>
              </div>

              <div className="meta-box">
                <span className="meta-key">File Size</span>
                <span className="meta-val">{imageSession.metadata.size_kb} KB</span>
              </div>

              <div className="meta-box">
                <span className="meta-key">Format</span>
                <span className="meta-val format-badge">{imageSession.metadata.format}</span>
              </div>

              <div className="meta-box">
                <span className="meta-key">Color Space</span>
                <span className="meta-val">{imageSession.metadata.color_mode || "RGB"}</span>
              </div>

              <div className="meta-box span-2">
                <span className="meta-key">Aspect Ratio</span>
                <span className="meta-val">{imageSession.metadata.aspect_ratio}</span>
              </div>
            </div>

            <div className="workflow-callout">
              <h4 className="callout-title">Ready for Image Processing</h4>
              <p className="callout-desc">
                Your photograph has been decoded into an OpenCV BGR matrix. Next, view the step-by-step
                computer vision preprocessing stages or jump directly into the Cartoon Studio to adjust filter parameters.
              </p>
            </div>

            <div className="upload-actions-group">
              <button
                className="btn-primary btn-large w-full"
                onClick={() => onProcessImage("preprocessing")}
              >
                <Layers size={18} />
                <span>View Preprocessing Stages</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn-secondary btn-large w-full"
                onClick={() => onProcessImage("studio")}
              >
                <Sparkles size={18} />
                <span>Open Cartoon Studio Directly</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
