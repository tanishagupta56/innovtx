'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MilestoneItem } from '@/data/timelineData';
import { motion, AnimatePresence } from 'framer-motion';

const Timeline3DCanvas = dynamic(
  () => import('@/components/3d/Timeline3DCanvas').then((mod) => mod.Timeline3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-xl border border-white/10 bg-midnight-950/80 flex items-center justify-center font-mono text-sm text-slate-500">
        <span className="w-3 h-3 rounded-full bg-electric-lime animate-ping mr-3" />
        INITIALIZING 3D SPATIAL ACCELERATOR...
      </div>
    ),
  }
);

export default function TimelineClient({
  initialMilestones,
}: {
  initialMilestones: MilestoneItem[];
}) {
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem | null>(
    initialMilestones[0] || null
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');

  const years = Array.from(new Set(initialMilestones.map((m) => m.year))).sort((a, b) => a - b);
  const categories = [
    { key: 'all', label: 'All Operations' },
    { key: 'hackathon', label: 'Hackathons' },
    { key: 'mentorship', label: 'SSSC Mentorship' },
    { key: 'workshop', label: 'Workshops & Labs' },
    { key: 'collaboration', label: 'Collaborations' },
    { key: 'platform', label: 'Platform Releases' },
  ];

  const filtered = initialMilestones.filter((m) => {
    const matchesCat = activeCategory === 'all' || m.category === activeCategory;
    const matchesYr = activeYear === 'all' || m.year === activeYear;
    return matchesCat && matchesYr;
  });

  return (
    <div className="space-y-10">
      {/* 3D WebGL Spatial Timeline */}
      <Timeline3DCanvas
        selectedId={selectedMilestone?.id || null}
        onSelectMilestone={(m) => setSelectedMilestone(m)}
      />

      {/* Scrubber & Filter Controls Bar */}
      <div className="p-6 border border-white/10 bg-midnight-900/60 backdrop-blur-md rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Year Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mr-2">
            EPOCH:
          </span>
          <button
            onClick={() => setActiveYear('all')}
            className={`px-3 py-1.5 font-mono text-xs rounded transition-all ${
              activeYear === 'all'
                ? 'bg-electric-lime text-black font-bold shadow-[0_0_12px_#D4FF24]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            All Years
          </button>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setActiveYear(yr)}
              className={`px-3 py-1.5 font-mono text-xs rounded transition-all ${
                activeYear === yr
                  ? 'bg-electric-cobalt text-white font-bold shadow-[0_0_15px_#1558C9]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mr-2">
            TRACK:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                activeCategory === cat.key
                  ? 'bg-white/20 text-white border border-electric-lime font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Milestone Stream + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chronological Stream */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              DISPLAYING {filtered.length} ARCHIVAL LOGS
            </span>
            <span className="text-[11px] font-mono text-electric-lime">
              CLICK ENTRY TO INSPECT
            </span>
          </div>

          <div className="space-y-4">
            {filtered.map((item) => {
              const isSelected = selectedMilestone?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMilestone(item)}
                  className={`p-6 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'border-electric-lime bg-midnight-900/90 shadow-[0_0_25px_rgba(212,255,36,0.15)]'
                      : 'border-white/10 bg-midnight-950/60 hover:border-cobalt/50 hover:bg-midnight-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-electric-cobalt/20 text-electric-cobalt border border-electric-cobalt/40">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {item.month} {item.year}
                      </span>
                    </div>
                    {item.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-electric-lime uppercase">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        VERIFIED RECORD
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-electric-lime transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>📍 {item.venue}</span>
                    {item.metrics.participants && (
                      <span className="text-electric-lime font-bold">
                        👥 {item.metrics.participants}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspector Modal/Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <AnimatePresence mode="wait">
            {selectedMilestone ? (
              <motion.div
                key={selectedMilestone.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="p-8 rounded-xl border border-electric-cobalt/40 bg-midnight-900/90 backdrop-blur-xl relative overflow-hidden shadow-2xl"
              >
                {/* Visual Accent Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cobalt/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-electric-lime uppercase tracking-widest">
                    RECORD ID // {selectedMilestone.id}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-white/10 rounded text-slate-300 border border-white/10">
                    {selectedMilestone.year} ARCHIVE
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white leading-snug">
                  {selectedMilestone.title}
                </h2>

                <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                  {selectedMilestone.description}
                </p>

                {/* Metrics Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {selectedMilestone.metrics.participants && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        PARTICIPANTS
                      </span>
                      <span className="text-lg font-bold text-electric-lime font-mono">
                        {selectedMilestone.metrics.participants}
                      </span>
                    </div>
                  )}
                  {selectedMilestone.metrics.teams && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        TEAMS FORMED
                      </span>
                      <span className="text-lg font-bold text-white font-mono">
                        {selectedMilestone.metrics.teams}
                      </span>
                    </div>
                  )}
                  {selectedMilestone.metrics.sponsors && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 col-span-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        SPONSORS & PARTNERS
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {selectedMilestone.metrics.sponsors}
                      </span>
                    </div>
                  )}
                </div>

                {/* Highlights */}
                {selectedMilestone.highlights && selectedMilestone.highlights.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block">
                      KEY DELIVERABLES & OUTCOMES:
                    </span>
                    <ul className="space-y-2">
                      {selectedMilestone.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-electric-lime font-mono mt-0.5">▹</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Source Verification Link */}
                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400">
                    VENUE: <span className="text-white">{selectedMilestone.venue}</span>
                  </div>
                  {selectedMilestone.sourceUrl && (
                    <a
                      href={selectedMilestone.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-mono bg-electric-lime text-black font-bold rounded hover:bg-lime-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>SOURCE LINK</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-8 border border-white/10 bg-midnight-950/60 rounded-xl text-center text-slate-500 font-mono text-sm">
                SELECT A NODE ON THE 3D SPLINE OR LIST TO VIEW TELEMETRY
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
