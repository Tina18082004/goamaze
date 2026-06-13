"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Product Image" }: ImageUploadProps) {
  const inputRef    = useRef<HTMLInputElement>(null);
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [error,    setError]    = useState("");
  const [preview,  setPreview]  = useState(value || "");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setError("");
    setLoading(true);
    setProgress(10);

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, and GIF images are allowed.");
      setLoading(false);
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      setLoading(false);
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setProgress(30);

    // Upload via API route
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 85));
      }, 300);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
      setPreview(data.url);
    } catch (err: unknown) {
      setError((err as Error).message || "Upload failed. Please try again.");
      setPreview(value || "");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#CBD5E1" }}>{label}</label>

      {/* Drop zone */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        style={{
          borderRadius: "16px",
          border: `2px dashed ${dragOver ? "#8B5CF6" : error ? "#EF4444" : "rgba(255,255,255,0.15)"}`,
          background: dragOver ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)",
          padding: "24px",
          textAlign: "center",
          cursor: loading ? "wait" : "pointer",
          transition: "all 0.25s ease",
          position: "relative",
          overflow: "hidden",
          minHeight: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Preview image */}
        {preview && !loading && (
          <div style={{ position: "relative", width: "100%", maxHeight: "200px", overflow: "hidden", borderRadius: "10px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "10px" }}
            />
            <div style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "4px 14px",
              borderRadius: "99px",
              fontSize: "0.72rem",
              backdropFilter: "blur(8px)",
            }}>
              Click to change
            </div>
          </div>
        )}

        {/* Upload icon when no preview */}
        {!preview && !loading && (
          <>
            <div style={{ fontSize: "36px" }}>🖼️</div>
            <div style={{ fontSize: "0.88rem", color: "#94A3B8", fontWeight: 500 }}>
              Drop image here or <span style={{ color: "#8B5CF6" }}>click to upload</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
              JPEG, PNG, WebP, GIF · Max 10MB
            </div>
          </>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "24px" }}>⬆️</div>
            <div style={{ fontSize: "0.85rem", color: "#94A3B8" }}>Uploading to Cloudinary…</div>
            {/* Progress bar */}
            <div style={{ width: "80%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg,#3B82F6,#8B5CF6)",
                borderRadius: "99px",
                transition: "width 0.3s ease",
              }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{progress}%</div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "10px 16px",
          borderRadius: "10px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          color: "#FCA5A5",
          fontSize: "0.8rem",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* URL input (manual) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "0.75rem", color: "#64748B" }}>Or enter image URL directly:</label>
        <input
          type="url"
          value={value}
          onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="https://res.cloudinary.com/..."
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#F8FAFC",
            fontSize: "0.83rem",
            outline: "none",
            fontFamily: "monospace",
          }}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
