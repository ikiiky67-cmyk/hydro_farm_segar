"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Globe2, Mail, Sparkles, MessageCircle, Leaf, Info } from "lucide-react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

const cinematicReveal: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  },
  item: {
    hidden: { filter: "blur(15px)", opacity: 0, scale: 0.95, y: 20 },
    show: {
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const blurReveal: Variants = {
  hidden: { opacity: 0, filter: "blur(15px)", scale: 1.05 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

type Props = {
  farmName: string;
  description: string | null;
  vision: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  whatsapp: string | null;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  ownerName?: string | null;
  ownerRole?: string | null;
  ownerBio?: string | null;
  ownerImageUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
};

export function TentangPageClient({
  farmName,
  description,
  vision,
  address,
  phone,
  email,
  instagram,
  whatsapp,
  bannerUrl,
  logoUrl,
  ownerName,
  ownerRole,
  ownerBio,
  ownerImageUrl,
  title,
  subtitle,
}: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const contacts = [
    address && { icon: MapPin, label: "Lokasi Kebun", value: address },
    phone && { icon: Phone, label: "Telepon", value: phone },
    email && { icon: Mail, label: "Email", value: email },
    instagram && { icon: Globe2, label: "Sosial Media", value: instagram },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <>
      {/* ✨ Animated Hero Section ✨ */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#020617] pt-20 pb-20"
      >
        {/* Parallax Background */}
        <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/uploads/image/Gambar1.jpeg"
                alt="Default Banner"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent opacity-80" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full px-6 max-w-7xl mx-auto flex flex-col justify-center"
        >
          <motion.div
            variants={cinematicReveal.container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center relative"
          >

            <motion.div variants={cinematicReveal.item} className="mb-6 relative">
              <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 border border-emerald-500/30 bg-black/30 backdrop-blur-xl text-white font-mono text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent font-semibold">Cerita Kami</span>
              </div>
            </motion.div>

            <motion.h1 variants={cinematicReveal.item} className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-extrabold mb-8 text-white leading-[1.1] tracking-tight relative">
              {title ? title : (
                <>
                  Tentang <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 font-serif italic font-normal relative inline-block">
                    {farmName}
                    <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-400/50 to-emerald-500/0 rounded-full blur-sm" />
                  </span>
                </>
              )}
            </motion.h1>
            {subtitle && (
              <motion.p
                variants={cinematicReveal.item}
                className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed font-light relative"
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Profil Pemilik (Owner Profile) ── */}
      {/* ── Profil Pemilik (Owner Profile) ── */}
      {ownerName && (
        <section className="pt-16 pb-8 max-w-5xl w-full mx-auto px-6 relative z-20 -mt-16 mb-8">
          <motion.div
            variants={blurReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="pub-glass rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
              {/* Image */}
              <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-[6px] border-[var(--pub-bg)] shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                {ownerImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ownerImageUrl} alt={ownerName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center">
                    <Leaf className="w-16 h-16 text-emerald-500/40" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col flex-grow">
                <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-4 text-xs font-mono tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                  <span className="w-8 h-[1px] bg-emerald-500/50 hidden md:block" />
                  Profil Pemilik
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2" style={{ color: "var(--pub-text)" }}>
                  {ownerName}
                </h2>
                {ownerRole && (
                  <h3 className="text-xl font-serif italic mb-6 text-emerald-500">
                    {ownerRole}
                  </h3>
                )}
                {ownerBio && (
                  <p className="text-lg font-light leading-relaxed opacity-90" style={{ color: "var(--pub-text-muted)" }}>
                    "{ownerBio}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Main Content (Bento Grid) ── */}
      <main className="max-w-7xl w-full mx-auto px-6 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Visi Misi - Large Bento Box */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 rounded-[3rem] p-10 md:p-14 pub-glass overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border mb-8 text-xs font-mono tracking-widest uppercase" style={{ borderColor: "var(--pub-divider)", color: "var(--pub-text-muted)" }}>
                <Info className="w-3.5 h-3.5 text-emerald-500" />
                Visi & Misi Kami
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8 leading-[1.1]" style={{ color: "var(--pub-text)" }}>
                Berkomitmen pada <br/>
                <span className="text-emerald-500 font-serif italic font-normal">Kualitas Murni.</span>
              </h2>
              
              <div className="space-y-6 text-lg font-light leading-relaxed opacity-90 max-w-xl" style={{ color: "var(--pub-text-muted)" }}>
                <p>
                  {description || "Kami berkomitmen untuk menyediakan sayuran berkualitas terbaik, ditanam dengan metode hidroponik modern yang ramah lingkungan dan 100% bebas pestisida."}
                </p>
                <p>
                  {vision || "Ditanam di dalam greenhouse khusus, setiap sayuran dijaga nutrisinya agar menghasilkan cita rasa dan kesegaran yang maksimal untuk meja makan keluarga Anda."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contacts - Small Bento Boxes */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            <motion.div
              variants={staggerGrid}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-8 flex-grow"
            >
              {contacts.length === 0 && (
                <div className="rounded-[2rem] p-8 pub-glass border border-white/5">
                  <p className="text-base font-light" style={{ color: "var(--pub-text-muted)" }}>
                    Informasi kontak belum diisi.
                  </p>
                </div>
              )}
              {contacts.map(({ icon: Icon, label, value }) => (
                <motion.div key={label} variants={fadeUp} className="rounded-[2rem] p-8 pub-glass border border-white/5 hover:bg-white/5 transition-colors group">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <Icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex flex-col justify-center min-h-[3.5rem]">
                      <p className="text-xs font-mono tracking-widest uppercase mb-1.5 opacity-60" style={{ color: "var(--pub-text-muted)" }}>{label}</p>
                      <p className="font-medium text-lg leading-tight" style={{ color: "var(--pub-text)" }}>{value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── CTA WhatsApp (Full Width Bottom Bento) ── */}
          {whatsapp && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="col-span-1 lg:col-span-12 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden pub-glass border-emerald-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex w-20 h-20 rounded-[1.5rem] items-center justify-center bg-emerald-500/20 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] shrink-0">
                    <MessageCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--pub-text)" }}>
                      Ada Pertanyaan?
                    </h3>
                    <p className="text-lg font-light leading-relaxed max-w-xl" style={{ color: "var(--pub-text-muted)" }}>
                      Tim kami siap membantu Anda memilih sayuran segar terbaik untuk keluarga.
                    </p>
                  </div>
                </div>

                <MagneticButton>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-5 rounded-full transition-all duration-300 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] whitespace-nowrap text-lg"
                  >
                    <Phone className="w-5 h-5" />
                    Chat via WhatsApp
                  </a>
                </MagneticButton>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </>
  );
}
