import React from 'react';
import Link from 'next/link';
import MagneticButton from '@/components/MagneticButton';

export const metadata = {
  title: 'SSSC Mentorship Cadre — TechNeeds IGDTUW',
  description: 'Structured peer mentorship cohorts in Web Development, DSA, and System Design for women engineers at IGDTUW.',
};

const COHORTS = [
  {
    title: 'Web Development Engineering Cohort',
    lead: 'Vidusi Agarwal',
    leadRole: 'Lead Mentor — Full-Stack Systems',
    status: 'COMPLETED ARCHIVE',
    tag: 'FRONTEND & APIS',
    duration: '8 Weeks · Hands-on',
    description: 'A comprehensive curriculum taking mentees from core JavaScript and DOM manipulation to modular React component trees, state management, Next.js App Router, and production deployments on Vercel.',
    outcomes: [
      'Built 3 production-ready client applications with responsive design',
      'Git collaboration: branching, merge conflict resolution, and PR reviews',
      'REST API consumption and state persistence with Supabase',
    ],
  },
  {
    title: 'Data Structures & Algorithms in C/C++',
    lead: 'Shefali Kaushal',
    leadRole: 'Lead Mentor — Algorithmic Problem Solving',
    status: 'COMPLETED ARCHIVE',
    tag: 'ALGORITHMS & CODING',
    duration: '10 Weeks · Intensive',
    description: 'Deep dive into computational complexity, C++ Standard Template Library (STL), pointers, recursion, dynamic programming, and graph traversals with weekly LeetCode sprint targets.',
    outcomes: [
      'Mastered 150+ standard interview algorithmic problem patterns',
      'Weekly peer-assisted mock coding contests under timed constraints',
      'Direct interview preparation for pre-final year campus internship drives',
    ],
  },
  {
    title: '21-Day CS Fundamentals Cohort',
    lead: 'TechNeeds Academic Cadre',
    leadRole: 'Core Committee Mentors',
    status: 'FLAGSHIP PROGRAM',
    tag: 'CORE COMPUTER SCIENCE',
    duration: '21 Days · Daily Drills',
    description: 'High-intensity daily revision sprint targeting university examinations and technical rounds across Operating Systems, Database Management Systems, Computer Networks, and Low-Level Design.',
    outcomes: [
      '400+ participants completed daily proof-of-work challenges',
      'Curated concept cheat sheets and architectural interview summaries',
      '85% completion rate with verified certificate issuances',
    ],
  },
];

const TRACKS = [
  {
    title: 'Track A: Full-Stack Web & Decentralized Systems',
    timeline: 'Autumn 2026 Cohort',
    focus: 'Next.js 14, TypeScript, Tailwind, Supabase, WebGL/Three.js, CI/CD pipelines.',
    seats: '40 Mentees',
  },
  {
    title: 'Track B: Applied AI & Machine Learning',
    timeline: 'Autumn 2026 Cohort',
    focus: 'Python, PyTorch, Transformers, Agentic Workflows, HuggingFace, RAG pipelines.',
    seats: '35 Mentees',
  },
  {
    title: 'Track C: Competitive Programming & DSA',
    timeline: 'Year-Round Sprint',
    focus: 'C++, Advanced STL, Dynamic Programming, Graph Theory, System Design.',
    seats: '50 Mentees',
  },
];

const FAQS = [
  {
    q: 'How are mentees selected for SSSC cohorts?',
    a: 'Applications open at the start of each semester. Freshers and sophomores complete a brief interest questionnaire. Selection is based on enthusiasm and commitment to weekly attendance.',
  },
  {
    q: 'Is there any fee or cost to participate in mentorship?',
    a: 'No. All TechNeeds mentorship cohorts and learning materials are 100% free and open to all enrolled IGDTUW students.',
  },
  {
    q: 'What is the expected weekly time commitment?',
    a: 'Mentees typically spend 4-6 hours per week: 2 hours of live interactive workshops/discussions and 3-4 hours of hands-on project commits.',
  },
];

export default function MentorshipPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
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

        {/* Cohort Archive Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-lime-green font-bold">
              {'// VERIFIED COHORT ARCHIVE & MENTORS'}
            </h2>
            <span className="text-xs font-mono text-slate-500">PUBLIC CURRICULUM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COHORTS.map((cohort, idx) => (
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
                    {cohort.outcomes.map((out, i) => (
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
            {TRACKS.map((tr, i) => (
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
            <MagneticButton href="/signup" strength={25}>
              <span className="px-8 py-3.5 bg-electric-blue text-deep-ink font-mono text-xs font-bold uppercase rounded-md shadow-[0_0_15px_rgba(117,230,255,0.4)]">
                Register for Mentorship Cohort →
              </span>
            </MagneticButton>
          </div>
        </div>

        {/* Mentorship FAQs */}
        <div className="space-y-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-lime-green font-bold">
            {'// MENTORSHIP COMMON QUESTIONS'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-6 border border-charcoal-border bg-charcoal/60 rounded-xl space-y-2">
                <h4 className="text-sm font-bold text-soft-white font-sans">{faq.q}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
