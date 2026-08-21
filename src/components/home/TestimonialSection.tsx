"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Star, MessageSquareQuote, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { Testimonial } from "@prisma/client";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const revealUp: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};

export function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    breakpoints: {
      "(max-width: 767px)": { slidesToScroll: 1, dragFree: true },
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 }
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi, setScrollSnaps, onSelect]);

  // Ping-Pong Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    let direction = 1; // 1 = forward, -1 = backward
    
    const play = () => {
      if (!emblaApi) return;
      if (direction === 1) {
        if (!emblaApi.canScrollNext()) {
          direction = -1;
          emblaApi.scrollPrev();
        } else {
          emblaApi.scrollNext();
        }
      } else {
        if (!emblaApi.canScrollPrev()) {
          direction = 1;
          emblaApi.scrollNext();
        } else {
          emblaApi.scrollPrev();
        }
      }
    };

    const interval = setInterval(play, 4000);
    
    const stop = () => clearInterval(interval);
    emblaApi.on("pointerDown", stop);

    return () => {
      clearInterval(interval);
      emblaApi.off("pointerDown", stop);
    };
  }, [emblaApi]);

  if (testimonials.length === 0) return null;

  return (
    <section className="pt-12 pb-12 lg:pt-16 lg:pb-16 px-6 relative overflow-hidden" style={{ background: "var(--pub-section-alt)" }}>
      {/* Background to match CTA Section exactly */}
      <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full scale-150 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.2 } }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-8 md:mb-10 flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm"
          >
            <MessageSquareQuote className="w-4 h-4" />
            Suara Pelanggan
          </motion.div>

          {/* Heading Typewriter */}
          <motion.h2
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } }
            }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6"
          >
            {"Apa Kata ".split("").map((char, index) => (
              <motion.span key={`apa-${index}`} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                {char}
              </motion.span>
            ))}
            <span className="text-emerald-500 font-serif italic font-normal">
              {"Mereka?".split("").map((char, index) => (
                <motion.span key={`mereka-${index}`} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h2>

          {/* Paragraph */}
          <motion.p variants={fadeUp} className="text-lg max-w-2xl mx-auto text-gray-600 leading-relaxed font-light">
            Pengalaman nyata dari mereka yang telah menikmati kesegaran dan kualitas sayuran hidroponik kami setiap harinya.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-visible w-full cursor-grab active:cursor-grabbing pb-8 pt-12" ref={emblaRef}>
          <div className="flex -ml-6" style={{ perspective: "1500px" }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, rotateX: -60, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.2 + (i * 0.15),
                  type: "spring",
                  bounce: 0.4
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex-[0_0_85%] md:flex-[0_0_50%] lg:flex-[0_0_33.3333%] min-w-0 pl-6"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative rounded-[2rem] p-8 md:p-10 h-full bg-white/70 border border-white/80 backdrop-blur-xl flex flex-col group shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-500 mt-4 mb-4">

                  {/* Faded Giant Quote Icon */}
                  <Quote className="absolute top-10 right-8 w-24 h-24 text-emerald-100 opacity-50 -rotate-6 pointer-events-none transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />

                  {/* Overlapping Profile Picture/Initial */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] flex items-center justify-center font-extrabold text-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white z-20 group-hover:scale-110 transition-transform duration-500">
                    {t.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="pt-10 flex flex-col h-full relative z-10 text-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow font-medium italic">
                      &quot;{t.content}&quot;
                    </p>

                    {/* Customer Info */}
                    <div className="mt-auto pt-6 border-t border-emerald-100/50">
                      <h4 className="font-bold text-gray-900 text-xl tracking-tight mb-1">
                        {t.name}
                      </h4>
                      {t.role && (
                        <p className="text-sm font-medium text-emerald-600">
                          {t.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {scrollSnaps.length > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8 md:mt-12 relative z-10">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${index === selectedIndex
                  ? "bg-emerald-500 scale-150 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  : "bg-emerald-200 hover:bg-emerald-300"
                  }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
