"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";

const BADGE_OPTIONS = [
  "Editor's Choice", "Trending Now", "Popular Pick", "Customer Favourite",
  "Must Have", "Fresh Pick", "Eco Pick", "Focus Essential", "Calming Pick",
  "People Love This", "Monsoon Essential", "New Arrival",
];

interface Category { _id: string; name: string; icon: string; }

interface FormData {
  title:         string;
  subtitle:      string;
  description:   string;
  price:         string;
  originalPrice: string;
  category:      string;
  image:         string;
  affiliateLink: string;
  badge:         string;
  rating:        string;
  reviews:       string;
  featured:      boolean;
}

const EMPTY: FormData = {
  title: "", subtitle: "", description: "", price: "", originalPrice: "",
  category: "", image: "", affiliateLink: "", badge: "Editor's Choice",
  rating: "4.5", reviews: "0", featured: false,
};

export default function NewProductPage() {
  const router = useRouter();
  const [form,       setForm]       = useState<FormData>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(r => { if (r.success) setCategories(r.data); });
  }, []);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) { setError("Please upload a product image."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/products", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          rating:  parseFloat(form.rating),
          reviews: parseInt(form.reviews),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create product.");
        return;
      }

      router.push("/admin/products");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#F8FAFC",
    fontSize: "0.88rem",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "'Poppins', sans-serif",
    transition: "border-color 0.2s ease",
  };

  const labelStyle = {
    fontSize: "0.82rem",
    fontWeight: 600 as const,
    color: "#CBD5E1",
    display: "block" as const,
    marginBottom: "8px",
  };

  return (
    <AdminLayout title="Add Product">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <Link href="/admin/products" style={{ color: "#64748B", fontSize: "0.85rem", textDecoration: "none" }}>
          ← Products
        </Link>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F8FAFC", fontFamily: "'Montserrat', sans-serif", margin: 0 }}>
          Add New Product
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>Product Title *</label>
              <input type="text" required value={form.title} onChange={set("title")} placeholder="e.g. Architect LED Desk Lamp" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Subtitle */}
            <div>
              <label style={labelStyle}>Subtitle / Tagline *</label>
              <input type="text" required value={form.subtitle} onChange={set("subtitle")} placeholder="Short catchy description" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description (optional)</label>
              <textarea value={form.description} onChange={set("description")} placeholder="Longer product description…" rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Price row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Price *</label>
                <input type="text" required value={form.price} onChange={set("price")} placeholder="₹1,299" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                  onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
              <div>
                <label style={labelStyle}>Original Price *</label>
                <input type="text" required value={form.originalPrice} onChange={set("originalPrice")} placeholder="₹2,199" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                  onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select required value={form.category} onChange={set("category")} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" disabled>Select a category</option>
                {categories.map(c => (
                  <option key={c._id} value={c.name} style={{ background: "#1E293B" }}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Badge */}
            <div>
              <label style={labelStyle}>Badge</label>
              <select value={form.badge} onChange={set("badge")} style={{ ...inputStyle, cursor: "pointer" }}>
                {BADGE_OPTIONS.map(b => (
                  <option key={b} value={b} style={{ background: "#1E293B" }}>{b}</option>
                ))}
              </select>
            </div>

            {/* Rating & Reviews */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Rating (0–5)</label>
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set("rating")} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                  onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
              <div>
                <label style={labelStyle}>Reviews Count</label>
                <input type="number" min="0" value={form.reviews} onChange={set("reviews")} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                  onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
              </div>
            </div>

            {/* Affiliate Link */}
            <div>
              <label style={labelStyle}>Amazon Affiliate Link *</label>
              <input type="url" required value={form.affiliateLink} onChange={set("affiliateLink")} placeholder="https://www.amazon.in/…" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Featured */}
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input type="checkbox" checked={form.featured} onChange={set("featured")} style={{ width: "18px", height: "18px", accentColor: "#8B5CF6" }} />
              <span style={{ fontSize: "0.87rem", color: "#CBD5E1", fontWeight: 600 }}>Mark as Featured Product</span>
            </label>
          </div>

          {/* Right column — Image */}
          <div>
            <ImageUpload
              value={form.image}
              onChange={url => setForm(f => ({ ...f, image: url }))}
              label="Product Image *"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#FCA5A5",
            fontSize: "0.85rem",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
          <button type="submit" disabled={loading} style={{
            padding: "13px 28px",
            borderRadius: "12px",
            background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            border: "none",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            boxShadow: loading ? "none" : "0 6px 20px rgba(99,102,241,0.35)",
          }}>
            {loading ? "Creating…" : "✓ Create Product"}
          </button>
          <Link href="/admin/products" style={{
            padding: "13px 28px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94A3B8",
            fontSize: "0.9rem",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}>
            Cancel
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
