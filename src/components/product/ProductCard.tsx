"use client";

import Link from "next/link";
import { Leaf, ExternalLink, ShoppingBag } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";

export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  pricePerKg: number;
  unit: string;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: SerializedProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const handleClick = async () => {
    try {
      await fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, source: "landing_page" }),
      });
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        href={`/produk/${product.slug}`}
        onClick={handleClick}
        className="group flex flex-col h-full rounded-2xl overflow-hidden border pub-card-glow transition-all duration-300"
        style={{
          background: "var(--pub-card-bg)",
          borderColor: "var(--pub-card-border)",
        }}
      >
        {/* Image */}
        <div
          className="relative h-52 overflow-hidden"
          style={{ background: "var(--pub-section-alt)" }}
        >
          {product.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Leaf className="w-14 h-14 text-emerald-500/20 transition-all duration-500 group-hover:text-emerald-500/40 group-hover:scale-110" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Featured badge */}
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm">
              ★ Unggulan
            </div>
          )}

          {/* Category */}
          {product.category && (
            <div
              className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg border backdrop-blur-md"
              style={{
                background: "rgba(0,0,0,0.35)",
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {product.category}
            </div>
          )}

          {/* Quick view button — appears on hover */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="inline-flex items-center gap-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Detail
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3
            className="font-bold text-[17px] leading-snug mb-2 transition-colors duration-200 group-hover:text-emerald-500"
            style={{ color: "var(--pub-text)" }}
          >
            {product.name}
          </h3>

          {product.description && (
            <p
              className="text-sm leading-relaxed line-clamp-2 flex-grow mb-4"
              style={{ color: "var(--pub-text-muted)" }}
            >
              {product.description}
            </p>
          )}

          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: "var(--pub-divider)" }}
          >
            <div>
              <span className="text-xl font-extrabold text-emerald-500">
                {formatRupiah(product.pricePerKg)}
              </span>
              <span
                className="text-xs ml-1 font-medium"
                style={{ color: "var(--pub-text-muted)" }}
              >
                /{product.unit}
              </span>
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500 flex items-center justify-center transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
