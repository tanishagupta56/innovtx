import React from 'react';
import CollaborateClient from './CollaborateClient';

export const metadata = {
  title: 'Partner & Sponsor — TechNeeds IGDTUW',
  description: 'Collaborate with TechNeeds IGDTUW for InnoVortex hackathon sponsorships, technical workshops, and premier recruitment pipelines.',
};

export default function CollaboratePage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-charcoal-border pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              PARTNERSHIP MATRIX // CORP_RELATIONS
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              COLLABORATION &amp; SPONSORSHIP
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            COLLABORATE &amp; <br />
            <span className="text-lime-green">SPONSOR.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Partner with TechNeeds to empower premier women technologists at Indira Gandhi Delhi Technical University for Women. Accelerate your brand, hire top engineering talent, and test your developer APIs with hundreds of builders.
          </p>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-lime-green block">1,200+</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Undergraduate Reach</span>
          </div>
          <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-soft-white block">500+</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Hackathon Applicants</span>
          </div>
          <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-electric-blue-light block">15+</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Industry Partners</span>
          </div>
          <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-soft-white block">100%</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Verified Check-in</span>
          </div>
        </div>

        {/* Interactive Client Component */}
        <CollaborateClient />
      </div>
    </div>
  );
}
