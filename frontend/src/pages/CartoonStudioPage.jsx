import React, { useState } from "react";
import {
  Sliders,
  Wand2,
  SplitSquareVertical,
  Download,
  Layers,
  Sparkles,
  CheckCircle2,
  Maximize2,
  Clock,
  Eye,
} from "lucide-react";
import ParameterControls, { DEFAULT_PARAMS } from "../components/ParameterControls";

export default function CartoonStudioPage({
  imageSession,
  cartoonResult,
  cartoonParams,
  setCartoonParams,
  onGenerateCartoon,
  isProcessing,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState("cartoon"); // 'cartoon' | 'color' | 'edges' | 'original'

  const handleReset = () => {
    setCartoonParams({ ...DEFAULT_PARAMS });
  };

  if (!imageSession) {
    return (
      <div className="page-container empty-state">
        <Sliders size={48} className="text-purple empty-icon" />
        <h2>No Active Image</h2>
        <p>Upload a photograph or select a sample image first to start cartooning.</p>
        <button className="btn-primary" onClick={() => onNavigate("upload")}>
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="page-container studio-page">
      <div className="page-header flex-header">
        <div>
          <h1 className="page-title">Cartoon Effect Studio</h1>
          <p className="page-subtitle">
            Fine-tune OpenCV bilateral smoothing and adaptive edge parameters to shape your cartoon aesthetic.
          </p>
        </div>

        {cartoonResult && (
          <div className="header-action-group">
            <button
              className="btn-outline"
              onClick={() => onNavigate("comparison")}
            >
              <SplitSquareVertical size={16} />
              <span>Split Comparison</span>
            </button>
            <button
              className="btn-primary"
              onClick={() => onNavigate("download")}
            >
              <Download size={16} />
              <span>Download Image</span>
            </button>
          </div>
        )}
      </div>

      <div className="studio-layout">
        {/* Left Column: Parameter Controls */}
        <aside className="studio-sidebar">
          <ParameterControls
            params={cartoonParams}
            setParams={setCartoonParams}
            onGenerate={onGenerateCartoon}
            onReset={handleReset}
            isProcessing={isProcessing}
            lastDuration={cartoonResult ? cartoonResult.duration_ms : null}
          />
        </aside>

        {/* Right Column: Visual Result Canvas */}
        <main className="studio-main">
          {/* Layer View Switcher Tabs */}
          <div className="studio-tabs">
            <button
              className={`studio-tab ${activeTab === "cartoon" ? "active" : ""}`}
              onClick={() => setActiveTab("cartoon")}
            >
              <Sparkles size={16} />
              <span>Final Cartoon (Blended)</span>
            </button>
            <button
              className={`studio-tab ${activeTab === "color" ? "active" : ""}`}
              onClick={() => setActiveTab("color")}
            >
              <Layers size={16} />
              <span>Color Smoothed (Bilateral)</span>
            </button>
            <button
              className={`studio-tab ${activeTab === "edges" ? "active" : ""}`}
              onClick={() => setActiveTab("edges")}
            >
              <span>Edge Mask (Adaptive)</span>
            </button>
            <button
              className={`studio-tab ${activeTab === "original" ? "active" : ""}`}
              onClick={() => setActiveTab("original")}
            >
              <span>Original Photo</span>
            </button>
          </div>

          {/* Canvas Display Card */}
          <div className="studio-canvas-card">
            {isProcessing ? (
              <div className="studio-processing-overlay">
                <div className="spinner large"></div>
                <h3>Applying OpenCV Bilateral Filtering & Edge Blending...</h3>
                <p>Computing bitwise combination of color layers</p>
              </div>
            ) : cartoonResult ? (
              <div className="studio-canvas-content">
                <div className="canvas-img-container">
                  {activeTab === "cartoon" && (
                    <img
                      src={cartoonResult.cartoon_image}
                      alt="Final Cartoon"
                      className="canvas-image"
                    />
                  )}
                  {activeTab === "color" && (
                    <img
                      src={cartoonResult.color_smoothed}
                      alt="Color Smoothed"
                      className="canvas-image"
                    />
                  )}
                  {activeTab === "edges" && (
                    <img
                      src={cartoonResult.edge_mask}
                      alt="Edge Mask"
                      className="canvas-image"
                    />
                  )}
                  {activeTab === "original" && (
                    <img
                      src={cartoonResult.original_image || imageSession.preview}
                      alt="Original Photo"
                      className="canvas-image"
                    />
                  )}
                </div>

                {/* Canvas Metadata Bar */}
                <div className="canvas-meta-bar">
                  <div className="meta-left">
                    <span className="style-tag">
                      Style: <strong>{cartoonParams.style.replace("_", " ").toUpperCase()}</strong>
                    </span>
                    <span className="dim-tag">
                      {cartoonResult.dimensions.width} × {cartoonResult.dimensions.height} px
                    </span>
                  </div>

                  <div className="meta-right">
                    <span className="duration-tag">
                      <Clock size={14} /> {cartoonResult.duration_ms} ms
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="studio-empty-prompt">
                <Sparkles size={40} className="text-purple" />
                <h3>Ready to Cartoonify</h3>
                <p>Click "Generate Cartoon Effect" to compute the blended result with your current parameters.</p>
                <button className="btn-primary" onClick={onGenerateCartoon}>
                  <Wand2 size={16} />
                  <span>Generate Cartoon Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Shortcuts Bar */}
          {cartoonResult && (
            <div className="studio-shortcuts">
              <div className="shortcut-card" onClick={() => onNavigate("comparison")}>
                <SplitSquareVertical size={20} className="text-purple" />
                <div>
                  <strong>Compare Before & After</strong>
                  <p>Interactive slider split view</p>
                </div>
              </div>

              <div className="shortcut-card" onClick={() => onNavigate("gallery")}>
                <Sparkles size={20} className="text-emerald" />
                <div>
                  <strong>Try 5 Artistic Styles</strong>
                  <p>Comic, Sketch, Pastel, Watercolor</p>
                </div>
              </div>

              <div className="shortcut-card" onClick={() => onNavigate("download")}>
                <Download size={20} className="text-blue" />
                <div>
                  <strong>Export High-Res</strong>
                  <p>Download as PNG or JPEG</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
