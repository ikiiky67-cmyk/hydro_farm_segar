import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getStockMovementsPaginated } from "@/actions/stock.actions";
import { getProducts } from "@/actions/product.actions";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatNumber } from "@/lib/utils";
import { RiwayatFilterBar } from "@/components/dashboard/RiwayatFilterBar";
import {
  ArrowLeft, TrendingUp, TrendingDown, RotateCcw, Trash2,
  Package, History,
  Filter, DollarSign, Boxes,
} from "lucide-react";
import { RiwayatTableClient } from "@/components/dashboard/RiwayatTableClient";

export const metadata: Metadata = { title: "Riwayat Pergerakan Stok" };

const TYPE_CONFIG = {
  PANEN_MASUK: {
    label: "Panen Masuk",
    icon: TrendingUp,
    badge: "bg-indigo-500/15 text-indigo-400",
    valueSign: "+",
    valueColor: "#6366f1",
    desc: "Restok",
  },
  TERJUAL: {
    label: "Terjual",
    icon: TrendingDown,
    badge: "bg-sky-500/15 text-sky-400",
    valueSign: "−",
    valueColor: "#38bdf8",
    desc: "Penjualan",
  },
  RUSAK: {
    label: "Rusak/Terbuang",
    icon: Trash2,
    badge: "bg-rose-500/15 text-rose-400",
    valueSign: "−",
    valueColor: "#f43f5e",
    desc: "Kerugian",
  },
  PENYESUAIAN: {
    label: "Penyesuaian",
    icon: RotateCcw,
    badge: "bg-amber-500/15 text-amber-400",
    valueSign: "±",
    valueColor: "#f59e0b",
    desc: "Koreksi",
  },
} as const;

const TYPE_FILTERS = [
  { value: "SEMUA", label: "Semua" },
  { value: "PANEN_MASUK", label: "Panen Masuk" },
  { value: "TERJUAL", label: "Terjual" },
  { value: "RUSAK", label: "Rusak" },
  { value: "PENYESUAIAN", label: "Penyesuaian" },
];

const PER_PAGE = 1000;

export default async function RiwayatStokPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const productId = params.productId ?? "";
  const typeFilter = params.type ?? "SEMUA";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [data, allProducts] = await Promise.all([
    getStockMovementsPaginated({
      productId: productId || undefined,
      type: typeFilter,
      page,
      perPage: PER_PAGE,
    }),
    getProducts(),
  ]);

  // Hitung agregat nilai berdasarkan filter aktif
  const totalPenjualan = data.movements
    .filter((m) => m.type === "TERJUAL")
    .reduce((s, m) => s + m.totalNilai, 0);

  const totalKerugian = data.movements
    .filter((m) => m.type === "RUSAK")
    .reduce((s, m) => s + m.totalNilai, 0);

  const totalRestok = data.movements
    .filter((m) => m.type === "PANEN_MASUK")
    .reduce((s, m) => s + m.quantity, 0);

  // Build URL helpers
  function buildUrl(overrides: Record<string, string>) {
    const p: Record<string, string> = {
      ...(productId ? { productId } : {}),
      ...(typeFilter !== "SEMUA" ? { type: typeFilter } : {}),
      ...(page > 1 ? { page: String(page) } : {}),
      ...overrides,
    };
    const qs = new URLSearchParams(p).toString();
    return `/dashboard/stok/riwayat${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/stok"
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors hover:opacity-80"
            style={{ background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--t-text-primary)" }}>
              <History className="w-6 h-6 text-indigo-400" />
              Riwayat Pergerakan Stok
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--t-text-muted)" }}>
              {data.total} entri ditemukan
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards (per halaman) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-2xl border p-4 flex items-center gap-3"
          style={{ background: "var(--t-card-bg)", borderColor: "rgba(99,102,241,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-400">{formatRupiah(totalPenjualan)}</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Nilai Penjualan (halaman ini)</p>
          </div>
        </div>
        <div
          className="rounded-2xl border p-4 flex items-center gap-3"
          style={{ background: "var(--t-card-bg)", borderColor: "rgba(244,63,94,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-rose-400">{formatRupiah(totalKerugian)}</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Nilai Kerugian (halaman ini)</p>
          </div>
        </div>
        <div
          className="rounded-2xl border p-4 flex items-center gap-3"
          style={{ background: "var(--t-card-bg)", borderColor: "rgba(245,158,11,0.25)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
            <Boxes className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-amber-500">{formatNumber(totalRestok)} unit</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Total Restok (halaman ini)</p>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="rounded-2xl border p-4 flex flex-col sm:flex-row gap-3"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        {/* Filter Produk */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Filter className="w-4 h-4 flex-shrink-0" style={{ color: "var(--t-text-muted)" }} />
          <RiwayatFilterBar
            products={allProducts.map((p) => ({ id: p.id, name: p.name }))}
            currentProductId={productId}
            currentType={typeFilter}
          />
        </div>

        {/* Filter Jenis */}
        <div className="flex gap-1.5 flex-wrap">
          {TYPE_FILTERS.map((f) => {
            const isActive = typeFilter === f.value;
            return (
              <Link
                key={f.value}
                href={buildUrl({ type: f.value, page: "1" })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={
                  isActive
                    ? { background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.4)", color: "#6366f1" }
                    : { background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-muted)" }
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Tabel Riwayat ── */}
      <RiwayatTableClient movements={data.movements} />
    </div>
  );
}
