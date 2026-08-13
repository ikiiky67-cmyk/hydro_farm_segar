import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { ProductCard } from "@/components/product/ProductCard";
import { AnimatedHero } from "@/components/home/AnimatedHero";
import { LandingSections } from "@/components/home/LandingSections";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.businessProfile.findFirst();
  return {
    title: profile?.farmName ?? "HydroFarm Segar",
    description:
      profile?.tagline ?? "Sayuran Hidroponik Segar Langsung dari Kebun — 100% Bebas Pestisida",
  };
}

export default async function HomePage() {
  const [profile, rawProducts, promos] = await Promise.all([
    prisma.businessProfile.findFirst(),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 6,
    }),
    prisma.promoContent.findMany({
      where: { status: "AKTIF" },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  const featuredProducts = rawProducts.map((p) => ({
    ...p,
    pricePerKg: parseFloat(p.pricePerKg.toString()),
  }));

  const farmName = profile?.farmName ?? "HydroFarm Segar";
  const tagline =
    profile?.tagline ?? "Sayuran Hidroponik Segar, Sehat, Langsung dari Kebun";
  const whatsapp = profile?.whatsapp ?? "";

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: "var(--pub-bg)", color: "var(--pub-text)" }}
    >
      <PublicNavbar farmName={farmName} />

      {/* ─────────────────────────────────────────
          HERO SECTION
         ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pub-hero-dark pub-hero-light">
        {/* Animated gradient orbs */}
        <div
          className="pub-orb-1 absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.04) 50%, transparent 70%)",
          }}
        />
        <div
          className="pub-orb-2 absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(20,184,166,0.15) 0%, rgba(20,184,166,0.03) 50%, transparent 70%)",
          }}
        />
        <div
          className="pub-orb-3 absolute top-[40%] right-[15%] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 65%)",
          }}
        />

        {/* Grid background */}
        <div
          className="pub-grid-bg absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <AnimatedHero tagline={tagline} whatsapp={whatsapp} />
      </section>

      {/* ─────────────────────────────────────────
          ALL CLIENT SECTIONS (untuk animasi)
         ───────────────────────────────────────── */}
      <LandingSections
        promos={promos.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          badgeText: p.badgeText,
        }))}
        featuredProducts={featuredProducts}
        profile={
          profile
            ? {
                farmName,
                description: profile.description,
                address: profile.address,
                phone: profile.phone,
                instagram: profile.instagram,
                whatsapp: profile.whatsapp,
              }
            : null
        }
        whatsapp={whatsapp}
      />
    </div>
  );
}
