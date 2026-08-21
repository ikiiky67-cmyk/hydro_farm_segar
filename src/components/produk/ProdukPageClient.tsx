"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import type { SerializedProduct } from "@/components/product/ProductCard";
import Link from "next/link";
import { Leaf } from "lucide-react";

const cinematicReveal: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  },
  item: {
    hidden: { filter: "blur(15px)", opacity: 0, scale: 0.95, y: 20 },
    show: {
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

type Props = {
  products: SerializedProduct[];
  farmName: string;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  whatsapp?: string | null;
  title?: string | null;
  subtitle?: string | null;
};

export function ProdukPageClient({ products, farmName, bannerUrl, logoUrl, whatsapp, title, subtitle }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      {/* ── Animated Hero Section ── */}
      <section
        ref={heroRef}
        className="relative pt-40 pb-32 flex items-center justify-center overflow-hidden bg-[#020617]"
      >
        {/* Parallax Background */}
        <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/uploads/image/Gambar1.jpeg"
                alt="Default Banner"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent opacity-80" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full px-6 max-w-7xl mx-auto flex flex-col justify-center"
        >
          <motion.div
            variants={cinematicReveal.container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center relative"
          >

            <motion.div variants={cinematicReveal.item} className="mb-6 relative">
              <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 border border-emerald-500/30 bg-black/30 backdrop-blur-xl text-white font-mono text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent font-semibold">Katalog Premium</span>
              </div>
            </motion.div>

            <motion.h1 variants={cinematicReveal.item} className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-extrabold mb-8 text-white leading-[1.1] tracking-tight relative">
              {title ? title : (
                <>
                  Kesegaran
                  <br />
                  <span className="font-serif italic font-normal text-emerald-400">Pilihan Terbaik</span>
                </>
              )}
            </motion.h1>
            
            <motion.p
              variants={cinematicReveal.item}
              className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed font-light relative"
            >
              {subtitle ? subtitle : "Semua produk dipanen hari ini — 100% bebas pestisida, dikurasi khusus dari greenhouse premium kami ke dapur Anda."}
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Catalog ── */}
      <main id="katalog" className="flex-1 max-w-7xl w-full mx-auto px-6 py-24 scroll-mt-24">
        <ProductCatalog products={products} farmName={farmName} whatsapp={whatsapp} />
      </main>
    </>
  );
}
