import { prisma } from "@/lib/prisma";

export class AnalyticsRepository {
  static async aggregateRevenue(startMonth: Date, endMonth: Date) {
    return prisma.transaction.aggregate({
      where: {
        type: "PENJUALAN",
        occurredAt: { gte: startMonth, lte: endMonth },
      },
      _sum: { totalAmount: true },
    });
  }

  static async countSales(startMonth: Date, endMonth: Date) {
    return prisma.transaction.count({
      where: {
        type: "PENJUALAN",
        occurredAt: { gte: startMonth, lte: endMonth },
      },
    });
  }

  static async countActiveProducts() {
    return prisma.product.count({ where: { isActive: true } });
  }

  static async countProductViews(since: Date) {
    return prisma.productView.count({
      where: { viewedAt: { gte: since } },
    });
  }

  static async getTopProducts(take: number) {
    return prisma.transactionItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take,
    });
  }

  static async getRecentTransactions(take: number) {
    return prisma.transaction.findMany({
      where: { type: "PENJUALAN" },
      orderBy: { occurredAt: "desc" },
      take,
      include: { items: { include: { product: true } } },
    });
  }

  static async getTransactionsForChart(since: Date) {
    return prisma.transaction.findMany({
      where: {
        type: "PENJUALAN",
        occurredAt: { gte: since },
        isDeleted: false,
      },
      select: {
        occurredAt: true,
        totalAmount: true,
      },
    });
  }

  static async getProductNameById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      select: { name: true },
    });
  }
}
