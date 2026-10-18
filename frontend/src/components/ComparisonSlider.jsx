import React, { useState, useRef, useCallback } from "react";
import { Columns, SplitSquareVertical, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export default function ComparisonSlider({
  originalUrl,
  cartoonUrl,
  originalLabel = "Original Photograph",
  cartoonLabel = "Cartoonified (OpenCV)",
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'side-by-side'
  const containerRef = useRef(null);

  const handleMove = useCallback(
    (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percent);
    },
    [containerRef]
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="comparison-wrapper">
      {/* View Mode Toggle Controls */}
      <div className="comparison-toolbar">
        <div className="toolbar-buttons">
          <button
            className={`tool-btn ${viewMode === "split" ? "active" : ""}`}
            onClick={() => setViewMode("split")}
          >
            <SplitSquareVertical size={16} />
            <span>Interactive Split Slider</span>
          </button>
          <button
            className={`tool-btn ${viewMode === "side-by-side" ? "active" : ""}`}
            onClick={() => setViewMode("side-by-side")}
          >
            <Columns size={16} />
            <span>Side-by-Side Dual View</span>
          </button>
        </div>
        <div className="slider-hint">
          {viewMode === "split"
            ? "Drag or slide across the image to compare"
            : "Direct parallel comparison"}
        </div>
      </div>

      {viewMode === "split" ? (
        /* Interactive Split Slider */
        <div
          ref={containerRef}
          className="split-slider-container"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onClick={(e) => handleMove(e.clientX)}
        >
          {/* Cartoon Image (Base Background) */}
          <img
            src={cartoonUrl}
            alt="Cartoon Output"
            className="slider-img base-img"
            draggable="false"
          />
          <div className="img-badge badge-right">{cartoonLabel}</div>

          {/* Original Image (Clipped Overlay) */}
          <div
            className="slider-clipped-layer"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={originalUrl}
              alt="Original Input"
              className="slider-img"
              draggable="false"
            />
            <div className="img-badge badge-left">{originalLabel}</div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="slider-divider"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
          >
            <div className="divider-line"></div>
            <div className="divider-handle">
              <span className="handle-chevron-left">◀</span>
              <span className="handle-chevron-right">▶</span>
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side View */
        <div className="side-by-side-grid">
          <div className="side-card">
            <div className="side-card-header">
              <span className="badge-pill original-pill">{originalLabel}</span>
            </div>
            <div className="side-card-img-wrap">
              <img src={originalUrl} alt="Original" />
            </div>
          </div>

          <div className="side-card">
            <div className="side-card-header">
              <span className="badge-pill cartoon-pill">{cartoonLabel}</span>
            </div>
            <div className="side-card-img-wrap">
              <img src={cartoonUrl} alt="Cartoonified" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
