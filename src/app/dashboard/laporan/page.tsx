import type { Metadata } from "next";
import { getLaporanLabaRugi, getTransactionsForReport } from "@/actions/transaction.actions";
import { formatRupiah, formatDate } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  ShoppingCart, Wallet
} from "lucide-react";
import { LaporanMonthPicker } from "@/components/dashboard/LaporanMonthPicker";
import { PrintButton } from "@/components/dashboard/PrintButton";
import { LaporanTableTabsClient } from "@/components/dashboard/LaporanTableTabsClient";

export const metadata: Metadata = { title: "Laporan Laba Rugi" };

export default async function LaporanPage(props: {
  searchParams: Promise<{ month?: string }>;
}) {
  const sp = await props.searchParams;
  let targetDate = new Date();
  
  if (sp.month) {
    const [year, month] = sp.month.split("-");
    if (year && month) {
      targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    }
  }

  const [laporan, txData] = await Promise.all([
    getLaporanLabaRugi(targetDate),
    getTransactionsForReport(targetDate)
  ]);
  
  const isProfit = laporan.labaRugi >= 0;
  
  // Serialize Prisma Decimal for Client Component
  const serializedTransactions = txData.transactions.map(t => ({
    ...t,
    totalAmount: parseFloat((t.totalAmount ?? 0).toString()),
    occurredAt: t.occurredAt.toISOString(),
  }));

  const totalTransaksi = laporan.countPenjualan + laporan.countPemasukan + laporan.countPengeluaran;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>
            Laporan Laba Rugi
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
            Periode: {formatDate(laporan.period.start)} — {formatDate(laporan.period.end)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LaporanMonthPicker currentMonth={sp.month || ""} />
          <PrintButton targetDate={targetDate} />
        </div>
      </div>

      {/* ── Summary Cards (Compact 4-Grid) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Pemasukan */}
        <div className="rounded-2xl border p-4 transition-theme flex flex-col justify-between" style={{ background: "var(--t-card-bg)", borderColor: "rgba(99,102,241,0.25)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--t-text-secondary)]">Total Masuk</p>
          </div>
          <div>
            <p className="text-xl font-bold text-indigo-500">{formatRupiah(laporan.totalPemasukan)}</p>
            <p className="text-xs mt-1 text-[var(--t-text-muted)]">Penjualan: {formatRupiah(laporan.totalPenjualan)}</p>
          </div>
        </div>

        {/* Card Pengeluaran */}
        <div className="rounded-2xl border p-4 transition-theme flex flex-col justify-between" style={{ background: "var(--t-card-bg)", borderColor: "rgba(244,63,94,0.25)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--t-text-secondary)]">Total Keluar</p>
          </div>
          <div>
            <p className="text-xl font-bold text-rose-500">{formatRupiah(laporan.totalPengeluaran)}</p>
            <p className="text-xs mt-1 text-[var(--t-text-muted)]">{laporan.countPengeluaran} Entri pengeluaran</p>
          </div>
        </div>

        {/* Card Laba Bersih */}
        <div className="rounded-2xl border p-4 transition-theme flex flex-col justify-between" style={{ background: "var(--t-card-bg)", borderColor: isProfit ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${isProfit ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-500" : "bg-rose-500/15 border-rose-500/25 text-rose-400"}`}>
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--t-text-secondary)]">Laba Bersih</p>
          </div>
          <div>
            <p className={`text-xl font-bold ${isProfit ? "text-emerald-500" : "text-rose-500"}`}>
              {isProfit ? "+" : ""}{formatRupiah(laporan.labaRugi)}
            </p>
            <p className="text-xs mt-1 text-[var(--t-text-muted)]">Bulan berjalan</p>
          </div>
        </div>

        {/* Card Aktivitas */}
        <div className="rounded-2xl border p-4 transition-theme flex flex-col justify-between" style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--t-input-bg)] border border-[var(--t-input-border)] flex items-center justify-center text-[var(--t-text-secondary)]">
              <Activity className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--t-text-secondary)]">Aktivitas</p>
          </div>
          <div>
            <p className="text-xl font-bold text-[var(--t-text-primary)]">{totalTransaksi}</p>
            <p className="text-xs mt-1 text-[var(--t-text-muted)]">Total Transaksi</p>
          </div>
        </div>
      </div>

      {/* Modal tracker Info (Tetap dipertahankan supaya user ingat) */}
      <div
        className="rounded-xl border px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--t-card-bg)", borderColor: "rgba(167,139,250,0.25)" }}
      >
        <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex flex-shrink-0 items-center justify-center">
          <Wallet className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>
          <strong style={{ color: "var(--t-text-primary)" }}>Info:</strong> Modal tercatat sebagai Pemasukan Lain dengan catatan khusus (opsional).
        </p>
      </div>

      {/* ── Table Tabs Client ── */}
      <LaporanTableTabsClient transactions={serializedTransactions} />
      
    </div>
  );
}
