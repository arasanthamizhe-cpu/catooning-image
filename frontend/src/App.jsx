import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeDashboard from "./pages/HomeDashboard";
import ImageUploadPage from "./pages/ImageUploadPage";
import PreprocessingPage from "./pages/PreprocessingPage";
import CartoonStudioPage from "./pages/CartoonStudioPage";
import ImageComparisonPage from "./pages/ImageComparisonPage";
import EffectsGalleryPage from "./pages/EffectsGalleryPage";
import DownloadResultsPage from "./pages/DownloadResultsPage";
import AboutProjectPage from "./pages/AboutProjectPage";
import { DEFAULT_PARAMS } from "./components/ParameterControls";
import {
  fetchHealth,
  fetchSampleImages,
  loadSampleImage,
  uploadImage,
  generateCartoon,
} from "./services/api";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Active session data
  const [imageSession, setImageSession] = useState(null);
  const [cartoonResult, setCartoonResult] = useState(null);
  const [cartoonParams, setCartoonParams] = useState({ ...DEFAULT_PARAMS });

  // System states
  const [sampleImages, setSampleImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);

  // Check health and fetch sample images on load
  useEffect(() => {
    fetchHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));

    fetchSampleImages()
      .then((data) => setSampleImages(data.samples || []))
      .catch((err) => console.warn("Failed to load sample images:", err));
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle local file upload
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const data = await uploadImage(file);
      setImageSession(data);
      setCartoonResult(null); // Clear previous cartoon
      showToast(`Image "${data.filename}" loaded & validated.`);
      setCurrentPage("upload");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle sample image selection
  const handleSelectSample = async (sampleId) => {
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const data = await loadSampleImage(sampleId);
      setImageSession(data);
      setCartoonResult(null);
      showToast(`Sample "${data.filename}" loaded successfully.`);
      setCurrentPage("upload");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Clear current image
  const handleClearImage = () => {
    setImageSession(null);
    setCartoonResult(null);
    setCartoonParams({ ...DEFAULT_PARAMS });
    setErrorMessage(null);
    setCurrentPage("dashboard");
    showToast("Active image session cleared.");
  };

  // Generate Cartoon using OpenCV backend
  const handleGenerateCartoon = async () => {
    if (!imageSession) return;
    setIsProcessing(true);

    try {
      const res = await generateCartoon(imageSession.image_id, cartoonParams);
      setCartoonResult(res);
      showToast(`Cartoon generated in ${res.duration_ms} ms!`);

      // Add to session history
      setRecentHistory((prev) => [
        {
          thumb: res.cartoon_image,
          filename: imageSession.filename,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          style: (cartoonParams.style || "classic").toUpperCase(),
        },
        ...prev.slice(0, 5),
      ]);
    } catch (err) {
      setErrorMessage(err.message);
      showToast(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`app-root ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* Global Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        backendOnline={backendOnline}
        hasImage={!!imageSession}
        hasCartoon={!!cartoonResult}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="floating-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Active Page View */}
      <main className="main-content">
        {currentPage === "dashboard" && (
          <HomeDashboard
            onNavigate={setCurrentPage}
            onFileUpload={handleFileUpload}
            sampleImages={sampleImages}
            onSelectSample={handleSelectSample}
            hasImage={!!imageSession}
            hasCartoon={!!cartoonResult}
            recentHistory={recentHistory}
          />
        )}

        {currentPage === "upload" && (
          <ImageUploadPage
            imageSession={imageSession}
            onFileUpload={handleFileUpload}
            onClearImage={handleClearImage}
            onProcessImage={(target) => setCurrentPage(target)}
            sampleImages={sampleImages}
            onSelectSample={handleSelectSample}
            errorMessage={errorMessage}
            isUploading={isUploading}
          />
        )}

        {currentPage === "preprocessing" && (
          <PreprocessingPage
            imageSession={imageSession}
            onNavigate={setCurrentPage}
            onSetCartoonParams={setCartoonParams}
          />
        )}

        {currentPage === "studio" && (
          <CartoonStudioPage
            imageSession={imageSession}
            cartoonResult={cartoonResult}
            cartoonParams={cartoonParams}
            setCartoonParams={setCartoonParams}
            onGenerateCartoon={handleGenerateCartoon}
            isProcessing={isProcessing}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === "comparison" && (
          <ImageComparisonPage
            imageSession={imageSession}
            cartoonResult={cartoonResult}
            onNavigate={setCurrentPage}
            onResetParams={() => setCartoonParams({ ...DEFAULT_PARAMS })}
            onGenerateCartoon={handleGenerateCartoon}
          />
        )}

        {currentPage === "gallery" && (
          <EffectsGalleryPage
            imageSession={imageSession}
            cartoonResult={cartoonResult}
            onNavigate={setCurrentPage}
            onApplyStyle={(newResult) => {
              setCartoonResult(newResult);
              setCartoonParams(newResult.parameters);
            }}
            isProcessing={isProcessing}
          />
        )}

        {currentPage === "download" && (
          <DownloadResultsPage
            imageSession={imageSession}
            cartoonResult={cartoonResult}
            onNavigate={setCurrentPage}
            onProcessAnother={() => {
              setImageSession(null);
              setCartoonResult(null);
              setCurrentPage("upload");
            }}
          />
        )}

        {currentPage === "about" && (
          <AboutProjectPage onNavigate={setCurrentPage} />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <strong>Cartoonify AI</strong> — Computer Vision Laboratory Project (OpenCV + Python + React)
          </div>
          <div className="footer-right">
            <span>Powered by OpenCV 5 & FastAPI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
