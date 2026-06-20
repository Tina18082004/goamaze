"use client";

import { motion } from "framer-motion";

const categories = [
  {
    icon: "🛋",
    label: "Home Decor",
    desc: "Serene spaces, curated details",
    count: "4 picks",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.10)",
    border: "rgba(139,92,246,0.25)",
  },
  {
    icon: "✨",
    label: "Lifestyle",
    desc: "Intentional everyday essentials",
    count: "3 picks",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.25)",
  },
  {
    icon: "🍳",
    label: "Kitchen",
    desc: "Craft your culinary ritual",
    count: "3 picks",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.20)",
  },
  {
    icon: "📖",
    label: "Study Essentials",
    desc: "Spaces built for deep focus",
    count: "4 picks",
    color: "#10B981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.20)",
  },
  {
    icon: "🎵",
    label: "Entertainment",
    desc: "Sound, screen & experience",
    count: "2 picks",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.10)",
    border: "rgba(236,72,153,0.20)",
  },
];

export default function FeaturedCollections() {
  return (
    <section
      id="collections"
      style={{
        padding: "100px 0",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blob */}
      <div className="glow-blob" style={{
        width: 400, height: 400,
        background: "rgba(99,102,241,0.07)",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
      }} />

      <div className="section-wrapper" style={{ position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <span className="section-label">✦ Our Collections</span>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}>
            Designed for{" "}
            <span className="gradient-text">Modern Living</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            Five carefully selected categories — each a world of intentional,
            beautiful, and functional essentials.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}>
          {categories.map((cat, i) => (
            <motion.a
              key={cat.label}
              href="#products"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              style={{
                display: "block",
                textDecoration: "none",
                padding: "32px 24px",
                borderRadius: "20px",
                background: cat.bg,
                border: `1px solid ${cat.border}`,
                backdropFilter: "blur(12px)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 12px 40px ${cat.bg}, 0 4px 24px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 24px rgba(0,0,0,0.2)";
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "16px" }}>
                {cat.icon}
              </div>
              <div style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1.05rem", fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}>{cat.label}</div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}>{cat.desc}</div>
              <div style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "99px",
                background: `${cat.color}22`,
                border: `1px solid ${cat.color}44`,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: cat.color,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.05em",
              }}>{cat.count}</div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
