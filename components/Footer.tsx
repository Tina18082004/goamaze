"use client";

import { motion } from "framer-motion";
import {
  FaInstagram,
  FaYoutube,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";

const footerLinks = {
  Discover: ["Home Decor", "Lifestyle", "Kitchen", "Study Essentials", "Entertainment"],
  Company: ["About Us", "How It Works", "Affiliate Disclosure", "Privacy Policy"],
  Support: ["FAQ", "Contact Us", "Suggest a Product", "Report an Issue"],
};

const socials = [
  { icon: <FaInstagram size={18} />, href: "#", label: "Instagram" },
  { icon: <FaYoutube size={18} />, href: "#", label: "YouTube" },
  { icon: <FaPinterest size={18} />, href: "#", label: "Pinterest" },
  { icon: <FaTwitter size={18} />, href: "#", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#070D1A",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "80px",
      }}
    >
      <div className="section-wrapper">

        {/* TOP SECTION */}
        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: "48px",
          paddingBottom: "64px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>

          {/* Brand */}
          <div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <h2 style={{ color: "white" }}>GoAmaze</h2>
            </motion.div>

            <p style={{ color: "#64748B", fontSize: "0.875rem" }}>
              Thoughtfully curated essentials for modern living.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  style={{
                    color: "#64748B",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: "#94A3B8" }}>{title}</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ color: "#64748B", textDecoration: "none" }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 0",
          color: "#475569",
          fontSize: "0.75rem",
        }}>
          <p>© 2026 GoAmaze</p>
          <div style={{ display: "flex", gap: "15px" }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}