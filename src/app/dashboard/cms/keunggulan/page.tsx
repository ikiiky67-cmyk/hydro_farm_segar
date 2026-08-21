import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { KeunggulanManager } from "@/components/dashboard/KeunggulanManager";
import { ListChecks, Globe } from "lucide-react";

export const metadata: Metadata = { title: "Keunggulan | CMS" };
export const dynamic = "force-dynamic";

export default async function KeunggulanPage() {
  const features = await prisma.farmFeature.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>Kelola Keunggulan</h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
          Fitur/alasan "Kenapa Pilih Kami" yang akan ditampilkan di landing page
        </p>
      </div>

      <div
        className="flex items-center gap-2 text-xs text-indigo-400 rounded-xl px-4 py-3 border transition-theme"
        style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)" }}
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span>Hanya keunggulan yang statusnya "Aktif" yang akan muncul di halaman depan.</span>
      </div>

      <div
        className="rounded-2xl border p-6 transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid var(--t-divider)" }}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Daftar Keunggulan</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Tambah, edit, urutkan, atau sembunyikan keunggulan</p>
          </div>
        </div>
        
        <KeunggulanManager features={features} />
      </div>
    </div>
  );
}
