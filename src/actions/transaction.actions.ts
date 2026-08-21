"use server";

import { revalidatePath } from "next/cache";
import { TransactionService } from "@/services/transaction.service";

export async function createTransaction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  try {
    await TransactionService.createTransaction(raw);
    revalidatePath("/dashboard/transaksi");
    revalidatePath("/dashboard/laporan");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error.fieldErrors) {
      return { error: error.fieldErrors };
    }
    return { error: { totalAmount: ["Terjadi kesalahan saat membuat transaksi."] } };
  }
}

export async function getTransactions(params: {
  limit?: number;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  return TransactionService.getTransactions(params);
}

export async function deleteTransaction(id: string) {
  try {
    await TransactionService.deleteTransaction(id);
    revalidatePath("/dashboard/transaksi");
    revalidatePath("/dashboard/laporan");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus transaksi" };
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  try {
    await TransactionService.updateTransaction(id, raw);
    revalidatePath("/dashboard/transaksi");
    revalidatePath("/dashboard/laporan");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error.fieldErrors) {
      return { error: error.fieldErrors };
    }
    return { error: "Gagal mengupdate transaksi" };
  }
}

/**
 * Laporan Laba Rugi
 */
export async function getLaporanLabaRugi(month?: Date) {
  return TransactionService.getLaporanLabaRugi(month);
}

export async function getTransactionsForReport(month?: Date) {
  return TransactionService.getTransactionsForReport(month);
}

