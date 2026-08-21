import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { LandingSections } from "@/components/home/LandingSections";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.businessProfile.findFirst();
  return {
    title: profile?.farmName ?? "ANDANA FARM HIDROPONIK",
    description:
      profile?.tagline ?? "Sayuran Hidroponik Segar Langsung dari Kebun — 100% Bebas Pestisida",
  };
}

export default async function HomePage() {
  const [profile, rawProducts, promos, testimonials, farmFeatures] = await Promise.all([
    prisma.businessProfile.findFirst(),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 6,
    }),
    prisma.promoContent.findMany({
      where: {
        status: "AKTIF",
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
          { startDate: { lte: new Date() }, endDate: null },
          { startDate: null, endDate: { gte: new Date() } },
        ]
      },
      orderBy: { sortOrder: "asc" },
      take: 10,
    }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.farmFeature.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const featuredProducts = rawProducts.map((p) => ({
    ...p,
    pricePerKg: parseFloat(p.pricePerKg.toString()),
    minStock: parseFloat(p.minStock.toString()),
  }));

  const farmName = profile?.farmName ?? "HydroFarm Segar";
  const whatsapp = profile?.whatsapp ?? "";

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: "var(--pub-bg)", color: "var(--pub-text)" }}
    >
      <PublicNavbar farmName={farmName} logoUrl={profile?.logoUrl || null} />

      {/* ─────────────────────────────────────────
          HERO CAROUSEL
         ───────────────────────────────────────── */}
      <HeroCarousel 
        whatsapp={whatsapp} 
        bannerUrl={profile?.bannerUrl} 
        title={profile?.heroHomeTitle} 
        subtitle={profile?.heroHomeSubtitle} 
        title2={profile?.heroHomeTitle2} 
        subtitle2={profile?.heroHomeSubtitle2} 
        title3={profile?.heroHomeTitle3} 
        subtitle3={profile?.heroHomeSubtitle3} 
      />

      {/* ─────────────────────────────────────────
          ALL CLIENT SECTIONS (untuk animasi)
         ───────────────────────────────────────── */}
      <LandingSections
        promos={promos.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          badgeText: p.badgeText,
          imageUrl: p.imageUrl,
        }))}
        featuredProducts={featuredProducts}
        testimonials={testimonials}
        farmFeatures={farmFeatures}
        profile={
          profile
            ? {
              farmName,
              description: profile.description,
              address: profile.address,
              phone: profile.phone,
              instagram: profile.instagram,
              whatsapp: profile.whatsapp,
              logoUrl: profile.logoUrl,
              whyChooseUsTitle: profile.whyChooseUsTitle,
              whyChooseUsSubtitle: profile.whyChooseUsSubtitle,
            }
            : null
        }
        whatsapp={whatsapp}
      />
    </div>
  );
}
