"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";

const faqs = [
  {
    q: "How does GoAmaze work?",
    a: "GoAmaze curates the best products in selected categories and lists them on our site. When you click a product and buy it on Amazon, we earn a small affiliate commission — at zero extra cost to you. You get expert-picked recommendations; we get a tiny thank-you from Amazon.",
  },
  {
    q: "Are these products genuine Amazon listings?",
    a: "Yes. Every product links directly to Amazon India. We never sell anything ourselves. You purchase securely through Amazon's own platform with all their buyer protections.",
  },
  {
    q: "Do I pay more because of the affiliate link?",
    a: "Absolutely not. The price you see on Amazon is identical whether you use our link or search directly. Our commission comes from Amazon's seller fee — not from you.",
  },
  {
    q: "How are products selected for GoAmaze?",
    a: "Our team manually researches each category, reads thousands of reviews, compares specs and value, and handpicks only items we'd confidently recommend to a friend. We update picks regularly to keep them fresh and relevant.",
  },
  {
    q: "Can I suggest a product or category?",
    a: "We love hearing from our community! Use the Contact section below to drop us a message. Great suggestions often make their way into our next curated list.",
  },
  {
    q: "How often are the collections updated?",
    a: "Collections are reviewed every month or when a significant new product launches. Seasonal picks (like Monsoon Essentials) are updated ahead of every season so you always get timely recommendations.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        padding: "100px 0",
        background: "linear-gradient(180deg, var(--bg-primary) 0%, #0B1120 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="glow-blob" style={{
        width: 400, height: 400,
        background: "rgba(139,92,246,0.06)",
        bottom: "5%", right: "5%",
      }} />

      <div className="section-wrapper" style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <span className="section-label">✦ Frequently Asked</span>
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}>
            Questions,{" "}
            <span className="gradient-text">Answered</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
          }}>
            Everything you need to know about GoAmaze and how affiliate curation works.
          </p>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              style={{
                borderRadius: "16px",
                border: open === i
                  ? "1px solid rgba(139,92,246,0.35)"
                  : "1px solid rgba(255,255,255,0.08)",
                background: open === i
                  ? "rgba(139,92,246,0.07)"
                  : "rgba(255,255,255,0.03)",
                overflow: "hidden",
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
            >
              {/* Question row */}
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "22px 24px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "16px",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.97rem",
                  fontWeight: 600,
                  color: open === i ? "#C4B5FD" : "var(--text-primary)",
                  transition: "color 0.3s ease",
                }}>{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flexShrink: 0 }}
                >
                  <HiChevronDown
                    size={20}
                    style={{ color: open === i ? "#8B5CF6" : "var(--text-muted)" }}
                  />
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      padding: "0 24px 22px",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.9,
                    }}>{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
