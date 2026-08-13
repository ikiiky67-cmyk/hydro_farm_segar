import type { Metadata } from "next";
import Link from "next/link";
import { getAllStockSummary, getStockMovements } from "@/actions/stock.actions";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatRupiah } from "@/lib/utils";
import { StokPOS } from "@/components/dashboard/StokPOS";
import {
  TrendingUp, TrendingDown, RotateCcw, Trash2,
  History, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = { title: "Manajemen Stok" };

const movementTypeConfig = {
  PANEN_MASUK: { label: "Panen Masuk",   icon: TrendingUp,   badge: "bg-emerald-500/15 text-emerald-500" },
  TERJUAL:     { label: "Terjual",        icon: TrendingDown, badge: "bg-sky-500/15 text-sky-400" },
  RUSAK:       { label: "Rusak/Terbuang", icon: Trash2,       badge: "bg-rose-500/15 text-rose-400" },
  PENYESUAIAN: { label: "Penyesuaian",   icon: RotateCcw,    badge: "bg-amber-500/15 text-amber-400" },
};

export default async function StokPage() {
  const [stockSummary, recentMovements] = await Promise.all([
    getAllStockSummary(),
    getStockMovements(),
  ]);

  const posProducts = stockSummary.map((p) => ({
    id: p.id,
    name: p.name,
    unit: p.unit,
    imageUrl: p.imageUrl,
    currentStock: p.currentStock,
    pricePerKg: p.pricePerKg,
  }));

  // 5 pergerakan terbaru untuk preview
  const previewMovements = recentMovements.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>
          Manajemen Stok
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
          Klik produk untuk mencatat pergerakan stok
        </p>
      </div>

      {/* POS Grid */}
      <StokPOS products={posProducts} />

      {/* Riwayat Preview + tombol lihat semua */}
      <div
        className="rounded-2xl border overflow-hidden transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <div
          className="px-5 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid var(--t-divider)" }}
        >
          <History className="w-4 h-4" style={{ color: "var(--t-text-muted)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--t-text-primary)" }}>
            Pergerakan Terbaru
          </h3>
          <span className="text-xs ml-1" style={{ color: "var(--t-text-muted)" }}>
            (5 terakhir)
          </span>
          <Link
            href="/dashboard/stok/riwayat"
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
            style={{
              background: "rgba(16,185,129,0.1)",
              borderColor: "rgba(16,185,129,0.3)",
              color: "#10b981",
            }}
          >
            Lihat Riwayat Lengkap
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {previewMovements.length === 0 ? (
          <div className="flex flex-col items-center py-12" style={{ color: "var(--t-text-muted)" }}>
            <History className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">Belum ada riwayat pergerakan stok</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--t-divider)" }}>
            {previewMovements.map((m) => {
              const cfg = movementTypeConfig[m.type as keyof typeof movementTypeConfig];
              const Icon = cfg.icon;
              const qty = parseFloat(m.quantity.toString());
              const price = parseFloat((m.product as { name: string; unit: string; pricePerKg?: { toString(): string } }).pricePerKg?.toString() ?? "0");
              const nilai = qty * price;
              const showNilai = m.type === "TERJUAL" || m.type === "RUSAK";
              return (
                <div key={m.id} className="px-5 py-3.5 flex items-center gap-4 t-table-row">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Badge className={`border-0 text-xs gap-1 flex-shrink-0 ${cfg.badge}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </Badge>
                    <span className="text-sm font-medium truncate" style={{ color: "var(--t-text-primary)" }}>
                      {m.product.name}
                    </span>
                    {m.note && (
                      <span className="text-xs truncate hidden sm:block" style={{ color: "var(--t-text-muted)" }}>
                        · {m.note}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--t-text-primary)" }}>
                      {formatNumber(qty)} {m.product.unit}
                    </p>
                    {showNilai && price > 0 && (
                      <p
                        className="text-xs font-semibold"
                        style={{ color: m.type === "TERJUAL" ? "#10b981" : "#f43f5e" }}
                      >
                        {m.type === "TERJUAL" ? "+" : "−"}{formatRupiah(nilai)}
                      </p>
                    )}
                  </div>
                  <p className="text-xs flex-shrink-0 w-20 text-right" style={{ color: "var(--t-text-muted)" }}>
                    {new Date(m.recordedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer tombol navigasi */}
        {previewMovements.length > 0 && (
          <div
            className="px-5 py-3 flex justify-center"
            style={{ borderTop: "1px solid var(--t-divider)" }}
          >
            <Link
              href="/dashboard/stok/riwayat"
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "#10b981" }}
            >
              Lihat Semua Riwayat
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
