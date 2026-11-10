import React from 'react';
import FAQClient from './FAQClient';
import Link from 'next/link';

export const metadata = {
  title: 'FAQ & Helpdesk — TechNeeds IGDTUW',
  description: 'Everything you need to know regarding hackathon eligibility, cryptographic passes, mentorship cohorts, and community participation at TechNeeds IGDTUW.',
};

export default function FAQPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink min-h-screen text-soft-white relative z-10">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
              HELPDESK // INQUIRIES
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              COMMUNITY SUPPORT DIRECTORY
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            FAQ &amp; <br />
            <span className="text-ice-cyan">INQUIRIES.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Everything you need to know regarding hackathon eligibility, cryptographic passes, mentorship cohorts, and community participation.
          </p>
        </div>

        {/* Searchable Accordion Component */}
        <FAQClient />

        {/* Bottom Helpdesk Escalation */}
        <div className="p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-soft-white">Still have questions?</h4>
            <p className="text-xs text-slate-400 font-mono">
              Email our support leads at techneedsigdtuw@gmail.com or WhatsApp +91 8958898580.
            </p>
          </div>
          <Link
            href="/collaborate"
            className="px-6 py-3 bg-ice-cyan text-deep-ink font-mono text-xs font-bold uppercase rounded-md hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(117,230,255,0.35)] whitespace-nowrap"
          >
            Contact Team ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
