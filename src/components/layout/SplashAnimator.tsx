"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SplashAnimator({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Cek apakah ini muatan pertama kali (jika last_path belum ada)
  const [isInitialLoad] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("last_path");
    }
    return true;
  });

  // Hitung arah geser
  const slideX = (() => {
    if (typeof window !== "undefined") {
      const lastPath = sessionStorage.getItem("last_path") || "/";
      const currPath = pathname || "/";
      if (lastPath === currPath) return 40;

      const getIdx = (p: string) => {
        if (p === "/") return 0;
        if (p.startsWith("/produk")) return 1;
        if (p.startsWith("/tentang")) return 2;
        return 99;
      };

      return getIdx(currPath) < getIdx(lastPath) ? -40 : 40;
    }
    return 40;
  })();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Tunggu sedikit agar animasi halaman selesai sebelum mencatat history path
      // Ini mencegah bug di mana next.js memicu ulang render terlalu cepat
      setTimeout(() => {
        sessionStorage.setItem("last_path", pathname || "/");
      }, 500);
    }
  }, [pathname]);

  if (isDashboard) {
    return <>{children}</>;
  }

  // Animasi Transisi Antar Halaman (Dynamic Lateral Slide)
  // Jika ini adalah muatan pertama (isInitialLoad = true), kita matikan awal animasinya dengan initial={false}
  return (
    <motion.div
      key={pathname}
      initial={isInitialLoad ? false : { opacity: 0, x: slideX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
