"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard, SerializedProduct } from "@/components/product/ProductCard";
import { Search, Filter, X, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PER_PAGE = 12;

type Props = {
  products: SerializedProduct[];
  farmName?: string;
  whatsapp?: string | null;
};

export function ProductCatalog({ products, farmName, whatsapp }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Ambil semua kategori unik dari data produk
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category)
      .filter((c): c is string => !!c && c.trim() !== "");
    return [...new Set(cats)].sort();
  }, [products]);

  // Filter produk berdasarkan search + kategori
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !activeCategory || p.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const hasFilters = search.trim() !== "" || activeCategory !== null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
      {/* ── LEFT SIDEBAR (FILTERS) ── */}
      <div
        className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-6 lg:border-r-[6px] lg:pr-8 relative lg:sticky lg:top-32 h-max pb-4"
        style={{ borderColor: "var(--pub-divider)" }}
      >
        <h2 className="text-xl font-bold tracking-tight mb-2" style={{ color: "var(--pub-text)" }}>
          Cari & Filter
        </h2>

        {/* Search input */}
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--pub-text-muted, #71717a)" }}
          />
          <input
            type="text"
            placeholder="Cari sayuran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border text-sm outline-none transition-all duration-300 focus:shadow-[0_0_30px_rgba(16,185,129,0.15)] focus:border-emerald-500/50"
            style={{
              background: "var(--pub-card-bg, rgba(255,255,255,0.03))",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "var(--pub-card-border, rgba(255,255,255,0.08))",
              color: "var(--pub-text, #fafafa)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" style={{ color: "var(--pub-text-muted, #71717a)" }} />
            </button>
          )}
        </div>

        {/* Category Dropdown Toggle */}
        <div className="relative mt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm uppercase tracking-wider opacity-70" style={{ color: "var(--pub-text)" }}>
              Kategori
            </span>
            <Filter className="w-4 h-4 opacity-70" style={{ color: "var(--pub-text)" }} />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 flex items-center justify-between ${activeCategory === null
                ? "bg-emerald-500/80 backdrop-blur-md border-emerald-500/50 text-white shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4)]"
                : "border-white/10 hover:border-emerald-500/40 hover:bg-white/5"
                }`}
              style={
                activeCategory === null
                  ? undefined
                  : {
                    background: "var(--pub-card-bg, rgba(255,255,255,0.03))",
                    backdropFilter: "blur(24px)",
                    color: "var(--pub-text-secondary, #a1a1aa)",
                  }
              }
            >
              <span>Semua Kategori</span>
              {activeCategory === null && <div className="w-2 h-2 rounded-full bg-white" />}
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`w-full text-left px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 flex items-center justify-between ${activeCategory === cat
                  ? "bg-emerald-500/80 backdrop-blur-md border-emerald-500/50 text-white shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4)]"
                  : "border-white/10 hover:border-emerald-500/40 hover:bg-white/5"
                  }`}
                style={
                  activeCategory === cat
                    ? undefined
                    : {
                      background: "var(--pub-card-bg, rgba(255,255,255,0.03))",
                      backdropFilter: "blur(24px)",
                      color: "var(--pub-text-secondary, #a1a1aa)",
                    }
                }
              >
                <span>{cat}</span>
                {activeCategory === cat && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT MAIN CONTENT (PRODUCTS) ── */}
      <div className="flex-1 w-full flex flex-col gap-6">

        {/* Results summary and grid */}
        {hasFilters && (
          <div className="flex items-center justify-between">
            <p
              className="text-sm"
              style={{ color: "var(--pub-text-muted, #71717a)" }}
            >
              Menampilkan{" "}
              <span className="font-semibold text-emerald-500">
                {filtered.length}
              </span>{" "}
              dari {products.length} produk
              {activeCategory && (
                <>
                  {" "}
                  di kategori{" "}
                  <span className="font-semibold text-emerald-500">
                    {activeCategory}
                  </span>
                </>
              )}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory(null);
              }}
              className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Reset filter
            </button>
          </div>
        )}

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-[2rem] border transition-theme"
            style={{
              background: "var(--pub-card-bg, rgba(255,255,255,0.03))",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "var(--pub-card-border, rgba(255,255,255,0.08))",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <ShoppingBag
              className="w-16 h-16 mb-4"
              style={{ color: "rgba(16,185,129,0.3)" }}
            />
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: "var(--pub-text, #fafafa)" }}
            >
              {hasFilters ? "Tidak ada produk ditemukan" : "Belum ada produk"}
            </h3>
            <p style={{ color: "var(--pub-text-muted, #71717a)" }}>
              {hasFilters
                ? "Coba ubah kata kunci atau hapus filter."
                : "Katalog sayuran sedang diperbarui."}
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${search}-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5"
                style={{ perspective: "1500px" }}
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.1, // Jeda agak diperbesar agar lebih berurutan 1 per 1
                      ease: "easeOut"
                    }}
                    className="h-full flex"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="w-full">
                      <ProductCard product={product} farmName={farmName} whatsapp={whatsapp} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
