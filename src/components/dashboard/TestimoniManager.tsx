"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTestimonial, updateTestimonialStatus, deleteTestimonial } from "@/actions/cms.actions";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import type { Testimonial } from "@prisma/client";

export function TestimoniManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createTestimonial(formData);
      setShowForm(false);
      router.refresh();
    });
  }

  async function toggleStatus(id: string, current: boolean) {
    startTransition(async () => {
      await updateTestimonialStatus(id, !current);
      router.refresh();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus testimoni ini?")) return;
    startTransition(async () => {
      await deleteTestimonial(id);
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
          {showForm ? "Batal" : "Tambah Testimoni"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="p-6 rounded-2xl border space-y-4" style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}>
          <h3 className="font-semibold text-lg" style={{ color: "var(--t-text-primary)" }}>Testimoni Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Nama *</label>
              <input name="name" required placeholder="Budi Santoso" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Peran / Pekerjaan</label>
              <input name="role" placeholder="Ibu Rumah Tangga" className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Isi Testimoni *</label>
            <textarea name="content" required rows={3} placeholder="Sayurannya segar banget..." className={`${inputClass} resize-none`} style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Rating (1-5)</label>
            <input type="number" name="rating" required min={1} max={5} defaultValue={5} className={inputClass} style={inputStyle} />
          </div>
          <Button type="submit" disabled={pending} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold">
            {pending ? "Menyimpan..." : "Simpan Testimoni"}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className={`p-5 rounded-2xl border transition-all ${!t.isActive ? 'opacity-60' : ''}`} style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-sm" style={{ color: "var(--t-text-primary)" }}>{t.name}</h4>
                <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>{t.role}</p>
              </div>
              <div className="flex text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
            </div>
            <p className="text-sm italic mb-4" style={{ color: "var(--t-text-secondary)" }}>&quot;{t.content}&quot;</p>
            <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: "var(--t-divider)" }}>
              <Button size="sm" variant="outline" onClick={() => toggleStatus(t.id, t.isActive)} disabled={pending} className="rounded-lg text-xs gap-1.5 h-8">
                {t.isActive ? <><EyeOff className="w-3.5 h-3.5" /> Sembunyikan</> : <><Eye className="w-3.5 h-3.5" /> Tampilkan</>}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)} disabled={pending} className="rounded-lg text-xs gap-1 h-8">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && !showForm && (
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed" style={{ borderColor: "var(--t-divider)" }}>
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>Belum ada testimoni.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Komponen ikon yang missing di import
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
