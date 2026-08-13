"use client";

import { useRouter } from "next/navigation";

type Props = {
  products: { id: string; name: string }[];
  currentProductId: string;
  currentType: string;
};

export function RiwayatFilterBar({ products, currentProductId, currentType }: Props) {
  const router = useRouter();

  function handleProductChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    if (e.target.value) params.set("productId", e.target.value);
    if (currentType && currentType !== "SEMUA") params.set("type", currentType);
    router.push(`/dashboard/stok/riwayat?${params.toString()}`);
  }

  return (
    <select
      className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 min-w-0"
      style={{
        background: "var(--t-input-bg)",
        borderColor: "var(--t-input-border)",
        color: "var(--t-text-primary)",
      }}
      defaultValue={currentProductId}
      onChange={handleProductChange}
    >
      <option value="">Semua Produk</option>
      {products.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
