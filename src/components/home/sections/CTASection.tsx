"use client";

import { motion, type Variants } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

export function CTASection({ whatsapp }: { whatsapp: string | null }) {
  if (!whatsapp) return null;

  return (
    <section className="pt-12 pb-32 lg:pt-16 lg:pb-32 px-6 relative overflow-hidden" style={{ background: "var(--pub-section-alt)" }}>
      <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full scale-150 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.05]" style={{ color: "var(--pub-text)" }}>
            Siap Menikmati <br />
            <span className="text-emerald-500 font-serif italic font-normal">Kesegarannya?</span>
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed" style={{ color: "var(--pub-text-muted)" }}>
            Hubungi kami sekarang untuk mendapatkan sayuran hidroponik terbaik. Pengiriman tersedia setiap hari langsung ke pintu Anda.
          </p>

          <MagneticButton>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-5 rounded-full transition-all duration-300 shadow-[0_0_50px_-10px_rgba(16,185,129,0.6)] text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Chat via WhatsApp
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
