"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle({ variant = "default" }: { variant?: "default" | "navbar" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
      className="relative flex items-center gap-1.5 rounded-xl border transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/30"
      style={{
        padding: variant === "navbar" ? "0.4rem" : "0.4rem 0.75rem",
        background: "var(--t-input-bg)",
        borderColor: "var(--t-input-border)",
        color: "var(--t-text-secondary)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-1.5"
        >
          {isDark ? (
            <><Moon className="w-4 h-4" />{variant !== "navbar" && <span className="text-xs font-medium">Dark</span>}</>
          ) : (
            <><Sun className="w-4 h-4 text-amber-500" />{variant !== "navbar" && <span className="text-xs font-medium" style={{ color: "#b45309" }}>Light</span>}</>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
