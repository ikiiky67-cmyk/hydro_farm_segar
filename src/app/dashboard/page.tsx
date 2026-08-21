import type { Metadata } from "next";
import { getDashboardMetrics, getSalesChartData } from "@/actions/analytics.actions";
import { getLowStockProducts } from "@/actions/stock.actions";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { TrendingUp, ShoppingCart, Package, Eye, ShieldAlert, AlertTriangle } from "lucide-react";
import type { Transaction, TransactionItem, Product } from "@prisma/client";
import { formatRupiah, formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import Link from "next/link";

type TxWithItems = Transaction & {
  items: (TransactionItem & { product: Pick<Product, "name"> })[];
};

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [metrics, chartData, lowStockProducts, profile] = await Promise.all([
    getDashboardMetrics(),
    getSalesChartData(),
    getLowStockProducts(),
    prisma.businessProfile.findFirst(),
  ]);
  const farmName = profile?.farmName || "Hydro Farm Segar";

  // Cek apakah admin masih menggunakan password default
  let isDefaultPassword = false;
  try {
    const session = await auth();
    if (session?.user?.email) {
      const admin = await prisma.admin.findUnique({
        where: { email: session.user.email },
        select: { password: true },
      });
      if (admin) {
        isDefaultPassword = await bcrypt.compare("admin123", admin.password);
      }
    }
  } catch {
    // Abaikan error pengecekan password, jangan blokir dashboard
  }

  const metricCards = [
    {
      title: "Pendapatan Bulan Ini",
      value: `Rp ${metrics.revenue.toLocaleString("id-ID")}`,
      subtitle: "Dari penjualan produk",
      icon: <TrendingUp className="w-5 h-5" strokeWidth={1.8} />,
      colorVariant: "indigo" as const,
      trend: "up" as const,
      trendValue: "Bulan ini",
      delay: 0,
    },
    {
      title: "Transaksi Penjualan",
      value: `${metrics.salesCount} order`,
      subtitle: "Bulan berjalan",
      icon: <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />,
      colorVariant: "blue" as const,
      trend: "neutral" as const,
      delay: 0.1,
    },
    {
      title: "Produk Aktif",
      value: `${metrics.activeProducts} jenis`,
      subtitle: "Di semua kategori",
      icon: <Package className="w-5 h-5" strokeWidth={1.8} />,
      colorVariant: "amber" as const,
      delay: 0.2,
    },
    {
      title: "Klik Produk",
      value: `${metrics.productViews} kunjungan`,
      subtitle: "30 hari terakhir",
      icon: <Eye className="w-5 h-5" strokeWidth={1.8} />,
      colorVariant: "rose" as const,
      trend: "up" as const,
      trendValue: "30 hari",
      delay: 0.3,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--t-text-primary)" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--t-text-muted)" }}>
          Ringkasan operasional dan analitik {farmName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <SalesChart data={chartData} />
        </div>
        <div>
          <TopProductsChart data={metrics.topProducts} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div
        className="t-card rounded-2xl border p-5 transition-theme"
        style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
      >
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--t-text-primary)" }}>
          Transaksi Terbaru
        </h3>
        {metrics.recentTransactions.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--t-text-muted)" }}>
            Belum ada transaksi. Mulai catat penjualan pertama Anda!
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--t-divider)" }}>
            {(metrics.recentTransactions as TxWithItems[]).map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--t-text-primary)" }}>
                    {tx.buyerName ?? "Pembeli"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>
                    {tx.items.map((i) => i.product.name).join(", ")} ·{" "}
                    {formatDate(tx.occurredAt)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-indigo-400">
                  +{formatRupiah(parseFloat(tx.totalAmount.toString()))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
