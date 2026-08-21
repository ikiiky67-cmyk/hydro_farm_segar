import type { Metadata } from "next";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { Package } from "lucide-react";

export const metadata: Metadata = { title: "Tambah Produk" };

export default function TambahProdukPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>Tambah Produk</h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>Tambah sayuran hidroponik baru ke katalog</p>
      </div>

      <div
        className="rounded-2xl border p-6 transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid var(--t-divider)" }}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Package className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>Informasi Produk</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>Isi detail produk baru Anda</p>
          </div>
        </div>
        <ProductForm />
      </div>
    </div>
  );
}
