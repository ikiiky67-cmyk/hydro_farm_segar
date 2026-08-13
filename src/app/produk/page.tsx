import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { ProductCard } from "@/components/product/ProductCard";
import { Sparkles, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Katalog Produk | HydroFarm",
  description: "Lihat semua katalog sayuran hidroponik berkualitas dari kebun kami.",
};

export default async function PublicProdukPage() {
  const [profile, rawProducts] = await Promise.all([
    prisma.businessProfile.findFirst(),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
  ]);

  const products = rawProducts.map((p) => ({
    ...p,
    pricePerKg: parseFloat(p.pricePerKg.toString()),
  }));

  const farmName = profile?.farmName ?? "HydroFarm Segar";

  return (
    <div
      className="t-pub-bg min-h-screen pt-24 pb-16 transition-theme"
      style={{ background: "var(--t-pub-bg)", color: "var(--t-text-primary)" }}
    >
      <PublicNavbar farmName={farmName} />

      <main className="max-w-6xl mx-auto px-6">
        <div className="relative mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 text-sm font-medium">Katalog Sayuran</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: "var(--t-text-primary)" }}>
            Produk Tersedia
          </h1>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: "var(--t-text-secondary)" }}>
            Sayuran hidroponik segar, ditanam tanpa pestisida, dan dipanen langsung dari kebun kami hari ini.
          </p>
        </div>

        {products.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-3xl border transition-theme"
            style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
          >
            <ShoppingBag className="w-16 h-16 mb-4" style={{ color: "rgba(16,185,129,0.3)" }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--t-text-primary)" }}>Belum ada produk</h3>
            <p style={{ color: "var(--t-text-muted)" }}>Katalog sayuran sedang diperbarui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer
        className="t-footer border-t mt-16 py-8 px-6 text-center transition-theme"
        style={{ borderColor: "var(--t-divider)" }}
      >
        <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>
          © {new Date().getFullYear()} {farmName}. Semua hak dilindungi.
        </p>
      </footer>
    </div>
  );
}
