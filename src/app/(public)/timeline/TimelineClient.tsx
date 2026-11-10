'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  year: number;
  category: string | null;
}

export default function TimelineClient({ items }: { items: TimelineItem[] }) {
  const years = Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a);
  const [activeYear, setActiveYear] = useState<number | 'all'>(years[0] || 'all');
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const filtered = activeYear === 'all' ? items : items.filter((i) => i.year === activeYear);

  if (!items.length) {
    return (
      <div className="p-16 border border-cobalt/25 bg-[#050816] text-center font-mono">
        <p className="text-gray-400 text-lg mb-2">Historical milestones are currently being verified.</p>
        <p className="text-gray-600 text-xs">Official society timeline records to be added by admin.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Sticky Year Navigation & Progress Rail (Desktop) */}
      <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">
        <div className="p-6 border border-cobalt/25 bg-[#050816]">
          <span className="text-lime font-mono text-xs uppercase tracking-widest font-bold block mb-4">
            CHRONOLOGICAL SCRUBBER
          </span>

          <div className="flex lg:flex-col gap-2 flex-wrap">
            <button
              onClick={() => setActiveYear('all')}
              className={`text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider border transition-all ${
                activeYear === 'all'
                  ? 'bg-lime text-midnight border-lime font-bold shadow-[0_0_15px_rgba(212,255,36,0.3)]'
                  : 'border-cobalt/20 text-gray-400 hover:text-white hover:border-cobalt'
              }`}
            >
              All Milestones ({items.length})
            </button>

            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveYear(yr)}
                className={`text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider border transition-all flex items-center justify-between ${
                  activeYear === yr
                    ? 'bg-cobalt text-white border-cobalt-bright font-bold shadow-[0_0_15px_rgba(21,88,201,0.4)]'
                    : 'border-cobalt/20 text-gray-400 hover:text-white hover:border-cobalt'
                }`}
              >
                <span>Year {yr}</span>
                <span className="text-[10px] opacity-70">
                  {items.filter((i) => i.year === yr).length} entries
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry info */}
        <div className="p-6 border border-cobalt/20 bg-[#040712] font-mono text-xs text-gray-500 hidden lg:block space-y-2">
          <p className="text-lime uppercase font-bold">{'// ARCHIVE VERIFICATION'}</p>
          <p>Chronological records indexed by society executive tenure.</p>
          <p className="text-gray-600">STATE: LIVE SYNCHRONIZED</p>
        </div>
      </div>

      {/* Main Timeline Stream */}
      <div className="lg:col-span-8 relative">
        {/* Animated Electric Progress Line */}
        <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-lime via-cobalt to-transparent shadow-[0_0_10px_#1558C9]" />

        <div className="space-y-8 pl-12">
          {filtered.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="relative group">
                {/* Glowing Node Pulse */}
                <div
                  className={`absolute -left-[45px] top-6 w-5 h-5 rounded-none border-2 transition-all ${
                    isExpanded
                      ? 'bg-lime border-lime shadow-[0_0_15px_#D4FF24] rotate-45 scale-110'
                      : 'bg-midnight border-cobalt group-hover:border-lime group-hover:rotate-45'
                  }`}
                />

                {/* Milestone Content Card */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className={`p-8 border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isExpanded
                      ? 'border-lime/60 bg-[#060a1d] shadow-[0_0_30px_rgba(21,88,201,0.2)]'
                      : 'border-cobalt/25 bg-[#050816] hover:border-cobalt/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="tag-telemetry-lime font-bold">
                        {formatDate(item.date)}
                      </span>
                      {item.category && (
                        <span className="font-mono text-xs text-gray-400 uppercase">
                          {'// ' + item.category}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-cobalt-300">
                      {isExpanded ? '[-] CONTRACT' : '[+] EXPAND'}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white group-hover:text-lime transition-colors">
                    {item.title}
                  </h3>

                  <AnimatePresence>
                    {isExpanded && item.description && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-cobalt/20 text-gray-300 font-body text-base leading-relaxed whitespace-pre-wrap">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
