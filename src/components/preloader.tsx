import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = "hidden";
    
    // Timer to match the animation sequence:
    // Hold complete composition briefly, then dissolve at ~2.5s
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none"
        >
          {/* Subtle Varanasi Ink Art SVG (Hand-drawn look) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 0.12, scale: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center opacity-20 mix-blend-screen"
          >
            <svg 
              width="800" 
              height="400" 
              viewBox="0 0 800 400" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-full max-w-5xl stroke-white/80"
              style={{ strokeWidth: 0.75 }}
            >
              {/* Central Ghat Steps */}
              <path d="M200 280 H 600 M150 300 H 650 M100 320 H 700 M50 340 H 750" strokeWidth="1" strokeDasharray="3 3"/>
              
              {/* Distant Temple Spire (Left) */}
              <path d="M300 280 L 320 120 L 340 280" strokeWidth="0.5" />
              <path d="M320 120 V 90 M315 100 H 325" strokeWidth="0.5" />
              <path d="M320 120 C 310 160 310 240 300 280 M320 120 C 330 160 330 240 340 280" strokeWidth="0.5" strokeDasharray="1 2"/>

              {/* Distant Temple Spire (Right) */}
              <path d="M480 280 L 500 160 L 520 280" strokeWidth="0.5" />
              <path d="M500 160 V 140 M495 150 H 505" strokeWidth="0.5" />
              
              {/* Old Architecture Silhouettes & Arches */}
              <path d="M360 280 V 220 C 360 200 400 200 400 220 V 280" strokeWidth="0.75" />
              <path d="M410 280 V 230 C 410 210 440 210 440 230 V 280" strokeWidth="0.75" />
              
              {/* Subtle River Waves & Reflections */}
              <path d="M250 360 Q 300 355 350 360 T 450 360 T 550 360" strokeWidth="0.5" strokeDasharray="4 6"/>
              <path d="M200 380 Q 280 375 360 380 T 520 380" strokeWidth="0.5" strokeDasharray="2 8"/>
              
              {/* Subtle Boat Silhouette */}
              <path d="M550 330 C 580 350 630 350 660 330 H 550 Z" strokeWidth="0.5" fill="rgba(255,255,255,0.02)"/>
              <path d="M605 335 V 300 M590 310 L 605 300 L 620 315" strokeWidth="0.5" />
            </svg>
          </motion.div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-white text-4xl sm:text-5xl md:text-6xl tracking-[0.25em] sm:tracking-[0.3em] font-serif uppercase text-center ml-[0.25em]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              Shree Bakers
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              className="text-zinc-400 mt-6 sm:mt-8 text-[0.65rem] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase text-center"
            >
              Freshly Baked &bull; Varanasi
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
