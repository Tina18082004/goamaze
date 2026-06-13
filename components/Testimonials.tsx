"use client";

import { motion } from "framer-motion";

const communityCards = [
  {
    icon: "🛋️",
    label: "People love this for living rooms",
    desc: "Our linen throw and coaster picks are frequently added to wishlists together — a calm, curated combo for any space.",
    tag: "Home Decor",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.20)",
  },
  {
    icon: "☕",
    label: "Popular pick for morning rituals",
    desc: "The ceramic pour-over set is one of our most-clicked kitchen picks — simple, beautiful, and worth every rupee.",
    tag: "Kitchen",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.20)",
  },
  {
    icon: "📖",
    label: "Trending in study setups",
    desc: "Our desk lamp and reading journal are editor favourites — every focused work session deserves the right tools.",
    tag: "Books & Study",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.20)",
  },
];

const missions = [
  { icon: "✦", text: "No fake reviews. No inflated numbers." },
  { icon: "✦", text: "Every pick is researched and chosen by our editors." },
  { icon: "✦", text: "We are early — and growing with you." },
];

export default function Testimonials() {
  return (
    <section
      style={{
        padding: "100px 0",
        background: "linear-gradient(180deg, #111827 0%, var(--bg-primary) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="glow-blob" style={{
        width: 500, height: 500,
        background: "rgba(99,102,241,0.06)",
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
          <span className="section-label">✦ Why People Pick GoAmaze</span>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}>
            Community{" "}
            <span className="gradient-text">Favourites</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            maxWidth: "440px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            Not fake stars. Not inflated numbers. Just honest picks our editors believe in — and early users are discovering.
          </p>
        </motion.div>

        {/* Community Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "64px",
        }}>
          {communityCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              style={{
                padding: "32px 28px",
                borderRadius: "20px",
                background: card.bg,
                border: `1px solid ${card.border}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "16px" }}>{card.icon}</div>

              <div style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "12px",
                lineHeight: 1.4,
              }}>{card.label}</div>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                color: "var(--text-secondary)",
                lineHeight: 1.85,
                marginBottom: "20px",
              }}>
                {card.desc}
              </p>

              <div style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "99px",
                background: `${card.color}22`,
                border: `1px solid ${card.color}44`,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: card.color,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.05em",
              }}>{card.tag}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(139,92,246,0.18)",
            borderRadius: "24px",
            padding: "40px 48px",
            textAlign: "center",
          }}
        >
          <div style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            borderRadius: "99px",
            padding: "6px 18px",
            marginBottom: "20px",
          }}>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.06em",
            }}>🌱 EARLY ACCESS · COMMUNITY GROWING</span>
          </div>

          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.2rem, 3vw, 1.7rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "28px",
          }}>
            We&apos;re just getting started.
          </h3>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
          }}>
            {missions.map((m) => (
              <div
                key={m.text}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#8B5CF6", fontWeight: 700 }}>{m.icon}</span>
                {m.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
