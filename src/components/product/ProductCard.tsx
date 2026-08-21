"use client";

import Link from "next/link";
import Image from "next/image";
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
  minStock: number;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: SerializedProduct;
  index?: number;
  disableAnimation?: boolean;
  farmName?: string;
  whatsapp?: string | null;
  from?: string;
}

export function ProductCard({ product, index = 0, disableAnimation = false, farmName, whatsapp, from }: ProductCardProps) {
  const handleClick = async () => {
    try {
      await fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, source: "landing_page" }),
      });
    } catch {}
  };

  const CardWrapper = disableAnimation ? "div" : motion.div;
  const animationProps = disableAnimation ? {} : {
    initial: { opacity: 0, y: 30, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { 
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: index * 0.1 
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (whatsapp) {
      const waMessage = encodeURIComponent(`Halo ${farmName || 'Admin'}, saya tertarik dengan produk:\n\nProduk: ${product.name}\nHarga: ${formatRupiah(product.pricePerKg)}/${product.unit}\n\nApakah stoknya masih tersedia?`);
      const waLink = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${waMessage}`;
      window.open(waLink, "_blank", "noopener,noreferrer");
    } else {
      // Jika tidak ada nomor WA, arahkan ke halaman detail saja
      window.location.href = `/produk/${product.slug}${from ? `?from=${from}` : ""}`;
    }
  };

  return (
    <CardWrapper
      {...animationProps}
      className="h-full"
    >
      <Link
        href={`/produk/${product.slug}${from ? `?from=${from}` : ""}`}
        onClick={handleClick}
        className="group flex flex-col h-full rounded-[2rem] overflow-hidden relative transition-all duration-500 hover:-translate-y-2"
        style={{
          background: "var(--pub-card-bg, rgba(255,255,255,0.03))",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--pub-card-border, rgba(255,255,255,0.08))",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[150%] transition-transform duration-[1500ms] ease-in-out z-20 pointer-events-none" />
        
        {/* Glow backdrop on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-[1.5rem] rounded-b-xl mx-2 mt-2 bg-black/5">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Leaf className="w-14 h-14 text-emerald-500/20 transition-all duration-500 group-hover:text-emerald-500/40 group-hover:scale-110" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category */}
          {product.category && (
            <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
              {product.category}
            </div>
          )}

          {/* Quick view button — appears on hover */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              <ExternalLink className="w-4 h-4" />
              Lihat Detail
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 flex flex-col flex-grow relative z-10">
          {product.isFeatured && (
            <div className="mb-2">
              <span className="inline-block bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded shadow-sm">
                Unggulan
              </span>
            </div>
          )}
          <h3
            className="font-bold text-lg md:text-xl tracking-tight leading-snug mb-2 transition-colors duration-300 group-hover:text-emerald-500 line-clamp-2"
            style={{ color: "var(--pub-text)" }}
          >
            {product.name}
          </h3>

          {product.description && (
            <p
              className="text-sm md:text-base leading-relaxed line-clamp-2 flex-grow mb-4 font-light"
              style={{ color: "var(--pub-text-muted)" }}
            >
              {product.description}
            </p>
          )}

          <div
            className="flex items-center justify-between pt-4 mt-auto border-t gap-2"
            style={{ borderColor: "var(--pub-divider)" }}
          >
            <div className="flex-1 min-w-0">
              <span className="text-lg md:text-xl font-extrabold text-emerald-500 tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] block truncate">
                {formatRupiah(product.pricePerKg)}
              </span>
              <span
                className="text-[10px] md:text-xs font-medium opacity-60 block truncate"
                style={{ color: "var(--pub-text-muted)" }}
              >
                per {product.unit}
              </span>
            </div>

            <motion.button
              onClick={handleCartClick}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/30 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center transition-all duration-300 flex-shrink-0 group/btn"
              aria-label="Beli via WhatsApp"
            >
              <ShoppingBag className="w-4 h-4 md:w-4 md:h-4 text-emerald-500 group-hover/btn:text-white transition-colors duration-300 drop-shadow-sm" />
            </motion.button>
          </div>
        </div>
      </Link>
    </CardWrapper>
  );
}
