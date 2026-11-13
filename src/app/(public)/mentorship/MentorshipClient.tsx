'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MagneticButton from '@/components/MagneticButton';
import PortalHeader from '@/components/mentorship/PortalHeader';
import SignInModal from '@/components/mentorship/SignInModal';
import AdminConsole from '@/components/mentorship/AdminConsole';
import MenteeDashboard from '@/components/mentorship/MenteeDashboard';
import { mentorshipApi } from '@/lib/mentorship/client-api';

interface MentorshipClientProps {
  initialCohorts: any[];
  initialTracks: any[];
  faqs: any[];
}

export default function MentorshipClient({
  initialCohorts,
  initialTracks,
  faqs,
}: MentorshipClientProps) {
  const [user, setUser] = useState<any | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<'public' | 'portal'>('public');
  const [livePrograms, setLivePrograms] = useState<any[]>([]);

  // Check current session
  const checkSession = async () => {
    try {
      const res = await mentorshipApi.getMe();
      if (res.user) {
        setUser(res.user);
        setActiveTab('portal');
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const loadLivePrograms = async () => {
    try {
      const res = await mentorshipApi.getPrograms();
      setLivePrograms(res.programs || []);
    } catch {
      // fallback to initial
    }
  };

  useEffect(() => {
    checkSession();
    loadLivePrograms();
  }, []);

  const handleSignOut = async () => {
    try {
      await mentorshipApi.logout();
      setUser(null);
      setActiveTab('public');
    } catch {
      // ignore
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-transparent min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Portal Header / Quick Access */}
        <PortalHeader
          user={user}
          onOpenSignIn={() => {
            setAuthModalMode('signin');
            setIsSignInOpen(true);
          }}
          onSignOut={handleSignOut}
        />

        {/* View Switcher when user is logged in */}
        {user && (
          <div className="flex items-center gap-3 border-b border-charcoal-border pb-4 font-mono text-xs">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-4 py-2 rounded-lg font-bold transition-all uppercase ${
                activeTab === 'portal'
                  ? 'bg-electric-blue text-soft-white shadow-[0_0_15px_rgba(49,94,255,0.4)]'
                  : 'text-slate-400 hover:text-white bg-deep-ink border border-charcoal-border'
              }`}
            >
              {user.role === 'admin' && '01 // ADMIN CONSOLE'}
              {user.role === 'mentor' && '02 // MENTOR WORKSPACE'}
              {user.role === 'mentee' && '03 // MENTEE DASHBOARD'}
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 rounded-lg font-bold transition-all uppercase ${
                activeTab === 'public'
                  ? 'bg-charcoal text-lime-green border border-lime-green/40'
                  : 'text-slate-400 hover:text-white bg-deep-ink border border-charcoal-border'
              }`}
            >
              Public Cohort Overview
            </button>
          </div>
        )}

        {/* Portal Console View (when logged in and on portal tab) */}
        {user && activeTab === 'portal' && (
          <div className="animate-fade-in">
            {user.role === 'admin' && <AdminConsole />}

            {user.role === 'mentor' && (
              <div className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl text-center space-y-3 font-mono text-xs">
                <span className="px-2.5 py-1 text-[11px] font-mono uppercase bg-deep-ink border border-charcoal-border text-lime-green">
                  02 // MENTOR WORKSPACE
                </span>
                <p className="text-slate-300">
                  Welcome, <strong>{user.name}</strong>. Mentor publishing and mentee grading workspace loading in Phase 3.
                </p>
              </div>
            )}

            {user.role === 'mentee' && (
              <MenteeDashboard user={user} onRefreshUser={checkSession} />
            )}
          </div>
        )}

        {/* Public Cohort Overview (Default View / Public Tab) */}
        {(!user || activeTab === 'public') && (
          <div className="space-y-16 animate-fade-in">
            {/* Editorial Header */}
            <div className="border-b border-charcoal-border pb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
                  MENTORSHIP CADRE // SSSC
                </span>
                <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                  PEER-TO-PEER ENGINEERING
                </span>
              </div>

              <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
                SSSC MENTORSHIP <br />
                <span className="text-lime-green">ECOSYSTEM.</span>
              </h1>

              <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
                The Society Student Support Cell (SSSC) pairs aspiring engineers with experienced seniors and alumni. From foundational C++ algorithms to full-stack architectures and FAANG interview preparation.
              </p>
            </div>

            {/* Live Active Programs (Dynamic from API) */}
            {livePrograms.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-lime-green font-bold">
                    {'// ACTIVE CADRE PROGRAMS ('}{livePrograms.length}{')'}
                  </h2>
                  <span className="text-xs font-mono text-slate-500">LIVE SYLLABUS &amp; COHORTS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {livePrograms.map((prog) => (
                    <div
                      key={prog.id}
                      className="p-6 border border-charcoal-border bg-charcoal/80 rounded-2xl flex flex-col justify-between group hover:border-electric-blue/50 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              prog.status === 'active'
                                ? 'bg-lime-green/15 text-lime-green border border-lime-green/30'
                                : 'bg-electric-blue/15 text-electric-blue-light border border-electric-blue/30'
                            }`}
                          >
                            {prog.status === 'active' ? 'ACTIVE COHORT' : 'UPCOMING'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            VERIFIED SSSC
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-soft-white group-hover:text-lime-green transition-colors">
                          {prog.title}
                        </h3>

                        <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                          {prog.description || 'Structured peer curriculum and project deliverables.'}
                        </p>

                        {prog.tech_tags && prog.tech_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {prog.tech_tags.map((tag: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-[10px] font-mono bg-deep-ink border border-charcoal-border text-slate-300 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-charcoal-border flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">START:</span>
                        <span className="text-soft-white font-bold">
                          {prog.start_date ? new Date(prog.start_date).toLocaleDateString() : 'TBD'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cohort Archive Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
                <h2 className="font-mono text-xs uppercase tracking-widest text-lime-green font-bold">
                  {'// VERIFIED COHORT ARCHIVE & MENTORS'}
                </h2>
                <span className="text-xs font-mono text-slate-500">PUBLIC CURRICULUM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {initialCohorts.map((cohort, idx) => (
                  <div
                    key={idx}
                    className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl flex flex-col justify-between group hover:border-electric-blue/50 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-charcoal border border-charcoal-border text-lime-green">
                          {cohort.tag}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {cohort.duration}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-soft-white group-hover:text-lime-green transition-colors mb-2">
                        {cohort.title}
                      </h3>

                      <div className="mb-4">
                        <p className="text-xs font-mono text-electric-blue-light font-bold">
                          Mentor: {cohort.lead}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500">
                          {cohort.leadRole}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                        {cohort.description}
                      </p>

                      <div className="space-y-2 border-t border-charcoal-border pt-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">
                          DELIVERABLES &amp; OUTCOMES:
                        </span>
                        {cohort.outcomes.map((out: string, i: number) => (
                          <div key={i} className="text-xs text-slate-300 flex items-start gap-2 font-sans">
                            <span className="text-lime-green font-mono">▹</span>
                            <span>{out}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-charcoal-border flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">STATUS:</span>
                      <span className="text-lime-green font-bold">{cohort.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tracks Application */}
            <div className="p-10 border border-electric-blue/40 bg-charcoal/80 rounded-3xl space-y-8">
              <div>
                <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
                  APPLY FOR NEXT CADRE
                </span>
                <h2 className="editorial-title text-3xl sm:text-5xl text-soft-white mt-3">
                  Upcoming Mentorship Tracks<span className="text-lime-green">.</span>
                </h2>
                <p className="text-slate-400 text-sm font-sans mt-2 max-w-xl">
                  Registration opens for new cohorts twice a year. Submit your interest to be notified as soon as seat allocation commences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {initialTracks.map((tr, i) => (
                  <div key={i} className="p-6 bg-deep-ink border border-charcoal-border rounded-xl space-y-3">
                    <span className="text-xs font-mono text-lime-green font-bold block">{tr.timeline}</span>
                    <h4 className="text-lg font-bold text-soft-white">{tr.title}</h4>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{tr.focus}</p>
                    <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-charcoal-border">
                      CAPACITY: {tr.seats}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal-border">
                <span className="text-xs font-mono text-slate-400">
                  FREE FOR ALL ENROLLED IGDTUW UNDERGRADUATES
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setAuthModalMode('signup');
                      setIsSignInOpen(true);
                    }}
                    className="px-6 py-3.5 bg-lime-green hover:bg-lime-green-light text-deep-ink font-mono text-xs font-bold uppercase rounded-md shadow-[0_0_15px_rgba(184,217,76,0.4)] transition-all"
                  >
                    Enroll as Mentee →
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('signin');
                      setIsSignInOpen(true);
                    }}
                    className="px-6 py-3.5 bg-electric-blue hover:bg-electric-blue-light text-soft-white font-mono text-xs font-bold uppercase rounded-md shadow-[0_0_15px_rgba(49,94,255,0.4)] transition-all"
                  >
                    Portal Sign-In →
                  </button>
                </div>
              </div>
            </div>

            {/* Mentorship FAQs */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-lime-green font-bold">
                {'// MENTORSHIP COMMON QUESTIONS'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-6 border border-charcoal-border bg-charcoal/60 rounded-xl space-y-2">
                    <h4 className="text-sm font-bold text-soft-white font-sans">{faq.q}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sign In Modal */}
        <SignInModal
          isOpen={isSignInOpen}
          initialMode={authModalMode}
          onClose={() => setIsSignInOpen(false)}
          onSuccess={(u) => {
            setUser(u);
            setActiveTab('portal');
            loadLivePrograms();
          }}
        />
      </div>
    </div>
  );
}
