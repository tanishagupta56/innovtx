'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    if (mql.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const el = containerRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Pointer-reactive gradient lighting */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `
              radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(21,88,201,0.12), transparent 50%),
              radial-gradient(600px circle at ${mousePos.x * 80 + 20}% ${mousePos.y * 60 + 20}%, rgba(212,255,36,0.04), transparent 50%)
            `,
          }}
        />
      )}

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(21,88,201,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,88,201,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating technical elements */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-1/4 left-[10%] w-px h-32 bg-gradient-to-b from-transparent via-cobalt/30 to-transparent"
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 right-[15%] w-2 h-2 border border-lime/30"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute bottom-1/3 left-[20%] w-20 h-px bg-gradient-to-r from-transparent via-cobalt/20 to-transparent"
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[60%] right-[8%] text-cobalt/10 font-mono text-xs"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {'<innovation />'}
          </motion.div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-6">
            IGDTUW Technical Society
          </p>
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-white">Tech</span>
          <span className="text-lime">Needs</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Fostering innovation, coding proficiency, and problem-solving
          at Indira Gandhi Delhi Technical University for Women.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/events" className="btn-accent text-base px-8 py-4">
            Explore Events
          </Link>
          <Link href="/about" className="btn-ghost text-base px-8 py-4">
            Learn More
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-5 h-8 border border-cobalt/30 flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-cobalt/50" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
