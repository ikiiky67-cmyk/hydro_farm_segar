"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function PublicError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[PublicError]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--pub-bg, #0a0a0a)", color: "var(--pub-text, #fafafa)" }}
    >
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h2>
        <p
          className="mb-8 leading-relaxed"
          style={{ color: "var(--pub-text-muted, #a1a1aa)" }}
        >
          Maaf, halaman ini mengalami masalah. Silakan coba lagi atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-2xl transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border font-semibold px-6 py-3 rounded-2xl transition-colors duration-200"
            style={{
              borderColor: "var(--pub-card-border, rgba(255,255,255,0.08))",
              color: "var(--pub-text, #fafafa)",
            }}
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs" style={{ color: "var(--pub-text-subtle, #52525b)" }}>
            Kode error: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
