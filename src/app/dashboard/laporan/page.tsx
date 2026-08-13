import type { Metadata } from "next";
import { getLaporanLabaRugi } from "@/actions/transaction.actions";
import { formatRupiah, formatDate } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, DollarSign, ArrowUpDown,
  ShoppingCart, Wallet, PieChart,
} from "lucide-react";

export const metadata: Metadata = { title: "Laporan Laba Rugi" };

export default async function LaporanPage() {
  const laporan = await getLaporanLabaRugi();
  const isProfit = laporan.labaRugi >= 0;

  const incomeItems = [
    {
      label: "Pendapatan Penjualan",
      value: laporan.totalPenjualan,
      count: laporan.countPenjualan,
      countLabel: "transaksi penjualan",
      color: "#10b981",
      borderColor: "rgba(16,185,129,0.25)",
      iconBg: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25",
      icon: ShoppingCart,
    },
    {
      label: "Pemasukan Lain",
      value: laporan.totalPemasukanLain,
      count: laporan.countPemasukan,
      countLabel: "entri pemasukan",
      color: "#38bdf8",
      borderColor: "rgba(56,189,248,0.25)",
      iconBg: "bg-sky-500/15 text-sky-400 border border-sky-500/25",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>
          Laporan Laba Rugi
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
          Periode: {formatDate(laporan.period.start)} — {formatDate(laporan.period.end)}
        </p>
      </div>

      {/* ── Pemasukan ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--t-text-secondary)" }}>
            Pemasukan
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {incomeItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border p-5 transition-theme"
                style={{ background: "var(--t-card-bg)", borderColor: item.borderColor }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold" style={{ color: item.color }}>
                  {formatRupiah(item.value)}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--t-text-secondary)" }}>
                  {item.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>
                  {item.count} {item.countLabel}
                </p>
              </div>
            );
          })}
        </div>

        {/* Total Pemasukan */}
        <div
          className="mt-3 rounded-xl px-5 py-3 flex items-center justify-between"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--t-text-secondary)" }}>
            Total Pemasukan
          </p>
          <p className="font-bold text-emerald-500">{formatRupiah(laporan.totalPemasukan)}</p>
        </div>
      </div>

      {/* ── Pengeluaran ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--t-text-secondary)" }}>
            Pengeluaran
          </h2>
        </div>

        <div
          className="rounded-2xl border p-5 transition-theme"
          style={{ background: "var(--t-card-bg)", borderColor: "rgba(244,63,94,0.25)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-rose-400">
                {formatRupiah(laporan.totalPengeluaran)}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--t-text-secondary)" }}>
                Total Pengeluaran
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>
                {laporan.countPengeluaran} entri pengeluaran
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
          </div>

          {/* Breakdown per kategori */}
          {laporan.pengeluaranPerKategori.length > 0 && (
            <div style={{ borderTop: "1px solid var(--t-divider)" }} className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "var(--t-text-muted)" }}>
                <PieChart className="w-3 h-3" />
                Breakdown Kategori
              </p>
              <div className="space-y-2">
                {laporan.pengeluaranPerKategori.map((k) => {
                  const pct = laporan.totalPengeluaran > 0
                    ? Math.round((k.total / laporan.totalPengeluaran) * 100)
                    : 0;
                  return (
                    <div key={k.kategori}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ color: "var(--t-text-secondary)" }}>{k.kategori}</span>
                        <span className="font-semibold text-rose-400">{formatRupiah(k.total)}</span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--t-input-border)" }}
                      >
                        <div
                          className="h-full rounded-full bg-rose-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Laba / Rugi ── */}
      <div
        className="rounded-2xl border p-6 transition-theme"
        style={{
          background: "var(--t-card-bg)",
          borderColor: isProfit ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: isProfit ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
                color: isProfit ? "#10b981" : "#f43f5e",
              }}
            >
              <ArrowUpDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: "var(--t-text-primary)" }}>
                {isProfit ? "Total Laba Bersih" : "Total Rugi Bersih"}
              </p>
              <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>
                Bulan berjalan
              </p>
            </div>
          </div>
          <p className="text-3xl font-bold" style={{ color: isProfit ? "#10b981" : "#f43f5e" }}>
            {isProfit ? "+" : ""}{formatRupiah(laporan.labaRugi)}
          </p>
        </div>

        <div className="mt-4 pt-4 text-sm" style={{ borderTop: "1px solid var(--t-divider)", color: "var(--t-text-secondary)" }}>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <span>
              Penjualan: <strong className="text-emerald-500">{formatRupiah(laporan.totalPenjualan)}</strong>
            </span>
            <span>
              Pemasukan Lain: <strong className="text-sky-400">{formatRupiah(laporan.totalPemasukanLain)}</strong>
            </span>
            <span>
              Pengeluaran: <strong className="text-rose-400">{formatRupiah(laporan.totalPengeluaran)}</strong>
            </span>
          </div>
          <p className="mt-2">
            ({formatRupiah(laporan.totalPemasukan)}) − ({formatRupiah(laporan.totalPengeluaran)}) ={" "}
            <span className="font-semibold" style={{ color: isProfit ? "#10b981" : "#f43f5e" }}>
              {formatRupiah(laporan.labaRugi)}
            </span>
          </p>
        </div>
      </div>

      {/* Modal tracker */}
      <div
        className="rounded-xl border px-5 py-4 flex items-center gap-3"
        style={{ background: "var(--t-card-bg)", borderColor: "rgba(167,139,250,0.25)" }}
      >
        <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-violet-400" />
        </div>
        <div className="text-sm">
          <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Modal/Investasi</p>
          <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>
            Modal tercatat sebagai Pemasukan Lain dengan catatan [MODAL]
          </p>
        </div>
      </div>
    </div>
  );
}
