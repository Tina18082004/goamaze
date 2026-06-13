"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGE_OPTIONS = [
  "Editor's Choice", "Trending Now", "Popular Pick", "Customer Favourite",
  "Must Have", "Fresh Pick", "Eco Pick", "Focus Essential", "Calming Pick",
  "People Love This", "Monsoon Essential", "New Arrival",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category { _id: string; name: string; icon: string; }

interface FormState {
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);   // React 19 — unwrap async params

  const [form,       setForm]       = useState<FormState | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");

  // ── Fetch product + categories ────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [productRes, catRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/categories"),
        ]);

        const productJson = await productRes.json();
        const catJson     = await catRes.json();

        if (!productRes.ok || !productJson.success) {
          setError(productJson.message || "Product not found.");
          setLoading(false);
          return;
        }

        const p = productJson.data;
        setForm({
          title:         p.title         ?? "",
          subtitle:      p.subtitle       ?? "",
          description:   p.description   ?? "",
          price:         p.price          ?? "",
          originalPrice: p.originalPrice  ?? "",
          category:      p.category       ?? "",
          image:         p.image          ?? "",
          affiliateLink: p.affiliateLink  ?? "",
          badge:         p.badge          ?? "Editor's Choice",
          rating:        String(p.rating  ?? 4.5),
          reviews:       String(p.reviews ?? 0),
          featured:      p.featured       ?? false,
        });

        if (catJson.success) setCategories(catJson.data);
      } catch {
        setError("Failed to load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // ── Field change handler ──────────────────────────────────────────────────
  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f =>
        f
          ? {
              ...f,
              [field]:
                e.target.type === "checkbox"
                  ? (e.target as HTMLInputElement).checked
                  : e.target.value,
            }
          : f
      );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!form.image) { setError("Please upload or provide a product image."); return; }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating:  parseFloat(form.rating),
          reviews: parseInt(form.reviews),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to update product.");
        return;
      }

      setSuccess("Product updated successfully!");
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputStyle = {
    width:         "100%",
    padding:       "12px 16px",
    borderRadius:  "12px",
    background:    "rgba(255,255,255,0.04)",
    border:        "1px solid rgba(255,255,255,0.1)",
    color:         "#F8FAFC",
    fontSize:      "0.88rem",
    outline:       "none",
    boxSizing:     "border-box" as const,
    fontFamily:    "'Poppins', sans-serif",
    transition:    "border-color 0.2s ease",
  };

  const labelStyle = {
    fontSize:     "0.82rem",
    fontWeight:   600 as const,
    color:        "#CBD5E1",
    display:      "block" as const,
    marginBottom: "8px",
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(139,92,246,0.5)");
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <Link href="/admin/products" style={{ color: "#64748B", fontSize: "0.85rem", textDecoration: "none" }}>
            ← Products
          </Link>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F8FAFC", fontFamily: "'Montserrat', sans-serif", margin: 0 }}>
            Edit Product
          </h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "28px",
          opacity: 0.5,
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              height: "52px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
        </div>
      </AdminLayout>
    );
  }

  // ── Error state (product not found) ───────────────────────────────────────
  if (error && !form) {
    return (
      <AdminLayout title="Edit Product">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <Link href="/admin/products" style={{ color: "#64748B", fontSize: "0.85rem", textDecoration: "none" }}>
            ← Products
          </Link>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F8FAFC", fontFamily: "'Montserrat', sans-serif", margin: 0 }}>
            Edit Product
          </h2>
        </div>
        <div style={{
          padding:      "24px",
          borderRadius: "16px",
          background:   "rgba(239,68,68,0.08)",
          border:       "1px solid rgba(239,68,68,0.2)",
          color:        "#FCA5A5",
        }}>
          ⚠️ {error}
          <Link href="/admin/products" style={{ display: "block", marginTop: "12px", color: "#8B5CF6", fontSize: "0.85rem" }}>
            ← Back to products
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!form) return null;

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Edit Product">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <Link href="/admin/products" style={{ color: "#64748B", fontSize: "0.85rem", textDecoration: "none" }}>
          ← Products
        </Link>
        <h2 style={{
          fontSize:   "1.4rem",
          fontWeight:  800,
          color:      "#F8FAFC",
          fontFamily: "'Montserrat', sans-serif",
          margin:     0,
        }}>
          Edit Product
        </h2>

        {/* Product ID badge */}
        <span style={{
          marginLeft:   "auto",
          padding:      "4px 12px",
          borderRadius: "99px",
          background:   "rgba(139,92,246,0.1)",
          border:       "1px solid rgba(139,92,246,0.2)",
          color:        "#A78BFA",
          fontSize:     "0.72rem",
          fontFamily:   "monospace",
        }}>
          ID: {id}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>

          {/* ── Left column — fields ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>Product Title *</label>
              <input
                type="text" required value={form.title} onChange={set("title")}
                placeholder="e.g. Architect LED Desk Lamp" style={inputStyle}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </div>

            {/* Subtitle */}
            <div>
              <label style={labelStyle}>Subtitle / Tagline *</label>
              <input
                type="text" required value={form.subtitle} onChange={set("subtitle")}
                placeholder="Short catchy description" style={inputStyle}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                value={form.description} onChange={set("description")}
                placeholder="Longer product description…" rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </div>

            {/* Price */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Price *</label>
                <input
                  type="text" required value={form.price} onChange={set("price")}
                  placeholder="₹1,299" style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
              <div>
                <label style={labelStyle}>Original Price *</label>
                <input
                  type="text" required value={form.originalPrice} onChange={set("originalPrice")}
                  placeholder="₹2,199" style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                required value={form.category} onChange={set("category")}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
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
              <select
                value={form.badge} onChange={set("badge")}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {BADGE_OPTIONS.map(b => (
                  <option key={b} value={b} style={{ background: "#1E293B" }}>{b}</option>
                ))}
              </select>
            </div>

            {/* Rating & Reviews */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Rating (0–5)</label>
                <input
                  type="number" min="0" max="5" step="0.1"
                  value={form.rating} onChange={set("rating")} style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
              <div>
                <label style={labelStyle}>Reviews Count</label>
                <input
                  type="number" min="0"
                  value={form.reviews} onChange={set("reviews")} style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
            </div>

            {/* Affiliate Link */}
            <div>
              <label style={labelStyle}>Amazon Affiliate Link *</label>
              <input
                type="url" required value={form.affiliateLink} onChange={set("affiliateLink")}
                placeholder="https://www.amazon.in/…" style={inputStyle}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </div>

            {/* Featured */}
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox" checked={form.featured} onChange={set("featured")}
                style={{ width: "18px", height: "18px", accentColor: "#8B5CF6" }}
              />
              <span style={{ fontSize: "0.87rem", color: "#CBD5E1", fontWeight: 600 }}>
                Mark as Featured Product
              </span>
            </label>
          </div>

          {/* ── Right column — image upload ── */}
          <div>
            <ImageUpload
              value={form.image}
              onChange={url => setForm(f => f ? { ...f, image: url } : f)}
              label="Product Image *"
            />

            {/* Cloudinary URL info */}
            {form.image && form.image.includes("res.cloudinary.com") && (
              <div style={{
                marginTop:    "12px",
                padding:      "10px 14px",
                borderRadius: "10px",
                background:   "rgba(16,185,129,0.08)",
                border:       "1px solid rgba(16,185,129,0.2)",
                fontSize:     "0.75rem",
                color:        "#34D399",
                wordBreak:    "break-all",
              }}>
                ✓ Cloudinary image: <span style={{ fontFamily: "monospace", opacity: 0.8 }}>{form.image}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error / Success banners */}
        {error && (
          <div style={{
            marginTop:    "20px",
            padding:      "14px 18px",
            borderRadius: "12px",
            background:   "rgba(239,68,68,0.1)",
            border:       "1px solid rgba(239,68,68,0.25)",
            color:        "#FCA5A5",
            fontSize:     "0.85rem",
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop:    "20px",
            padding:      "14px 18px",
            borderRadius: "12px",
            background:   "rgba(16,185,129,0.1)",
            border:       "1px solid rgba(16,185,129,0.25)",
            color:        "#34D399",
            fontSize:     "0.85rem",
          }}>
            ✓ {success}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding:    "13px 28px",
              borderRadius:"12px",
              background:  saving
                ? "rgba(99,102,241,0.4)"
                : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              border:     "none",
              color:      "white",
              fontSize:   "0.9rem",
              fontWeight:  700,
              cursor:      saving ? "wait" : "pointer",
              boxShadow:   saving ? "none" : "0 6px 20px rgba(99,102,241,0.35)",
              transition:  "all 0.2s ease",
            }}
          >
            {saving ? "Saving…" : "✓ Save Changes"}
          </button>

          <Link
            href="/admin/products"
            style={{
              padding:      "13px 28px",
              borderRadius: "12px",
              background:   "rgba(255,255,255,0.05)",
              border:       "1px solid rgba(255,255,255,0.1)",
              color:        "#94A3B8",
              fontSize:     "0.9rem",
              fontWeight:    600,
              textDecoration:"none",
              display:      "inline-flex",
              alignItems:   "center",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
