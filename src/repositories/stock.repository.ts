import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class StockRepository {
  static async getProductForStockMovement(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: { name: true, pricePerKg: true, unit: true },
    });
  }

  static async getStockMovementsGroupByProductId(productId: string) {
    return prisma.stockMovement.groupBy({
      by: ["type"],
      where: { productId },
      _sum: { quantity: true },
    });
  }

  static async createStockMovementWithTransaction(
    movementData: Prisma.StockMovementCreateInput,
    transactionData?: Prisma.TransactionCreateInput
  ) {
    return prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: movementData,
      });

      if (transactionData) {
        await tx.transaction.create({
          data: transactionData,
        });
      }

      return movement;
    });
  }

  static async getStockMovements(productId?: string) {
    return prisma.stockMovement.findMany({
      where: productId ? { productId } : undefined,
      include: { product: { select: { name: true, unit: true, pricePerKg: true } } },
      orderBy: { recordedAt: "desc" },
      take: 100,
    });
  }

  static async getStockMovementsPaginated(
    where: Prisma.StockMovementWhereInput,
    page: number,
    perPage: number
  ) {
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

    return { movements, total };
  }

  static async getStockMovementStats(where: Prisma.StockMovementWhereInput) {
    return prisma.stockMovement.groupBy({
      by: ["type"],
      where,
      _sum: { quantity: true },
      _count: true,
    });
  }

  static async getActiveProductsForStockSummary() {
    return prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, unit: true, pricePerKg: true, imageUrl: true, minStock: true },
    });
  }
}
