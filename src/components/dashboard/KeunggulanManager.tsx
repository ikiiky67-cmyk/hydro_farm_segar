"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFarmFeature, updateFarmFeatureStatus, deleteFarmFeature } from "@/actions/cms.actions";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff, LayoutGrid } from "lucide-react";
import type { FarmFeature } from "@prisma/client";

export function KeunggulanManager({ features }: { features: FarmFeature[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createFarmFeature(formData);
      if (result && result.error) {
        alert("Error: " + result.error);
        return;
      }
      setShowForm(false);
      router.refresh();
    });
  }

  async function toggleStatus(id: string, current: boolean) {
    startTransition(async () => {
      await updateFarmFeatureStatus(id, !current);
      router.refresh();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus keunggulan ini?")) return;
    startTransition(async () => {
      await deleteFarmFeature(id);
      router.refresh();
    });
  }

  const inputClass = "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all";
  const inputStyle = { background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-primary)" };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className="bg-indigo-500 hover:bg-indigo-400 text-white gap-2 rounded-xl font-semibold">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Batal" : "Tambah Keunggulan"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border space-y-4" style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}>
          <h3 className="font-semibold text-lg" style={{ color: "var(--t-text-primary)" }}>Keunggulan Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Judul *</label>
              <input name="title" required placeholder="Contoh: Bebas Pestisida" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Ikon (Nama Lucide Icon)</label>
              <input name="icon" placeholder="Contoh: Leaf, ShieldCheck" className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Deskripsi *</label>
            <textarea name="description" required rows={3} placeholder="Sayuran ditanam tanpa bahan kimia..." className={`${inputClass} resize-none`} style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Urutan (Angka)</label>
            <input type="number" name="sortOrder" defaultValue={0} className={inputClass} style={inputStyle} />
          </div>
          <Button type="submit" disabled={pending} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold">
            {pending ? "Menyimpan..." : "Simpan Keunggulan"}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {features.map(f => (
          <div key={f.id} className={`p-5 rounded-2xl border transition-all ${!f.isActive ? 'opacity-60' : ''}`} style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}>
            <div className="mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                <span className="text-indigo-400 text-xs font-mono">{f.icon || "Icon"}</span>
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--t-text-primary)" }}>{f.title}</h4>
              <p className="text-xs line-clamp-3" style={{ color: "var(--t-text-muted)" }}>{f.description}</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t mt-4" style={{ borderColor: "var(--t-divider)" }}>
              <span className="text-xs" style={{ color: "var(--t-text-muted)" }}>Urutan: {f.sortOrder}</span>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => toggleStatus(f.id, f.isActive)} disabled={pending} className="rounded-lg h-8 w-8">
                  {f.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(f.id)} disabled={pending} className="rounded-lg h-8 w-8">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {features.length === 0 && !showForm && (
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed" style={{ borderColor: "var(--t-divider)" }}>
            <LayoutGrid className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Belum ada keunggulan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
