"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import * as LucideIcons from "lucide-react";

const maskReveal = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  },
  item: {
    hidden: { y: 40, opacity: 0, filter: "blur(10px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  },
};

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className="w-full h-full relative overflow-hidden bg-gray-100">
      <motion.img
        style={{ y, scale: 1.25 }}
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

// Fallback features in case the DB is empty
const DEFAULT_FEATURES = [
  { icon: "Droplets", title: "Sistem Tersirkulasi", description: "Air bernutrisi 24 jam untuk pertumbuhan optimal." },
  { icon: "Leaf", title: "100% Bebas Pestisida", description: "Aman dikonsumsi. Tanpa bahan kimia berbahaya." },
  { icon: "Zap", title: "Panen Tiap Hari", description: "Stok selalu segar dari greenhouse kami." },
  { icon: "Award", title: "Quality Control", description: "Disortir ketat sebelum dikirim ke Anda." },
];

export function IntroSection({
  farmFeatures,
  title,
  subtitle,
}: {
  farmFeatures?: any[];
  title?: string | null;
  subtitle?: string | null;
}) {
  const features = farmFeatures && farmFeatures.length > 0 ? farmFeatures : DEFAULT_FEATURES;

  // Render Lucide Icon by name
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Droplets;
    return <IconComponent className="w-7 h-7 text-emerald-500" />;
  };

  return (
    <section className="relative w-full flex flex-col overflow-hidden bg-[var(--pub-bg-2)]">
      {/* Top Block: Text Content (The Paper) */}
      <div className="relative z-10 w-full flex flex-col items-center p-8 md:p-16 lg:px-24 lg:pt-24 lg:pb-16 bg-[var(--pub-bg)] text-center">
        {/* The Pull-Up Curtain Animation (Torn Paper) */}
        <motion.div
          initial={{ height: "100vh" }}
          whileInView={{ height: "0vh" }}
          transition={{ duration: 2.5, ease: [0.25, 1, 0.3, 1], delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="absolute left-0 right-0 top-full z-40 bg-[var(--pub-bg)] pointer-events-none"
        >
          {/* Horizontal Torn Paper Edge SVG at the bottom of the curtain */}
          <div className="absolute left-0 right-0 -bottom-[39px] h-[40px] z-20 overflow-visible">
            <svg preserveAspectRatio="none" viewBox="0 0 100 20" className="w-full h-full relative z-0 drop-shadow-[0_12px_15px_rgba(0,0,0,0.25)]" style={{ fill: "var(--pub-bg)" }}>
              <path d="M0,0 L100,0 L100,10 L98,14 L96,8 L94,15 L92,9 L90,16 L88,10 L86,17 L84,11 L82,18 L80,12 L78,16 L76,10 L74,15 L72,9 L70,14 L68,8 L66,13 L64,7 L62,15 L60,9 L58,16 L56,10 L54,17 L52,11 L50,18 L48,12 L46,19 L44,13 L42,17 L40,11 L38,16 L36,10 L34,15 L32,9 L30,14 L28,8 L26,13 L24,7 L22,15 L20,9 L18,16 L16,10 L14,17 L12,11 L10,18 L8,12 L6,19 L4,13 L2,16 L0,10 Z" />
            </svg>
            {/* Filler block to cover the upward-bleeding shadow and gap */}
            <div className="absolute bottom-[calc(100%-2px)] left-0 right-0 h-[60px] bg-[var(--pub-bg)] z-10" />
          </div>
        </motion.div>

        <motion.div
          variants={maskReveal.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px" }}
          className="w-full max-w-6xl relative z-30"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6" style={{ color: "var(--pub-text)" }}>
            <motion.div variants={maskReveal.item}>{title || "Kenapa Harus Pilih Kami?"}</motion.div>
          </h2>
          <div className="max-w-2xl mx-auto">
            <motion.p variants={maskReveal.item} className="text-lg leading-relaxed" style={{ color: "var(--pub-text-muted)" }}>
              {subtitle || "Kami memadukan teknologi pertanian modern dengan dedikasi tinggi untuk menghasilkan panen yang murni, sehat, dan renyah setiap hari."}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Block: Flanking Features & Centered Image */}
      <div className="relative w-full z-0 bg-[var(--pub-bg)] pb-24 lg:pb-32 px-6 flex justify-center">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-12 relative z-10 pt-16 lg:pt-28">
          
          {/* Left Features */}
          <div className="flex flex-col gap-6 w-full lg:w-[320px] shrink-0 justify-center">
            {features.slice(0, Math.ceil(features.length / 2)).map((f, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-start text-left bg-[var(--pub-bg)] p-6 rounded-3xl border border-[var(--pub-divider)] shadow-lg hover:shadow-xl transition-all duration-300 group flex-1"
                >
                  <div className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--pub-divider)] transition-transform duration-700 group-hover:scale-110 group-hover:shadow-lg shrink-0 bg-[var(--pub-section-alt)]">
                    {renderIcon(f.icon)}
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight transition-colors" style={{ color: "var(--pub-text)" }}>
                    {f.title}
                  </h3>
                  <p className="text-base leading-relaxed opacity-80" style={{ color: "var(--pub-text-muted)" }}>
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Center Image */}
          <div className="w-full lg:flex-1 max-w-[650px] shrink rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-[var(--pub-divider)] relative z-10 bg-[var(--pub-bg)] flex items-stretch min-h-[300px]">
            <ParallaxImage src="/uploads/image/GreenHouse.jpeg" alt="Greenhouse" />
          </div>

          {/* Right Features */}
          <div className="flex flex-col gap-6 w-full lg:w-[320px] shrink-0 justify-center">
            {features.slice(Math.ceil(features.length / 2)).map((f, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-start text-left bg-[var(--pub-bg)] p-6 rounded-3xl border border-[var(--pub-divider)] shadow-lg hover:shadow-xl transition-all duration-300 group flex-1"
                >
                  <div className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--pub-divider)] transition-transform duration-700 group-hover:scale-110 group-hover:shadow-lg shrink-0 bg-[var(--pub-section-alt)]">
                    {renderIcon(f.icon)}
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight transition-colors" style={{ color: "var(--pub-text)" }}>
                    {f.title}
                  </h3>
                  <p className="text-base leading-relaxed opacity-80" style={{ color: "var(--pub-text-muted)" }}>
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
