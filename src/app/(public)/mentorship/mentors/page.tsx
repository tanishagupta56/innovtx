import React from 'react';
import MentorProfileCard from '@/components/mentors/MentorProfileCard';
import { mentors } from '@/data/mentors';

export const metadata = {
  title: 'Meet the Mentors — TechNeeds IGDTUW',
  description: 'Verified peer mentors in Web Development, AI/ML, and Core Engineering at IGDTUW.',
};

export default function MentorsPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 lg:px-12 bg-transparent min-h-screen text-soft-white relative z-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green font-bold">
              05 // MENTOR ROSTER
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              VERIFIED SSSC CADRE
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            MEET THE <br />
            <span className="text-lime-green">MENTORS.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Tap a card to flip it and reveal the mentor&apos;s avatar, skills, journey, and how they can help you.
          </p>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10 justify-items-center">
          {mentors.map((mentor, i) => (
            <MentorProfileCard key={mentor.id} mentor={mentor} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
