import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProfilForm } from "@/components/dashboard/ProfilForm";
import { Store, Globe } from "lucide-react";

export const metadata: Metadata = { title: "Profil Bisnis | CMS" };

export default async function ProfilPage() {
  const profile = await prisma.businessProfile.findFirst();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>Profil Bisnis</h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
          Informasi ini ditampilkan di landing page publik Anda
        </p>
      </div>

      <div
        className="flex items-center gap-2 text-xs text-indigo-400 rounded-xl px-4 py-3 border transition-theme"
        style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)" }}
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span>Perubahan akan langsung terlihat di halaman publik <strong>/</strong> setelah disimpan.</span>
      </div>

      <div
        className="rounded-2xl border p-6 transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid var(--t-divider)" }}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Store className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Informasi Usaha</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Nama, kontak, dan deskripsi bisnis Anda</p>
          </div>
        </div>
        <ProfilForm profile={profile} />
      </div>
    </div>
  );
}
