"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import Link from "next/link";

interface Analytics {
  totalProducts:    number;
  totalCategories:  number;
  totalSubscribers: number;
  featuredProducts: number;
}

export default function AdminDashboard() {
  const [data,    setData]    = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(r => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F8FAFC", fontFamily: "'Montserrat', sans-serif", margin: "0 0 6px" }}>
          Welcome back 👋
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
          Here&apos;s what&apos;s happening with GoAmaze today.
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "20px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: "120px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: "20px", marginBottom: "40px" }}>
          <StatCard label="Total Products"    value={data?.totalProducts    ?? 0} icon="🛍️" color="#3B82F6" subtitle="All curated products" />
          <StatCard label="Categories"        value={data?.totalCategories  ?? 0} icon="🏷️" color="#8B5CF6" subtitle="Product categories" />
          <StatCard label="Newsletter Subs"   value={data?.totalSubscribers ?? 0} icon="📧" color="#10B981" subtitle="Subscribed emails" />
          <StatCard label="Featured Products" value={data?.featuredProducts ?? 0} icon="⭐" color="#F59E0B" subtitle="Highlighted picks" />
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ fontWeight: 700, color: "#94A3B8", marginBottom: "16px", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.78rem" }}>
          Quick Actions
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "14px" }}>
          {[
            { href: "/admin/products/new",  label: "Add New Product",  icon: "➕", color: "#3B82F6" },
            { href: "/admin/categories",    label: "Manage Categories", icon: "🏷️", color: "#8B5CF6" },
            { href: "/admin/newsletter",    label: "View Subscribers",  icon: "📧", color: "#10B981" },
            { href: "/admin/products",      label: "All Products",      icon: "📦", color: "#F59E0B" },
          ].map(({ href, label, icon, color }) => (
            <Link key={href} href={href} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#CBD5E1",
              textDecoration: "none",
              fontSize: "0.87rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}44`;
              (e.currentTarget as HTMLAnchorElement).style.background = `${color}12`;
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
            >
              <span style={{ fontSize: "20px" }}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
