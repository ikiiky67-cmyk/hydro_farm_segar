import Link from "next/link";
import { Leaf, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--pub-bg, #0a0a0a)", color: "var(--pub-text, #fafafa)" }}
    >
      <div className="text-center max-w-lg">
        {/* Decorative icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{ background: "rgba(16,185,129,0.08)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-12 h-12 text-emerald-500/40" />
          </div>
        </div>

        {/* 404 text */}
        <h1
          className="text-8xl font-extrabold tracking-tight mb-2"
          style={{ color: "rgba(16,185,129,0.2)" }}
        >
          404
        </h1>
        <h2 className="text-2xl font-bold mb-3">Halaman Tidak Ditemukan</h2>
        <p
          className="mb-10 leading-relaxed"
          style={{ color: "var(--pub-text-muted, #a1a1aa)" }}
        >
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
          Mungkin Anda bisa menemukan apa yang dicari di beranda atau katalog produk kami.
        </p>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_0_40px_-8px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_-4px_rgba(16,185,129,0.6)]"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/produk"
            className="inline-flex items-center justify-center gap-2 border font-semibold px-7 py-3.5 rounded-2xl transition-colors duration-200"
            style={{
              borderColor: "var(--pub-card-border, rgba(255,255,255,0.08))",
              background: "var(--pub-card-bg, rgba(255,255,255,0.02))",
              color: "var(--pub-text, #fafafa)",
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
