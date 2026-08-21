import { AnalyticsRepository } from "@/repositories/analytics.repository";
import { startOfMonth, endOfMonth, subDays, format, eachDayOfInterval } from "date-fns";
import { id } from "date-fns/locale";

export class AnalyticsService {
  static async getDashboardMetrics() {
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
      AnalyticsRepository.aggregateRevenue(startMonth, endMonth),
      AnalyticsRepository.countSales(startMonth, endMonth),
      AnalyticsRepository.countActiveProducts(),
      AnalyticsRepository.countProductViews(subDays(now, 30)),
      AnalyticsRepository.getTopProducts(5),
      AnalyticsRepository.getRecentTransactions(5),
    ]);

    type GroupByResult = { productId: string; _sum: { quantity: bigint | null } };
    const topProducts = await Promise.all(
      (topProductsRaw as unknown as GroupByResult[]).map(async (item) => {
        const product = await AnalyticsRepository.getProductNameById(item.productId);
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

  static async getSalesChartData() {
    const now = new Date();
    const days = eachDayOfInterval({ start: subDays(now, 29), end: now });

    const rawTransactions = await AnalyticsRepository.getTransactionsForChart(subDays(now, 29));

    const dailyMap = new Map<string, { totalAmount: number; count: number }>();
    for (const tx of rawTransactions) {
      const dateStr = format(new Date(tx.occurredAt), "yyyy-MM-dd");
      const existing = dailyMap.get(dateStr) || { totalAmount: 0, count: 0 };
      existing.totalAmount += parseFloat(tx.totalAmount.toString());
      existing.count += 1;
      dailyMap.set(dateStr, existing);
    }

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayData = dailyMap.get(dateStr);
      return {
        date: format(day, "dd MMM", { locale: id }),
        pendapatan: dayData?.totalAmount ?? 0,
        transaksi: dayData?.count ?? 0,
      };
    });
  }
}
