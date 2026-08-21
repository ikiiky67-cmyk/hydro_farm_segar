"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, LayoutDashboard } from "lucide-react";

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="text-center max-w-md">
        <div
          className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.25)" }}
        >
          <AlertTriangle className="w-7 h-7 text-rose-400" />
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--t-text-primary)" }}>
          Terjadi Kesalahan
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--t-text-muted)" }}>
          Halaman dashboard ini mengalami masalah. Data Anda tetap aman.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 text-sm"
            style={{
              borderColor: "var(--t-card-border)",
              color: "var(--t-text-primary)",
            }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs" style={{ color: "var(--t-text-muted)" }}>
            Kode error: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
