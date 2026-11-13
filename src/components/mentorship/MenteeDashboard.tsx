'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { mentorshipApi } from '@/lib/mentorship/client-api';
import type { MentorshipResource, MentorshipSubmission } from '@/lib/mentorship/types';

interface MenteeDashboardProps {
  user: any;
  onRefreshUser?: () => void;
}

// CountUp animation component
function CountUp({
  target,
  duration = 900,
  prefix = '',
  suffix = '',
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setVal(0);
      return;
    }
    let startTimestamp: number | null = null;
    let animFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setVal(Math.round(ease * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, duration]);

  return (
    <span>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

// Live Countdown Formatter
function formatTimeRemaining(deadlineIso: string, nowMs: number) {
  const diff = new Date(deadlineIso).getTime() - nowMs;
  if (diff <= 0) return { text: 'Deadline Passed', isExpired: true, isUrgent: false };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const isUrgent = diff < 24 * 60 * 60 * 1000; // < 24 hours
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return {
    text: parts.join(' '),
    isExpired: false,
    isUrgent,
  };
}

export default function MenteeDashboard({ user }: MenteeDashboardProps) {
  const [resources, setResources] = useState<MentorshipResource[]>([]);
  const [submissions, setSubmissions] = useState<MentorshipSubmission[]>([]);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'quiz' | 'project'>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  // Action Drawer State
  const [drawerResource, setDrawerResource] = useState<MentorshipResource | null>(null);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Quiz state inside drawer
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | number>>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScoreResult, setQuizScoreResult] = useState<{ score: number; max: number } | null>(null);

  // Project state inside drawer
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [projectNotes, setProjectNotes] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Clock ticker for live countdowns (1-second precision)
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const programId = user.program_ids?.[0];
      const [resData, subData, lbData] = await Promise.all([
        mentorshipApi.getResources(programId),
        mentorshipApi.getSubmissions(undefined, user.id),
        mentorshipApi.getLeaderboard(programId),
      ]);

      setResources(resData.resources || []);
      setSubmissions(subData.submissions || []);

      const userRankEntry = (lbData.leaderboard || []).find((r: any) => r.id === user.id);
      if (userRankEntry) {
        setLeaderboardRank(userRankEntry.rank);
      }
    } catch {
      // quiet fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  // Derived KPI calculations
  const totalScore = useMemo(() => {
    return submissions.reduce((acc, s) => acc + (s.score || 0), 0);
  }, [submissions]);

  const completedCount = useMemo(() => {
    return submissions.filter(
      (s) => s.status === 'graded' || s.status === 'submitted'
    ).length;
  }, [submissions]);

  // Next deadline calculation (earliest upcoming resource deadline not yet submitted)
  const nextDeadlineInfo = useMemo(() => {
    const pendingWithDeadlines = resources
      .filter((r) => {
        const hasSub = submissions.some((s) => s.resource_id === r.id);
        const inFuture = new Date(r.deadline).getTime() > nowMs;
        return !hasSub && inFuture;
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    if (pendingWithDeadlines.length === 0) return null;
    return pendingWithDeadlines[0];
  }, [resources, submissions, nowMs]);

  // Filtered resources based on tab
  const filteredResources = useMemo(() => {
    if (activeTab === 'all') return resources;
    return resources.filter((r) => r.type === activeTab);
  }, [resources, activeTab]);

  // Open drawer handler
  const openActionDrawer = (res: MentorshipResource) => {
    setDrawerResource(res);
    setActionError(null);
    setQuizAnswers({});
    setCurrentQuizIndex(0);
    setQuizScoreResult(null);

    // If project, populate existing submission fields if present
    const existing = submissions.find((s) => s.resource_id === res.id);
    if (existing) {
      setRepoUrl(existing.repo_url || existing.link || '');
      setDemoUrl(existing.demo_url || '');
      setProjectNotes(existing.notes || '');
    } else {
      setRepoUrl('');
      setDemoUrl('');
      setProjectNotes('');
    }
  };

  const closeActionDrawer = () => {
    setDrawerResource(null);
    setActionError(null);
  };

  // Video Complete Handler
  const handleCompleteVideo = async () => {
    if (!drawerResource) return;
    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await mentorshipApi.createSubmission({
        resource_id: drawerResource.id,
      });
      if (res.submission) {
        showToast(`🎉 Video completed! +${res.submission.score ?? drawerResource.max_score} points earned.`);
        await loadData();
        closeActionDrawer();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to record completion.');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Quiz Submit Handler
  const handleQuizSubmit = async () => {
    if (!drawerResource) return;
    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await mentorshipApi.createSubmission({
        resource_id: drawerResource.id,
        answers: quizAnswers,
      });

      if (res.submission) {
        setQuizScoreResult({
          score: res.submission.score ?? 0,
          max: drawerResource.max_score,
        });
        showToast(`🎯 Quiz completed! Score: ${res.submission.score} / ${drawerResource.max_score} PTS`);
        await loadData();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to submit quiz.');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Project Submit Handler
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerResource) return;

    if (!repoUrl.trim() && !demoUrl.trim()) {
      setActionError('Please provide either a GitHub repository link or live demo URL.');
      return;
    }

    setSubmittingAction(true);
    setActionError(null);

    try {
      const res = await mentorshipApi.createSubmission({
        resource_id: drawerResource.id,
        repo_url: repoUrl.trim() || undefined,
        demo_url: demoUrl.trim() || undefined,
        notes: projectNotes.trim() || undefined,
        link: demoUrl.trim() || repoUrl.trim(),
      });

      if (res.submission) {
        showToast('🚀 Project submitted successfully! Awaiting mentor review.');
        await loadData();
        closeActionDrawer();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to submit project.');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Helper to extract YouTube video ID for embedded player
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const u = new URL(url);
        const v = u.searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}` : url;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-deep-ink border border-lime-green/60 text-soft-white rounded-xl shadow-[0_0_25px_rgba(184,217,76,0.3)] font-mono text-xs flex items-center gap-3 animate-slide-up">
          <span className="text-lime-green text-base">✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Top Banner / User Context */}
      <div className="p-6 sm:p-8 border border-charcoal-border bg-charcoal/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-lime-green/15 text-lime-green border border-lime-green/30">
              03 // MENTEE DASHBOARD
            </span>
            <span className="text-xs font-mono text-slate-400">
              ENROLLMENT: <strong>{user.enrollment_no || 'TN-ACTIVE'}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-soft-white">
            Welcome back, {user.name}
          </h2>
          <p className="text-xs text-slate-300 font-sans max-w-xl">
            Track your weekly curriculum, review automated scores, and submit engineering deliverables before deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/mentorship/profile/${user.id}`}
            className="px-4 py-2.5 bg-deep-ink hover:bg-charcoal border border-charcoal-border hover:border-lime-green text-soft-white rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <span>🤖</span> VIEW AI PROFILE →
          </Link>
        </div>
      </div>

      {/* KPI Cards with Count-Up Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Total Score */}
        <div className="p-6 bg-charcoal/80 border border-charcoal-border rounded-2xl relative overflow-hidden group hover:border-electric-blue/40 transition-all">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
            Total Score
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-soft-white">
            <CountUp target={totalScore} suffix=" PTS" />
          </div>
          <div className="mt-2 text-[11px] font-mono text-lime-green flex items-center gap-1">
            <span>↑</span>
            <span>Live cumulative points</span>
          </div>
        </div>

        {/* KPI 2: Rank */}
        <div className="p-6 bg-charcoal/80 border border-charcoal-border rounded-2xl relative overflow-hidden group hover:border-electric-blue/40 transition-all">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
            Cohort Rank
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-soft-white">
            {leaderboardRank ? (
              <CountUp target={leaderboardRank} prefix="#" />
            ) : (
              <span className="text-slate-400">#--</span>
            )}
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400">
            Across active cohort peers
          </div>
        </div>

        {/* KPI 3: Completed X/Y */}
        <div className="p-6 bg-charcoal/80 border border-charcoal-border rounded-2xl relative overflow-hidden group hover:border-electric-blue/40 transition-all">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
            Deliverables Completed
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-soft-white">
            <CountUp target={completedCount} />
            <span className="text-xl text-slate-500 font-normal"> / {resources.length}</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400">
            {resources.length > 0
              ? `${Math.round((completedCount / resources.length) * 100)}% curriculum progress`
              : 'No items yet'}
          </div>
        </div>

        {/* KPI 4: Next Deadline Live Countdown */}
        <div className="p-6 bg-charcoal/80 border border-charcoal-border rounded-2xl relative overflow-hidden group hover:border-burnt-orange/50 transition-all">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
            Next Deadline
          </span>
          {nextDeadlineInfo ? (
            (() => {
              const countdown = formatTimeRemaining(nextDeadlineInfo.deadline, nowMs);
              return (
                <div>
                  <div
                    className={`text-2xl sm:text-3xl font-mono font-bold ${
                      countdown.isUrgent
                        ? 'text-burnt-orange animate-pulse'
                        : 'text-soft-white'
                    }`}
                  >
                    {countdown.text}
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-slate-400 truncate">
                    {nextDeadlineInfo.title}
                  </div>
                </div>
              );
            })()
          ) : (
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-lime-green">
                Caught Up!
              </div>
              <div className="mt-2 text-[11px] font-mono text-slate-400">
                No pending deadlines
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs with smooth transitions */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-border pb-3">
          <div className="flex items-center gap-2 p-1 bg-deep-ink border border-charcoal-border rounded-xl font-mono text-xs">
            {(
              [
                { id: 'all', label: 'All Items', count: resources.length },
                {
                  id: 'video',
                  label: 'Videos',
                  count: resources.filter((r) => r.type === 'video').length,
                },
                {
                  id: 'quiz',
                  label: 'Quizzes',
                  count: resources.filter((r) => r.type === 'quiz').length,
                },
                {
                  id: 'project',
                  label: 'Projects',
                  count: resources.filter((r) => r.type === 'project').length,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-electric-blue text-soft-white shadow-[0_0_12px_rgba(49,94,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-charcoal/70 border border-charcoal-border">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            CLICK CARD TO OPEN DELIVERABLE
          </span>
        </div>

        {/* Skeleton Loaders while fetching */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 border border-charcoal-border bg-charcoal/40 rounded-2xl h-48 animate-pulse space-y-4"
              >
                <div className="h-4 bg-deep-ink rounded w-1/3" />
                <div className="h-6 bg-deep-ink rounded w-3/4" />
                <div className="h-3 bg-deep-ink rounded w-full" />
                <div className="h-4 bg-deep-ink rounded w-1/2 pt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && filteredResources.length === 0 && (
          <div className="p-12 border border-charcoal-border bg-charcoal/40 rounded-2xl text-center space-y-3 font-mono text-xs">
            <span className="text-3xl block">📋</span>
            <p className="text-soft-white font-bold text-sm">
              No deliverables found in this category
            </p>
            <p className="text-slate-400 max-w-md mx-auto">
              Your mentors will publish curriculum assignments shortly. Switch tabs to see available items or check back soon!
            </p>
          </div>
        )}

        {/* Resource Cards Grid */}
        {!loading && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const submission = submissions.find((s) => s.resource_id === res.id);
              const countdown = formatTimeRemaining(res.deadline, nowMs);

              // Status Pill determination
              let statusPill = {
                text: 'Pending',
                className: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
              };

              if (submission) {
                if (
                  submission.status === 'graded' ||
                  (res.type === 'video' && submission.status === 'submitted')
                ) {
                  statusPill = {
                    text: `Graded ${submission.score ?? res.max_score}/${res.max_score} pts`,
                    className: 'bg-lime-green/15 text-lime-green border-lime-green/40 font-bold',
                  };
                } else if (submission.status === 'submitted') {
                  statusPill = {
                    text: 'Submitted – Awaiting Grade',
                    className: 'bg-electric-blue/15 text-electric-blue-light border-electric-blue/40 font-bold',
                  };
                }
              } else if (countdown.isExpired) {
                statusPill = {
                  text: 'Deadline Passed – 0 pts',
                  className: 'bg-burnt-orange/15 text-burnt-orange-light border-burnt-orange/40 font-bold',
                };
              }

              // Pulse when < 24h left and not submitted
              const shouldPulseRed = countdown.isUrgent && !submission;

              return (
                <div
                  key={res.id}
                  onClick={() => openActionDrawer(res)}
                  className={`p-6 border bg-charcoal/80 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] ${
                    shouldPulseRed
                      ? 'border-burnt-orange/60 shadow-[0_0_15px_rgba(255,107,74,0.25)] animate-pulse'
                      : 'border-charcoal-border hover:border-electric-blue/60'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Category badge + Max points */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          res.type === 'video'
                            ? 'bg-electric-blue/15 text-electric-blue-light border border-electric-blue/30'
                            : res.type === 'quiz'
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                            : 'bg-lime-green/15 text-lime-green border border-lime-green/30'
                        }`}
                      >
                        {res.type === 'video' && 'VIDEO LESSON'}
                        {res.type === 'quiz' && 'ASSESSMENT QUIZ'}
                        {res.type === 'project' && 'HANDS-ON PROJECT'}
                      </span>

                      <span className="text-[11px] font-mono font-bold text-slate-300">
                        {res.max_score} PTS
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="text-lg font-bold text-soft-white group-hover:text-lime-green transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                        {res.description || res.problem_statement || 'Curated cohort deliverable.'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom section: Countdown + Status Pill */}
                  <div className="pt-4 mt-4 border-t border-charcoal-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">COUNTDOWN:</span>
                      <span
                        className={`font-bold ${
                          countdown.isExpired
                            ? 'text-burnt-orange'
                            : countdown.isUrgent
                            ? 'text-burnt-orange'
                            : 'text-slate-300'
                        }`}
                      >
                        {countdown.text}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase border ${statusPill.className}`}
                      >
                        {statusPill.text}
                      </span>

                      <span className="text-xs font-mono text-electric-blue group-hover:translate-x-1 transition-transform">
                        Open →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ACTION DRAWER (Video Player, Quiz Builder, Project Submission) */}
      {/* ============================================================ */}
      {drawerResource && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={closeActionDrawer}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-charcoal border-l border-charcoal-border p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-left z-10">
            {/* Drawer Header */}
            <div>
              <div className="flex items-start justify-between border-b border-charcoal-border pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        drawerResource.type === 'video'
                          ? 'bg-electric-blue/15 text-electric-blue-light border border-electric-blue/30'
                          : drawerResource.type === 'quiz'
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : 'bg-lime-green/15 text-lime-green border border-lime-green/30'
                      }`}
                    >
                      {drawerResource.type.toUpperCase()} DELIVERABLE
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      MAX {drawerResource.max_score} PTS
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-soft-white font-sans">
                    {drawerResource.title}
                  </h3>
                </div>

                <button
                  onClick={closeActionDrawer}
                  className="text-slate-400 hover:text-white font-mono text-sm p-2 rounded-lg hover:bg-deep-ink transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Deadline alert */}
              {(() => {
                const countdown = formatTimeRemaining(drawerResource.deadline, nowMs);
                return (
                  <div
                    className={`p-3 rounded-lg border font-mono text-xs mb-6 flex items-center justify-between ${
                      countdown.isExpired
                        ? 'bg-burnt-orange/15 border-burnt-orange/40 text-burnt-orange-light'
                        : countdown.isUrgent
                        ? 'bg-burnt-orange/15 border-burnt-orange/50 text-burnt-orange animate-pulse'
                        : 'bg-deep-ink border-charcoal-border text-slate-300'
                    }`}
                  >
                    <span>
                      DEADLINE:{' '}
                      {new Date(drawerResource.deadline).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    <span className="font-bold">{countdown.text}</span>
                  </div>
                );
              })()}

              {/* Error banner inside drawer */}
              {actionError && (
                <div className="p-3 mb-6 bg-burnt-orange/15 border border-burnt-orange/30 rounded-lg text-xs font-mono text-burnt-orange-light">
                  ⚠️ {actionError}
                </div>
              )}

              {/* DRAWER CONTENT TYPE 1: VIDEO */}
              {drawerResource.type === 'video' && (
                <div className="space-y-6">
                  {drawerResource.video_url && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-charcoal-border bg-black">
                      <iframe
                        src={getEmbedUrl(drawerResource.video_url)}
                        title={drawerResource.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div className="p-4 bg-deep-ink border border-charcoal-border rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Lesson Description &amp; Instructions
                    </span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                      {drawerResource.description || 'Watch the lecture video completely to master core concepts.'}
                    </p>
                  </div>
                </div>
              )}

              {/* DRAWER CONTENT TYPE 2: QUIZ */}
              {drawerResource.type === 'quiz' && (
                <div className="space-y-6">
                  {(() => {
                    const existing = submissions.find((s) => s.resource_id === drawerResource.id);
                    const questions = drawerResource.questions || [];

                    // Case A: Result already revealed or previously submitted
                    if (quizScoreResult || (existing && existing.status === 'graded')) {
                      const finalScore = quizScoreResult?.score ?? existing?.score ?? 0;
                      const maxScore = quizScoreResult?.max ?? drawerResource.max_score;
                      const pct = maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0;

                      return (
                        <div className="p-6 bg-deep-ink border border-lime-green/40 rounded-xl space-y-4 text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-lime-green/15 text-lime-green flex items-center justify-center text-xl font-bold">
                            🎯
                          </div>
                          <h4 className="text-xl font-bold text-soft-white font-sans">
                            Quiz Completed!
                          </h4>
                          <div className="text-3xl font-mono font-bold text-lime-green">
                            {finalScore} / {maxScore} PTS ({pct}%)
                          </div>
                          <p className="text-xs text-slate-300 font-sans">
                            Your score has been registered in the cohort database and applied to your leaderboard rank.
                          </p>
                        </div>
                      );
                    }

                    // Case B: No questions found
                    if (questions.length === 0) {
                      return (
                        <div className="p-6 bg-deep-ink border border-charcoal-border rounded-xl text-center font-mono text-xs text-slate-400">
                          Quiz questions are being finalized by your mentor. Please check back shortly.
                        </div>
                      );
                    }

                    // Case C: Active Quiz — One Question at a Time with Progress Bar
                    const currentQ = questions[currentQuizIndex];
                    const progressPct = Math.round(((currentQuizIndex + 1) / questions.length) * 100);

                    return (
                      <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-lime-green font-bold">
                              QUESTION {currentQuizIndex + 1} OF {questions.length}
                            </span>
                            <span className="text-slate-400">{progressPct}% COMPLETED</span>
                          </div>
                          <div className="w-full h-2 bg-deep-ink rounded-full overflow-hidden border border-charcoal-border">
                            <div
                              className="h-full bg-lime-green transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Question Card */}
                        <div className="p-5 bg-deep-ink border border-charcoal-border rounded-xl space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              POINTS: {currentQ.points ?? 1} PTS
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-soft-white leading-snug">
                            {currentQ.text}
                          </h4>

                          {/* Options Radio List */}
                          <div className="space-y-2 pt-2">
                            {currentQ.options?.map((opt: string, optIdx: number) => {
                              const isChecked = quizAnswers[currentQ.id] === optIdx || quizAnswers[currentQ.id] === opt;
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() =>
                                    setQuizAnswers({
                                      ...quizAnswers,
                                      [currentQ.id]: optIdx,
                                    })
                                  }
                                  className={`w-full p-3 rounded-lg text-left text-xs font-mono transition-all flex items-center justify-between border ${
                                    isChecked
                                      ? 'bg-lime-green/15 border-lime-green text-soft-white shadow-[0_0_10px_rgba(184,217,76,0.2)]'
                                      : 'bg-charcoal border-charcoal-border text-slate-300 hover:border-slate-500 hover:text-white'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                      isChecked
                                    ? 'border-lime-green bg-lime-green text-deep-ink font-bold'
                                    : 'border-slate-500'
                                    }`}
                                  >
                                    {isChecked ? '✓' : ''}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quiz Navigation Controls */}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            disabled={currentQuizIndex === 0}
                            onClick={() => setCurrentQuizIndex((prev) => Math.max(prev - 1, 0))}
                            className="px-4 py-2 bg-deep-ink hover:bg-charcoal disabled:opacity-30 text-soft-white border border-charcoal-border rounded-lg font-mono text-xs transition-colors"
                          >
                            ← Previous
                          </button>

                          {currentQuizIndex < questions.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => setCurrentQuizIndex((prev) => prev + 1)}
                              className="px-5 py-2 bg-electric-blue hover:bg-electric-blue-light text-soft-white rounded-lg font-mono text-xs font-bold uppercase transition-all shadow-[0_0_10px_rgba(49,94,255,0.4)]"
                            >
                              Next Question →
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                submittingAction ||
                                formatTimeRemaining(drawerResource.deadline, nowMs).isExpired
                              }
                              onClick={handleQuizSubmit}
                              className="px-6 py-2 bg-lime-green hover:bg-lime-green-light disabled:opacity-40 text-deep-ink rounded-lg font-mono text-xs font-bold uppercase transition-all shadow-[0_0_12px_rgba(184,217,76,0.4)] flex items-center gap-1.5"
                            >
                              {submittingAction ? 'SCORING...' : 'SUBMIT QUIZ →'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* DRAWER CONTENT TYPE 3: PROJECT */}
              {drawerResource.type === 'project' && (
                <div className="space-y-6">
                  {/* Problem statement & guidelines */}
                  <div className="p-4 bg-deep-ink border border-charcoal-border rounded-xl space-y-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Problem Statement
                      </span>
                      <p className="text-xs text-soft-white font-sans leading-relaxed whitespace-pre-line mt-1">
                        {drawerResource.problem_statement || drawerResource.description || 'Build and deploy according to cohort specifications.'}
                      </p>
                    </div>

                    {drawerResource.guidelines && (
                      <div className="pt-2 border-t border-charcoal-border">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">
                          Submission Guidelines
                        </span>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line mt-1">
                          {drawerResource.guidelines}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Existing feedback & status display if already submitted */}
                  {(() => {
                    const existing = submissions.find((s) => s.resource_id === drawerResource.id);
                    if (!existing) return null;

                    return (
                      <div className="p-4 bg-deep-ink border border-charcoal-border rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            SUBMISSION STATUS
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              existing.status === 'graded'
                                ? 'bg-lime-green/15 text-lime-green border border-lime-green/30'
                                : 'bg-electric-blue/15 text-electric-blue-light border border-electric-blue/30'
                            }`}
                          >
                            {existing.status === 'graded'
                              ? `Graded: ${existing.score} / ${drawerResource.max_score} pts`
                              : 'Submitted – Awaiting Grade'}
                          </span>
                        </div>

                        {existing.feedback && (
                          <div className="p-3 bg-charcoal rounded-lg border border-charcoal-border space-y-1">
                            <span className="text-[10px] font-mono text-lime-green uppercase block">
                              Mentor Feedback:
                            </span>
                            <p className="text-xs text-slate-200 font-sans">{existing.feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Submission Form (only enabled if not submitted or resubmission allowed) */}
                  {(() => {
                    const existing = submissions.find((s) => s.resource_id === drawerResource.id);
                    const isExpired = formatTimeRemaining(drawerResource.deadline, nowMs).isExpired;

                    if (existing) {
                      return (
                        <div className="p-4 bg-deep-ink border border-charcoal-border rounded-xl space-y-2 text-xs font-mono">
                          <span className="text-slate-400 uppercase block text-[10px]">
                            Your Submitted Links
                          </span>
                          {existing.repo_url && (
                            <div>
                              <span className="text-slate-500">Repo: </span>
                              <a
                                href={existing.repo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-electric-blue hover:underline break-all"
                              >
                                {existing.repo_url}
                              </a>
                            </div>
                          )}
                          {existing.demo_url && (
                            <div>
                              <span className="text-slate-500">Live Demo: </span>
                              <a
                                href={existing.demo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-lime-green hover:underline break-all"
                              >
                                {existing.demo_url}
                              </a>
                            </div>
                          )}
                          {existing.notes && (
                            <div className="pt-2 text-slate-300 font-sans">
                              <span className="text-slate-500 font-mono text-[10px] block">Notes:</span>
                              {existing.notes}
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (isExpired) {
                      return (
                        <div className="p-4 bg-burnt-orange/15 border border-burnt-orange/40 rounded-xl text-xs font-mono text-burnt-orange-light text-center">
                          ⚠️ The submission deadline has passed. Late submissions are disabled.
                        </div>
                      );
                    }

                    return (
                      <form onSubmit={handleProjectSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono uppercase text-slate-300">
                            GitHub Repository URL *
                          </label>
                          <input
                            type="url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/username/project-repo"
                            className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-lime-green placeholder:text-slate-600 transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono uppercase text-slate-300">
                            Live Demo URL (Vercel / Netlify / Render)
                          </label>
                          <input
                            type="url"
                            value={demoUrl}
                            onChange={(e) => setDemoUrl(e.target.value)}
                            placeholder="https://my-project.vercel.app"
                            className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-lime-green placeholder:text-slate-600 transition-colors"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono uppercase text-slate-300">
                            Implementation Notes / Architecture Highlights
                          </label>
                          <textarea
                            rows={3}
                            value={projectNotes}
                            onChange={(e) => setProjectNotes(e.target.value)}
                            placeholder="Key design choices, instructions to run locally, libraries used..."
                            className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-sans text-xs focus:outline-none focus:border-lime-green placeholder:text-slate-600 transition-colors"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingAction || isExpired}
                          className="w-full py-3.5 bg-lime-green hover:bg-lime-green-light disabled:opacity-40 text-deep-ink rounded-lg font-mono text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(184,217,76,0.4)] flex items-center justify-center gap-2"
                        >
                          {submittingAction ? 'SUBMITTING DELIVERABLES...' : 'SUBMIT PROJECT DELIVERABLES →'}
                        </button>
                      </form>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-6 border-t border-charcoal-border flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">SSSC AUTOMATED SYSTEM</span>

              {drawerResource.type === 'video' && (
                (() => {
                  const existing = submissions.find((s) => s.resource_id === drawerResource.id);
                  const isExpired = formatTimeRemaining(drawerResource.deadline, nowMs).isExpired;

                  if (existing) {
                    return (
                      <span className="px-3 py-1.5 bg-lime-green/15 text-lime-green border border-lime-green/30 rounded font-bold">
                        ✓ COMPLETED (+{existing.score ?? drawerResource.max_score} PTS)
                      </span>
                    );
                  }

                  return (
                    <button
                      type="button"
                      disabled={submittingAction || isExpired}
                      onClick={handleCompleteVideo}
                      className="px-5 py-2.5 bg-electric-blue hover:bg-electric-blue-light disabled:opacity-40 text-soft-white rounded-lg font-bold uppercase transition-all shadow-[0_0_12px_rgba(49,94,255,0.4)] flex items-center gap-2"
                    >
                      {submittingAction ? 'SAVING...' : 'MARK AS COMPLETE →'}
                    </button>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
