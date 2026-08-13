"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { Plus, X } from "lucide-react";

const modalStyle = {
  background: "var(--t-modal-bg)",
  borderColor: "var(--t-card-border)",
} as React.CSSProperties;

export function TransactionModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.35)]"
      >
        <Plus className="w-4 h-4" />
        Catat Transaksi
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto rounded-2xl shadow-2xl border p-6 transition-theme overflow-y-auto max-h-[90vh]"
              style={modalStyle}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--t-text-primary)" }}>
                    Catat Transaksi
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>
                    Pengeluaran, pemasukan lain, atau modal
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
                  style={{ background: "var(--t-input-bg)", color: "var(--t-text-secondary)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <TransactionForm onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
