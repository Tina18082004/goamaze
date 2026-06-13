"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section
      id="contact"
      style={{
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* Full-width gradient bg card */}
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            borderRadius: "32px",
            padding: "80px 48px",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.18) 50%, rgba(99,102,241,0.12) 100%)",
            border: "1px solid rgba(139,92,246,0.25)",
            textAlign: "center",
          }}
        >
          {/* Decorative blobs inside */}
          <div className="glow-blob" style={{
            width: 300, height: 300,
            background: "rgba(59,130,246,0.15)",
            top: "-100px", right: "-50px",
          }} />
          <div className="glow-blob" style={{
            width: 250, height: 250,
            background: "rgba(139,92,246,0.12)",
            bottom: "-80px", left: "-40px",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="section-label" style={{ margin: "0 auto 24px" }}>
              ✦ Stay In The Know
            </span>

            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}>
              Discover New Picks{" "}
              <span className="gradient-text">Before Anyone Else</span>
            </h2>

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--text-secondary)",
              maxWidth: "460px",
              margin: "0 auto 44px",
              lineHeight: 1.8,
            }}>
              Join 50,000+ modern curators who receive our thoughtfully
              selected finds — seasonal picks, exclusive drops, and calm
              editorial content. No spam, ever.
            </p>

            {/* Form */}
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  gap: "12px",
                  maxWidth: "480px",
                  margin: "0 auto",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    padding: "14px 20px",
                    borderRadius: "99px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
                />
                <motion.button
                  type="submit"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: "14px 28px" }}
                >
                  Subscribe
                  <HiArrowRight />
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: "20px 32px",
                  borderRadius: "99px",
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#34D399",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  display: "inline-block",
                  fontSize: "0.95rem",
                }}
              >
                🎉 You&apos;re in! Welcome to the GoAmaze circle.
              </motion.div>
            )}

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: "20px",
            }}>
              Unsubscribe any time. We respect your inbox.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
