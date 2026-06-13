"use client";

import { motion } from "framer-motion";

const galleryImages = [
  {
    src: "/images/living_room.png",
    alt: "Elegant living room",
    label: "Calm Interiors",
    span: 2,
    height: "320px",
  },
  {
    src: "/images/cozy_reading.png",
    alt: "Cozy reading nook",
    label: "Cosy Reading Nooks",
    span: 1,
    height: "320px",
  },
  {
    src: "/images/desk_workspace.png",
    alt: "Minimal desk workspace",
    label: "Focused Workspaces",
    span: 1,
    height: "280px",
  },
  {
    src: "/images/boho_kitchen.png",
    alt: "Boho kitchen",
    label: "Kitchen Rituals",
    span: 1,
    height: "280px",
  },
  {
    src: "/images/modern_kitchen.png",
    alt: "Modern kitchen with greens",
    label: "Fresh Cooking Spaces",
    span: 1,
    height: "280px",
  },
];

export default function InspirationGallery() {
  return (
    <section
      id="inspiration"
      style={{
        padding: "100px 0",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="glow-blob" style={{
        width: 400, height: 400,
        background: "rgba(139,92,246,0.07)",
        top: "20%", right: "-10%",
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
          <span className="section-label">✦ Visual Inspiration</span>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}>
            A World of{" "}
            <span className="gradient-text">Aesthetic Spaces</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            maxWidth: "440px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            Let the imagery speak. Timeless spaces, curated moments,
            and quiet luxury in every frame.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }} className="gallery-grid">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              style={{
                gridColumn: img.span === 2 ? "span 2" : "span 1",
                height: img.height,
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              {/* Overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.1) 60%)",
                transition: "opacity 0.3s ease",
              }} />
              {/* Label */}
              <div style={{
                position: "absolute",
                bottom: "20px", left: "20px",
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "white",
              }}>{img.label}</div>
              {/* Pin icon */}
              <div style={{
                position: "absolute",
                top: "16px", right: "16px",
                width: "36px", height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px",
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
                className="pin-btn"
              >📌</div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .gallery-grid > div[style*="span 2"] { grid-column: span 2 !important; }
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
          .gallery-grid > div[style*="span 2"] { grid-column: span 1 !important; }
        }
        .gallery-grid > div:hover .pin-btn { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
