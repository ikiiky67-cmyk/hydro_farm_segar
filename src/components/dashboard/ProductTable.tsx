"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, ImageOff, CheckSquare, Square, Eye, EyeOff, Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { DeleteProductButton } from "@/components/dashboard/DeleteProductButton";
import { bulkUpdateProductStatus } from "@/actions/product.actions";

type ProductWithStock = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  pricePerKg: number;
  unit: string;
  currentStock: number;
  minStock: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
};

export function ProductTable({ products }: { products: ProductWithStock[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  // SEARCH & PAGINATION
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (isActive: boolean) => {
    if (selectedIds.size === 0) return;
    startTransition(async () => {
      await bulkUpdateProductStatus(Array.from(selectedIds), isActive);
      setSelectedIds(new Set());
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Search Bar ── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center bg-[var(--t-input-bg)] border border-[var(--t-input-border)] px-4 py-2.5 rounded-2xl transition-theme focus-within:ring-2 focus-within:ring-indigo-500/50 max-w-sm">
          <Search className="w-4 h-4 mr-3 opacity-50" style={{ color: "var(--t-text-muted)" }} />
          <input
            type="text"
            placeholder="Cari produk sayuran atau kategori..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="w-full bg-transparent outline-none text-sm placeholder:text-[var(--t-text-muted)] text-[var(--t-text-primary)] transition-colors"
          />
        </div>
      </div>

      {/* ── Bulk Actions Toolbar ── */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl flex items-center justify-between border shadow-sm animate-in fade-in slide-in-from-top-2"
          style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
        >
          <div className="flex items-center gap-2 px-2">
            <Badge className="bg-indigo-500 text-white font-medium hover:bg-indigo-500">
              {selectedIds.size} dipilih
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction(true)}
              disabled={pending}
              className="h-8 gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
            >
              <Eye className="w-3.5 h-3.5" />
              Aktifkan
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction(false)}
              disabled={pending}
              className="h-8 gap-1.5 border-zinc-500/30 text-zinc-600 hover:bg-zinc-500/10 hover:text-zinc-700"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Nonaktifkan
            </Button>
          </div>
        </div>
      )}

      {/* ── Tabel ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--t-divider)", background: "var(--t-card-bg)" }}>
              <th className="px-4 py-3.5 w-[40px]">
                <button onClick={toggleSelectAll} className="text-indigo-500 hover:text-indigo-400">
                  {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </th>
              {["Foto", "Produk", "Kategori", "Harga", "Stok", "Status", ""].map((h, i) => (
                <th
                  key={h || i}
                  className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h === "Foto" ? "text-center w-[72px]" :
                      h === "Harga" || h === "Stok" ? "text-right" :
                        h === "Status" ? "text-center" : "text-left"
                    }`}
                  style={{ color: "var(--t-text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className="t-table-row transition-colors"
                style={{
                  borderBottom: "1px solid var(--t-divider)",
                  backgroundColor: selectedIds.has(product.id) ? "rgba(99,102,241,0.05)" : "transparent"
                }}
              >
                {/* Checkbox */}
                <td className="px-4 py-3">
                  <button onClick={() => toggleSelect(product.id)} className="text-indigo-500 hover:text-indigo-400">
                    {selectedIds.has(product.id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 opacity-30" />
                    )}
                  </button>
                </td>

                {/* ── Foto Produk ── */}
                <td className="px-4 py-3 text-center">
                  <div className="mx-auto w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center border"
                    style={{ borderColor: "var(--t-card-border)", background: "var(--t-input-bg)" }}
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <ImageOff
                        className="w-5 h-5 opacity-30"
                        style={{ color: "var(--t-text-muted)" }}
                      />
                    )}
                  </div>
                </td>

                {/* ── Nama & Slug ── */}
                <td className="px-4 py-3">
                  <p className="font-medium" style={{ color: "var(--t-text-primary)" }}>{product.name}</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--t-text-muted)" }}>/{product.slug}</p>
                </td>

                {/* ── Kategori ── */}
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{
                      background: "var(--t-badge-bg)",
                      color: "var(--t-badge-text)",
                      border: "1px solid var(--t-badge-border)",
                    }}
                  >
                    {product.category ?? "—"}
                  </span>
                </td>

                {/* ── Harga ── */}
                <td className="px-4 py-3 text-right">
                  <p className="font-semibold text-indigo-400">
                    {formatRupiah(parseFloat(product.pricePerKg.toString()))}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>/{product.unit}</p>
                </td>

                {/* ── Stok ── */}
                <td className="px-4 py-3 text-right">
                  <span
                    className="font-semibold"
                    style={{
                      color:
                        product.currentStock < 1
                          ? "#f43f5e"
                          : product.currentStock < 5
                            ? "#f59e0b"
                            : "var(--t-text-primary)",
                    }}
                  >
                    {product.currentStock.toFixed(2)} {product.unit}
                  </span>
                </td>

                {/* ── Status ── */}
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {product.isFeatured && (
                      <Badge className="bg-amber-500/15 text-amber-500 border-0 text-xs">Unggulan</Badge>
                    )}
                    <Badge
                      className={`border-0 text-xs ${product.isActive
                          ? "bg-indigo-500/15 text-indigo-400"
                          : "bg-zinc-500/15 text-zinc-500"
                        }`}
                    >
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </td>

                {/* ── Aksi ── */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="rounded-lg gap-1.5 text-xs"
                      style={{ color: "var(--t-text-muted)" }}
                    >
                      <Link href={`/dashboard/produk/${product.id}/edit`}>
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteProductButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
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
