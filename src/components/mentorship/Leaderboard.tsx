'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mentorshipApi } from '@/lib/mentorship/client-api';

interface LeaderboardProps {
  currentUserId?: string;
  initialProgramId?: string;
}

export default function Leaderboard({ currentUserId, initialProgramId }: LeaderboardProps) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(initialProgramId || '');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [progRes, lbRes] = await Promise.all([
        mentorshipApi.getPrograms(),
        mentorshipApi.getLeaderboard(selectedProgramId || undefined),
      ]);
      setPrograms(progRes.programs || []);
      setLeaderboard(lbRes.leaderboard || []);
      setLastRefreshed(new Date());
    } catch {
      // quiet fallback
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProgramId]);

  // Re-read data every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [selectedProgramId]);

  const filtered = leaderboard.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      (item.enrollment_no && item.enrollment_no.toLowerCase().includes(q))
    );
  });

  const top3 = leaderboard.slice(0, 3);
  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3; // Silver (#2), Gold (#1), Bronze (#3)

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-charcoal-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-lime-green/15 text-lime-green border border-lime-green/30">
              CADRE RANKINGS
            </span>
            <span className="text-[11px] font-mono text-slate-400">LIVE SYNC (20S)</span>
          </div>
          <h3 className="text-2xl font-bold text-soft-white font-sans">
            Cohort Leaderboard
          </h3>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {programs.length > 0 && (
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="px-3 py-2 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-electric-blue transition-colors"
            >
              <option value="">All Cohorts</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          )}

          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="Search by name or TN-..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-8 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-electric-blue placeholder:text-slate-600 transition-colors"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-slate-500">🔍</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {!loading && top3.length > 0 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {podiumOrder.map((entry) => {
            if (!entry) return null;
            const isGold = entry.rank === 1;
            const isSilver = entry.rank === 2;
            const isBronze = entry.rank === 3;
            const isMe = currentUserId === entry.id;

            return (
              <div
                key={entry.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isGold
                    ? 'bg-gradient-to-b from-amber-500/10 via-charcoal to-deep-ink border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.2)] md:-translate-y-3'
                    : isSilver
                    ? 'bg-gradient-to-b from-slate-400/10 via-charcoal to-deep-ink border-slate-300/60 shadow-[0_0_20px_rgba(203,213,225,0.15)]'
                    : 'bg-gradient-to-b from-amber-700/10 via-charcoal to-deep-ink border-amber-600/60 shadow-[0_0_20px_rgba(180,83,9,0.15)]'
                }`}
              >
                {/* Crown / Rank Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
                      isGold
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : isSilver
                        ? 'bg-slate-300/20 text-slate-200 border-slate-300/50'
                        : 'bg-amber-700/20 text-amber-500 border-amber-600/50'
                    }`}
                  >
                    {isGold && '👑 1ST PLACE · GOLD'}
                    {isSilver && '🥈 2ND PLACE · SILVER'}
                    {isBronze && '🥉 3RD PLACE · BRONZE'}
                  </span>
                </div>

                {/* Avatar Icon */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold font-mono border mb-3 ${
                    isGold
                      ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                      : isSilver
                      ? 'bg-slate-300/15 border-slate-300 text-slate-200'
                      : 'bg-amber-700/15 border-amber-600 text-amber-500'
                  }`}
                >
                  {entry.name.charAt(0)}
                </div>

                <h4 className="text-lg font-bold text-soft-white flex items-center gap-1.5">
                  {entry.name}
                  {isMe && (
                    <span className="px-1.5 py-0.5 rounded bg-electric-blue text-white text-[9px] font-mono">
                      YOU
                    </span>
                  )}
                </h4>
                <span className="text-xs font-mono text-slate-400 mb-4">
                  {entry.enrollment_no}
                </span>

                <div className="w-full pt-4 border-t border-charcoal-border flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">TOTAL SCORE</span>
                    <span className="text-lg font-bold text-lime-green">{entry.total_score} PTS</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">COMPLETED</span>
                    <span className="text-sm font-bold text-soft-white">{entry.completed_count} Tasks</span>
                  </div>
                </div>

                <div className="mt-4 w-full">
                  <Link
                    href={`/mentorship/profile/${entry.id}`}
                    className="block w-full py-2 bg-deep-ink hover:bg-charcoal border border-charcoal-border hover:border-lime-green/50 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-all text-center"
                  >
                    View AI Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranked Table */}
      <div className="border border-charcoal-border bg-charcoal/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-charcoal-border bg-deep-ink/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Mentee</th>
                <th className="py-3.5 px-4">Enrollment ID</th>
                <th className="py-3.5 px-4">Deliverables</th>
                <th className="py-3.5 px-4">Completion</th>
                <th className="py-3.5 px-4 text-right">Total Score</th>
                <th className="py-3.5 px-4 text-center">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 animate-pulse">
                    Loading live rankings...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No mentees match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const isMe = currentUserId === row.id;
                  const isTop3 = row.rank <= 3;

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isMe
                          ? 'bg-electric-blue/15 text-soft-white font-bold border-l-4 border-l-electric-blue'
                          : 'hover:bg-deep-ink/50 text-slate-300'
                      }`}
                    >
                      <td className="py-4 px-4 font-bold text-sm">
                        {row.rank === 1 && <span className="text-amber-300">#1 👑</span>}
                        {row.rank === 2 && <span className="text-slate-300">#2 🥈</span>}
                        {row.rank === 3 && <span className="text-amber-600">#3 🥉</span>}
                        {row.rank > 3 && <span>#{row.rank}</span>}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-bold text-soft-white text-sm">
                            {row.name}
                          </span>
                          {isMe && (
                            <span className="px-1.5 py-0.5 rounded bg-electric-blue text-white text-[9px]">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-400">
                        {row.enrollment_no || '—'}
                      </td>

                      <td className="py-4 px-4">
                        <span>{row.completed_count}</span>
                        <span className="text-slate-500"> / {row.total_resources}</span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-deep-ink rounded-full overflow-hidden border border-charcoal-border">
                            <div
                              className="h-full bg-lime-green"
                              style={{ width: `${Math.min(row.completion_pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">{row.completion_pct}%</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-lime-green text-sm">
                        {row.total_score} PTS
                      </td>

                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/mentorship/profile/${row.id}`}
                          className="px-2.5 py-1 bg-deep-ink hover:bg-charcoal border border-charcoal-border hover:border-lime-green/40 text-slate-300 hover:text-white rounded text-[11px] transition-colors"
                        >
                          Profile →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-deep-ink/50 border-t border-charcoal-border flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>AUTO-REFRESH: 20s interval</span>
          <span>LAST UPDATED: {lastRefreshed.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
