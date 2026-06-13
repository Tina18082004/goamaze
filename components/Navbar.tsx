"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navLinks = [
  { label: "Home",        href: "#home" },
  { label: "Discover",    href: "#collections" },
  { label: "Collections", href: "#products" },
  { label: "Inspiration", href: "#inspiration" },
  { label: "About",       href: "#about" },
  { label: "Contact",     href: "#contact" },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.4s ease",
          background: scrolled
            ? "rgba(15, 23, 42, 0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "none",
          boxShadow: scrolled
            ? "0 4px 30px rgba(0,0,0,0.3)"
            : "none",
        }}
      >
        {/* ── Logo ── */}
        <motion.a
          href="#home"
          whileHover={{ scale: 1.04 }}
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div style={{
            width: 32, height: 32,
            borderRadius: "10px",
            background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "white",
            fontFamily: "var(--font-montserrat)",
            boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
          }}>G</div>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "1.35rem",
            fontWeight: 800,
            background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>GoAmaze</span>
        </motion.a>

        {/* ── Desktop Nav Links ── */}
        <ul style={{
          display: "flex", gap: "8px", listStyle: "none",
          alignItems: "center",
        }} className="hidden-mobile">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={() => setActiveLink(label)}
                style={{
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "99px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  color: activeLink === label ? "#C4B5FD" : "#94A3B8",
                  background: activeLink === label
                    ? "rgba(139,92,246,0.12)"
                    : "transparent",
                  border: activeLink === label
                    ? "1px solid rgba(139,92,246,0.25)"
                    : "1px solid transparent",
                  transition: "all 0.25s ease",
                  display: "block",
                }}
                onMouseEnter={e => {
                  if (activeLink !== label) {
                    (e.target as HTMLElement).style.color = "#E2E8F0";
                    (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={e => {
                  if (activeLink !== label) {
                    (e.target as HTMLElement).style.color = "#94A3B8";
                    (e.target as HTMLElement).style.background = "transparent";
                  }
                }}
              >{label}</a>
            </li>
          ))}
        </ul>

        {/* ── CTA Button ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary hidden-mobile"
            style={{ padding: "10px 24px", fontSize: "0.85rem" }}
          >
            ✦ Explore Now
          </motion.a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              borderRadius: "10px",
              padding: "8px",
              cursor: "pointer",
              display: "flex", alignItems: "center",
            }}
          >
            {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1,  y: 0 }}
            exit={{   opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: "72px",
              left: 0, right: 0,
              zIndex: 99,
              background: "rgba(15,23,42,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              padding: "20px 24px 28px",
            }}
          >
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => { setActiveLink(label); setMenuOpen(false); }}
                    style={{
                      display: "block",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      color: activeLink === label ? "#C4B5FD" : "#94A3B8",
                      background: activeLink === label ? "rgba(139,92,246,0.1)" : "transparent",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                    }}
                  >{label}</a>
                </li>
              ))}
            </ul>
            <a href="#products" className="btn-primary" style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
              ✦ Explore Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Inline Mobile CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile   { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}