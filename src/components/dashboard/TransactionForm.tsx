"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/actions/transaction.actions";
import { Button } from "@/components/ui/button";
import {
  Wallet, TrendingDown, Plus as PlusIcon,
  ShoppingCart, Wrench, Zap, Droplets, Leaf, Package2
} from "lucide-react";

// Hanya 3 tipe manual: Modal, Pengeluaran, Pemasukan Lain
// PENJUALAN sudah otomatis dari StokPOS
const TYPES = [
  {
    value: "PEMASUKAN",
    label: "Pemasukan Lain",
    desc: "Pendapatan non-penjualan",
    icon: PlusIcon,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.35)",
  },
  {
    value: "PENGELUARAN",
    label: "Pengeluaran",
    desc: "Biaya operasional",
    icon: TrendingDown,
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.35)",
  },
  {
    value: "MODAL",
    label: "Modal / Investasi",
    desc: "Suntikan modal awal",
    icon: Wallet,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.35)",
  },
];

// Sub-kategori pengeluaran
const EXPENSE_CATEGORIES = [
  { label: "Benih/Bibit", icon: Leaf },
  { label: "Pupuk/Nutrisi", icon: Droplets },
  { label: "Peralatan", icon: Wrench },
  { label: "Listrik/Air", icon: Zap },
  { label: "Kemasan", icon: Package2 },
  { label: "Lainnya", icon: ShoppingCart },
];

const inputStyle = {
  background: "var(--t-input-bg)",
  borderColor: "var(--t-input-border)",
  color: "var(--t-text-primary)",
} as React.CSSProperties;

const inputClass =
  "w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all";

export function TransactionForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("PENGELUARAN");
  const [category, setCategory] = useState<string>("");

  const selectedType = TYPES.find((t) => t.value === type)!;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    // Untuk MODAL, simpan sebagai PEMASUKAN dengan note bertanda [MODAL]
    if (type === "MODAL") {
      formData.set("type", "PEMASUKAN");
      const existingNote = formData.get("note") as string;
      formData.set("note", `[MODAL] ${existingNote || "Suntikan modal"}`);
    }

    startTransition(async () => {
      const result = await createTransaction(formData);
      if (result?.error) {
        setError("Periksa kembali isian form Anda.");
      } else {
        router.refresh();
        onClose();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Pilih Jenis */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
          Jenis Transaksi
        </p>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => {
            const Icon = t.icon;
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className="flex flex-col items-center gap-1 py-3 rounded-xl border text-center transition-all duration-150 text-xs font-semibold"
                style={
                  active
                    ? { background: t.bg, borderColor: t.border, color: t.color }
                    : { background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-muted)" }
                }
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="type" value={type === "MODAL" ? "PEMASUKAN" : type} />
      </div>

      {/* Sub-kategori pengeluaran */}
      {type === "PENGELUARAN" && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
            Kategori Pengeluaran
          </p>
          <div className="grid grid-cols-3 gap-2">
            {EXPENSE_CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = category === c.label;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCategory(active ? "" : c.label)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl border text-center transition-all text-xs"
                  style={
                    active
                      ? { background: "rgba(244,63,94,0.1)", borderColor: "rgba(244,63,94,0.35)", color: "#f43f5e" }
                      : { background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-muted)" }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {c.label}
                </button>
              );
            })}
          </div>
          {category && <input type="hidden" name="channel" value={category} />}
        </div>
      )}

      {/* Jumlah */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
          Jumlah (Rp)
        </p>
        <input
          name="totalAmount"
          type="number"
          min="0"
          step="100"
          required
          placeholder="Contoh: 150000"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Catatan */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
          Keterangan {type !== "MODAL" && "(opsional)"}
        </p>
        <input
          name="note"
          type="text"
          placeholder={
            type === "PENGELUARAN"
              ? "Beli pupuk nutrisi AB..."
              : type === "MODAL"
              ? "Sumber modal..."
              : "Keterangan pemasukan..."
          }
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Tanggal */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
          Tanggal
        </p>
        <input
          name="occurredAt"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {error && (
        <p className="text-rose-500 text-xs bg-rose-500/10 border border-rose-500/25 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
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
          className="flex-1 rounded-xl font-semibold text-white"
          style={{ background: selectedType.color }}
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
