import type { Metadata } from "next";
import { getTransactions } from "@/actions/transaction.actions";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TransactionModal } from "@/components/dashboard/TransactionModal";
import {
  Receipt, TrendingUp, TrendingDown, DollarSign,
  Wallet, ShoppingCart, Info,
} from "lucide-react";

export const metadata: Metadata = { title: "Transaksi | HydroFarm" };

const typeConfig: Record<string, {
  label: string;
  badge: string;
  icon: React.ElementType;
}> = {
  PENJUALAN:   { label: "Penjualan",       badge: "bg-emerald-500/15 text-emerald-500", icon: ShoppingCart },
  PEMASUKAN:   { label: "Pemasukan Lain",  badge: "bg-sky-500/15 text-sky-400",         icon: DollarSign },
  PENGELUARAN: { label: "Pengeluaran",     badge: "bg-rose-500/15 text-rose-400",       icon: TrendingDown },
};

export default async function TransaksiPage() {
  const transactions = await getTransactions(100);

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
      color: "#10b981",
      border: "rgba(16,185,129,0.25)",
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
      color: balance >= 0 ? "#10b981" : "#f43f5e",
      border: balance >= 0 ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)",
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
          {/* Info hint */}
          <div
            className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-xl border"
            style={{
              background: "rgba(16,185,129,0.05)",
              borderColor: "rgba(16,185,129,0.2)",
              color: "var(--t-text-muted)",
            }}
          >
            <Info className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            Penjualan otomatis tercatat via menu Stok
          </div>
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

        {transactions.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            style={{ color: "var(--t-text-muted)" }}
          >
            <Receipt className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-medium">Belum ada transaksi</p>
            <p className="text-sm mt-1">Catat penjualan via menu Stok atau tambah transaksi manual</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--t-divider)" }}>
                  {["Tanggal", "Jenis", "Keterangan", "Jumlah"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${
                        i === 3 ? "text-right" : "text-left"
                      }`}
                      style={{ color: "var(--t-text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const config = typeConfig[tx.type] ?? typeConfig["PEMASUKAN"];
                  const Icon = config.icon;
                  const isExpense = tx.type === "PENGELUARAN";
                  return (
                    <tr
                      key={tx.id}
                      className="t-table-row"
                      style={{ borderBottom: "1px solid var(--t-divider)" }}
                    >
                      <td
                        className="px-5 py-4 text-xs whitespace-nowrap"
                        style={{ color: "var(--t-text-muted)" }}
                      >
                        {formatDate(tx.occurredAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={`border-0 text-xs gap-1.5 ${config.badge}`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs max-w-xs" style={{ color: "var(--t-text-secondary)" }}>
                        {tx.buyerName ? (
                          <span className="font-medium" style={{ color: "var(--t-text-primary)" }}>
                            {tx.buyerName} —{" "}
                          </span>
                        ) : null}
                        {tx.channel ? (
                          <span
                            className="mr-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                            style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}
                          >
                            {tx.channel}
                          </span>
                        ) : null}
                        {tx.note ?? "—"}
                      </td>
                      <td
                        className="px-5 py-4 text-right font-bold whitespace-nowrap"
                        style={{ color: isExpense ? "#f43f5e" : "#10b981" }}
                      >
                        {isExpense ? "−" : "+"}
                        {formatRupiah(parseFloat(tx.totalAmount.toString()))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
