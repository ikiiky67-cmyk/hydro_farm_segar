import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getProductStock } from "@/actions/product.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package, Pencil, ImageOff } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export const metadata: Metadata = { title: "Manajemen Produk" };

export default async function ProdukPage() {
  const products = await getProducts();

  const productsWithStock = await Promise.all(
    products.map(async (p) => ({
      ...p,
      currentStock: await getProductStock(p.id),
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>Produk</h1>
          <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
            Kelola katalog sayuran hidroponik Anda
          </p>
        </div>
        <Button asChild className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl gap-2 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Link href="/dashboard/produk/tambah">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      <div
        className="rounded-2xl border overflow-hidden transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        {productsWithStock.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16" style={{ color: "var(--t-text-muted)" }}>
            <Package className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">Belum ada produk</p>
            <p className="text-sm mt-1">Klik &quot;Tambah Produk&quot; untuk memulai</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--t-divider)", background: "var(--t-card-bg)" }}>
                  {["Foto", "Produk", "Kategori", "Harga", "Stok", "Status", ""].map((h, i) => (
                    <th
                      key={h || i}
                      className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${
                        h === "Foto" ? "text-center w-[72px]" :
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
                {productsWithStock.map((product) => (
                  <tr
                    key={product.id}
                    className="t-table-row transition-colors"
                    style={{ borderBottom: "1px solid var(--t-divider)" }}
                  >
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
                          className={`border-0 text-xs ${
                            product.isActive
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
