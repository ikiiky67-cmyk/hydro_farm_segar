"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { ProductCard, type SerializedProduct } from "@/components/product/ProductCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

export function FeaturedProductsSection({
  featuredProducts,
  farmName,
  whatsapp
}: {
  featuredProducts: SerializedProduct[];
  farmName?: string;
  whatsapp?: string | null;
}) {
  return (
    <section id="produk-unggulan" className="pt-12 pb-12 lg:pt-16 lg:pb-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Column (Sticky Title & CTA) */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col items-start lg:border-r-4 border-emerald-500/30 lg:pr-8 lg:pb-12"
          >
            <div className="hidden lg:block w-8 h-[2px] bg-emerald-500 mb-8" />

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]" style={{ color: "var(--pub-text)" }}>
              Pilihan <br className="hidden lg:block" />
              <span className="text-emerald-500 font-serif italic font-normal">Terbaik</span>
            </h2>
            <p className="text-lg max-w-xl font-light mb-10 leading-relaxed" style={{ color: "var(--pub-text-muted)" }}>
              Koleksi sayuran segar unggulan kami. Dipilih dengan cermat untuk memastikan kualitas dan nutrisi maksimal setiap harinya.
            </p>
            <MagneticButton>
              <Link
                href="/produk"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg transition-all duration-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] hover:-translate-y-1"
              >
                Katalog Lengkap
                <ArrowRight className="w-5 h-5" />
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Right Column (Scrollable Products Grid) */}
          <div className="lg:col-span-8">
            {featuredProducts.length === 0 ? (
              <motion.div
                variants={slideInRight}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center py-32 rounded-[3rem] pub-glass w-full"
              >
                <Package className="w-16 h-16 mx-auto mb-6 text-emerald-500/30" />
                <p className="text-xl" style={{ color: "var(--pub-text-muted)" }}>
                  Belum ada produk unggulan. Segera hadir!
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={staggerGrid}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
                style={{ perspective: "1500px" }}
              >
                {featuredProducts.map((product, i) => (
                  <motion.div key={product.id} variants={slideInRight}>
                    <ProductCard product={product} index={i} disableAnimation={true} farmName={farmName} whatsapp={whatsapp} from="home" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
