"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B1120",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Poppins', sans-serif",
    }}>
      {/* Background blobs */}
      <div style={{ position: "fixed", top: "10%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "rgba(59,130,246,0.06)", filter: "blur(90px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(139,92,246,0.08)", filter: "blur(90px)", pointerEvents: "none" }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        borderRadius: "24px",
        padding: "48px",
        background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
          }}>⚡</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F8FAFC", fontFamily: "'Montserrat', sans-serif", margin: 0 }}>
            GoAmaze Admin
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "6px" }}>
            Sign in to your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#CBD5E1", display: "block", marginBottom: "8px" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@goamaze.com"
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#F8FAFC",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
              onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#CBD5E1", display: "block", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#F8FAFC",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
              onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          {error && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#FCA5A5",
              fontSize: "0.82rem",
              textAlign: "center",
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              border: "none",
              color: "white",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              transition: "all 0.25s ease",
              boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.4)",
              marginTop: "4px",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.75rem", color: "#475569" }}>
          Default: admin@goamaze.com · GoAmaze@2024!
        </p>
      </div>
    </div>
  );
}
