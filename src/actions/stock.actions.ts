"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const stockMovementSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["PANEN_MASUK", "TERJUAL", "RUSAK", "PENYESUAIAN"]),
  quantity: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  note: z.string().optional(),
  buyerName: z.string().optional(),
  recordedAt: z.coerce.date().optional(),
});

/**
 * Catat pergerakan stok.
 * - TERJUAL  → otomatis buat Transaction PENJUALAN (pendapatan)
 * - RUSAK    → otomatis buat Transaction PENGELUARAN (kerugian)
 * - PENYESUAIAN → otomatis buat Transaction PEMASUKAN atau PENGELUARAN (tergantung tanda qty)
 * - PANEN_MASUK → hanya StockMovement, tidak buat transaction keuangan
 */
export async function createStockMovement(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = stockMovementSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { productId, type, quantity, note, buyerName, recordedAt } = parsed.data;

  // Ambil data produk untuk hitung nilai
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { name: true, pricePerKg: true, unit: true },
  });

  if (!product) return { error: { productId: ["Produk tidak ditemukan"] } };

  const pricePerUnit = parseFloat(product.pricePerKg.toString());
  const totalValue = pricePerUnit * quantity;
  const occurredAt = recordedAt ?? new Date();

  // Jalankan dalam satu transaksi DB
  await prisma.$transaction(async (tx) => {
    // 1. Catat StockMovement
    await tx.stockMovement.create({
      data: { productId, type, quantity, note, recordedAt: occurredAt },
    });

    // 2. Buat Transaction keuangan otomatis berdasarkan jenis
    if (type === "TERJUAL") {
      await tx.transaction.create({
        data: {
          type: "PENJUALAN",
          totalAmount: totalValue,
          note: note || `Penjualan ${product.name} ${quantity} ${product.unit}`,
          buyerName: buyerName || null,
          occurredAt,
        },
      });
    } else if (type === "RUSAK") {
      await tx.transaction.create({
        data: {
          type: "PENGELUARAN",
          totalAmount: totalValue,
          note: note || `Kerugian stok rusak: ${product.name} ${quantity} ${product.unit}`,
          occurredAt,
        },
      });
    }
    // PENYESUAIAN dan PANEN_MASUK tidak otomatis buat transaction
  });

  revalidatePath("/dashboard/stok");
  revalidatePath("/dashboard/transaksi");
  revalidatePath("/dashboard/laporan");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getStockMovements(productId?: string) {
  return prisma.stockMovement.findMany({
    where: productId ? { productId } : undefined,
    include: { product: { select: { name: true, unit: true, pricePerKg: true } } },
    orderBy: { recordedAt: "desc" },
    take: 100,
  });
}

/** Riwayat pergerakan stok dengan pagination dan filter produk/jenis */
export async function getStockMovementsPaginated({
  productId,
  type,
  page = 1,
  perPage = 20,
}: {
  productId?: string;
  type?: string;
  page?: number;
  perPage?: number;
}) {
  const where = {
    ...(productId ? { productId } : {}),
    ...(type && type !== "SEMUA"
      ? { type: type as "PANEN_MASUK" | "TERJUAL" | "RUSAK" | "PENYESUAIAN" }
      : {}),
  };

  const [movements, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      include: {
        product: {
          select: { name: true, unit: true, pricePerKg: true, imageUrl: true },
        },
      },
      orderBy: { recordedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.stockMovement.count({ where }),
  ]);

  // Statistik agregat untuk header halaman
  const stats = await prisma.stockMovement.groupBy({
    by: ["type"],
    where,
    _sum: { quantity: true },
    _count: true,
  });

  return {
    movements: movements.map((m) => ({
      id: m.id,
      type: m.type,
      quantity: parseFloat(m.quantity.toString()),
      note: m.note,
      recordedAt: m.recordedAt,
      product: {
        name: m.product.name,
        unit: m.product.unit,
        imageUrl: m.product.imageUrl,
      },
      pricePerUnit: parseFloat(m.product.pricePerKg.toString()),
      totalNilai:
        parseFloat(m.quantity.toString()) *
        parseFloat(m.product.pricePerKg.toString()),
    })),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    stats,
  };
}

export async function getAllStockSummary() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true, unit: true, pricePerKg: true, imageUrl: true },
  });

  type ProductSelect = {
    id: string;
    name: string;
    unit: string;
    imageUrl: string | null;
    pricePerKg: { toString(): string };
  };

  return Promise.all(
    (products as ProductSelect[]).map(async (p) => {
      const movements = await prisma.stockMovement.groupBy({
        by: ["type"],
        where: { productId: p.id },
        _sum: { quantity: true },
      });

      let stock = 0;
      for (const m of movements) {
        const qty = parseFloat((m._sum.quantity ?? 0).toString());
        if (m.type === "PANEN_MASUK" || m.type === "PENYESUAIAN") stock += qty;
        else stock -= qty;
      }

      return {
        ...p,
        currentStock: Math.max(0, stock),
        pricePerKg: parseFloat(p.pricePerKg.toString()),
      };
    })
  );
}
