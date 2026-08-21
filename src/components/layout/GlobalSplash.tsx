"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function GlobalSplash({ farmName, logoUrl }: { farmName: string, logoUrl: string | null }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Selalu tampilkan pada SSR untuk menutupi layar sepenuhnya di awal
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isDashboard) {
      setShow(false);
      return;
    }

    const hasSeen = sessionStorage.getItem("has_seen_splash");
    if (hasSeen) {
      // Unmount dari DOM (setelah hydration)
      setShow(false);
    } else {
      sessionStorage.setItem("has_seen_splash", "true");
    }
  }, [isDashboard]);

  if (!show) return null;

  const fluidEase = [0.85, 0, 0.15, 1] as const;

  return (
    <div suppressHydrationWarning>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (sessionStorage.getItem('has_seen_splash')) {
              document.documentElement.style.setProperty('--splash-display', 'none');
            } else {
              document.documentElement.style.setProperty('--splash-display', 'flex');
            }
          `
        }}
      />
      <div 
        suppressHydrationWarning 
        style={{ display: "var(--splash-display, flex)" }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        <AnimatePresence>
          <motion.div
            key="splash-mask"
            className="absolute inset-0 bg-emerald-700 flex flex-col items-center justify-center"
            initial={{ clipPath: "circle(150vw at 50% 50%)" }}
            animate={{ clipPath: "circle(0vw at 50% 50%)" }}
            transition={{ duration: 1.2, ease: fluidEase, delay: 0.6 }}
            onAnimationComplete={() => setShow(false)}
            exit={{ opacity: 0 }} // in case it unmounts abruptly
          >
            <motion.div 
              className="flex flex-col items-center justify-center gap-6 text-white"
              initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              animate={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
            >
              {logoUrl && (
                <motion.div 
                  className="relative w-28 h-28 sm:w-36 sm:h-36 bg-white/10 rounded-[40%] p-4 backdrop-blur-md shadow-2xl border border-white/20"
                  animate={{ borderRadius: ["40%", "50%", "30%", "50%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                   <Image src={logoUrl} alt="Logo" fill className="object-contain p-3" />
                </motion.div>
              )}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                {farmName}
              </h1>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
