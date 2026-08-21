"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { changePassword } from "@/actions/auth.actions";

export function ChangePasswordClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await changePassword(formData);

    if (!res.success) {
      setError(res.error || "Terjadi kesalahan");
    } else {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      // Optional: redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-medium mb-4">
          <Lock className="w-4 h-4" />
          <span>Keamanan Akun</span>
        </div>
        <h1 className="text-3xl font-bold t-text-primary mb-2">Ganti Password</h1>
        <p className="t-text-muted text-sm">
          Perbarui password Anda secara berkala untuk menjaga keamanan akun admin.
        </p>
      </div>

      <div className="t-card border rounded-2xl p-6 shadow-sm transition-theme">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-500 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-500 font-medium">
              <p>Password berhasil diubah!</p>
              <p className="text-xs opacity-80 mt-1">Mengalihkan ke dashboard...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold t-text-secondary">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl t-input border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-theme"
                placeholder="Masukkan password saat ini"
              />
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 t-text-muted" />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 p-0.5 t-text-muted hover:text-indigo-400"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold t-text-secondary">Password Baru</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl t-input border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-theme"
                placeholder="Minimal 6 karakter"
              />
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 t-text-muted" />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 p-0.5 t-text-muted hover:text-indigo-400"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold t-text-secondary">Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl t-input border outline-none focus:ring-2 focus:ring-indigo-500/50 transition-theme"
                placeholder="Ulangi password baru"
              />
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 t-text-muted" />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 p-0.5 t-text-muted hover:text-indigo-400"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t t-divider flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm t-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-500 hover:bg-indigo-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
