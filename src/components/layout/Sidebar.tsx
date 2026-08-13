"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, Warehouse, Receipt, BarChart3,
  Settings, TrendingUp, ChevronRight, Globe, Image, Menu, X, FileText,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Transaksi", href: "/dashboard/transaksi", icon: Receipt },
  { label: "Produk", href: "/dashboard/produk", icon: Package },
  { label: "Stok", href: "/dashboard/stok", icon: Warehouse },
  { label: "Laporan L/R", href: "/dashboard/laporan", icon: BarChart3 },
  { type: "separator", label: "CMS" } as const,
  { label: "Profil Bisnis", href: "/dashboard/cms/profil", icon: Settings },
  { label: "Promo & Banner", href: "/dashboard/cms/promo", icon: Image },
];

function SidebarContent({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b t-divider flex-shrink-0 transition-theme">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.2)]"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", }}
          >
            <TrendingUp className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold t-text-primary tracking-tight">HydroFarm</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "#818cf8" }}>Sales Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item, i) => {
          if ("type" in item && item.type === "separator") {
            return (
              <div key={i} className="px-3 pt-5 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 t-divider border-t" />
                  <p className="text-[10px] uppercase tracking-widest t-text-muted font-bold px-1">
                    {item.label}
                  </p>
                  <div className="h-px flex-1 t-divider border-t" />
                </div>
              </div>
            );
          }

          const active = isActive(item.href!, "exact" in item ? item.exact : undefined);
          const Icon = item.icon!;

          return (
            <Link key={item.href} href={item.href!} onClick={onLinkClick}>
              <motion.div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group",
                  active
                    ? "t-text-primary"
                    : "t-text-muted hover:t-text-secondary"
                )}
                style={{
                  color: active ? "var(--t-text-primary)" : "var(--t-text-muted)",
                }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--t-text-secondary)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = "var(--t-text-muted)";
                }}
              >
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.25)",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                <Icon
                  className={cn(
                    "w-4 h-4 relative z-10 flex-shrink-0 transition-colors",
                    active ? "" : ""
                  )}
                  style={{ color: active ? "#818cf8" : "var(--t-text-muted)" }}
                />
                <span className="relative z-10 flex-1" style={{ color: "inherit" }}>{item.label}</span>
                {active && (
                  <ChevronRight className="w-3 h-3 relative z-10 flex-shrink-0" style={{ color: "rgba(129,140,248,0.6)" }} />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Landing Page Link */}
      <div className="p-3 border-t t-divider flex-shrink-0 transition-theme">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{ color: "var(--t-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--t-text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t-text-muted)")}
        >
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span>Lihat Landing Page</span>
          <FileText className="w-3 h-3 ml-auto opacity-40 flex-shrink-0" />
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden w-9 h-9 rounded-xl t-card border flex items-center justify-center transition-theme"
        style={{ color: "var(--t-text-secondary)" }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="t-sidebar fixed left-0 top-0 bottom-0 z-50 w-64 border-r flex flex-col md:hidden transition-theme"
            >
              <button
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--t-input-bg)", color: "var(--t-text-secondary)" }}
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent pathname={pathname} onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="t-sidebar hidden md:flex w-64 flex-shrink-0 border-r flex-col transition-theme">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
