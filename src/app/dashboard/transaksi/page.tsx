import type { Metadata } from "next";
import { getTransactions } from "@/actions/transaction.actions";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import { TransactionActionMenu } from "@/components/dashboard/TransactionActionMenu";
import { TransactionTableClient } from "@/components/dashboard/TransactionTableClient";
import {
  Receipt, TrendingUp, TrendingDown, DollarSign,
  Wallet, ShoppingCart, Info, Filter, X
} from "lucide-react";
import Link from "next/link";
import { startOfMonth, endOfMonth, parseISO, isValid } from "date-fns";

export const metadata: Metadata = { title: "Transaksi" };

const typeConfig: Record<string, {
  label: string;
  badge: string;
  icon: React.ElementType;
}> = {
  PENJUALAN:   { label: "Penjualan",       badge: "bg-indigo-500/15 text-indigo-400", icon: ShoppingCart },
  PEMASUKAN:   { label: "Pemasukan Lain",  badge: "bg-sky-500/15 text-sky-400",         icon: DollarSign },
  PENGELUARAN: { label: "Pengeluaran",     badge: "bg-rose-500/15 text-rose-400",       icon: TrendingDown },
};

export default async function TransaksiPage(props: {
  searchParams: Promise<{ start?: string; end?: string; preset?: string }>;
}) {
  const sp = await props.searchParams;
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  // Preset filter logic
  if (sp.preset === "this_month") {
    const now = new Date();
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
  } else if (sp.start && sp.end) {
    const s = parseISO(sp.start);
    const e = parseISO(sp.end);
    if (isValid(s) && isValid(e)) {
      startDate = s;
      endDate = e;
    }
  }

  const transactions = await getTransactions({ limit: 100, startDate, endDate });

  const totalPenjualan = transactions
    .filter((t) => t.type === "PENJUALAN")
    .reduce((s, t) => s + parseFloat(t.totalAmount.toString()), 0);

  const totalPemasukan = transactions
    .filter((t) => t.type === "PEMASUKAN")
    .reduce((s, t) => s + parseFloat(t.totalAmount.toString()), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === "PENGELUARAN")
    .reduce((s, t) => s + parseFloat(t.totalAmount.toString()), 0);

  const balance = totalPenjualan + totalPemasukan - totalPengeluaran;

  const summaryCards = [
    {
      label: "Pendapatan Penjualan",
      value: totalPenjualan,
      color: "#6366f1",
      border: "rgba(99,102,241,0.25)",
      icon: ShoppingCart,
      note: "Otomatis dari stok"
    },
    {
      label: "Pemasukan Lain",
      value: totalPemasukan,
      color: "#38bdf8",
      border: "rgba(56,189,248,0.25)",
      icon: DollarSign,
      note: "Modal & pendapatan lain"
    },
    {
      label: "Total Pengeluaran",
      value: totalPengeluaran,
      color: "#f43f5e",
      border: "rgba(244,63,94,0.25)",
      icon: TrendingDown,
      note: "Biaya operasional & kerugian"
    },
    {
      label: "Saldo Bersih",
      value: balance,
      color: balance >= 0 ? "#6366f1" : "#f43f5e",
      border: balance >= 0 ? "rgba(99,102,241,0.25)" : "rgba(244,63,94,0.25)",
      icon: Wallet,
      note: "Pemasukan − Pengeluaran"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>Transaksi</h1>
          <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
            Pemasukan, pengeluaran, dan modal usaha
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick Filters */}
          <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-xl">
            <Link 
              href="/dashboard/transaksi" 
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${!sp.preset ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-500' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              Semua Waktu
            </Link>
            <Link 
              href="/dashboard/transaksi?preset=this_month" 
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${sp.preset === 'this_month' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-500' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              Bulan Ini
            </Link>
          </div>

          <a
            href={`/api/export/transactions${sp.preset ? `?preset=${sp.preset}` : ''}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]"
          >
            Export CSV
          </a>
          
          <TransactionModal />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border p-4 transition-theme"
              style={{ background: "var(--t-card-bg)", borderColor: card.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.color}18` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: card.color }} />
                </div>
                <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>{card.note}</p>
              </div>
              <p className="text-xl font-bold" style={{ color: card.color }}>
                {formatRupiah(card.value)}
              </p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--t-text-secondary)" }}>
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div
        className="rounded-2xl border overflow-hidden transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <div
          className="px-5 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid var(--t-divider)" }}
        >
          <Receipt className="w-4 h-4" style={{ color: "var(--t-text-muted)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--t-text-primary)" }}>
            Riwayat Transaksi
          </h3>
          <span className="ml-auto text-xs" style={{ color: "var(--t-text-muted)" }}>
            {transactions.length} entri
          </span>
        </div>

        <TransactionTableClient transactions={transactions} />
      </div>
    </div>
  );
}
