import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PromoManager } from "@/components/dashboard/PromoManager";
import { Tag } from "lucide-react";

export const metadata: Metadata = { title: "Promo & Banner | CMS" };

export default async function PromoPage() {
  const promos = await prisma.promoContent.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>
          Promo &amp; Banner
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
          Kelola konten promo yang ditampilkan di landing page
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid var(--t-divider)" }}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Tag className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Daftar Promo</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Tambah, aktifkan, atau hapus promo</p>
          </div>
        </div>
        <PromoManager promos={promos} />
      </div>
    </div>
  );
}
