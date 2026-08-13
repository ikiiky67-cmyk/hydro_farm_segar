"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles, ChevronDown } from "lucide-react";
import { useRef } from "react";

const stagger: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)",
      transition: { duration: 0.7, ease: "easeOut" } },
  },
};

export function AnimatedHero({ tagline, whatsapp }: { tagline: string; whatsapp: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <motion.div
      ref={containerRef}
      style={{ y: heroY, opacity: heroOpacity }}
      className="relative z-10 text-center px-6 max-w-5xl mx-auto"
    >
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div variants={stagger.item}>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border text-sm font-medium"
            style={{
              background: "rgba(16,185,129,0.08)",
              borderColor: "rgba(16,185,129,0.2)",
              color: "#34d399",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Bebas Pestisida · Panen Segar Setiap Hari</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={stagger.item}
          className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold leading-[1.05] tracking-tight mb-6"
        >
          <span style={{ color: "var(--pub-text)" }}>Sayuran</span>{" "}
          <span className="pub-shimmer-text">Hidroponik</span>
          <br />
          <span style={{ color: "var(--pub-text)" }}>Segar &amp; Sehat</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={stagger.item}
          className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--pub-text-muted)" }}
        >
          {tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={stagger.item}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/produk"
              className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_0_40px_-8px_rgba(16,185,129,0.7)] hover:shadow-[0_0_50px_-4px_rgba(16,185,129,0.7)] text-[15px]"
            >
              Lihat Produk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {whatsapp && (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border font-semibold px-7 py-3.5 rounded-2xl transition-all duration-300 text-[15px]"
                style={{
                  background: "var(--pub-card-bg)",
                  borderColor: "var(--pub-card-border)",
                  color: "var(--pub-text)",
                }}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Pesan via WhatsApp
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={stagger.item}
          className="mt-16 flex flex-col items-center gap-2"
          style={{ color: "var(--pub-text-subtle)" }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 pub-scroll-indicator" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
