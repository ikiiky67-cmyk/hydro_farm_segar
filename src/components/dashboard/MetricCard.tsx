"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  colorVariant?: "indigo" | "green" | "blue" | "amber" | "rose";
  delay?: number;
}

const colorMap = {
  indigo: { border: "border-indigo-500/25", icon: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25" },
  green: { border: "border-emerald-500/25", icon: "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25" },
  blue:  { border: "border-sky-500/25",     icon: "bg-sky-500/15 text-sky-400 border border-sky-500/25" },
  amber: { border: "border-amber-500/25",   icon: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
  rose:  { border: "border-rose-500/25",    icon: "bg-rose-500/15 text-rose-400 border border-rose-500/25" },
};

const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
  if (trend === "up") return <TrendingUp className="w-3 h-3" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

export function MetricCard({
  title, value, subtitle, icon,
  trend = "neutral", trendValue,
  colorVariant = "indigo", delay = 0,
}: MetricCardProps) {
  const colors = colorMap[colorVariant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative overflow-hidden rounded-2xl border p-5 transition-theme", colors.border)}
      style={{ background: "var(--t-card-bg)", borderColor: undefined }}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.3 }}
            className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.icon)}
          >
            {icon}
          </motion.div>

          {trendValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.2, duration: 0.3 }}
              className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                trend === "up" && "bg-emerald-500/15 text-emerald-500",
                trend === "down" && "bg-rose-500/15 text-rose-400",
                trend === "neutral" && "bg-zinc-500/15 text-zinc-500"
              )}
            >
              <TrendIcon trend={trend} />
              {trendValue}
            </motion.div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.15, duration: 0.4 }}
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--t-text-primary)" }}
        >
          {value}
        </motion.p>

        <p className="text-sm mt-1 font-medium" style={{ color: "var(--t-text-secondary)" }}>{title}</p>
        {subtitle && (
          <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--t-text-secondary)" }}>{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
