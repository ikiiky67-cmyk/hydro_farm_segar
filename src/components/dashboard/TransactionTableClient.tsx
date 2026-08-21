"use client";

import { useState } from "react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TransactionActionMenu } from "@/components/dashboard/TransactionActionMenu";
import {
  ShoppingCart, DollarSign, TrendingDown,
  Search, ChevronLeft, ChevronRight, Receipt
} from "lucide-react";

type Transaction = any; // We use any here to accept the serialized Prisma object for simplicity

const typeConfig: Record<string, {
  label: string;
  badge: string;
  icon: React.ElementType;
}> = {
  PENJUALAN: { label: "Penjualan", badge: "bg-indigo-500/15 text-indigo-400", icon: ShoppingCart },
  PEMASUKAN: { label: "Pemasukan Lain", badge: "bg-sky-500/15 text-sky-400", icon: DollarSign },
  PENGELUARAN: { label: "Pengeluaran", badge: "bg-rose-500/15 text-rose-400", icon: TrendingDown },
};

export function TransactionTableClient({ transactions }: { transactions: Transaction[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = transactions.filter((tx) => {
    const s = searchQuery.toLowerCase();
    const typeLabel = typeConfig[tx.type]?.label.toLowerCase() || "";
    return (
      (tx.buyerName && tx.buyerName.toLowerCase().includes(s)) ||
      (tx.note && tx.note.toLowerCase().includes(s)) ||
      (tx.channel && tx.channel.toLowerCase().includes(s)) ||
      typeLabel.includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center bg-[var(--t-input-bg)] border border-[var(--t-input-border)] px-4 py-2.5 rounded-2xl transition-theme focus-within:ring-2 focus-within:ring-indigo-500/50 max-w-sm ml-5 mt-4">
        <Search className="w-4 h-4 mr-3 opacity-50" style={{ color: "var(--t-text-muted)" }} />
        <input
          type="text"
          placeholder="Cari transaksi (nama, keterangan...)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--t-text-muted)] text-[var(--t-text-primary)] transition-colors"
        />
      </div>

      {paginated.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          style={{ color: "var(--t-text-muted)" }}
        >
          <Receipt className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-medium">Tidak ada transaksi ditemukan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--t-divider)" }}>
                {["Tanggal", "Jenis", "Keterangan", "Jumlah", ""].map((h, i) => (
                  <th
                    key={h || i}
                    className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${i === 3 ? "text-right" : i === 4 ? "text-center w-[60px]" : "text-left"
                      }`}
                    style={{ color: "var(--t-text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx) => {
                const config = typeConfig[tx.type] ?? typeConfig["PEMASUKAN"];
                const Icon = config.icon;
                const isExpense = tx.type === "PENGELUARAN";

                const serializedTx = {
                  ...tx,
                  totalAmount: parseFloat(tx.totalAmount.toString()),
                };

                return (
                  <tr
                    key={tx.id}
                    className="t-table-row transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
                      style={{ color: isExpense ? "#f43f5e" : "#6366f1" }}
                    >
                      {isExpense ? "−" : "+"}
                      {formatRupiah(serializedTx.totalAmount)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <TransactionActionMenu transaction={serializedTx} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 pb-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-[var(--t-card-bg)] border border-[var(--t-card-border)] disabled:opacity-50 hover:bg-indigo-500/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold" style={{ color: "var(--t-text-secondary)" }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-[var(--t-card-bg)] border border-[var(--t-card-border)] disabled:opacity-50 hover:bg-indigo-500/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
