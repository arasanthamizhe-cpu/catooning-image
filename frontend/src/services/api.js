/**
 * Cartoonify AI - API Service Layer
 * Interfaces with the Python FastAPI OpenCV backend.
 */

const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const defaultBase = isLocal ? "http://127.0.0.1:8000/api" : "/api";
const rawBase = import.meta.env.VITE_API_BASE_URL || defaultBase;
const cleanBase = rawBase.replace(/\/+$/, "");
const API_BASE = cleanBase.endsWith("/api") ? cleanBase : `${cleanBase}/api`;



export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Backend service is offline or unreachable.");
  return res.json();
}

export async function fetchSampleImages() {
  const res = await fetch(`${API_BASE}/sample-images`);
  if (!res.ok) throw new Error("Failed to load sample images.");
  return res.json();
}

export async function loadSampleImage(sampleId) {
  const res = await fetch(`${API_BASE}/sample-images/load/${sampleId}`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to load sample image.");
  }
  return res.json();
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to upload image.");
  }
  return res.json();
}

export async function fetchPreprocessingStages(imageId, params = {}) {
  const res = await fetch(`${API_BASE}/image/preprocess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_id: imageId, ...params }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate preprocessing stages.");
  }
  return res.json();
}

export async function generateCartoon(imageId, params = {}) {
  const res = await fetch(`${API_BASE}/image/cartoonify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_id: imageId, ...params }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate cartoon effect.");
  }
  return res.json();
}

export function getDownloadUrl(imageId, format = "png", quality = 95) {
  return `${API_BASE}/image/download/${imageId}?format=${format}&quality=${quality}`;
}
