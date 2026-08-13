"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500"
      style={{ background: "var(--t-page-bg)" }}
    >
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="border rounded-3xl shadow-2xl p-8 sm:p-10 transition-all duration-300"
          style={{
            background: "var(--t-card-bg)",
            borderColor: "var(--t-card-border)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 border"
              style={{
                background: "rgba(16,185,129,0.1)",
                borderColor: "rgba(16,185,129,0.2)",
              }}
            >
              <Leaf className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--t-text-primary)" }}
            >
              HydroFarm Admin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm mt-2 font-medium"
              style={{ color: "var(--t-text-muted)" }}
            >
              Silakan masuk ke panel manajemen
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-sm font-semibold ml-1"
                style={{ color: "var(--t-text-secondary)" }}
              >
                Email Admin
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: "var(--t-text-muted)" }} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@hidroponik.com"
                  className="pl-11 border focus:ring-2 focus:ring-emerald-500/30 rounded-xl h-12 shadow-sm transition-all outline-none"
                  style={{
                    background: "var(--t-input-bg)",
                    borderColor: "var(--t-input-border)",
                    color: "var(--t-text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <Label
                htmlFor="password"
                className="text-sm font-semibold ml-1"
                style={{ color: "var(--t-text-secondary)" }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: "var(--t-text-muted)" }} />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="pl-11 pr-11 border focus:ring-2 focus:ring-emerald-500/30 rounded-xl h-12 shadow-sm transition-all outline-none"
                  style={{
                    background: "var(--t-input-bg)",
                    borderColor: "var(--t-input-border)",
                    color: "var(--t-text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                  style={{ color: "var(--t-text-muted)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 text-sm border rounded-xl px-4 py-3"
                style={{
                  background: "rgba(244,63,94,0.1)",
                  borderColor: "rgba(244,63,94,0.2)",
                  color: "#f43f5e",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all duration-200 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 mt-2"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </motion.form>

          {/* Footer note */}
          <p
            className="text-center text-xs font-medium mt-8 pt-6 border-t"
            style={{
              color: "var(--t-text-muted)",
              borderColor: "var(--t-divider)",
            }}
          >
            Sistem manajemen eksklusif untuk admin HydroFarm
          </p>
        </div>
      </motion.div>
    </div>
  );
}
