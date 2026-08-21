"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Leaf, ShieldCheck, Droplets, CheckCircle2, Truck, ShoppingBag } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { SerializedProduct } from "@/components/product/ProductCard";

type Props = {
  product: SerializedProduct;
  farmName: string;
  waLink: string;
  backHref: string;
  logoUrl?: string | null;
};

// Variasi animasi untuk kontainer stagger
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Variasi animasi masuk dari bawah
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

// Variasi animasi masuk dari kiri (untuk panel kiri/gambar)
const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export function ProductDetailClient({ product, farmName, waLink, backHref, logoUrl }: Props) {
  return (
    <main className="flex-grow flex flex-col lg:flex-row w-full overflow-hidden">
      {/* Left Side: Sticky Image Gallery */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={slideInLeft}
        className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 relative flex flex-col p-6 lg:p-10 overflow-hidden bg-emerald-500/5 border-b lg:border-b-0 lg:border-r" 
        style={{ borderColor: "var(--pub-divider)" }}
      >
        {/* Top Bar (Back Button) */}
        <div className="w-full z-20 flex justify-start">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-xl border font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:border-emerald-400 hover:text-white shadow-xl"
            style={{
              background: "var(--pub-card-bg, rgba(255,255,255,0.03))",
              borderColor: "var(--pub-card-border, rgba(255,255,255,0.08))",
              color: "var(--pub-text)"
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>

        {/* Featured Badge */}
        {product.isFeatured && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 20 }}
            className="absolute top-6 lg:top-10 right-6 lg:right-10 z-10 bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg tracking-wider"
          >
            ★ PRODUK UNGGULAN
          </motion.div>
        )}

        {/* Product Image */}
        <div className="relative w-full flex-grow p-8 lg:p-12 flex items-center justify-center">
          {product.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full h-full flex flex-col items-center justify-center gap-6 text-emerald-500/20"
            >
              <Leaf className="w-32 h-32" />
              <span className="font-semibold text-xl">Foto Belum Tersedia</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Right Side: Scrollable Details */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full lg:w-1/2 flex flex-col min-h-screen"
      >
        <div className="flex-grow px-8 py-16 lg:px-16 lg:py-32 xl:px-24 max-w-3xl w-full mx-auto flex flex-col justify-center">
          {/* Header section */}
          <div className="mb-8">
            {product.category && (
              <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-widest font-extrabold rounded-full mb-6">
                {product.category}
              </motion.span>
            )}
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
              style={{ color: "var(--pub-text)" }}>
              {product.name}
            </motion.h1>
            <motion.div variants={fadeUp} className="flex items-end gap-3 mb-8 pb-8 border-b" style={{ borderColor: "var(--pub-divider)" }}>
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-500 tracking-tighter">
                {formatRupiah(product.pricePerKg)}
              </span>
              <span className="text-xl font-medium mb-1.5" style={{ color: "var(--pub-text-muted)" }}>
                / {product.unit}
              </span>
            </motion.div>
          </div>

          {/* Description */}
          <motion.div variants={fadeUp} className="prose prose-emerald dark:prose-invert prose-lg max-w-none mb-12"
            style={{ color: "var(--pub-text-muted)" }}>
            <p className="leading-relaxed font-light text-lg">
              {product.description || "Sayuran hidroponik segar, ditanam dengan penuh perawatan dan standar kualitas tinggi untuk menjamin kesehatan keluarga Anda. Dipanen langsung di hari pengiriman untuk menjaga kerenyahan dan nutrisi optimal."}
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            <div className="flex items-start gap-4 p-5 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-1" style={{ color: "var(--pub-text)" }}>100% Organik</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: "var(--pub-text-subtle)" }}>Bebas pestisida & bahan kimia berbahaya</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-1" style={{ color: "var(--pub-text)" }}>Hidroponik</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: "var(--pub-text-subtle)" }}>Nutrisi air mineral terstandarisasi</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-1" style={{ color: "var(--pub-text)" }}>Panen Harian</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: "var(--pub-text-subtle)" }}>Kesegaran super maksimal</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h4 className="text-base font-bold mb-1" style={{ color: "var(--pub-text)" }}>Siap Kirim</h4>
                <p className="text-sm font-light leading-relaxed" style={{ color: "var(--pub-text-subtle)" }}>Diantar langsung ke pintu Anda</p>
              </div>
            </div>
          </motion.div>

          {/* Sticky/Fixed CTA Bar */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-8 border-t" style={{ borderColor: "var(--pub-divider)" }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.7)] hover:shadow-[0_15px_50px_-5px_rgba(16,185,129,0.8)] hover:-translate-y-1"
            >
              <ShoppingBag className="w-6 h-6" />
              Pesan via WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Inline Footer at the bottom of the right panel */}
        <motion.footer
          variants={fadeUp}
          className="border-t py-8 px-8 lg:px-16 xl:px-24 mt-auto"
          style={{ borderColor: "var(--pub-divider)", background: "var(--pub-section-alt)" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logoUrl} alt="Logo" className="w-7 h-7 object-contain rounded bg-white/5" />
              ) : (
                <Leaf className="w-5 h-5 text-emerald-500" />
              )}
              <span className="font-bold text-sm" style={{ color: "var(--pub-text)" }}>
                {farmName}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--pub-text-subtle)" }}>
              © {new Date().getFullYear()} {farmName}. Hak Cipta Dilindungi.
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </main>
  );
}
