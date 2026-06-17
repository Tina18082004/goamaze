"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import ProductCard from "./ProductCard";
import productsJsonFallback from "@/data/products.json";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
 
  // MongoDB documents use _id; the static JSON uses id (number)
  _id?:          string;
  id:            number;
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

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "School Bags",
  "Tiffin Bags",
  "Rain Coats",
  "Umbrellas",
  "Tiffin Boxes",
  "Water Bottles"
];

// Typed JSON fallback
const FALLBACK_PRODUCTS: Product[] = productsJsonFallback as Product[];

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius:    "20px",
        overflow:        "hidden",
        background:      "linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)",
        border:          "1px solid rgba(255,255,255,0.07)",
        backdropFilter:  "blur(12px)",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          height:     "220px",
          background: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)",
          backgroundSize: "200% 100%",
          animation:  "shimmer 1.6s infinite",
        }}
      />
      {/* Content placeholders */}
      <div style={{ padding: "20px" }}>
        {[80, 60, 40, 90].map((w, i) => (
          <div
            key={i}
            style={{
              height:        "12px",
              width:         `${w}%`,
              borderRadius:  "6px",
              background:    "rgba(255,255,255,0.06)",
              marginBottom:  "12px",
              animation:     "shimmer 1.6s infinite",
              animationDelay:`${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductGrid() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const [active,      setActive]      = useState("All");
  const [search,      setSearch]      = useState("");
  const [debouncedQ,  setDebouncedQ]  = useState("");

  // Voice search state
  const [listening,   setListening]   = useState(false);
  const [voiceError,  setVoiceError]  = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Debounce search input (300 ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch products from MongoDB API ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "100" });
        if (debouncedQ)           params.set("search",   debouncedQ);
        if (active !== "All")     params.set("category", active);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error(`API ${res.status}`);

        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data)) {
          // If the database is connected but completely empty (unseeded), trigger the fallback JSON
          if (json.data.length === 0) {
            console.warn("[ProductGrid] MongoDB connected but no products found. Using fallback.");
            setProducts(FALLBACK_PRODUCTS);
            setUsingFallback(true);
          } else {
            setProducts(json.data);
            setUsingFallback(false);
          }
        }
      } catch (err) {
        console.warn("[ProductGrid] MongoDB fetch failed, using products.json fallback:", err);
        if (!cancelled) {
          setProducts(FALLBACK_PRODUCTS);
          setUsingFallback(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [debouncedQ, active]);

  // ── Client-side filter (only used for the fallback JSON path) ──────────────
  const filtered = usingFallback
    ? products.filter(p => {
        const catMatch = active === "All" || p.category === active;
        if (!debouncedQ.trim()) return catMatch;
        // Split query into words and match ANY word for broader fuzzy results
        const words = debouncedQ.toLowerCase().split(/\s+/).filter(Boolean);
        const haystack = [p.title, p.subtitle, p.category, p.badge, p.price]
          .join(" ").toLowerCase();
        const anyWordMatch = words.some(w => haystack.includes(w));
        return catMatch && anyWordMatch;
      })
    : products;   // API already filtered

  // Suggestions for empty search state — fuzzy across ALL products (ignore category filter)
  const allSource = usingFallback ? FALLBACK_PRODUCTS : products;
  const suggestions = debouncedQ.trim()
    ? (() => {
        const words = debouncedQ.toLowerCase().split(/\s+/).filter(Boolean);
        return allSource
          .filter(p => {
            const haystack = [p.title, p.subtitle, p.category, p.badge].join(" ").toLowerCase();
            return words.some(w => haystack.includes(w));
          })
          .slice(0, 6);
      })()
    : allSource.slice(0, 6);

  // ── Web Speech API voice search ────────────────────────────────────────────
  const startListening = useCallback(() => {
    setVoiceError("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice search is not supported in this browser. Try Chrome.");
      return;
    }

    // Reuse instance or create a new one
    if (!recognitionRef.current) {
      const rec = new SpeechRecognition();
      rec.lang           = "en-IN";   // Indian English; gracefully falls back to en-US
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous     = false;

      rec.onstart  = () => setListening(true);
      rec.onend    = () => setListening(false);
     rec.onerror = (e: any) => {
        setListening(false);
        if (e.error === "not-allowed") {
          setVoiceError("Microphone access denied. Allow mic in browser settings.");
        } else if (e.error === "no-speech") {
          setVoiceError("No speech detected. Please try again.");
        } else {
          setVoiceError(`Voice error: ${e.error}`);
        }
      };

      rec.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = Array.from(e.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setSearch(transcript);
      };

      recognitionRef.current = rec;
    }

    recognitionRef.current.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="products"
      style={{
        padding:    "100px 0 120px",
        background: "linear-gradient(180deg, var(--bg-primary) 0%, #111827 100%)",
        position:   "relative",
        overflow:   "hidden",
      }}
    >
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse-mic {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
      `}</style>

      {/* Decorative blob */}
      <div className="glow-blob" style={{
        width: 500, height: 500,
        background: "rgba(59,130,246,0.06)",
        bottom: 0, left: "10%",
      }} />

      <div className="section-wrapper" style={{ position: "relative", zIndex: 1 }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "52px" }}
        >
          <span className="section-label">✦ School Essentials</span>

<h2
  style={{
    fontFamily: "var(--font-montserrat)",
    fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
    fontWeight: 800,
    color: "var(--text-primary)",
    marginBottom: "14px",
  }}
>
  School <span className="gradient-text">Essentials</span>
</h2>

<p
  style={{
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    color: "var(--text-muted)",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: 1.8,
  }}
>
  Discover curated school bags, tiffin bags, rain coats, umbrellas,
  tiffin boxes and water bottles selected for students and everyday
  school needs.
</p>

          {/* Fallback badge */}
          <AnimatePresence>
            {usingFallback && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            "6px",
                  marginTop:      "14px",
                  padding:        "5px 14px",
                  borderRadius:   "99px",
                  background:     "rgba(245,158,11,0.1)",
                  border:         "1px solid rgba(245,158,11,0.3)",
                  color:          "#FCD34D",
                  fontSize:       "0.73rem",
                  fontWeight:     600,
                  fontFamily:     "var(--font-body)",
                }}
              >
                ⚡ Showing offline catalogue — connect MongoDB Atlas to see live data
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Search Bar + Voice Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ position: "relative", maxWidth: "540px", margin: "0 auto 12px" }}
        >
          {/* Search icon */}
          <HiSearch style={{
            position:  "absolute",
            left:      "18px",
            top:       "50%",
            transform: "translateY(-50%)",
            color:     listening ? "#EF4444" : "var(--text-muted)",
            fontSize:  "18px",
            transition:"color 0.3s",
            zIndex:    2,
          }} />

          {/* Text input */}
          <input
            type="text"
            placeholder={listening ? "Listening… speak now" : "Search products..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width:          "100%",
              padding:        "14px 56px 14px 48px",
              borderRadius:   "99px",
              background:     listening
                ? "rgba(239,68,68,0.06)"
                : "rgba(255,255,255,0.05)",
              border:         listening
                ? "1px solid rgba(239,68,68,0.4)"
                : "1px solid rgba(255,255,255,0.10)",
              color:          "var(--text-primary)",
              fontFamily:     "var(--font-body)",
              fontSize:       "0.9rem",
              outline:        "none",
              backdropFilter: "blur(12px)",
              transition:     "all 0.3s ease",
              boxSizing:      "border-box",
            }}
            onFocus={e => {
              if (!listening) {
                e.target.style.borderColor = "rgba(139,92,246,0.5)";
                e.target.style.boxShadow   = "0 0 20px rgba(139,92,246,0.12)";
              }
            }}
            onBlur={e => {
              if (!listening) {
                e.target.style.borderColor = "rgba(255,255,255,0.10)";
                e.target.style.boxShadow   = "none";
              }
            }}
          />

          {/* Mic button */}
          <button
            onClick={listening ? stopListening : startListening}
            title={listening ? "Stop listening" : "Search by voice"}
            style={{
              position:     "absolute",
              right:        "10px",
              top:          "50%",
              transform:    "translateY(-50%)",
              width:        "36px",
              height:       "36px",
              borderRadius: "50%",
              border:       "none",
              background:   listening
                ? "rgba(239,68,68,0.85)"
                : "rgba(139,92,246,0.18)",
              cursor:       "pointer",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontSize:     "16px",
              transition:   "all 0.25s ease",
              animation:    listening ? "pulse-mic 1.2s infinite" : "none",
              zIndex:       2,
            }}
            onMouseEnter={e => {
              if (!listening) (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.32)";
            }}
            onMouseLeave={e => {
              if (!listening) (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.18)";
            }}
          >
            {listening ? "⏹" : "🎤"}
          </button>
        </motion.div>

        {/* Voice error */}
        <AnimatePresence>
          {voiceError && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign:  "center",
                fontSize:   "0.78rem",
                color:      "#FCA5A5",
                marginBottom:"20px",
                fontFamily: "var(--font-body)",
              }}
            >
              ⚠️ {voiceError}
            </motion.p>
          )}
        </AnimatePresence>

        {!voiceError && <div style={{ marginBottom: "24px" }} />}

        {/* ── Category Filter Tabs ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display:        "flex",
            gap:            "10px",
            flexWrap:       "wrap",
            justifyContent: "center",
            marginBottom:   "56px",
          }}
        >
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding:    "9px 22px",
                borderRadius:"99px",
                fontFamily: "var(--font-body)",
                fontSize:   "0.83rem",
                fontWeight:  600,
                cursor:     "pointer",
                transition: "all 0.25s ease",
                ...(active === cat
                  ? {
                      background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                      color:      "white",
                      border:     "1px solid transparent",
                      boxShadow:  "0 6px 20px rgba(99,102,241,0.35)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color:      "var(--text-muted)",
                      border:     "1px solid rgba(255,255,255,0.09)",
                    }),
              }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Product Grid / Skeleton / Empty state ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display:               "grid",
                gridTemplateColumns:   "repeat(auto-fill, minmax(280px, 1fr))",
                gap:                   "24px",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={active + debouncedQ}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap:                 "24px",
              }}
            >
              {filtered.length === 0 ? (
                <div style={{
                  gridColumn:  "1 / -1",
                  textAlign:   "center",
                  padding:     "60px 20px 20px",
                  color:       "var(--text-muted)",
                  fontFamily:  "var(--font-body)",
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
                  <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                    No exact match for <strong style={{ color: "var(--text-primary)" }}>&ldquo;{debouncedQ}&rdquo;</strong>
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "36px" }}>
                    Try searching: desk, candle, kitchen, lamp, blanket…
                  </p>
                  <div style={{
                    display:      "inline-block",
                    padding:      "6px 16px",
                    background:   "rgba(139,92,246,0.12)",
                    border:       "1px solid rgba(139,92,246,0.25)",
                    borderRadius: "99px",
                    fontSize:     "0.78rem",
                    color:        "#A78BFA",
                    fontWeight:   600,
                    marginBottom: "32px",
                  }}>✦ You might like these instead</div>
                  <div style={{
                    display:             "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap:                 "24px",
                    textAlign:           "left",
                  }}>
                    {suggestions.map((product, i) => (
                      <motion.div
                        key={product._id ?? product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                      >
                        <ProductCard {...product}  />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                filtered.map((product, i) => (
                  <motion.div
                    key={product._id ?? product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.45 }}
                  >
                    <ProductCard {...product}  />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            textAlign:  "center",
            marginTop:  "60px",
            fontFamily: "var(--font-body)",
            fontSize:   "0.8rem",
            color:      "var(--text-muted)",
          }}
        >
          * Links are affiliate links. Clicking and purchasing earns GoAmaze a small commission — at no extra cost to you.
        </motion.p>
      </div>
    </section>
  );
}
