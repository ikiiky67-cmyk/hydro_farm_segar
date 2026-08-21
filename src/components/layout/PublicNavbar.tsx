"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/tentang", label: "Tentang" },
];

export function PublicNavbar({ farmName, logoUrl, transparentOnTop = true }: { farmName: string, logoUrl?: string | null, transparentOnTop?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparentOnTop) return;
    const handler = () => setScrolled(window.scrollY > 20);
    handler(); // check initial
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [transparentOnTop]);

  const isSolid = !transparentOnTop || scrolled;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isSolid
          ? "pub-navbar border-b shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
          : "bg-transparent border-b border-transparent shadow-none"
      )}
      style={{ borderColor: isSolid ? "var(--pub-nav-border)" : "transparent" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-8 md:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {logoUrl ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-transparent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={farmName} className="w-full h-full object-contain" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
              >
                <Leaf className="w-4.5 h-4.5 text-emerald-400" />
              </motion.div>
            )}
            <span
              className="font-bold text-lg tracking-tight transition-colors duration-500"
              style={{ color: isSolid ? "var(--pub-nav-text)" : "white" }}
            >
              {farmName}
            </span>
          </Link>
        </div>

        {/* Right: Nav & Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-base font-medium transition-all duration-500",
                    isActive ? "text-emerald-500" : (isSolid ? "hover:text-emerald-500" : "text-white/80 hover:text-white")
                  )}
                  style={{ color: isActive ? undefined : (isSolid ? "var(--pub-nav-text-muted)" : undefined) }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-emerald-500/10"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200"
              style={{
                background: "var(--pub-card-bg)",
                borderColor: "var(--pub-card-border)",
                color: "var(--pub-text-muted)",
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t overflow-hidden"
            style={{ borderColor: "var(--pub-nav-border)", background: "var(--pub-nav-bg)" }}
          >
            <div className="px-6 py-4 space-y-1.5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      pathname === link.href
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "hover:bg-emerald-500/5"
                    )}
                    style={{ color: pathname === link.href ? undefined : "var(--pub-text-muted)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
