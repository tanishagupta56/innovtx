'use client';

import { motion } from 'framer-motion';
import HeroVisual from './HeroVisual';
import MagneticButton from './MagneticButton';
import SplitHeading from './SplitHeading';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 overflow-hidden bg-midnight">
      {/* Background radial energy field */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cobalt/20 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-lime/10 blur-[130px] pointer-events-none -z-10" />

      {/* Cyber Grid Lines Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(21, 88, 201, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(21, 88, 201, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top telemetry bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-b border-cobalt/20 pb-4 z-10"
      >
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-lime shadow-[0_0_8px_#D4FF24] animate-pulse" />
          <span className="text-lime font-bold uppercase tracking-wider">
            SOCIETY OPS ONLINE
          </span>
          <span className="text-gray-500 hidden sm:inline">{'// BATCH 2024-2026'}</span>
        </div>

        <div className="flex items-center gap-6 text-gray-400">
          <span className="hidden md:inline">INDIRA GANDHI DELHI TECHNICAL UNIVERSITY FOR WOMEN</span>
          <span className="tag-telemetry text-lime border-lime/40">v2.4 ACTIVE</span>
        </div>
      </motion.div>

      {/* Hero Body Composition: Asymmetrical Editorial Layering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto relative z-10 py-8">
        {/* Left Column: Massive Editorial Typography & Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          <div className="inline-flex items-center gap-2">
            <span className="tag-telemetry-lime">EST. IGDTUW DELHI</span>
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
              OFFICIAL TECHNICAL SOCIETY
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight leading-[0.88]">
              <span className="block text-white">IGNITING</span>
              <span className="block text-transparent [-webkit-text-stroke:1.5px_#1558C9] hover:[-webkit-text-stroke:1.5px_#D4FF24] transition-all">
                TECHNICAL
              </span>
              <span className="block text-white">
                GENIUS<span className="text-lime">.</span>
              </span>
            </h1>
          </div>

          <p className="text-gray-300 font-body text-base sm:text-lg max-w-xl leading-relaxed">
            The premier technology innovation collective at IGDTUW. We engineer competitive hackathons, architect distributed systems, and foster open engineering excellence among the nation&apos;s sharpest women developers.
          </p>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton href="/events" strength={25}>
              <span className="btn-magnetic">
                Explore Events &amp; Passes →
              </span>
            </MagneticButton>

            <MagneticButton href="/about" strength={20}>
              <span className="btn-hollow">
                Read Manifesto
              </span>
            </MagneticButton>
          </div>

          {/* Quick Stat Pill Rail */}
          <div className="pt-6 border-t border-cobalt/20 grid grid-cols-3 gap-4 font-mono">
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-white">100%</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">OPEN-SOURCE</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-lime">INNO-</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">VORTEX FEST</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-white">HMAC</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">SECURED PASSES</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Kinetic Hyper-Sphere Object */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          <HeroVisual />
        </div>
      </div>

      {/* Bottom Editorial Bar with Interactive Scroll Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs border-t border-cobalt/20 pt-4 z-10 text-gray-500">
        <div className="flex items-center gap-4">
          <span className="text-gray-400">COORDINATES:</span>
          <span className="text-white">28°39&apos;55&quot; N 77°13&apos;57&quot; E</span>
        </div>

        {/* Reactive scroll indicator */}
        <div className="flex items-center gap-3 text-gray-400">
          <span className="uppercase tracking-widest text-[10px]">SCROLL TO EXPLORE ARCHIVE</span>
          <div className="w-5 h-8 border border-cobalt/50 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-lime"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
