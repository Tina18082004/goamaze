"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin",              label: "Dashboard",    icon: "⚡" },
  { href: "/admin/products",     label: "Products",     icon: "🛍️" },
  { href: "/admin/categories",   label: "Categories",   icon: "🏷️" },
  { href: "/admin/newsletter",   label: "Newsletter",   icon: "📧" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      background: "rgba(15,23,42,0.98)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column",
      padding: "0 0 24px",
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* Logo */}
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        marginBottom: "12px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}>⚡</div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#F8FAFC", lineHeight: 1.2 }}>GoAmaze</div>
            <div style={{ fontSize: "0.65rem", color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "0 12px", flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "12px",
                marginBottom: "4px",
                fontSize: "0.87rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#F8FAFC" : "#64748B",
                background: isActive
                  ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(139,92,246,0.3)"
                  : "1px solid transparent",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "16px" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer note */}
      <div style={{ padding: "0 20px" }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            color: "#64748B",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.2s ease",
          }}
        >
          <span>🌐</span> View Public Site
        </Link>
      </div>
    </aside>
  );
}
