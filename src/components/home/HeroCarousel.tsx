"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const maskReveal: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  },
  item: {
    hidden: { y: "120%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, // Springy / Snappy
    },
  },
};

type Slide = {
  headline: string;
  highlightedWord: string;
  subheadline: string;
  badge: string;
  image: string;
};

const SLIDES: Slide[] = [
  {
    headline: "Segar dari Kebun,",
    highlightedWord: "Ke Meja Anda",
    subheadline: "Sayuran hidroponik premium — dipanen pagi ini, diantar hari ini.",
    badge: "🌱 Panen Segar Setiap Hari",
    image: "/uploads/image/Gambar1.jpeg",
  },
  {
    headline: "100% Bebas Pestisida,",
    highlightedWord: "100% Rasa Alami",
    subheadline: "Ditanam tanpa tanah, tanpa bahan kimia. Murni nutrisi alam.",
    badge: "🌿 Hidroponik Modern",
    image: "/uploads/image/Gambar2.jpeg",
  },
  {
    headline: "Pesan Sekarang,",
    highlightedWord: "Nikmati Kesegarannya",
    subheadline: "Hubungi kami via WhatsApp untuk pemesanan instan.",
    badge: "✨ Kualitas Terjamin",
    image: "/uploads/image/Gambar3.jpeg",
  },
];

export function HeroCarousel({
  whatsapp,
  bannerUrl,
  title,
  subtitle,
  title2,
  subtitle2,
  title3,
  subtitle3
}: {
  whatsapp: string;
  bannerUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  title2?: string | null;
  subtitle2?: string | null;
  title3?: string | null;
  subtitle3?: string | null;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, watchDrag: false }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
    Fade(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const customTitles = [title, title2, title3];
  const customSubtitles = [subtitle, subtitle2, subtitle3];

  // Parallax
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Slow parallax for background image
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Fast fade for text
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section ref={sectionRef} className="relative hero-height w-full flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* ── Carousel Background (Crossfade + Parallax) ── */}
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
        <div ref={emblaRef} className="overflow-hidden h-full w-full">
          <div className="flex h-full w-full">
            {SLIDES.map((_, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                {/* Image scaling based on active state is handled natively by CSS and embla fade,
                    but we add a slow zoom "Ken Burns" for the active slide */}
                <div
                  className={`absolute inset-0 transition-transform duration-[6000ms] ease-out ${i === selectedIndex ? "scale-105" : "scale-100"
                    }`}
                >
                  <img
                    src={SLIDES[i].image}
                    alt="Hydro Farm"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark overlay & vignette */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent opacity-80" />
      </motion.div>

      {/* ── Content Overlay ── */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 w-full px-6 max-w-7xl mx-auto flex flex-col justify-center h-full pt-20 pb-32 md:pb-20"
      >
        <div className="min-h-[400px] sm:min-h-[500px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              variants={maskReveal.container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, filter: "blur(8px)", transition: { duration: 0.5, ease: "easeInOut" } }}
              className="flex flex-col items-start text-left"
            >
              {/* Badge */}
              <div className="overflow-hidden mb-4 md:mb-6">
                <motion.div variants={maskReveal.item}>
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-sm font-medium bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono tracking-tight">{SLIDES[selectedIndex].badge}</span>
                  </div>
                </motion.div>
              </div>

              {/* Headline - Mask Reveal */}
              <h1 className="text-4xl sm:text-7xl md:text-8xl xl:text-[6rem] font-extrabold leading-[1] tracking-tighter text-white uppercase max-w-5xl">
                <div className="overflow-hidden py-1">
                  <motion.div variants={maskReveal.item}>
                    {customTitles[selectedIndex] || SLIDES[selectedIndex].headline}
                  </motion.div>
                </div>
                {!customTitles[selectedIndex] && (
                  <div className="overflow-hidden py-1">
                    <motion.div variants={maskReveal.item} className="text-emerald-400 font-serif italic font-normal tracking-normal normal-case">
                      {SLIDES[selectedIndex].highlightedWord}
                    </motion.div>
                  </div>
                )}
              </h1>

              {/* Subheadline */}
              <div className="overflow-hidden mt-4 mb-6 md:mt-8 md:mb-12">
                <motion.p
                  variants={maskReveal.item}
                  className="text-base sm:text-xl md:text-2xl max-w-2xl leading-relaxed text-white/80 font-light"
                >
                  {customSubtitles[selectedIndex] || SLIDES[selectedIndex].subheadline}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* STATIC CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-24 md:bottom-28 left-6 md:left-12 lg:left-24 right-6 flex flex-col sm:flex-row gap-3 md:gap-4 w-[calc(100%-48px)] sm:w-auto z-20"
          >
            <MagneticButton>
              <Link
                href="/produk"
                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3.5 md:px-8 md:py-4 rounded-full transition-all duration-300 shadow-[0_0_40px_-8px_rgba(16,185,129,0.5)] text-sm md:text-base w-full sm:w-auto"
              >
                Lihat Produk
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>

            {whatsapp && (
              <MagneticButton magneticPull={0.2}>
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 border font-semibold px-6 py-3.5 md:px-8 md:py-4 rounded-full transition-all duration-300 text-sm md:text-base bg-white/5 backdrop-blur-xl border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Hubungi Penjual
                </a>
              </MagneticButton>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Carousel Pagination Dots (Bottom Center) ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-500 rounded-full ${i === selectedIndex
              ? "w-8 h-2.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
              }`}
          />
        ))}
      </div>

      {/* ── Modern Scroll Indicator (Bottom Right) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-6 md:right-12 flex flex-col items-center z-20 hidden sm:flex"
      >
        <div className="w-[2px] h-16 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-emerald-500 rounded-full"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
