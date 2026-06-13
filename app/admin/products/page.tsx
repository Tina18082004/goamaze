"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

interface Product {
  _id:           string;
  title:         string;
  category:      string;
  price:         string;
  rating:        number;
  featured:      boolean;
  image:         string;
  createdAt:     string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search,   setSearch]   = useState("");

  const fetchProducts = () => {
    setLoading(true);
    fetch(`/api/products${search ? `?search=${encodeURIComponent(search)}` : ""}`)
      .then(r => r.json())
      .then(r => { if (r.success) setProducts(r.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) setProducts(p => p.filter(x => x._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch(`/api/products/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ featured: !current }),
    });
    setProducts(p => p.map(x => x._id === id ? { ...x, featured: !current } : x));
  };

  return (
    <AdminLayout title="Products">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F8FAFC", fontFamily: "'Montserrat', sans-serif", margin: "0 0 4px" }}>
            Products ({products.length})
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.85rem", margin: 0 }}>Manage your curated product catalogue</p>
        </div>
        <Link href="/admin/products/new" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "11px 22px", borderRadius: "12px",
          background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
          color: "white", textDecoration: "none",
          fontSize: "0.87rem", fontWeight: 700,
          boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
        }}>
          ➕ Add Product
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#F8FAFC",
          fontSize: "0.88rem",
          outline: "none",
          marginBottom: "20px",
          boxSizing: "border-box",
        }}
      />

      {/* Table */}
      <div style={{
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        background: "rgba(255,255,255,0.02)",
      }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 130px 90px 80px 120px",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontSize: "0.72rem",
          color: "#64748B",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          <span>Image</span>
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Featured</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#64748B", fontSize: "0.9rem" }}>
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#64748B", fontSize: "0.9rem" }}>
            No products found. <Link href="/admin/products/new" style={{ color: "#8B5CF6" }}>Add one now →</Link>
          </div>
        ) : (
          products.map((p, i) => (
            <div key={p._id} style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 130px 90px 80px 120px",
              padding: "14px 20px",
              alignItems: "center",
              borderBottom: i < products.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title} style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "10px", background: "#1E293B" }} />

              {/* Title */}
              <div>
                <div style={{ fontSize: "0.87rem", fontWeight: 600, color: "#F8FAFC", marginBottom: "2px" }}>{p.title}</div>
                <div style={{ fontSize: "0.73rem", color: "#64748B" }}>⭐ {p.rating}</div>
              </div>

              {/* Category */}
              <span style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "99px",
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#A78BFA",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}>{p.category}</span>

              {/* Price */}
              <span style={{ fontSize: "0.87rem", fontWeight: 700, color: "#F8FAFC" }}>{p.price}</span>

              {/* Featured toggle */}
              <button
                onClick={() => toggleFeatured(p._id, p.featured)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  lineHeight: 1,
                  opacity: p.featured ? 1 : 0.3,
                  transition: "opacity 0.2s ease",
                }}
                title={p.featured ? "Remove from featured" : "Mark as featured"}
              >
                ⭐
              </button>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px" }}>
                <Link href={`/admin/products/${p._id}/edit`} style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60A5FA",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}>Edit</Link>

                <button
                  onClick={() => handleDelete(p._id, p.title)}
                  disabled={deleting === p._id}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#FCA5A5",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: deleting === p._id ? "wait" : "pointer",
                  }}
                >
                  {deleting === p._id ? "…" : "Del"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
