"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createStockMovement } from "@/actions/stock.actions";
import {
  TrendingUp, TrendingDown, Trash2, RotateCcw,
  Package, X, Check, Minus, Plus, Warehouse
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  unit: string;
  imageUrl: string | null;
  currentStock: number;
  pricePerKg: number;
};

type ActionType = "PANEN_MASUK" | "TERJUAL" | "RUSAK" | "PENYESUAIAN";

const ACTIONS: {
  type: ActionType;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  badgeCls: string;
}[] = [
  {
    type: "PANEN_MASUK",
    label: "Panen Masuk",
    sublabel: "Restok",
    icon: TrendingUp,
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.35)",
    badgeCls: "bg-emerald-500/15 text-emerald-500",
  },
  {
    type: "TERJUAL",
    label: "Terjual",
    sublabel: "Pendapatan",
    icon: TrendingDown,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.35)",
    badgeCls: "bg-sky-500/15 text-sky-400",
  },
  {
    type: "RUSAK",
    label: "Rusak/Terbuang",
    sublabel: "Kerugian",
    icon: Trash2,
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.35)",
    badgeCls: "bg-rose-500/15 text-rose-400",
  },
  {
    type: "PENYESUAIAN",
    label: "Penyesuaian",
    sublabel: "+/− Stok",
    icon: RotateCcw,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
    badgeCls: "bg-amber-500/15 text-amber-400",
  },
];

export function StokPOS({ products }: { products: Product[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Panel state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType>("TERJUAL");
  const [qty, setQty] = useState<number>(1);
  const [note, setNote] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const openPanel = (p: Product) => {
    setSelectedProduct(p);
    setSelectedAction("TERJUAL");
    setQty(1);
    setNote("");
    setBuyerName("");
    setError(null);
    setSuccess(false);
  };

  const closePanel = () => {
    setSelectedProduct(null);
    setError(null);
    setSuccess(false);
  };

  const selectedActionDef = ACTIONS.find((a) => a.type === selectedAction)!;

  const handleConfirm = () => {
    if (!selectedProduct || qty <= 0) return;
    setError(null);

    const formData = new FormData();
    formData.set("productId", selectedProduct.id);
    formData.set("type", selectedAction);
    formData.set("quantity", qty.toString());
    if (note) formData.set("note", note);
    if (selectedAction === "TERJUAL" && buyerName) formData.set("buyerName", buyerName);

    startTransition(async () => {
      const result = await createStockMovement(formData);
      if (result?.error) {
        setError("Gagal menyimpan. Periksa kembali.");
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => {
          closePanel();
        }, 1200);
      }
    });
  };

  const stockColor = (stock: number) =>
    stock < 1 ? "#f43f5e" : stock < 5 ? "#f59e0b" : "#10b981";

  return (
    <div className="flex gap-6">
      {/* ── Grid Produk ── */}
      <div className="flex-1 min-w-0">
        {products.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border"
            style={{ color: "var(--t-text-muted)", borderColor: "var(--t-card-border)", background: "var(--t-card-bg)" }}
          >
            <Warehouse className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">Belum ada produk aktif</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => {
              const isSelected = selectedProduct?.id === p.id;
              return (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openPanel(p)}
                  className="text-left rounded-2xl border overflow-hidden transition-all duration-200 focus:outline-none"
                  style={{
                    background: isSelected ? "rgba(16,185,129,0.06)" : "var(--t-card-bg)",
                    borderColor: isSelected ? "rgba(16,185,129,0.5)" : "var(--t-card-border)",
                    boxShadow: isSelected ? "0 0 0 2px rgba(16,185,129,0.3)" : "none",
                  }}
                >
                  {/* Foto */}
                  <div
                    className="w-full h-28 flex items-center justify-center"
                    style={{ background: "var(--t-input-bg)" }}
                  >
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Package className="w-10 h-10 opacity-20" style={{ color: "var(--t-text-muted)" }} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p
                      className="text-sm font-semibold leading-tight truncate"
                      style={{ color: "var(--t-text-primary)" }}
                    >
                      {p.name}
                    </p>
                    <p
                      className="text-xs mt-1 font-bold"
                      style={{ color: stockColor(p.currentStock) }}
                    >
                      {p.currentStock.toFixed(2)} {p.unit}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Panel Aksi (Slide in) ── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-80 flex-shrink-0 rounded-2xl border overflow-hidden self-start sticky top-4"
            style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
          >
            {/* Header panel */}
            <div
              className="px-4 pt-4 pb-3 flex items-start justify-between"
              style={{ borderBottom: "1px solid var(--t-divider)" }}
            >
              <div className="flex gap-3 items-center min-w-0">
                {selectedProduct.imageUrl ? (
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--t-input-bg)" }}
                  >
                    <Package className="w-5 h-5 opacity-30" style={{ color: "var(--t-text-muted)" }} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--t-text-primary)" }}>
                    {selectedProduct.name}
                  </p>
                  <p className="text-xs" style={{ color: stockColor(selectedProduct.currentStock) }}>
                    Stok: {selectedProduct.currentStock.toFixed(2)} {selectedProduct.unit}
                  </p>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70 flex-shrink-0 ml-2"
                style={{ background: "var(--t-input-bg)", color: "var(--t-text-secondary)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Pilih Aksi */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
                  Jenis Pergerakan
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIONS.map((a) => {
                    const Icon = a.icon;
                    const active = selectedAction === a.type;
                    return (
                      <button
                        key={a.type}
                        onClick={() => setSelectedAction(a.type)}
                        className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-150"
                        style={
                          active
                            ? { background: a.bg, borderColor: a.border, color: a.color }
                            : { background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-muted)" }
                        }
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold leading-tight">{a.label}</span>
                        <span className="text-[10px] opacity-70">{a.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Jumlah */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
                  Jumlah ({selectedProduct.unit})
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty((q) => Math.max(0.1, parseFloat((q - 1).toFixed(3))))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors hover:opacity-80"
                    style={{ background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-secondary)" }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={qty}
                    onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                    className="flex-1 text-center border rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/30"
                    style={{
                      background: "var(--t-input-bg)",
                      borderColor: "var(--t-input-border)",
                      color: "var(--t-text-primary)",
                    }}
                  />
                  <button
                    onClick={() => setQty((q) => parseFloat((q + 1).toFixed(3)))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors hover:opacity-80"
                    style={{ background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-secondary)" }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Nama Pembeli (hanya TERJUAL) */}
              {selectedAction === "TERJUAL" && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
                    Nama Pembeli (opsional)
                  </p>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Nama pembeli..."
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                    style={{
                      background: "var(--t-input-bg)",
                      borderColor: "var(--t-input-border)",
                      color: "var(--t-text-primary)",
                    }}
                  />
                </div>
              )}

              {/* Catatan */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--t-text-muted)" }}>
                  Catatan (opsional)
                </p>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tambahkan catatan..."
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
                  style={{
                    background: "var(--t-input-bg)",
                    borderColor: "var(--t-input-border)",
                    color: "var(--t-text-primary)",
                  }}
                />
              </div>

              {/* Estimasi nilai (hanya TERJUAL) */}
              {selectedAction === "TERJUAL" && qty > 0 && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Estimasi Pendapatan</p>
                  <p className="font-bold text-emerald-500 text-base">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                      qty * selectedProduct.pricePerKg
                    )}
                  </p>
                </div>
              )}

              {/* Estimasi kerugian (RUSAK) */}
              {selectedAction === "RUSAK" && qty > 0 && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)" }}
                >
                  <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Estimasi Kerugian</p>
                  <p className="font-bold text-rose-400 text-base">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
                      qty * selectedProduct.pricePerKg
                    )}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-rose-500 text-xs bg-rose-500/10 border border-rose-500/25 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              {/* Tombol Konfirmasi */}
              <button
                onClick={handleConfirm}
                disabled={pending || qty <= 0 || success}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
                style={
                  success
                    ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }
                    : { background: selectedActionDef.bg, color: selectedActionDef.color, border: `1px solid ${selectedActionDef.border}` }
                }
              >
                {success ? (
                  <>
                    <Check className="w-4 h-4" />
                    Tersimpan!
                  </>
                ) : pending ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <selectedActionDef.icon className="w-4 h-4" />
                    {selectedActionDef.label} — {qty} {selectedProduct.unit}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
