"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertBusinessProfile } from "@/actions/cms.actions";
import { Button } from "@/components/ui/button";
import type { BusinessProfile } from "@prisma/client";
import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

const inputStyle = {
  background: "var(--t-input-bg)",
  borderColor: "var(--t-input-border)",
  color: "var(--t-text-primary)",
} as React.CSSProperties;

const inputClass = "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all";

export function ProfilForm({ profile }: { profile: BusinessProfile | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await upsertBusinessProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Nama Usaha *</label>
          <input name="farmName" required defaultValue={profile?.farmName ?? ""} placeholder="HydroFarm Segar" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Tagline</label>
          <input name="tagline" defaultValue={profile?.tagline ?? ""} placeholder="Slogan singkat..." className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Deskripsi</label>
        <textarea name="description" rows={3} defaultValue={profile?.description ?? ""} placeholder="Ceritakan tentang usaha Anda..." className={`${inputClass} resize-none`} style={inputStyle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Nomor Telepon</label>
          <input name="phone" defaultValue={profile?.phone ?? ""} placeholder="0812-xxxx-xxxx" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Email</label>
          <input name="email" type="email" defaultValue={profile?.email ?? ""} placeholder="info@hydrofarm.id" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>WhatsApp</label>
          <input name="whatsapp" defaultValue={profile?.whatsapp ?? ""} placeholder="6281234567890" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Instagram</label>
          <input name="instagram" defaultValue={profile?.instagram ?? ""} placeholder="@hydrofarm_segar" className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Alamat</label>
        <textarea name="address" rows={2} defaultValue={profile?.address ?? ""} placeholder="Jl. Pertanian No. 12..." className={`${inputClass} resize-none`} style={inputStyle} />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending} className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          {pending ? "Menyimpan..." : saved ? (
            <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
          ) : (
            <><Save className="w-4 h-4" /> Simpan Perubahan</>
          )}
        </Button>
      </div>
    </form>
  );
}
