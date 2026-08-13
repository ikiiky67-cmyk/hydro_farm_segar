"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createStockMovement } from "@/actions/stock.actions";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOVEMENT_TYPES = [
  { value: "PANEN_MASUK",  label: "Panen Masuk",     color: "#6366f1", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)" },
  { value: "TERJUAL",      label: "Terjual",          color: "#38bdf8", bg: "rgba(56,189,248,0.15)",  border: "rgba(56,189,248,0.4)" },
  { value: "RUSAK",        label: "Rusak/Terbuang",   color: "#f43f5e", bg: "rgba(244,63,94,0.15)",   border: "rgba(244,63,94,0.4)" },
  { value: "PENYESUAIAN",  label: "Penyesuaian",      color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.4)" },
];

const inputStyle = {
  background: "var(--t-input-bg)",
  borderColor: "var(--t-input-border)",
  color: "var(--t-text-primary)",
} as React.CSSProperties;

export function StockMovementModal({ products }: { products: { id: string; name: string; unit: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [type, setType] = useState("PANEN_MASUK");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createStockMovement(formData);
      if (result?.error) setError("Periksa isian form.");
      else { router.refresh(); setOpen(false); setType("PANEN_MASUK"); }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
      >
        <Plus className="w-4 h-4" />
        Tambah Pergerakan
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto rounded-2xl shadow-2xl border p-6 transition-theme"
              style={{ background: "var(--t-modal-bg)", borderColor: "var(--t-card-border)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--t-text-primary)" }}>Catat Pergerakan Stok</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>Panen, penjualan, atau penyesuaian</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70"
                  style={{ background: "var(--t-input-bg)", color: "var(--t-text-secondary)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Produk *</label>
                  <select name="productId" required className="w-full border rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle}>
                    <option value="">-- Pilih produk --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Jenis Pergerakan *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOVEMENT_TYPES.map((t) => (
                      <button
                        key={t.value} type="button" onClick={() => setType(t.value)}
                        className="py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 text-left"
                        style={
                          type === t.value
                            ? { background: t.bg, borderColor: t.border, color: t.color }
                            : { background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-muted)" }
                        }
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="type" value={type} />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Jumlah *</label>
                  <input name="quantity" type="number" min="0.01" step="0.01" required placeholder="0" className="w-full border rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Tanggal</label>
                  <input name="recordedAt" type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full border rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Catatan (opsional)</label>
                  <input name="note" placeholder="Tambahkan catatan..." className="w-full border rounded-xl px-4 py-3 text-sm outline-none" style={inputStyle} />
                </div>

                {error && (
                  <p className="text-rose-500 text-xs bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1 rounded-xl" style={{ border: "1px solid var(--t-input-border)", color: "var(--t-text-secondary)" }}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={pending} className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold">
                    {pending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
