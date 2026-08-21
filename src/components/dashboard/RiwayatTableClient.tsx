"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatNumber } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, RotateCcw, Trash2,
  Package, ChevronLeft, ChevronRight, History, Search
} from "lucide-react";

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

type StockMovement = any;

export function RiwayatTableClient({ movements }: { movements: StockMovement[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = movements.filter((m) => {
    const s = searchQuery.toLowerCase();
    const typeLabel = TYPE_CONFIG[m.type as keyof typeof TYPE_CONFIG]?.label.toLowerCase() || "";
    return (
      (m.product.name && m.product.name.toLowerCase().includes(s)) ||
      (m.note && m.note.toLowerCase().includes(s)) ||
      typeLabel.includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
    >
      {/* Search Bar */}
      <div className="p-4" style={{ borderBottom: "1px solid var(--t-divider)" }}>
        <div className="flex items-center bg-[var(--t-input-bg)] border border-[var(--t-input-border)] px-4 py-2.5 rounded-2xl transition-theme focus-within:ring-2 focus-within:ring-indigo-500/50 max-w-sm">
          <Search className="w-4 h-4 mr-3 opacity-50" style={{ color: "var(--t-text-muted)" }} />
          <input
            type="text"
            placeholder="Cari produk sayuran, catatan, atau jenis..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--t-text-muted)] text-[var(--t-text-primary)] transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20" style={{ color: "var(--t-text-muted)" }}>
          <History className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-medium">Tidak ada data ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--t-divider)", background: "var(--t-card-bg)" }}>
                {["Produk", "Jenis", "Jumlah", "Harga/Satuan", "Nilai", "Catatan", "Waktu"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${i >= 2 && i <= 4 ? "text-right" : "text-left"
                      }`}
                    style={{ color: "var(--t-text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((m) => {
                const cfg = TYPE_CONFIG[m.type as keyof typeof TYPE_CONFIG];
                const Icon = cfg.icon;
                return (
                  <tr
                    key={m.id}
                    className="t-table-row transition-colors"
                    style={{ borderBottom: "1px solid var(--t-divider)" }}
                  >
                    {/* Produk */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border"
                          style={{ borderColor: "var(--t-card-border)", background: "var(--t-input-bg)" }}
                        >
                          {m.product.imageUrl ? (
                            <Image
                              src={m.product.imageUrl}
                              alt={m.product.name}
                              width={36}
                              height={36}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          ) : (
                            <Package className="w-4 h-4 opacity-30" style={{ color: "var(--t-text-muted)" }} />
                          )}
                        </div>
                        <span className="font-medium" style={{ color: "var(--t-text-primary)" }}>
                          {m.product.name}
                        </span>
                      </div>
                    </td>

                    {/* Jenis */}
                    <td className="px-5 py-3.5">
                      <Badge className={`border-0 text-xs gap-1 ${cfg.badge}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </Badge>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--t-text-muted)" }}>
                        {cfg.desc}
                      </p>
                    </td>

                    {/* Jumlah */}
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-semibold" style={{ color: cfg.valueColor }}>
                        {cfg.valueSign}
                        {formatNumber(m.quantity)} {m.product.unit}
                      </span>
                    </td>

                    {/* Harga/Satuan */}
                    <td className="px-5 py-3.5 text-right text-xs" style={{ color: "var(--t-text-muted)" }}>
                      {formatRupiah(m.pricePerUnit)}
                      <span className="block text-[10px]">/{m.product.unit}</span>
                    </td>

                    {/* Nilai */}
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className="font-bold text-sm"
                        style={{
                          color:
                            m.type === "TERJUAL"
                              ? "#6366f1"
                              : m.type === "RUSAK"
                                ? "#f43f5e"
                                : m.type === "PANEN_MASUK"
                                  ? "var(--t-text-secondary)"
                                  : "#f59e0b",
                        }}
                      >
                        {m.type === "TERJUAL" ? "+" : m.type === "RUSAK" ? "−" : ""}
                        {formatRupiah(m.totalNilai)}
                      </span>
                    </td>

                    {/* Catatan */}
                    <td
                      className="px-5 py-3.5 text-xs max-w-[180px] truncate"
                      style={{ color: "var(--t-text-muted)" }}
                      title={m.note ?? ""}
                    >
                      {m.note ?? "—"}
                    </td>

                    {/* Waktu */}
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "var(--t-text-muted)" }}>
                      {new Date(m.recordedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <span className="block text-[10px] opacity-70">
                        {new Date(m.recordedAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div
          className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderTop: "1px solid var(--t-divider)" }}
        >
          <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>
            Menampilkan{" "}
            <span className="font-semibold" style={{ color: "var(--t-text-primary)" }}>
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)}
            </span>{" "}
            dari <span className="font-semibold" style={{ color: "var(--t-text-primary)" }}>{filtered.length}</span> entri
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:opacity-80 disabled:opacity-30"
              style={{ background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-secondary)" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:opacity-80 disabled:opacity-30"
              style={{ background: "var(--t-input-bg)", borderColor: "var(--t-input-border)", color: "var(--t-text-secondary)" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
