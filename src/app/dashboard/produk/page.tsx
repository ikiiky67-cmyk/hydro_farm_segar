import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getProductStock } from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { ProductTable } from "@/components/dashboard/ProductTable";

export const metadata: Metadata = { title: "Manajemen Produk" };

export default async function ProdukPage() {
  const products = await getProducts();

  const productsWithStock = await Promise.all(
    products.map(async (p) => ({
      ...p,
      pricePerKg: parseFloat(p.pricePerKg.toString()),
      minStock: parseFloat(p.minStock.toString()),
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
          <ProductTable products={productsWithStock} />
        )}
      </div>
    </div>
  );
}
