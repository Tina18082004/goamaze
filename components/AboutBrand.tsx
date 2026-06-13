"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "100+",  label: "Products Curated",   icon: "✦"  },
  { value: "5",     label: "Core Categories",     icon: "🗂"  },
  { value: "🌱",    label: "Community Growing",   icon: "😊" },
  { value: "100%",  label: "Affiliate Honest",    icon: "🤝"  },
];

export default function AboutBrand() {
  return (
    <section
      id="about"
      style={{
        padding: "100px 0",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="glow-blob" style={{
        width: 450, height: 450,
        background: "rgba(59,130,246,0.07)",
        top: "10%", left: "-10%",
      }} />

      <div className="section-wrapper" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }} className="about-grid">

          {/* ── Left: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: "relative" }}
          >
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              height: "480px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}>
              <img
                src="/images/desk_workspace.png"
                alt="About GoAmaze — curated workspace"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 60%)",
              }} />
            </div>

            {/* Floating card */}
            <motion.div
              className="glass-card"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: "-20px", right: "-20px",
                padding: "20px 24px",
                minWidth: "180px",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>🏆</div>
              <div style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem", fontWeight: 700,
                color: "var(--text-primary)",
              }}>Trusted Curation</div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem", color: "var(--text-muted)",
                marginTop: "4px",
              }}>Every pick is researched</div>
            </motion.div>
          </motion.div>

          {/* ── Right: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="section-label">✦ Our Story</span>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "24px",
              marginTop: "8px",
            }}>
              Quiet Luxury In{" "}
              <span className="gradient-text">Digital Form</span>
            </h2>

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.9,
              marginBottom: "20px",
            }}>
              GoAmaze was born from one simple frustration — too many choices,
              not enough clarity. We believe great products shouldn't be buried
              under infinite scroll and noisy ads.
            </p>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.9,
              marginBottom: "40px",
            }}>
              Our team researches, reviews, and hand-selects the very best in
              each category — so you can shop with intention, confidence, and
              a quiet sense of discovery. No stock, no fuss. Just beautifully
              curated, trustworthy finds — all available on Amazon.
            </p>

            {/* Stats grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              {stats.map(({ value, label, icon }) => (
                <div
                  key={label}
                  style={{
                    padding: "20px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ fontSize: "20px", marginBottom: "8px" }}>{icon}</div>
                  <div style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>{value}</div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
