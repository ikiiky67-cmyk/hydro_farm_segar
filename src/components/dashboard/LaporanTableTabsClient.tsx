"use client";

import { useState, useMemo } from "react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, ArrowDownRight, LayoutList, 
  CalendarDays, PieChart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TransactionItem = {
  id: string;
  type: string;
  channel: string | null;
  totalAmount: number;
  note: string | null;
  occurredAt: string | Date;
  items?: { product: { name: string } }[];
};

export function LaporanTableTabsClient({ transactions }: { transactions: TransactionItem[] }) {
  const [activeTab, setActiveTab] = useState<"arus-kas" | "harian" | "kategori">("arus-kas");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleTabChange = (tab: "arus-kas" | "harian" | "kategori") => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset halaman saat ganti tab
  };

  // Hitungan Rekap Harian
  const dailyData = useMemo(() => {
    const map = new Map<string, { masuk: number; keluar: number }>();
    
    transactions.forEach(t => {
      const date = new Date(t.occurredAt);
      const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      
      if (!map.has(dayKey)) map.set(dayKey, { masuk: 0, keluar: 0 });
      
      const curr = map.get(dayKey)!;
      if (t.type === "PENGELUARAN") {
        curr.keluar += t.totalAmount;
      } else {
        curr.masuk += t.totalAmount;
      }
    });

    return Array.from(map.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date)); // Descending by date
  }, [transactions]);

  // Hitungan Kategori
  const categoryData = useMemo(() => {
    const map = new Map<string, { total: number; type: string; count: number }>();
    
    transactions.forEach(t => {
      const isMasuk = t.type !== "PENGELUARAN";
      const catName = t.type === "PENJUALAN" 
        ? "Penjualan Sayur" 
        : (t.channel || (isMasuk ? "Pemasukan Lainnya" : "Pengeluaran Lainnya"));
      
      const key = `${catName}-${t.type}`;
      
      if (!map.has(key)) map.set(key, { total: 0, type: t.type, count: 0 });
      const curr = map.get(key)!;
      curr.total += t.totalAmount;
      curr.count += 1;
    });

    return Array.from(map.entries())
      .map(([key, data]) => ({ name: key.split("-")[0], ...data }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  // Data Array yang aktif
  const currentArray = 
    activeTab === "arus-kas" ? transactions : 
    activeTab === "harian" ? dailyData : 
    categoryData;

  // Logika Pagination
  const totalPages = Math.ceil(currentArray.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentArray.slice(startIndex, endIndex);

  return (
    <div className="rounded-2xl border flex flex-col mt-8" style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}>
      {/* Header Tabs */}
      <div className="flex gap-1 p-3 border-b overflow-x-auto no-scrollbar" style={{ borderColor: "var(--t-divider)" }}>
        <button
          onClick={() => handleTabChange("arus-kas")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "arus-kas" ? "bg-indigo-500 text-white" : "hover:bg-indigo-500/10 text-[var(--t-text-secondary)]"
          }`}
        >
          <LayoutList className="w-4 h-4" />
          Rincian Arus Kas
        </button>
        <button
          onClick={() => handleTabChange("harian")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "harian" ? "bg-emerald-500 text-white" : "hover:bg-emerald-500/10 text-[var(--t-text-secondary)]"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Rekap Harian
        </button>
        <button
          onClick={() => handleTabChange("kategori")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === "kategori" ? "bg-amber-500 text-white" : "hover:bg-amber-500/10 text-[var(--t-text-secondary)]"
          }`}
        >
          <PieChart className="w-4 h-4" />
          Analisis Kategori
        </button>
      </div>

      {/* Konten Tab */}
      <div className="p-0 overflow-x-auto">
        {activeTab === "arus-kas" && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--t-input-bg)] border-b border-[var(--t-divider)] text-[var(--t-text-muted)]">
                <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wide text-xs whitespace-nowrap">Waktu</th>
                <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wide text-xs">Kategori / Keterangan</th>
                <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wide text-xs">Tipe</th>
                <th className="px-5 py-3.5 text-right font-semibold uppercase tracking-wide text-xs">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[var(--t-text-muted)]">Belum ada transaksi bulan ini</td>
                </tr>
              ) : (
                (paginatedData as TransactionItem[]).map((t) => {
                  const isMasuk = t.type !== "PENGELUARAN";
                  const dateObj = new Date(t.occurredAt);
                  const itemsStr = t.items?.map(i => i.product.name).join(", ");
                  const desc = t.type === "PENJUALAN" ? `Penjualan: ${itemsStr || "Sayur"}` : (t.note || t.channel || "Lainnya");
                  return (
                    <tr key={t.id} className="border-b border-[var(--t-divider)] hover:bg-[var(--t-input-bg)]/50 transition-colors">
                      <td className="px-5 py-3.5 text-xs text-[var(--t-text-secondary)] whitespace-nowrap">
                        {dateObj.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                        <span className="block text-[10px] opacity-70">
                          {dateObj.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-medium text-[var(--t-text-primary)] max-w-[200px] truncate" title={desc}>
                        {desc}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge className={`border-0 text-[10px] gap-1 ${isMasuk ? "bg-indigo-500/15 text-indigo-500" : "bg-rose-500/15 text-rose-500"}`}>
                          {isMasuk ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {t.type}
                        </Badge>
                      </td>
                      <td className={`px-5 py-3.5 text-right font-bold text-sm whitespace-nowrap ${isMasuk ? "text-indigo-400" : "text-rose-400"}`}>
                        {isMasuk ? "+" : "−"}{formatRupiah(t.totalAmount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {activeTab === "harian" && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--t-input-bg)] border-b border-[var(--t-divider)] text-[var(--t-text-muted)]">
                <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wide text-xs">Tanggal</th>
                <th className="px-5 py-3.5 text-right font-semibold uppercase tracking-wide text-xs">Pemasukan</th>
                <th className="px-5 py-3.5 text-right font-semibold uppercase tracking-wide text-xs">Pengeluaran</th>
                <th className="px-5 py-3.5 text-right font-semibold uppercase tracking-wide text-xs">Laba Bersih</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[var(--t-text-muted)]">Tidak ada data harian</td>
                </tr>
              ) : (
                (paginatedData as any[]).map((d) => {
                  const laba = d.masuk - d.keluar;
                  const isProfit = laba >= 0;
                  const dateObj = new Date(d.date);
                  return (
                    <tr key={d.date} className="border-b border-[var(--t-divider)] hover:bg-[var(--t-input-bg)]/50 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-semibold text-[var(--t-text-primary)] whitespace-nowrap">
                        {dateObj.toLocaleDateString("id-ID", { weekday: 'short', day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-indigo-400 whitespace-nowrap">
                        {d.masuk > 0 ? `+${formatRupiah(d.masuk)}` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-rose-400 whitespace-nowrap">
                        {d.keluar > 0 ? `−${formatRupiah(d.keluar)}` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${isProfit ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                          {formatRupiah(laba)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {activeTab === "kategori" && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--t-input-bg)] border-b border-[var(--t-divider)] text-[var(--t-text-muted)]">
                <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wide text-xs">Kategori / Sumber</th>
                <th className="px-5 py-3.5 text-center font-semibold uppercase tracking-wide text-xs">Tipe</th>
                <th className="px-5 py-3.5 text-center font-semibold uppercase tracking-wide text-xs">Frekuensi</th>
                <th className="px-5 py-3.5 text-right font-semibold uppercase tracking-wide text-xs">Total Nominal</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[var(--t-text-muted)]">Tidak ada data kategori</td>
                </tr>
              ) : (
                (paginatedData as any[]).map((c, i) => {
                  const isMasuk = c.type !== "PENGELUARAN";
                  return (
                    <tr key={i} className="border-b border-[var(--t-divider)] hover:bg-[var(--t-input-bg)]/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-[var(--t-text-primary)]">
                        {c.name}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge className={`border-0 text-[10px] ${isMasuk ? "bg-indigo-500/15 text-indigo-500" : "bg-rose-500/15 text-rose-500"}`}>
                          {c.type}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-center text-[var(--t-text-secondary)] text-xs">
                        {c.count}x
                      </td>
                      <td className={`px-5 py-4 text-right font-bold text-sm whitespace-nowrap ${isMasuk ? "text-indigo-400" : "text-rose-400"}`}>
                        {formatRupiah(c.total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "var(--t-divider)" }}>
          <p className="text-xs text-[var(--t-text-muted)]">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, currentArray.length)} dari {currentArray.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold px-3 text-[var(--t-text-primary)]">
              Hal {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
