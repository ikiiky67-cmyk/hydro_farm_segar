"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TopProductsChartProps {
  data: Array<{ name: string; qty: number }>;
}

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669"];

export function TopProductsChart({ data }: TopProductsChartProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const gridColor    = isLight ? "#c8e0c8" : "#27272a";
  const tickMuted    = isLight ? "#6b9a6b" : "#71717a";
  const tickSecond   = isLight ? "#3d6b3d" : "#a1a1aa";
  const tooltipBg    = isLight ? "#ffffff" : "#18181b";
  const tooltipBorder= isLight ? "#c8e0c8" : "#3f3f46";
  const tooltipText  = isLight ? "#1a2e1a" : "#f4f4f5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border p-5 transition-theme"
      style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold" style={{ color: "var(--t-text-primary)" }}>Produk Terlaris</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>Berdasarkan total kuantitas terjual</p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[220px]" style={{ color: "var(--t-text-muted)" }}>
          <p className="text-sm">Belum ada data penjualan</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: tickMuted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: tickSecond, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "12px",
                color: tooltipText,
                fontSize: "13px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              }}
              formatter={(value: any) => [`${value} kg/ikat`, "Terjual"]}
            />
            <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
