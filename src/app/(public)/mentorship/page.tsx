import React from 'react';
import MentorshipClient from './MentorshipClient';

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
    <MentorshipClient
      initialCohorts={COHORTS}
      initialTracks={TRACKS}
      faqs={FAQS}
    />
  );
}
