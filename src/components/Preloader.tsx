'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeen = sessionStorage.getItem('tn_preload_done');

    if (isReduced || hasSeen) {
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('tn_preload_done', 'true');
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[99999] bg-[#030407] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <div className="relative flex flex-col items-center">
            {/* SVG Logo Animation */}
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20"
            >
              <motion.polygon
                points="50,5 90,25 90,75 50,95 10,75 10,25"
                stroke="#1558C9"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
              <motion.path
                d="M30 45 L50 30 L70 45 L50 65 Z"
                stroke="#D4FF24"
                strokeWidth="2.5"
                fill="none"
                initial={{ pathLength: 0, scale: 0.8 }}
                animate={{ pathLength: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="3"
                fill="#D4FF24"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
            </svg>

            {/* Brand text reveal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-4 font-display font-bold text-lg tracking-wider"
            >
              <span className="text-white">Tech</span>
              <span className="text-lime">Needs</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-[10px] font-mono text-cobalt-200 mt-1 uppercase tracking-widest"
            >
              IGDTUW // Technical Society
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
