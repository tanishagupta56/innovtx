import React from 'react';
import MagneticButton from '@/components/MagneticButton';

export const metadata = {
  title: 'Partner & Sponsor — TechNeeds IGDTUW',
  description: 'Collaborate with TechNeeds IGDTUW for hackathon sponsorships, technical workshops, and premier recruitment pipelines.',
};

const TIERS = [
  {
    name: 'Title Hackathon Partner',
    scope: 'Flagship Event Spotlight',
    benefits: [
      'Keynote presentation at Opening Ceremony',
      'Exclusive dedicated problem statement track',
      'Direct access to finalist resumes and GitHub repositories',
      'Prominent branding across banners, badges, and digital passes',
      'Judge seat on the final demo evaluation panel',
    ],
    highlight: true,
  },
  {
    name: 'Track & Tech Sponsor',
    scope: 'Domain Innovation',
    benefits: [
      'Sponsored technical workshop or API lab',
      'Branded award category (e.g. Best AI Agent / Best Web3 App)',
      'Access to registered participant talent pool',
      'Branding on event stream and stage backdrops',
    ],
    highlight: false,
  },
  {
    name: 'Community & Tooling Partner',
    scope: 'Ecosystem Enabler',
    benefits: [
      'API credits and student licenses distribution',
      'Logo on event landing page and certificates',
      'Mentorship booth in physical and virtual arenas',
      'Social media shoutouts across LinkedIn and WhatsApp',
    ],
    highlight: false,
  },
];

export default function CollaboratePage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 min-h-screen text-white relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-cobalt/25 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
              PARTNERSHIP MATRIX
            </span>
            <span className="font-mono text-xs text-electric-lime uppercase tracking-widest">
              CORP_RELATIONS // ACTIVE
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight uppercase">
            COLLABORATE &amp; <br />
            <span className="text-electric-lime">SPONSOR.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Partner with TechNeeds to empower premier women technologists at Indira Gandhi Delhi Technical University for Women. Accelerate your brand, hire top engineering talent, and test your developer APIs with hundreds of builders.
          </p>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 border border-white/10 bg-midnight-950/70 rounded-xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-electric-lime block">1,200+</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Undergraduate Reach</span>
          </div>
          <div className="p-6 border border-white/10 bg-midnight-950/70 rounded-xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-white block">500+</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Hackathon Applicants</span>
          </div>
          <div className="p-6 border border-white/10 bg-midnight-950/70 rounded-xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-electric-cobalt-light block">15+</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Industry Partners</span>
          </div>
          <div className="p-6 border border-white/10 bg-midnight-950/70 rounded-xl">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-white block">100%</span>
            <span className="text-xs font-mono text-slate-400 uppercase mt-1 block">Verified Check-in</span>
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              SPONSORSHIP PACKAGES // INNOVORTEX
            </span>
            <span className="font-mono text-xs text-electric-lime">
              CUSTOM TIERS AVAILABLE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-xl border flex flex-col justify-between ${
                  tier.highlight
                    ? 'border-electric-lime bg-midnight-900/90 shadow-[0_0_25px_rgba(212,255,36,0.15)]'
                    : 'border-white/10 bg-midnight-950/70'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                    {tier.scope}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {tier.name}
                  </h3>

                  <ul className="space-y-3">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-electric-lime font-mono mt-0.5">✔</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <a
                    href="mailto:techneeds.igdtuw@gmail.com?subject=Partnership%20Inquiry%20-%20TechNeeds"
                    className={`block w-full text-center py-3 text-xs font-mono font-bold rounded uppercase transition-colors ${
                      tier.highlight
                        ? 'bg-electric-lime text-black hover:bg-lime-400'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Request Brochure &amp; Deck →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="p-8 border border-electric-cobalt/40 bg-midnight-950/80 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Have a unique proposal?</h3>
            <p className="text-xs text-slate-400 font-mono">
              Direct inquiries: techneeds.igdtuw@gmail.com // Indira Gandhi Delhi Technical University for Women, Kashmere Gate, Delhi 110006
            </p>
          </div>
          <a
            href="mailto:techneeds.igdtuw@gmail.com"
            className="px-6 py-3 bg-electric-cobalt text-white font-mono text-xs uppercase font-bold rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            Connect with Corporate Lead ↗
          </a>
        </div>
      </div>
    </div>
  );
}
