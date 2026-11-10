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
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const years = Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a);
  const filtered = selectedYear === 'all' ? items : items.filter((i) => i.year === selectedYear);

  if (!items.length) {
    return (
      <div className="card text-center py-16">
        <p className="text-gray-400 text-base">To be added by admin.</p>
        <p className="text-gray-600 text-xs mt-1 font-mono">
          Historical milestones and event records are awaiting verification.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Year Navigation Bar */}
      {years.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all ${
              selectedYear === 'all'
                ? 'bg-cobalt text-white border-cobalt'
                : 'bg-transparent text-gray-400 border-cobalt/20 hover:text-white'
            }`}
          >
            All Milestones
          </button>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all ${
                selectedYear === yr
                  ? 'bg-cobalt text-white border-cobalt'
                  : 'bg-transparent text-gray-400 border-cobalt/20 hover:text-white'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      )}

      {/* Timeline Stream with animated vertical progress line */}
      <div className="relative pl-8 border-l border-cobalt/30 space-y-8">
        {filtered.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="relative group">
              {/* Timeline Node Point */}
              <div className="absolute -left-[39px] top-1.5 w-3.5 h-3.5 bg-midnight border-2 border-lime group-hover:bg-lime transition-all" />

              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="card cursor-pointer border-cobalt/20 hover:border-cobalt/50 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-lime bg-lime/10 px-2 py-0.5 border border-lime/30">
                      {formatDate(item.date)}
                    </span>
                    {item.category && (
                      <span className="text-xs font-mono text-gray-400 uppercase">
                        {'// ' + item.category}
                      </span>
                    )}
                  </div>
                  <span className="text-cobalt-300 font-mono text-sm">
                    {isExpanded ? '[-]' : '[+]'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-white text-lg mt-2">
                  {item.title}
                </h3>

                <AnimatePresence>
                  {isExpanded && item.description && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm text-gray-300 font-body leading-relaxed whitespace-pre-wrap pt-3 border-t border-cobalt/15">
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
