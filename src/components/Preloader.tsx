'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeen = sessionStorage.getItem('techneeds_cinematic_preload_v3');

    if (isReduced || hasSeen) {
      return;
    }

    setLoading(true);

    // Rapid telemetry counter
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 16) + 8;
        return Math.min(100, prev + step);
      });
    }, 60);

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('techneeds_cinematic_preload_v3', 'true');
    }, 1350);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[99999] bg-[#080B12] flex flex-col justify-between p-8 sm:p-12 pointer-events-none select-none overflow-hidden"
        >
          {/* Laser horizontal scanline */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-electric-blue to-transparent shadow-[0_0_20px_#315EFF] animate-scanline pointer-events-none" />

          {/* Top telemetry bar */}
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-electric-blue-light tracking-widest uppercase">
              TECHNEEDS IGDTUW // DIGITAL EXPERIENCE
            </span>
            <span className="text-lime-green flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-lime-green animate-ping" />
              ONLINE
            </span>
          </div>

          {/* Center Brand Identity with Official Logo Reveal */}
          <div className="flex flex-col items-center justify-center my-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6"
            >
              <div className="absolute inset-0 bg-lime-green/20 rounded-full blur-2xl animate-pulse" />
              <Image
                src="/brand/techneeds-logo.png"
                alt="TechNeeds IGDTUW Official Logo"
                fill
                sizes="(max-width: 768px) 112px, 144px"
                className="object-contain relative z-10 drop-shadow-[0_0_25px_rgba(49,94,255,0.5)]"
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, letterSpacing: '-0.02em' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-soft-white"
            >
              TECH<span className="text-lime-green">NEEDS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-mono text-xs text-slate-400 mt-2 tracking-widest uppercase"
            >
              Learn. Build. Explore. Connect.
            </motion.p>
          </div>

          {/* Bottom telemetry footer */}
          <div className="flex justify-between items-end text-xs font-mono border-t border-charcoal-border pt-4">
            <div className="space-y-1">
              <p className="text-slate-500">IGDTUW KASHMERE GATE, DELHI</p>
              <p className="text-slate-400">STATUS: INITIALIZING LIGHT FIELD</p>
            </div>
            <div className="text-right">
              <span className="text-4xl sm:text-6xl font-display font-black text-soft-white tracking-tighter">
                {counter}
                <span className="text-xs text-lime-green font-mono font-normal ml-1">%</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
