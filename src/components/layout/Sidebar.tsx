"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, Warehouse, Receipt, BarChart3,
  Settings, TrendingUp, ChevronRight, Globe, Image, Menu, X, FileText,
  MessageSquareQuote
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
  { label: "Keunggulan", href: "/dashboard/cms/keunggulan", icon: LayoutDashboard }, // Assuming we imported ListChecks earlier or can just use LayoutDashboard/BarChart
  { label: "Testimoni", href: "/dashboard/cms/testimoni", icon: MessageSquareQuote },
];

export function Sidebar({ farmName = "HydroFarm", logoUrl }: { farmName?: string, logoUrl?: string | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize mobile state on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile(); // Check immediately
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const closeSidebar = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button (Navbar) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b t-divider t-page z-40 flex items-center px-4 transition-theme">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors mr-3"
        >
          <Menu className="w-5 h-5 t-text-primary" />
        </button>
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-transparent flex items-center justify-center">
              <img src={logoUrl} alt={farmName} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
          )}
          <span className="font-bold t-text-primary tracking-tight">{farmName}</span>
        </div>
      </div>

      {/* Backdrop (Mobile) */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={{ x: isMobile ? "-100%" : 0 }}
        animate={{ x: isMobile ? (isOpen ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 t-sidebar shadow-2xl lg:shadow-none border-r t-divider lg:static flex flex-col transition-theme",
        )}
      >
        <SidebarContent pathname={pathname} onLinkClick={closeSidebar} farmName={farmName} logoUrl={logoUrl} />
      </motion.aside>
    </>
  );
}

function SidebarContent({ pathname, onLinkClick, farmName, logoUrl }: { pathname: string; onLinkClick?: () => void; farmName: string; logoUrl?: string | null }) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b t-divider flex-shrink-0 transition-theme">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-transparent flex items-center justify-center">
              <img src={logoUrl} alt={farmName} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.2)]"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <TrendingUp className="w-4.5 h-4.5 text-white" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold t-text-primary tracking-tight truncate max-w-[150px]">{farmName}</p>
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
