import { z } from "zod";
import { StockRepository } from "@/repositories/stock.repository";
import { Prisma } from "@prisma/client";

export const stockMovementSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["PANEN_MASUK", "TERJUAL", "RUSAK", "PENYESUAIAN"]),
  quantity: z.coerce.number().positive("Jumlah harus lebih dari 0"),
  note: z.string().optional(),
  buyerName: z.string().optional(),
  recordedAt: z.coerce.date().optional(),
});

export class StockService {
  static async createStockMovement(data: Record<string, unknown>) {
    const parsed = stockMovementSchema.safeParse(data);
    if (!parsed.success) {
      throw { fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const { productId, type, quantity, note, buyerName, recordedAt } = parsed.data;

    const product = await StockRepository.getProductForStockMovement(productId);
    if (!product) throw { fieldErrors: { productId: ["Produk tidak ditemukan"] } };

    const pricePerUnit = parseFloat(product.pricePerKg.toString());
    const totalValue = pricePerUnit * quantity;
    const occurredAt = recordedAt ?? new Date();

    const movements = await StockRepository.getStockMovementsGroupByProductId(productId);

    let currentStock = 0;
    for (const m of movements) {
      const qty = parseFloat((m._sum.quantity ?? 0).toString());
      if (m.type === "PANEN_MASUK" || m.type === "PENYESUAIAN") currentStock += qty;
      else currentStock -= qty;
    }

    if ((type === "TERJUAL" || type === "RUSAK") && quantity > currentStock) {
      let errorMessage = "";
      if (type === "TERJUAL") {
        if (currentStock <= 0) {
          errorMessage = `Gagal melakukan penjualan. Stok ${product.name} saat ini kosong (0).`;
        } else {
          errorMessage = `Gagal melakukan penjualan. Stok tidak mencukupi (Sisa stok: ${currentStock} ${product.unit}).`;
        }
      } else if (type === "RUSAK") {
        errorMessage = `Gagal mencatat stok rusak. Jumlah melebihi stok yang tersedia (Sisa stok: ${currentStock} ${product.unit}).`;
      }
      throw { fieldErrors: { quantity: [errorMessage] } };
    }

    const movementData: Prisma.StockMovementCreateInput = {
      product: { connect: { id: productId } },
      type,
      quantity,
      note,
      recordedAt: occurredAt,
    };

    let transactionData: Prisma.TransactionCreateInput | undefined;

    if (type === "TERJUAL") {
      transactionData = {
        type: "PENJUALAN",
        totalAmount: totalValue,
        note: note || `Penjualan ${product.name} ${quantity} ${product.unit}`,
        buyerName: buyerName || null,
        occurredAt,
      };
    } else if (type === "RUSAK") {
      transactionData = {
        type: "PENGELUARAN",
        totalAmount: totalValue,
        note: note || `Kerugian stok rusak: ${product.name} ${quantity} ${product.unit}`,
        occurredAt,
      };
    }

    return StockRepository.createStockMovementWithTransaction(movementData, transactionData);
  }

  static async getStockMovements(productId?: string) {
    return StockRepository.getStockMovements(productId);
  }

  static async getStockMovementsPaginated({
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
    const where: Prisma.StockMovementWhereInput = {
      ...(productId ? { productId } : {}),
      ...(type && type !== "SEMUA"
        ? { type: type as "PANEN_MASUK" | "TERJUAL" | "RUSAK" | "PENYESUAIAN" }
        : {}),
    };

    const { movements, total } = await StockRepository.getStockMovementsPaginated(where, page, perPage);
    const stats = await StockRepository.getStockMovementStats(where);

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

  static async getAllStockSummary() {
    const products = await StockRepository.getActiveProductsForStockSummary();

    type ProductSelect = {
      id: string;
      name: string;
      unit: string;
      imageUrl: string | null;
      pricePerKg: { toString(): string };
      minStock: { toString(): string };
    };

    return Promise.all(
      (products as ProductSelect[]).map(async (p) => {
        const movements = await StockRepository.getStockMovementsGroupByProductId(p.id);

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
          minStock: parseFloat(p.minStock.toString()),
        };
      })
    );
  }

  static async getLowStockProducts() {
    const allStock = await this.getAllStockSummary();
    return allStock.filter((p) => p.currentStock <= p.minStock);
  }
}
