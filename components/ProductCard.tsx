"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HiStar, HiExternalLink } from "react-icons/hi";

type Product = {
  // Accepts both MongoDB _id (string) and static JSON id (number)
  id?:           number;
  _id?:          string;
  title:         string;
  subtitle:      string;
  price:         string;
  originalPrice: string;
  rating:        number;
  reviews:       number;
  image:         string;
  affiliateLink: string;
  category:      string;
  badge:         string;
};

const badgeColors: Record<string, { bg: string; color: string }> = {
  "Trending":           { bg: "rgba(59,130,246,0.18)",  color: "#60A5FA" },
  "Trending Now":       { bg: "rgba(59,130,246,0.18)",  color: "#60A5FA" },
  "Editor's Pick":      { bg: "rgba(139,92,246,0.18)",  color: "#A78BFA" },
  "Editor's Choice":    { bg: "rgba(139,92,246,0.18)",  color: "#A78BFA" },
  "Best Seller":        { bg: "rgba(245,158,11,0.18)",  color: "#FCD34D" },
  "Customer Favourite": { bg: "rgba(245,158,11,0.18)",  color: "#FCD34D" },
  "Popular Pick":       { bg: "rgba(99,102,241,0.18)",  color: "#818CF8" },
  "People Love This":   { bg: "rgba(236,72,153,0.18)",  color: "#F9A8D4" },
  "Monsoon Essential":  { bg: "rgba(16,185,129,0.18)",  color: "#34D399" },
  "Focus Essential":    { bg: "rgba(99,102,241,0.18)",  color: "#818CF8" },
  "Eco Pick":           { bg: "rgba(16,185,129,0.18)",  color: "#34D399" },
  "Calming Pick":       { bg: "rgba(139,92,246,0.18)",  color: "#C4B5FD" },
  "Must Have":          { bg: "rgba(236,72,153,0.18)",  color: "#F9A8D4" },
  "Fresh Pick":         { bg: "rgba(16,185,129,0.18)",  color: "#34D399" },
  "New Arrival":        { bg: "rgba(234,179,8,0.18)",   color: "#FDE047" },
};

/**
 * Determine whether a URL can be handled by next/image.
 * next/image requires either a relative path (starts with "/") or an absolute
 * URL from a configured remote pattern (unsplash, cloudinary).
 * All other external URLs (e.g. bare http links not in next.config) fall back
 * to a plain <img> to avoid runtime errors.
 */
function isOptimisableImage(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/"))                      return true;  // local public/
  if (src.includes("res.cloudinary.com"))       return true;  // Cloudinary CDN
  if (src.includes("images.unsplash.com"))      return true;  // Unsplash
  return false;
}

export default function ProductCard({
  title, subtitle, price, originalPrice,
  rating, reviews, image, affiliateLink, badge,
}: Product) {
  const badge_style = badgeColors[badge] ?? { bg: "rgba(255,255,255,0.1)", color: "#CBD5E1" };
  const useNextImage = isOptimisableImage(image);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        borderRadius:   "20px",
        overflow:       "hidden",
        background:     "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)",
        border:         "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(12px)",
        boxShadow:      "0 8px 32px rgba(0,0,0,0.35)",
        transition:     "border-color 0.3s ease, box-shadow 0.3s ease",
        cursor:         "pointer",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.35)";
        (e.currentTarget as HTMLElement).style.boxShadow  = "0 16px 48px rgba(0,0,0,0.45), 0 0 30px rgba(139,92,246,0.12)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
        (e.currentTarget as HTMLElement).style.boxShadow  = "0 8px 32px rgba(0,0,0,0.35)";
      }}
    >
      {/* Image Container */}
      <div style={{ position: "relative", overflow: "hidden", height: "220px" }}>

        {useNextImage ? (
          /* next/image — auto-optimised, lazy-loaded, Cloudinary/Unsplash/local */
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              objectFit:  "cover",
              transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
            onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
        ) : (
          /* Plain <img> for external URLs not in remotePatterns */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            style={{
              width:      "100%",
              height:     "100%",
              objectFit:  "cover",
              transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
            onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
        )}

        {/* Gradient overlay */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          position:       "absolute",
          top:            "14px",
          left:           "14px",
          padding:        "5px 12px",
          borderRadius:   "99px",
          background:     badge_style.bg,
          border:         `1px solid ${badge_style.color}44`,
          backdropFilter: "blur(8px)",
          fontSize:       "0.7rem",
          fontWeight:     700,
          color:          badge_style.color,
          fontFamily:     "var(--font-body)",
          letterSpacing:  "0.04em",
        }}>{badge}</div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 22px" }}>

        <h3 style={{
          fontFamily:   "var(--font-montserrat)",
          fontSize:     "0.98rem",
          fontWeight:   700,
          color:        "var(--text-primary)",
          marginBottom: "6px",
          lineHeight:   1.3,
        }}>{title}</h3>

        <p style={{
          fontFamily:   "var(--font-body)",
          fontSize:     "0.78rem",
          color:        "var(--text-muted)",
          marginBottom: "14px",
          lineHeight:   1.6,
        }}>{subtitle}</p>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <HiStar
                key={s}
                size={13}
                style={{ color: s <= Math.round(rating) ? "#FBBF24" : "#334155" }}
              />
            ))}
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#FBBF24", fontWeight: 600 }}>
            {rating}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
            {reviews} early reviews
          </span>
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{
              fontFamily: "var(--font-montserrat)",
              fontSize:   "1.2rem",
              fontWeight:  800,
              color:      "var(--text-primary)",
            }}>{price}</div>
            <div style={{
              fontFamily:     "var(--font-body)",
              fontSize:       "0.75rem",
              color:          "var(--text-muted)",
              textDecoration: "line-through",
              marginTop:      "1px",
            }}>{originalPrice}</div>
          </div>

          {/* CTA */}
          <motion.a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            style={{ padding: "9px 18px", fontSize: "0.78rem", gap: "5px" }}
          >
            View on Amazon
            <HiExternalLink size={13} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}