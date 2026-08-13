"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

interface SalesChartProps {
  data: Array<{ date: string; pendapatan: number; transaksi: number }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const gridColor   = isLight ? "#c8e0c8" : "#27272a";
  const tickColor   = isLight ? "#6b9a6b" : "#71717a";
  const tooltipBg   = isLight ? "#ffffff" : "#18181b";
  const tooltipBorder = isLight ? "#c8e0c8" : "#3f3f46";
  const tooltipText = isLight ? "#1a2e1a" : "#a1a1aa";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border p-5 transition-theme"
      style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold" style={{ color: "var(--t-text-primary)" }}>Grafik Pendapatan</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>30 hari terakhir</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="pendapatanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={isLight ? 0.25 : 0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ color: tooltipText, fontSize: 11, marginBottom: 6 }}
            formatter={(v: any, name?: any) => [
              name === "pendapatan" ? `Rp ${Number(v).toLocaleString("id-ID")}` : `${v} transaksi`,
              name === "pendapatan" ? "Pendapatan" : "Transaksi",
            ]}
          />
          <Area
            type="monotone"
            dataKey="pendapatan"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#pendapatanGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
