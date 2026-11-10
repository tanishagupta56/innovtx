'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import HeroVisual from './HeroVisual';
import MagneticButton from './MagneticButton';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 overflow-hidden bg-transparent">
      {/* Background radial energy field */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-electric-blue/15 blur-[170px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-lime-green/10 blur-[140px] pointer-events-none -z-10" />

      {/* Cyber Grid Lines Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(117, 230, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(49, 94, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top society status bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs border-b border-charcoal-border pb-4 z-10"
      >
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-green shadow-[0_0_8px_#B8D94C] animate-pulse" />
          <span className="text-lime-green font-bold uppercase tracking-wider">
            SOCIETY OPS ONLINE
          </span>
          <span className="text-slate-500 hidden sm:inline">{'// IGDTUW KASHMERE GATE'}</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span className="hidden md:inline">INDIRA GANDHI DELHI TECHNICAL UNIVERSITY FOR WOMEN</span>
          <span className="px-2.5 py-0.5 rounded bg-charcoal border border-charcoal-border text-lime-green text-[11px] font-mono">
            V3.0 ACTIVE
          </span>
        </div>
      </motion.div>

      {/* Hero Body Composition: Asymmetrical Editorial Layering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto relative z-10 py-10">
        {/* Left Column: Headline, Brand Logo & Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
              <div className="absolute inset-0 bg-lime-green/20 rounded-full blur-xl" />
              <Image
                src="/brand/techneeds-logo.png"
                alt="TechNeeds Logo"
                fill
                sizes="64px"
                className="object-contain relative z-10 drop-shadow-[0_0_15px_rgba(184,217,76,0.4)]"
                priority
              />
            </div>
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green block w-fit">
                EST. IGDTUW DELHI
              </span>
              <span className="font-mono text-xs text-slate-400 tracking-wider block mt-1">
                Official Technology Community &amp; Research Collective
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="editorial-title text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl text-soft-white tracking-tight leading-[0.92]">
              <span className="block text-soft-white">ALL YOU NEED</span>
              <span className="block text-transparent [-webkit-text-stroke:1.5px_#315EFF] hover:[-webkit-text-stroke:1.5px_#B8D94C] transition-all">
                TO KNOW ABOUT
              </span>
              <span className="block text-soft-white">
                TECH<span className="text-lime-green">.</span>
              </span>
            </h1>
          </div>

          <div className="space-y-3 max-w-xl">
            <p className="font-mono text-sm sm:text-base text-lime-green tracking-wider font-semibold">
              Learn. Build. Explore. Connect.
            </p>
            <p className="text-slate-300 font-sans text-base sm:text-lg leading-relaxed">
              The premier innovation collective at IGDTUW. We engineer competitive hackathons, foster peer mentorship cohorts, and build production open-source systems among India&apos;s sharpest women engineers.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton href="/about" strength={25}>
              <span className="px-6 py-3.5 bg-lime-green hover:bg-lime-green/90 text-deep-ink font-mono text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-[0_0_20px_rgba(184,217,76,0.4)] block">
                Explore TechNeeds →
              </span>
            </MagneticButton>

            <MagneticButton href="/events" strength={20}>
              <span className="px-6 py-3.5 bg-charcoal hover:bg-charcoal-surface text-soft-white border border-charcoal-border hover:border-electric-blue/60 font-mono text-xs font-bold uppercase tracking-wider rounded-md transition-all block">
                Discover Our Events ↗
              </span>
            </MagneticButton>
          </div>

          {/* Quick Stat Metric Rail */}
          <div className="pt-6 border-t border-charcoal-border grid grid-cols-3 gap-6 font-mono">
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-soft-white">1,200+</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">ACTIVE BUILDERS</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-lime-green">INNO-</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">VORTEX FEST</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-soft-white">14 NODES</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">3D CHRONICLE</p>
            </div>
          </div>
        </div>

        {/* Right Column: Cybernetic 3D Core HUD Reticle Overlay */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <HeroVisual />
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-500 pt-4 border-t border-charcoal-border z-10">
        <span className="text-slate-400">SCROLL DOWN TO TRAVERSE THE ECOSYSTEM</span>
        <span className="animate-bounce text-lime-green">↓ [01 / 14 SECTIONS]</span>
      </div>
    </section>
  );
}
