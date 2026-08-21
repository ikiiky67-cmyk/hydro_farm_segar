"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const staggerGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};

const floatLevitate = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 + (i * 0.1) }
  }),
};

type Promo = {
  id: string;
  title: string;
  description: string | null;
  badgeText: string | null;
  imageUrl: string | null;
};

export function PromoSection({ promos }: { promos: Promo[] }) {
  const [promoEmblaRef, promoEmblaApi] = useEmblaCarousel(
    { 
      align: "start",
      loop: false,
      breakpoints: {
        "(max-width: 767px)": { 
          loop: promos.length >= 2,
          slidesToScroll: 1,
          dragFree: true
        },
        "(min-width: 768px)": { 
          loop: promos.length >= 6,
          slidesToScroll: 3 
        }
      }
    },
    [Autoplay({ delay: 3500, stopOnInteraction: true, playOnInit: false })]
  );

  const [promoSelectedIndex, setPromoSelectedIndex] = useState(0);
  const [promoScrollSnaps, setPromoScrollSnaps] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);

  const promoScrollPrev = useCallback(() => promoEmblaApi && promoEmblaApi.scrollPrev(), [promoEmblaApi]);
  const promoScrollNext = useCallback(() => promoEmblaApi && promoEmblaApi.scrollNext(), [promoEmblaApi]);
  const promoScrollTo = useCallback((index: number) => promoEmblaApi && promoEmblaApi.scrollTo(index), [promoEmblaApi]);

  const promoOnSelect = useCallback(() => {
    if (!promoEmblaApi) return;
    setPromoSelectedIndex(promoEmblaApi.selectedScrollSnap());
  }, [promoEmblaApi]);

  const promoOnReInit = useCallback(() => {
    if (!promoEmblaApi) return;
    setPromoScrollSnaps(promoEmblaApi.scrollSnapList());
    setPromoSelectedIndex(promoEmblaApi.selectedScrollSnap());
    
    // Pastikan status autoplay konsisten dengan kemampuan scroll (responsif)
    const autoplay = promoEmblaApi.plugins().autoplay;
    if (autoplay && isInView) {
      if (promoEmblaApi.canScrollNext() || promoEmblaApi.canScrollPrev()) {
        autoplay.play();
      } else {
        autoplay.stop();
      }
    }
  }, [promoEmblaApi, isInView]);

  useEffect(() => {
    if (!promoEmblaApi) return;
    promoEmblaApi.on("select", promoOnSelect);
    promoEmblaApi.on("reInit", promoOnReInit);
    promoOnReInit();
  }, [promoEmblaApi, promoOnSelect, promoOnReInit]);

  useEffect(() => {
    // Timeout khusus untuk penundaan awal saat pertama kali masuk ke layar
    if (promoEmblaApi && isInView) {
      const autoplay = promoEmblaApi.plugins().autoplay;
      if (autoplay) {
        const timer = setTimeout(() => {
          if (promoEmblaApi.canScrollNext() || promoEmblaApi.canScrollPrev()) {
            autoplay.play();
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [promoEmblaApi, isInView]);

  if (promos.length === 0) return null;

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950">
      {/* Abstract Aurora Glows */}
      <div className="absolute top-0 -left-32 w-96 h-96 bg-emerald-400/20 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Top Wave Curtain */}
      <motion.div 
        initial={{ y: "0%" }}
        whileInView={{ y: "-100%" }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.3, 1], delay: 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute top-0 left-0 right-0 w-full h-[55%] z-40 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[var(--pub-bg)] z-10" />
        <div className="absolute left-0 right-0 top-[calc(100%-2px)] z-0">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" className="w-full h-[40px] md:h-[60px] lg:h-[90px]" style={{ fill: "var(--pub-bg)" }}>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 pt-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-end justify-between mb-16 flex-wrap gap-4"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Penawaran <span className="text-amber-400 font-serif italic font-normal">Spesial</span>
            </h2>
            <p className="text-lg text-emerald-100/80">
              Jangan lewatkan harga terbaik minggu ini.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          onViewportEnter={() => setIsInView(true)}
          className="overflow-hidden w-full cursor-grab active:cursor-grabbing"
          ref={promoEmblaRef}
        >
          <div className="flex -ml-6 pb-8 pt-4 -mt-4">
            {promos.map((promo, index) => (
              <div key={promo.id} className="flex-[0_0_100%] md:flex-[0_0_33.3333%] min-w-0 pl-6" style={{ perspective: "1500px" }}>
                <motion.div custom={index} variants={floatLevitate} className="relative rounded-[2rem] p-8 h-full bg-white/10 border border-white/10 backdrop-blur-md overflow-hidden flex flex-col group shadow-lg hover:bg-white/15 hover:border-white/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition-colors duration-500">
                {/* Background glow hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {promo.badgeText && (
                  <div className="absolute top-6 right-6 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-500 text-xs font-bold px-4 py-1.5 rounded-full z-20">
                    {promo.badgeText}
                  </div>
                )}
                {promo.imageUrl ? (
                  <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden relative z-10">
                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-amber-500/10 border border-amber-500/20 z-10 relative">
                    <Tag className="w-6 h-6 text-amber-500" />
                  </div>
                )}
                <h3 className="font-bold text-2xl mb-3 relative z-10 tracking-tight text-white">
                  {promo.title}
                </h3>
                {promo.description && (
                  <p className="text-base leading-relaxed font-light relative z-10 text-emerald-100/90">
                    {promo.description}
                  </p>
                )}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pagination Dots */}
        {promoScrollSnaps.length > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10 relative z-10">
            {promoScrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => promoScrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  index === promoSelectedIndex
                    ? "bg-amber-400 scale-150 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                    : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Wave Curtain */}
      <motion.div 
        initial={{ y: "0%" }}
        whileInView={{ y: "100%" }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.3, 1], delay: 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute bottom-0 left-0 right-0 w-full h-[55%] z-40 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[var(--pub-bg)] z-10" />
        <div className="absolute left-0 right-0 bottom-[calc(100%-2px)] z-0 transform rotate-180">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" className="w-full h-[40px] md:h-[60px] lg:h-[90px]" style={{ fill: "var(--pub-bg)" }}>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
