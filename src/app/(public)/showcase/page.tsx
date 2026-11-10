import React from 'react';
import ShowcaseClient from './ShowcaseClient';

export const metadata = {
  title: 'Student Project Showcase — TechNeeds IGDTUW',
  description: 'Explore peer-reviewed software projects, hackathon winners, and open-source packages created by IGDTUW women engineers.',
};

export default function ShowcasePage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-transparent min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              INNOVATION VAULT // PROJECTS
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              PEER-REVIEWED SOFTWARE REPOSITORY
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            STUDENT PROJECT <br />
            <span className="text-lime-green">SHOWCASE.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            An interactive laboratory exhibiting peer-reviewed software projects, InnoVortex hackathon winners, and open-source packages authored by IGDTUW students.
          </p>
        </div>

        <ShowcaseClient />
      </div>
    </div>
  );
}
