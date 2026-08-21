"use client";

import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Bell, LogOut, User, ShieldAlert, AlertTriangle, Package, Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  isDefaultPassword?: boolean;
  lowStockProducts?: any[];
}

export function DashboardHeader({ user, isDefaultPassword, lowStockProducts = [] }: DashboardHeaderProps) {
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  const totalNotifications = (isDefaultPassword ? 1 : 0) + (lowStockProducts.length > 0 ? 1 : 0);

  return (
    <header
      className="t-header h-16 border-b flex items-center justify-between px-4 md:px-6 flex-shrink-0 transition-theme"
      style={{
        background: "var(--t-header-bg)",
        borderColor: "var(--t-header-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pl-10 md:pl-0"
      >
        <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 hover:opacity-80 outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{
                background: "var(--t-input-bg)",
                borderColor: "var(--t-input-border)",
                color: "var(--t-text-secondary)",
              }}
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 shadow-sm" style={{ borderColor: "var(--t-header-bg)" }}>
                  {totalNotifications}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80"
            style={{
              background: "var(--t-modal-bg)",
              borderColor: "var(--t-card-border)",
              color: "var(--t-text-primary)",
            }}
          >
            <DropdownMenuLabel className="font-semibold px-4 py-3">
              Notifikasi ({totalNotifications})
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "var(--t-divider)", margin: 0 }} />
            
            <div className="max-h-80 overflow-y-auto py-1">
              {totalNotifications === 0 ? (
                <div className="px-4 py-6 text-center text-sm" style={{ color: "var(--t-text-muted)" }}>
                  Tidak ada notifikasi saat ini.
                </div>
              ) : (
                <>
                  {isDefaultPassword && (
                    <div className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default border-b last:border-0" style={{ borderColor: "var(--t-divider)" }}>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-amber-500 mb-1">Peringatan Keamanan</p>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--t-text-secondary)" }}>
                            Anda masih menggunakan password default <code className="bg-amber-500/10 px-1 py-0.5 rounded text-[10px] border border-amber-500/20">admin123</code>.
                          </p>
                          <Link href="/dashboard/pengaturan/password" className="text-xs font-semibold text-amber-600 hover:text-amber-500 mt-2 inline-block">
                            Ganti Sekarang &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {lowStockProducts.length > 0 && (
                    <div className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default border-b last:border-0" style={{ borderColor: "var(--t-divider)" }}>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-rose-500 mb-1">Stok Minimum Tercapai</p>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--t-text-secondary)" }}>
                            Ada <span className="font-semibold text-rose-500">{lowStockProducts.length} produk</span> yang stoknya butuh perhatian.
                          </p>
                          <Link href="/dashboard/stok" className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 mt-2 inline-block">
                            Cek Manajemen Stok &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-xl border transition-all duration-200 hover:opacity-80 outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{
                background: "var(--t-input-bg)",
                borderColor: "var(--t-input-border)",
              }}
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium" style={{ color: "var(--t-text-primary)" }}>
                {user.name ?? "Admin"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52"
            style={{
              background: "var(--t-modal-bg)",
              borderColor: "var(--t-card-border)",
              color: "var(--t-text-primary)",
            }}
          >
            <DropdownMenuLabel style={{ color: "var(--t-text-muted)", fontSize: "0.75rem" }}>
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "var(--t-divider)" }} />
            <Link href="/dashboard/pengaturan/password">
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                style={{ color: "var(--t-text-secondary)" }}
              >
                <Lock className="w-4 h-4" />
                Ganti Password
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator style={{ background: "var(--t-divider)" }} />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-rose-500 cursor-pointer gap-2 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
