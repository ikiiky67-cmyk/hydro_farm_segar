import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ProdukPageClient } from "@/components/produk/ProdukPageClient";

export const metadata: Metadata = {
  title: "Katalog Produk",
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
    minStock: parseFloat(p.minStock.toString()),
  }));

  const farmName = profile?.farmName ?? "Andana Farm Hidroponik";

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ background: "var(--pub-bg)", color: "var(--pub-text)" }}
    >
      <PublicNavbar farmName={farmName} logoUrl={profile?.logoUrl || null} />
      <ProdukPageClient
        products={products}
        farmName={farmName}
        bannerUrl={profile?.bannerUrl}
        logoUrl={profile?.logoUrl}
        whatsapp={profile?.whatsapp}
        title={profile?.heroProductsTitle}
        subtitle={profile?.heroProductsSubtitle}
      />
      <PublicFooter profile={profile} copyrightOnly={true} />
    </div>
  );
}
