'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeen = sessionStorage.getItem('techneeds_cinematic_preload');

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
        const step = Math.floor(Math.random() * 14) + 6;
        return Math.min(100, prev + step);
      });
    }, 70);

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('techneeds_cinematic_preload', 'true');
    }, 1300);

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
          className="fixed inset-0 z-[99999] bg-[#030407] flex flex-col justify-between p-8 sm:p-12 pointer-events-none select-none overflow-hidden"
        >
          {/* Laser horizontal scanline */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-lime to-transparent shadow-[0_0_15px_#D4FF24] animate-scanline pointer-events-none" />

          {/* Top telemetry bar */}
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cobalt-300 tracking-widest uppercase">
              TECHNEEDS IGDTUW // SYSTEM BOOT
            </span>
            <span className="text-lime flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-lime animate-ping" />
              INITIALIZING
            </span>
          </div>

          {/* Center Brand Identity with animated geometric vector */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="relative mb-8">
              <svg
                width="140"
                height="140"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 sm:w-28 sm:h-28"
              >
                {/* Hexagon framework */}
                <motion.polygon
                  points="50,5 92,27 92,73 50,95 8,73 8,27"
                  stroke="#1558C9"
                  strokeWidth="2.5"
                  fill="none"
                  initial={{ pathLength: 0, rotate: -30 }}
                  animate={{ pathLength: 1, rotate: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Inner kinetic diamond */}
                <motion.path
                  d="M50 18 L80 50 L50 82 L20 50 Z"
                  stroke="#D4FF24"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  fill="none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                />
                {/* Core pulse node */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="5"
                  fill="#D4FF24"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
              </svg>
            </div>

            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, letterSpacing: '-0.02em' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white"
            >
              TECH<span className="text-lime">NEEDS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-mono text-xs text-gray-400 uppercase tracking-widest mt-2"
            >
              PREMIER TECHNICAL SOCIETY // IGDTUW DELHI
            </motion.p>
          </div>

          {/* Bottom telemetry progress */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 font-mono text-xs border-t border-cobalt/20 pt-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">ENGINE:</span>
              <span className="text-white">GSAP + LENIS ACCELERATED</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-36 h-1 bg-[#0a1226] border border-cobalt/30 overflow-hidden">
                <motion.div
                  className="h-full bg-lime shadow-[0_0_10px_#D4FF24]"
                  style={{ width: `${counter}%` }}
                />
              </div>
              <span className="text-lime font-bold min-w-[3rem] text-right font-mono">
                {counter}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
