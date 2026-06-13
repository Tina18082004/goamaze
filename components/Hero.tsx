"use client";

import { motion } from "framer-motion";
import { HiArrowRight, HiSparkles } from "react-icons/hi";

const heroImages = [
  {
    src: "/images/desk_workspace.png",
    alt: "Minimal desk workspace",
    height: "260px",
    top: "0", left: "0",
    floatDir: -8,
  },
  {
    src: "/images/living_room.png",
    alt: "Elegant living room",
    height: "200px",
    top: "0", left: "calc(50% + 8px)",
    floatDir: 8,
  },
  {
    src: "/images/cozy_reading.png",
    alt: "Cozy reading setup",
    height: "230px",
    top: "276px", left: "0",
    floatDir: 8,
  },
  {
    src: "/images/modern_kitchen.png",
    alt: "Modern kitchen essentials",
    height: "220px",
    top: "216px", left: "calc(50% + 8px)",
    floatDir: -8,
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
    },
  },
};


export default function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        paddingTop: "96px",
        paddingBottom: "80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background Blobs ── */}
      <div className="glow-blob" style={{
        width: 600, height: 600,
        background: "rgba(59,130,246,0.12)",
        top: "-200px", left: "-200px",
      }} />
      <div className="glow-blob" style={{
        width: 500, height: 500,
        background: "rgba(139,92,246,0.10)",
        bottom: "-150px", right: "-100px",
      }} />

      <div className="section-wrapper" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }} className="hero-grid">

          {/* ── LEFT: Content ── */}
          <div>
            <motion.div
               variants={fadeUp} initial="hidden" animate="visible"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "28px" }}
            >
              <span className="section-label">
                <HiSparkles style={{ color: "#C4B5FD" }} />
                Thoughtfully Curated Collections
              </span>
            </motion.div>

            <motion.h1
               variants={fadeUp} initial="hidden" animate="visible"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                color: "var(--text-primary)",
                marginBottom: "24px",
              }}
            >
              Beautifully Curated.
              <br />
              <span className="gradient-text">Effortlessly</span>
              <br />
              Discovered.
            </motion.h1>

            <motion.p
              variants={fadeUp} initial="hidden" animate="visible"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                marginBottom: "40px",
                maxWidth: "460px",
              }}
            >
              Handpicked essentials for modern living — from serene home spaces
              to inspired workspaces. Every pick, purposefully chosen for you.
            </motion.p>

            <motion.div
               variants={fadeUp} initial="hidden" animate="visible"
              style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
            >
              <motion.a
                href="#products"
                className="btn-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Collections
                <HiArrowRight style={{ marginLeft: 4 }} />
              </motion.a>
              <motion.a
                href="#inspiration"
                className="btn-ghost"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                View Inspiration
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
               variants={fadeUp} initial="hidden" animate="visible"
              style={{
                display: "flex", gap: "32px", marginTop: "52px",
                paddingTop: "40px",
                borderTop: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                { num: "100+", label: "Products Curated" },
                { num: "5",    label: "Categories"       },
                { num: "🌱",   label: "Growing Community" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "1.8rem", fontWeight: 800,
                    background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>{num}</div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Pinterest Collage ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1,  x: 0  }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            style={{ position: "relative", height: "520px" }}
            className="hero-collage"
          >
            {heroImages.map((img, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, img.floatDir, 0] }}
                transition={{
                  duration: 3.5 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                style={{
                  position: "absolute",
                  width: "calc(50% - 8px)",
                  height: img.height,
                  top: img.top, left: img.left,
                  zIndex: 2,
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    display: "block",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(15,23,42,0.3) 0%, transparent 60%)",
                }} />
              </motion.div>
            ))}

            {/* Floating "Editor's Pick" card */}
            <motion.div
              className="glass-card glow-pulse"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: "16px", left: "-24px",
                padding: "16px 20px",
                zIndex: 20,
                minWidth: "170px",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>🏡</div>
              <div style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.95rem", fontWeight: 700,
                color: "var(--text-primary)",
              }}>Editor&apos;s Pick</div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem", color: "var(--text-muted)",
                marginTop: "2px",
              }}>Curated this week</div>
            </motion.div>

            {/* Floating "Trending" badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                position: "absolute",
                top: "16px", right: "-16px",
                background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                borderRadius: "99px",
                padding: "8px 18px",
                zIndex: 20,
                boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
              }}
            >
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem", fontWeight: 700, color: "white",
              }}>🔥 Trending Now</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid    { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-collage { height: 380px !important; }
        }
        @media (max-width: 520px) {
          .hero-collage { height: 300px !important; }
        }
      `}</style>
    </section>
  );
}