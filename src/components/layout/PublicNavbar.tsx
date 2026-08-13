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
  { href: "/tentang", label: "Tentang Kami" },
];

export function PublicNavbar({ farmName }: { farmName: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pub-navbar transition-all duration-500",
        scrolled
          ? "border-b shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
          : "border-b border-transparent shadow-none",
      )}
      style={{ borderColor: scrolled ? "var(--pub-nav-border)" : "transparent" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
          >
            <Leaf className="w-4.5 h-4.5 text-emerald-400" />
          </motion.div>
          <span
            className="font-bold text-base tracking-tight transition-colors duration-300"
            style={{ color: "var(--pub-text)" }}
          >
            {farmName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-emerald-500"
                    : "hover:text-emerald-400"
                )}
                style={{ color: isActive ? undefined : "var(--pub-text-muted)" }}
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
          <ThemeToggle variant="navbar" />
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
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
