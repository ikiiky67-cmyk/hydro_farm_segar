import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class TransactionRepository {
  static async createTransaction(data: Prisma.TransactionCreateInput) {
    return prisma.transaction.create({ data });
  }

  static async getTransactions(where: Prisma.TransactionWhereInput, limit?: number) {
    return prisma.transaction.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      take: limit,
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    });
  }

  static async updateTransaction(id: string, data: Prisma.TransactionUpdateInput) {
    return prisma.transaction.update({
      where: { id },
      data,
    });
  }

  static async softDeleteTransaction(id: string) {
    return prisma.transaction.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  static async aggregateTransaction(
    type: "PENJUALAN" | "PEMASUKAN" | "PENGELUARAN",
    dateFilter: { gte: Date; lte: Date }
  ) {
    return prisma.transaction.aggregate({
      where: { type, occurredAt: dateFilter, isDeleted: false },
      _sum: { totalAmount: true },
      _count: true,
    });
  }

  static async groupByChannelTransaction(
    type: "PENJUALAN" | "PEMASUKAN" | "PENGELUARAN",
    dateFilter: { gte: Date; lte: Date }
  ) {
    return prisma.transaction.groupBy({
      by: ["channel"],
      where: { type, occurredAt: dateFilter, isDeleted: false },
      _sum: { totalAmount: true },
      orderBy: { _sum: { totalAmount: "desc" } },
    });
  }
}
