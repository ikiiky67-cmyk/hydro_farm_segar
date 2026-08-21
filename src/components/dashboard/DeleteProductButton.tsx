"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkProductHistory, deleteProduct } from "@/actions/product.actions";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      // 1. Cek riwayat terlebih dahulu di background
      const hasHistory = await checkProductHistory(id);
      
      // 2. Siapkan pesan peringatan yang sesuai
      let message = "Apakah Anda yakin ingin menghapus produk ini secara permanen?";
      if (hasHistory) {
        message = "⚠️ PERINGATAN: Produk ini memiliki riwayat stok atau transaksi!\n\nMenghapus produk ini secara permanen dapat merusak data laporan keuangan lama Anda.\n\nProduk ini HANYA AKAN DINONAKTIFKAN (disembunyikan dari katalog publik) agar data tetap aman.\n\nLanjutkan?";
      }

      // 3. Tampilkan peringatan bawaan browser
      if (window.confirm(message)) {
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const isBusy = pending || loading;

  return (
    <Button 
      size="sm" 
      variant="ghost" 
      onClick={handleDelete} 
      disabled={isBusy} 
      className="rounded-lg gap-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {isBusy ? "Hapus..." : "Hapus"}
    </Button>
  );
}
