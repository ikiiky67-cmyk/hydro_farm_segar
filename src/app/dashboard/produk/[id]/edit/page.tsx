import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { Pencil } from "lucide-react";

export const metadata: Metadata = { title: "Edit Produk | HydroFarm" };

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await prisma.product.findUnique({ where: { id } });
  if (!raw) notFound();

  // Convert Decimal → plain number to avoid serialization error in Client Component
  const product = {
    ...raw,
    pricePerKg: parseFloat(raw.pricePerKg.toString()),
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>Edit Produk</h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
          Perbarui informasi:{" "}
          <span className="font-medium" style={{ color: "var(--t-text-primary)" }}>
            {product.name}
          </span>
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid var(--t-divider)" }}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <Pencil className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "var(--t-text-primary)" }}>{product.name}</p>
            <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>/{product.slug}</p>
          </div>
        </div>
        <ProductForm product={product} />
      </div>
    </div>
  );
}
