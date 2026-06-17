"use client";

import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi";

const testimonials = [
  {
    icon: "🏡",
    iconBg: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
    stars: 5,
    tag: "Home Decor · Popular Pick",
    text: "People are loving the Linen Throw Blanket — soft, minimal, and exactly what a calm evening needs. It pairs beautifully with the Marble Coaster Set from our Home Decor collection.",
    label: "Customer Favourite",
    labelColor: "#A78BFA",
    labelBg: "rgba(139,92,246,0.12)",
  },
  {
    icon: "🍳",
    iconBg: "linear-gradient(135deg,#F59E0B,#EF4444)",
    stars: 5,
    tag: "Kitchen · Trending This Week",
    text: "Our Cast Iron Skillet and Copper Cookware Set are trending picks this season. Designed for kitchens that are as beautiful as they are functional — and Amazon-backed for quality.",
    label: "Trending Now",
    labelColor: "#FCD34D",
    labelBg: "rgba(245,158,11,0.12)",
  },
  {
    icon: "📖",
    iconBg: "linear-gradient(135deg,#10B981,#3B82F6)",
    stars: 5,
    tag: "Books & Study · Editor's Choice",
    text: "The Architect LED Desk Lamp + Bamboo Organiser combo is our most-saved study setup. Minimalist, functional, and everything your workspace needs to feel intentional.",
    label: "Editor's Choice",
    labelColor: "#34D399",
    labelBg: "rgba(16,185,129,0.12)",
  },
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
          <span className="section-label">✦ Community Favourites</span>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}>
            What People Are{" "}
            <span className="gradient-text">Loving Right Now</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            maxWidth: "440px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            Our most saved, clicked, and talked-about picks — curated from
            real Amazon ratings and community interest.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className="glass-card"
              style={{ padding: "32px 28px" }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                {Array.from({ length: t.stars }).map((_, s) => (
                  <HiStar key={s} size={16} style={{ color: "#FBBF24" }} />
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: 1.85,
                marginBottom: "28px",
              }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Footer row */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "44px", height: "44px",
                  borderRadius: "50%",
                  background: t.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem",
                  flexShrink: 0,
                }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem", color: "var(--text-muted)",
                  }}>{t.tag}</div>
                </div>
                <div style={{
                  padding: "4px 12px",
                  borderRadius: "99px",
                  background: t.labelBg,
                  border: `1px solid ${t.labelColor}44`,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: t.labelColor,
                  fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                }}>{t.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Honest startup note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center",
            marginTop: "48px",
            padding: "16px 24px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            maxWidth: "560px",
            margin: "48px auto 0",
          }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
          }}>
            🌱 GoAmaze is <strong style={{ color: "#C4B5FD" }}>early access</strong> — our community is growing.
            Product highlights are based on Amazon ratings and curated editorial picks, not fabricated reviews.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
