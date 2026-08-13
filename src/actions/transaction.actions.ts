"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { startOfMonth, endOfMonth } from "date-fns";

const transactionSchema = z.object({
  type: z.enum(["PENJUALAN", "PEMASUKAN", "PENGELUARAN"]),
  totalAmount: z.coerce.number().positive(),
  note: z.string().optional(),
  buyerName: z.string().optional(),
  channel: z.string().optional(),
  occurredAt: z.coerce.date().optional(),
});

export async function createTransaction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = transactionSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.transaction.create({ data: parsed.data });
  revalidatePath("/dashboard/transaksi");
  revalidatePath("/dashboard/laporan");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getTransactions(limit = 50) {
  return prisma.transaction.findMany({
    orderBy: { occurredAt: "desc" },
    take: limit,
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  });
}

/**
 * Laporan Laba Rugi — menggabungkan:
 * - Pendapatan Penjualan (Transaction PENJUALAN) → otomatis dari StokPOS TERJUAL
 * - Pemasukan Lain (Transaction PEMASUKAN)
 * - Pengeluaran (Transaction PENGELUARAN) → termasuk otomatis dari StokPOS RUSAK
 *
 * Catatan: PENYESUAIAN di StokPOS tidak otomatis buat transaction,
 * admin bisa buat manual jika perlu.
 */
export async function getLaporanLabaRugi(month?: Date) {
  const target = month ?? new Date();
  const start = startOfMonth(target);
  const end = endOfMonth(target);

  const dateFilter = { gte: start, lte: end };

  const [penjualan, pemasukanLain, pengeluaran] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: "PENJUALAN", occurredAt: dateFilter },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { type: "PEMASUKAN", occurredAt: dateFilter },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { type: "PENGELUARAN", occurredAt: dateFilter },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  // Detail pengeluaran per kategori (channel)
  const pengeluaranPerKategori = await prisma.transaction.groupBy({
    by: ["channel"],
    where: { type: "PENGELUARAN", occurredAt: dateFilter },
    _sum: { totalAmount: true },
    orderBy: { _sum: { totalAmount: "desc" } },
  });

  const totalPenjualan = parseFloat((penjualan._sum.totalAmount ?? 0).toString());
  const totalPemasukanLain = parseFloat((pemasukanLain._sum.totalAmount ?? 0).toString());
  const totalPengeluaran = parseFloat((pengeluaran._sum.totalAmount ?? 0).toString());
  const totalPemasukan = totalPenjualan + totalPemasukanLain;
  const labaRugi = totalPemasukan - totalPengeluaran;

  return {
    totalPenjualan,
    totalPemasukanLain,
    totalPemasukan,
    totalPengeluaran,
    labaRugi,
    countPenjualan: penjualan._count,
    countPemasukan: pemasukanLain._count,
    countPengeluaran: pengeluaran._count,
    pengeluaranPerKategori: pengeluaranPerKategori.map((k) => ({
      kategori: k.channel ?? "Lainnya",
      total: parseFloat((k._sum.totalAmount ?? 0).toString()),
    })),
    period: { start, end },
  };
}
