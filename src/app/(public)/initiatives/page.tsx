import React from 'react';
import { SOCIETY_INITIATIVES } from '@/data/societyData';
import Link from 'next/link';

export const metadata = {
  title: 'Society Initiatives & Programs — TechNeeds IGDTUW',
  description: 'Explore flagship programs of TechNeeds IGDTUW including InnoVortex, SSSC Mentorship Cadre, and CS Fundamentals sprints.',
};

export default function InitiativesPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 min-h-screen text-white relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-cobalt/25 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
              PROGRAM ARCHITECTURE
            </span>
            <span className="font-mono text-xs text-electric-lime uppercase tracking-widest">
              ACTIVE COHORTS &amp; HACKATHONS
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight uppercase">
            FLAGSHIP <br />
            <span className="text-electric-lime">INITIATIVES.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            From multi-institution hackathons to intensive peer mentorship programs, TechNeeds crafts environments where women engineers transform theoretical knowledge into real software.
          </p>
        </div>

        {/* Initiatives List */}
        <div className="space-y-12">
          {SOCIETY_INITIATIVES.map((init, idx) => (
            <div
              key={init.id}
              id={init.id}
              className="p-8 sm:p-12 rounded-xl border border-white/10 bg-midnight-950/80 backdrop-blur-md relative overflow-hidden group hover:border-electric-lime transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono text-cobalt-bright font-bold">
                      0{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-electric-lime/15 text-electric-lime border border-electric-lime/30">
                      {init.status}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-white group-hover:text-electric-lime transition-colors">
                    {init.title}
                  </h2>

                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {init.subtitle}
                  </p>

                  <div className="pt-2 text-xs font-mono text-electric-lime font-bold">
                    {init.metrics}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <p className="text-base text-slate-300 leading-relaxed font-sans">
                    {init.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {init.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs font-mono text-slate-500">
                      ELIGIBILITY: IGDTUW STUDENTS &amp; REGISTERED HACKERS
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/events"
                        className="px-4 py-2 text-xs font-mono bg-electric-cobalt text-white font-bold rounded hover:bg-blue-600 transition-colors"
                      >
                        Check Upcoming Cohort →
                      </Link>
                      <Link
                        href="/timeline"
                        className="px-4 py-2 text-xs font-mono bg-white/10 text-slate-200 rounded hover:bg-white/20 transition-colors"
                      >
                        View Historical Log
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
