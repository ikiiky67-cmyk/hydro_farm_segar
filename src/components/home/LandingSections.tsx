"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ProductCard, SerializedProduct } from "@/components/product/ProductCard";
import {
  Leaf, Phone, Globe2, MapPin, ArrowRight, Droplets,
  Zap, Award, Package, MessageCircle, Tag,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0,
    transition: { duration: 0.65, ease: "easeOut" } },
};

const staggerGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: "easeOut" } },
};

type Props = {
  promos: { id: string; title: string; description: string | null; badgeText: string | null }[];
  featuredProducts: SerializedProduct[];
  profile: {
    farmName: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    instagram: string | null;
    whatsapp: string | null;
  } | null;
  whatsapp: string;
};

const FEATURES = [
  {
    icon: Droplets,
    title: "Sistem Hidroponik",
    desc: "Ditanam tanpa tanah menggunakan larutan nutrisi terstandarisasi untuk pertumbuhan optimal.",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.2)",
  },
  {
    icon: Leaf,
    title: "100% Organik",
    desc: "Bebas pestisida dan bahan kimia berbahaya. Aman dikonsumsi langsung dari kebun.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  {
    icon: Zap,
    title: "Panen Setiap Hari",
    desc: "Produksi berkelanjutan memastikan kesegaran produk saat sampai di tangan Anda.",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
  },
  {
    icon: Award,
    title: "Kualitas Terjamin",
    desc: "Setiap batch melewati quality control ketat sebelum dikirim ke pelanggan.",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
  },
];

export function LandingSections({ promos, featuredProducts, profile, whatsapp }: Props) {
  return (
    <>
      {/* ─────────────────────────────────────────
          FEATURES / WHY US
         ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border"
              style={{
                background: "rgba(16,185,129,0.08)",
                borderColor: "rgba(16,185,129,0.2)",
                color: "#34d399",
              }}
            >
              Kenapa Memilih Kami
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: "var(--pub-text)" }}
            >
              Keunggulan Hidroponik
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "var(--pub-text-muted)" }}>
              Teknologi modern berpadu dengan komitmen kualitas untuk menghadirkan sayuran terbaik
            </p>
          </motion.div>

          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={cardReveal}
                  className="rounded-2xl border p-6 pub-card-glow pub-icon-hover"
                  style={{
                    background: "var(--pub-card-bg)",
                    borderColor: "var(--pub-card-border)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border pub-icon-inner"
                    style={{ background: f.bg, borderColor: f.border }}
                  >
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{ color: "var(--pub-text)" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--pub-text-muted)" }}>
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          PROMO SECTION
         ───────────────────────────────────────── */}
      {promos.length > 0 && (
        <section className="py-20 px-6" style={{ background: "var(--pub-section-alt)" }}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="flex items-end justify-between mb-10 flex-wrap gap-4"
            >
              <div>
                <div
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 border"
                  style={{
                    background: "rgba(251,191,36,0.08)",
                    borderColor: "rgba(251,191,36,0.2)",
                    color: "#fbbf24",
                  }}
                >
                  <Tag className="w-3 h-3" />
                  Promo & Penawaran
                </div>
                <h2
                  className="text-3xl font-extrabold tracking-tight"
                  style={{ color: "var(--pub-text)" }}
                >
                  Penawaran Spesial
                </h2>
              </div>
            </motion.div>

            <motion.div
              variants={staggerGrid}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {promos.map((promo) => (
                <motion.div
                  key={promo.id}
                  variants={cardReveal}
                  className="relative rounded-2xl border p-6 overflow-hidden pub-card-glow"
                  style={{
                    background: "var(--pub-card-bg)",
                    borderColor: "rgba(251,191,36,0.2)",
                  }}
                >
                  {/* Background glow */}
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)",
                    }}
                  />

                  {promo.badgeText && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {promo.badgeText}
                    </div>
                  )}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
                    style={{
                      background: "rgba(251,191,36,0.1)",
                      borderColor: "rgba(251,191,36,0.25)",
                    }}
                  >
                    <Tag className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: "var(--pub-text)" }}
                  >
                    {promo.title}
                  </h3>
                  {promo.description && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--pub-text-muted)" }}
                    >
                      {promo.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────
          BANNER 3 PRODUK PROMOSI
         ───────────────────────────────────────── */}
      {featuredProducts.length >= 3 && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-emerald-950/20 pub-card-glow border border-emerald-500/20"
            >
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
                {/* Banner Text / CTA */}
                <div className="lg:col-span-4 p-8 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-emerald-500/10" style={{ background: "var(--pub-card-bg)" }}>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border border-amber-500/30 bg-amber-500/10 text-amber-500 w-fit">
                    <Tag className="w-4 h-4" />
                    Penawaran Terbatas
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4" style={{ color: "var(--pub-text)" }}>
                    Panen Spesial <span className="text-emerald-500">Hari Ini</span>
                  </h2>
                  <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--pub-text-muted)" }}>
                    Nikmati kesegaran hidroponik premium dengan harga terbaik. Sayuran ini dipanen pagi ini dan siap diantarkan langsung ke meja makan Anda.
                  </p>
                  <Link
                    href="/produk"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_0px_rgba(16,185,129,0.6)] w-fit"
                  >
                    Beli Sekarang <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* 3 Products Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-0 bg-black/5 dark:bg-white/5">
                  {featuredProducts.slice(0, 3).map((product, i) => (
                    <Link
                      key={product.id}
                      href={`/produk/${product.slug}`}
                      className="group relative flex flex-col p-6 sm:p-8 border-b sm:border-b-0 sm:border-r last:border-0 border-emerald-500/10 hover:bg-emerald-500/5 transition-colors duration-300 h-full justify-between"
                    >
                      <div className="flex-grow">
                        <div className="relative w-full aspect-square mb-6 bg-emerald-500/10 rounded-2xl overflow-hidden flex items-center justify-center">
                          {product.imageUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <Leaf className="w-12 h-12 text-emerald-500/30 group-hover:scale-110 transition-transform duration-500" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white text-emerald-600 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                              Lihat Detail
                            </span>
                          </div>
                        </div>

                        <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-500 transition-colors" style={{ color: "var(--pub-text)" }}>
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="pt-4 mt-auto">
                        <span className="text-xl font-extrabold text-emerald-500">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.pricePerKg)}
                        </span>
                        <span className="text-xs font-medium ml-1" style={{ color: "var(--pub-text-muted)" }}>
                          /{product.unit}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────
          FEATURED PRODUCTS (ALL)
         ───────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 border"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  borderColor: "rgba(16,185,129,0.2)",
                  color: "#34d399",
                }}
              >
                <Package className="w-3 h-3" />
                Produk Unggulan
              </div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: "var(--pub-text)" }}
              >
                Pilihan Terbaik dari Kebun
              </h2>
              <p className="mt-2 text-base" style={{ color: "var(--pub-text-muted)" }}>
                Sayuran segar panen hari ini
              </p>
            </div>
            <Link
              href="/produk"
              className="inline-flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 text-sm font-semibold transition-colors duration-200"
            >
              Lihat semua produk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {featuredProducts.length === 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center py-20 rounded-2xl border"
              style={{
                background: "var(--pub-card-bg)",
                borderColor: "var(--pub-card-border)",
              }}
            >
              <Package className="w-12 h-12 mx-auto mb-3 text-emerald-500/30" />
              <p style={{ color: "var(--pub-text-muted)" }}>
                Belum ada produk unggulan. Segera hadir!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CTA BANNER
         ───────────────────────────────────────── */}
      {whatsapp && (
        <section className="py-20 px-6" style={{ background: "var(--pub-section-alt)" }}>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              <div
                className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mx-auto mb-6 border"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  borderColor: "rgba(16,185,129,0.25)",
                }}
              >
                <MessageCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
                style={{ color: "var(--pub-text)" }}
              >
                Siap Memesan?
              </h2>
              <p
                className="text-base mb-8 max-w-xl mx-auto"
                style={{ color: "var(--pub-text-muted)" }}
              >
                Hubungi kami sekarang untuk mendapatkan sayuran segar langsung ke pintu Anda.
                Pengiriman tersedia setiap hari!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)]"
                >
                  <Phone className="w-4 h-4" />
                  Pesan via WhatsApp
                </motion.a>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/produk"
                    className="inline-flex items-center justify-center gap-2 border font-semibold px-8 py-3.5 rounded-2xl transition-all duration-300"
                    style={{
                      background: "var(--pub-card-bg)",
                      borderColor: "var(--pub-card-border)",
                      color: "var(--pub-text)",
                    }}
                  >
                    Lihat Katalog
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────
          PROFILE / CONTACT
         ───────────────────────────────────────── */}
      {profile && (
        <section
          className="py-20 px-6 border-t"
          style={{ borderColor: "var(--pub-divider)" }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  borderColor: "rgba(16,185,129,0.2)",
                }}
              >
                <Leaf className="w-8 h-8 text-emerald-400" />
              </div>
              <h2
                className="text-2xl font-extrabold mb-4"
                style={{ color: "var(--pub-text)" }}
              >
                {profile.farmName}
              </h2>
              {profile.description && (
                <p
                  className="leading-relaxed mb-8 max-w-2xl mx-auto"
                  style={{ color: "var(--pub-text-muted)" }}
                >
                  {profile.description}
                </p>
              )}
              <div
                className="flex flex-wrap justify-center gap-6 text-sm"
                style={{ color: "var(--pub-text-muted)" }}
              >
                {profile.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {profile.address}
                  </div>
                )}
                {profile.instagram && (
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {profile.instagram}
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {profile.phone}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────
          FOOTER
         ───────────────────────────────────────── */}
      <footer
        className="border-t py-10 px-6"
        style={{ borderColor: "var(--pub-divider)", background: "var(--pub-section-alt)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{
                background: "rgba(16,185,129,0.1)",
                borderColor: "rgba(16,185,129,0.2)",
              }}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--pub-text)" }}>
              {profile?.farmName ?? "HydroFarm Segar"}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--pub-text-subtle)" }}>
            © {new Date().getFullYear()} {profile?.farmName ?? "HydroFarm Segar"}. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--pub-text-subtle)" }}>
            <Link href="/produk" className="hover:text-emerald-400 transition-colors">Produk</Link>
            <Link href="/tentang" className="hover:text-emerald-400 transition-colors">Tentang</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
