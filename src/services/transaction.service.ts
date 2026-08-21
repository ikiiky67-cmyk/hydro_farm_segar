import { z } from "zod";
import { TransactionRepository } from "@/repositories/transaction.repository";
import { startOfMonth, endOfMonth } from "date-fns";
import { Prisma } from "@prisma/client";

export const transactionSchema = z.object({
  type: z.enum(["PENJUALAN", "PEMASUKAN", "PENGELUARAN"]),
  totalAmount: z.coerce.number().positive(),
  note: z.string().optional(),
  buyerName: z.string().optional(),
  channel: z.string().optional(),
  occurredAt: z.coerce.date().optional(),
});

export class TransactionService {
  static async createTransaction(data: Record<string, unknown>) {
    const parsed = transactionSchema.safeParse(data);
    if (!parsed.success) {
      throw { fieldErrors: parsed.error.flatten().fieldErrors };
    }

    return TransactionRepository.createTransaction(parsed.data);
  }

  static async getTransactions(params: { limit?: number; startDate?: Date; endDate?: Date } = {}) {
    const { limit = 100, startDate, endDate } = params;
    const where: Prisma.TransactionWhereInput = { isDeleted: false };
    
    if (startDate || endDate) {
      where.occurredAt = {};
      if (startDate) where.occurredAt.gte = startDate;
      if (endDate) where.occurredAt.lte = endDate;
    }

    return TransactionRepository.getTransactions(where, limit);
  }

  static async updateTransaction(id: string, data: Record<string, unknown>) {
    const parsed = transactionSchema.safeParse(data);
    if (!parsed.success) {
      throw { fieldErrors: parsed.error.flatten().fieldErrors };
    }

    return TransactionRepository.updateTransaction(id, parsed.data);
  }

  static async deleteTransaction(id: string) {
    return TransactionRepository.softDeleteTransaction(id);
  }

  static async getLaporanLabaRugi(month?: Date) {
    const target = month ?? new Date();
    const start = startOfMonth(target);
    const end = endOfMonth(target);

    const dateFilter = { gte: start, lte: end };

    const [penjualan, pemasukanLain, pengeluaran] = await Promise.all([
      TransactionRepository.aggregateTransaction("PENJUALAN", dateFilter),
      TransactionRepository.aggregateTransaction("PEMASUKAN", dateFilter),
      TransactionRepository.aggregateTransaction("PENGELUARAN", dateFilter),
    ]);

    const pengeluaranPerKategori = await TransactionRepository.groupByChannelTransaction("PENGELUARAN", dateFilter);

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

  static async getTransactionsForReport(month?: Date) {
    const target = month ?? new Date();
    const start = startOfMonth(target);
    const end = endOfMonth(target);

    const where: Prisma.TransactionWhereInput = {
      occurredAt: { gte: start, lte: end },
      isDeleted: false,
    };

    const transactions = await TransactionRepository.getTransactions(where);

    return {
      period: { start, end },
      transactions,
    };
  }
}
