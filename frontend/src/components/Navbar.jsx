import React from "react";
import {
  Sparkles,
  Upload,
  Layers,
  Sliders,
  SplitSquareVertical,
  Palette,
  Download,
  BookOpen,
  Sun,
  Moon,
  Activity,
} from "lucide-react";

export default function Navbar({
  currentPage,
  setCurrentPage,
  darkMode,
  setDarkMode,
  backendOnline,
  hasImage,
  hasCartoon,
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Sparkles },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "preprocessing", label: "Preprocessing", icon: Layers, disabled: !hasImage },
    { id: "studio", label: "Cartoon Studio", icon: Sliders, disabled: !hasImage },
    { id: "comparison", label: "Comparison", icon: SplitSquareVertical, disabled: !hasCartoon },
    { id: "gallery", label: "Effects Gallery", icon: Palette, disabled: !hasImage },
    { id: "download", label: "Download", icon: Download, disabled: !hasCartoon },
    { id: "about", label: "About & Theory", icon: BookOpen },
  ];

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setCurrentPage("dashboard")}>
          <div className="brand-logo">
            <Sparkles className="brand-icon" size={22} />
          </div>
          <div>
            <div className="brand-title">
              Cartoonify <span className="gradient-text">AI</span>
            </div>
            <div className="brand-subtitle">OpenCV Computer Vision</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                className={`nav-tab ${isActive ? "active" : ""} ${
                  item.disabled ? "disabled" : ""
                }`}
                onClick={() => !item.disabled && setCurrentPage(item.id)}
                title={item.disabled ? "Upload an image first" : item.label}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="nav-actions">
          {/* Backend Status indicator */}
          <div
            className={`status-pill ${backendOnline ? "online" : "offline"}`}
            title={backendOnline ? "Backend Connected (FastAPI + OpenCV)" : "Backend Disconnected"}
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {backendOnline ? "OpenCV Ready" : "Offline"}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
