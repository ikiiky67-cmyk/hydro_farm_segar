"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPromo, updatePromoStatus, deletePromo } from "@/actions/cms.actions";
import { Button } from "@/components/ui/button";
import type { PromoContent } from "@prisma/client";
import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, X, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inputStyle = {
  background: "var(--t-input-bg)",
  borderColor: "var(--t-input-border)",
  color: "var(--t-text-primary)",
} as React.CSSProperties;

const inputClass =
  "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all";

function PromoCard({ promo }: { promo: PromoContent }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isActive = promo.status === "AKTIF";

  return (
    <div
      className="relative rounded-2xl border p-5 transition-all duration-200"
      style={{
        background: "var(--t-card-bg)",
        borderColor: isActive ? "rgba(99,102,241,0.25)" : "var(--t-card-border)",
        opacity: isActive ? 1 : 0.65,
      }}
    >
      {promo.badgeText && (
        <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500 text-white">
          {promo.badgeText}
        </span>
      )}
      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mb-3">
        <Tag className="w-4 h-4 text-indigo-400" />
      </div>
      <h3 className="font-bold mb-1 pr-20" style={{ color: "var(--t-text-primary)" }}>
        {promo.title}
      </h3>
      {promo.description && (
        <p className="text-xs leading-relaxed" style={{ color: "var(--t-text-muted)" }}>
          {promo.description}
        </p>
      )}
      <div
        className="flex items-center gap-2 mt-4 pt-4"
        style={{ borderTop: "1px solid var(--t-divider)" }}
      >
        <button
          onClick={() =>
            startTransition(async () => {
              await updatePromoStatus(promo.id, isActive ? "NONAKTIF" : "AKTIF");
              router.refresh();
            })
          }
          disabled={pending}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
            isActive
              ? "bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25"
              : "bg-zinc-500/10 hover:bg-zinc-500/20"
          }`}
          style={isActive ? {} : { color: "var(--t-text-muted)" }}
        >
          {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {isActive ? "Aktif" : "Nonaktif"}
        </button>
        <button
          onClick={() =>
            startTransition(async () => {
              if (confirm("Hapus promo ini?")) {
                await deletePromo(promo.id);
                router.refresh();
              }
            })
          }
          disabled={pending}
          className="ml-auto text-xs flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors hover:bg-rose-500/10 hover:text-rose-500"
          style={{ color: "var(--t-text-muted)" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </div>
    </div>
  );
}

function AddPromoForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createPromo(formData);
      router.refresh();
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="text-xs font-semibold uppercase tracking-wide mb-2 block"
          style={{ color: "var(--t-text-muted)" }}
        >
          Judul Promo *
        </label>
        <input name="title" required placeholder="Promo Ramadan..." className={inputClass} style={inputStyle} />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>
          Deskripsi
        </label>
        <textarea
          name="description"
          rows={2}
          placeholder="Deskripsi singkat promo..."
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>
            Badge Teks
          </label>
          <input name="badgeText" placeholder="DISKON 20%" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>
            Status
          </label>
          <select name="status" className={`${inputClass} cursor-pointer`} style={inputStyle}>
            <option value="AKTIF">Aktif</option>
            <option value="NONAKTIF">Nonaktif</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1 rounded-xl"
          style={{ border: "1px solid var(--t-input-border)", color: "var(--t-text-secondary)" }}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold"
        >
          {pending ? "Menyimpan..." : "Tambah"}
        </Button>
      </div>
    </form>
  );
}

export function PromoManager({ promos }: { promos: PromoContent[] }) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--t-text-primary)" }}>
            {promos.length} promo terdaftar
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>
            Hanya promo berstatus &quot;Aktif&quot; yang ditampilkan di landing page
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
        >
          <Plus className="w-4 h-4" />
          Tambah Promo
        </button>
      </div>

      {/* Add Promo Modal */}
      <AnimatePresence>
        {addOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setAddOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto rounded-2xl shadow-2xl border p-6 transition-theme"
              style={{ background: "var(--t-modal-bg)", borderColor: "var(--t-card-border)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold" style={{ color: "var(--t-text-primary)" }}>
                  Tambah Promo
                </h2>
                <button
                  onClick={() => setAddOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
                  style={{ background: "var(--t-input-bg)", color: "var(--t-text-secondary)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AddPromoForm onClose={() => setAddOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Promo Cards */}
      {promos.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-2xl border"
          style={{
            background: "var(--t-card-bg)",
            borderColor: "var(--t-card-border)",
            color: "var(--t-text-muted)",
          }}
        >
          <Tag className="w-10 h-10 mb-2 opacity-20" />
          <p className="text-sm">Belum ada promo. Tambah yang pertama!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      )}
    </div>
  );
}
