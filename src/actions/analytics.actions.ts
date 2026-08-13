"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subDays, format, eachDayOfInterval } from "date-fns";
import { id } from "date-fns/locale";

export async function getDashboardMetrics() {
  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);

  const [
    revenueSumResult,
    salesCount,
    activeProducts,
    productViewsCount,
    topProductsRaw,
    recentTransactions,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        type: "PENJUALAN",
        occurredAt: { gte: startMonth, lte: endMonth },
      },
      _sum: { totalAmount: true },
    }),
    prisma.transaction.count({
      where: {
        type: "PENJUALAN",
        occurredAt: { gte: startMonth, lte: endMonth },
      },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.productView.count({
      where: { viewedAt: { gte: subDays(now, 30) } },
    }),
    prisma.transactionItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.transaction.findMany({
      where: { type: "PENJUALAN" },
      orderBy: { occurredAt: "desc" },
      take: 5,
      include: { items: { include: { product: true } } },
    }),
  ]);

  // Resolve top products with names
  type GroupByResult = { productId: string; _sum: { quantity: bigint | null } };
  const topProducts = await Promise.all(
    (topProductsRaw as GroupByResult[]).map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });
      return {
        name: product?.name ?? "Tidak diketahui",
        qty: parseFloat((item._sum.quantity ?? 0).toString()),
      };
    })
  );


  return {
    revenue: parseFloat((revenueSumResult._sum.totalAmount ?? 0).toString()),
    salesCount,
    activeProducts,
    productViews: productViewsCount,
    topProducts,
    recentTransactions,
  };
}

export async function getSalesChartData() {
  const now = new Date();
  const days = eachDayOfInterval({ start: subDays(now, 29), end: now });

  const dailySales = await prisma.transaction.groupBy({
    by: ["occurredAt"],
    where: {
      type: "PENJUALAN",
      occurredAt: { gte: subDays(now, 29) },
    },
    _sum: { totalAmount: true },
    _count: true,
  });

  // Map to daily chart data
  type DailySaleRow = { occurredAt: Date; _sum: { totalAmount: bigint | null }; _count: number };
  return days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayData = (dailySales as DailySaleRow[]).find(
      (d) => format(new Date(d.occurredAt), "yyyy-MM-dd") === dateStr
    );
    return {
      date: format(day, "dd MMM", { locale: id }),
      pendapatan: parseFloat((dayData?._sum.totalAmount ?? 0).toString()),
      transaksi: dayData?._count ?? 0,
    };
  });

}
