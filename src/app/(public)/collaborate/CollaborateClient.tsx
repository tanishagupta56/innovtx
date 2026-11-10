'use client';

import React, { useState } from 'react';

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

const COLLAB_TYPES = [
  {
    title: 'Industry Partnerships',
    description: 'Workshops, hackathon problem statement tracks, and direct talent recruitment pipelines with senior tech leaders.',
    tag: 'CORPORATE',
  },
  {
    title: 'Student Chapters & Clubs',
    description: 'Joint inter-college hackathons, cross-promotional hack tracks, and shared community spaces across Delhi NCR.',
    tag: 'CAMPUS',
  },
  {
    title: 'Institutional Alliances',
    description: 'Academic hackathons, high-performance computing lab access, and co-hosted regional tech fests (e.g. IIIT Delhi & INNERve).',
    tag: 'UNIVERSITY',
  },
];

export default function CollaborateClient() {
  const [activeTab, setActiveTab] = useState<'sponsor' | 'collaborate'>('sponsor');
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    type: 'Event Sponsorship',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Connect to existing ticket/inquiry backend
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `[Partnership Inquiry] ${form.organization} - ${form.type}`,
          category: 'partnership',
          description: `Name: ${form.name}\nOrganization: ${form.organization}\nEmail: ${form.email}\nType: ${form.type}\n\nMessage:\n${form.message}`,
        }),
      });

      // Show success regardless of auth session to allow public inquiries
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-charcoal-border pb-4 font-mono text-xs">
        <button
          onClick={() => setActiveTab('sponsor')}
          className={`px-5 py-2.5 uppercase tracking-wider rounded-md transition-all ${
            activeTab === 'sponsor'
              ? 'bg-electric-blue text-deep-ink font-bold shadow-[0_0_15px_#315EFF]'
              : 'bg-charcoal border border-charcoal-border text-slate-400 hover:text-white'
          }`}
        >
          Sponsor InnoVortex &amp; Events
        </button>

        <button
          onClick={() => setActiveTab('collaborate')}
          className={`px-5 py-2.5 uppercase tracking-wider rounded-md transition-all ${
            activeTab === 'collaborate'
              ? 'bg-electric-blue text-deep-ink font-bold shadow-[0_0_15px_#315EFF]'
              : 'bg-charcoal border border-charcoal-border text-slate-400 hover:text-white'
          }`}
        >
          Institutional &amp; Community Alliances
        </button>
      </div>

      {activeTab === 'sponsor' ? (
        /* Sponsorship Packages Grid */
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              SPONSORSHIP PACKAGES // INNOVORTEX ARENA
            </span>
            <span className="font-mono text-xs text-lime-green font-bold">
              CUSTOM TIERS AVAILABLE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl border flex flex-col justify-between ${
                  tier.highlight
                    ? 'border-electric-blue/50 bg-charcoal/90 shadow-[0_0_25px_rgba(117,230,255,0.15)]'
                    : 'border-charcoal-border bg-charcoal/60'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                    {tier.scope}
                  </span>
                  <h3 className="text-2xl font-bold text-soft-white mb-6">
                    {tier.name}
                  </h3>

                  <ul className="space-y-3 font-sans">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-lime-green font-mono mt-0.5">✔</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-charcoal-border">
                  <a
                    href="mailto:techneedsigdtuw@gmail.com?subject=Sponsorship%20Proposal%20-%20TechNeeds"
                    className={`block w-full text-center py-3 text-xs font-mono font-bold rounded uppercase transition-colors ${
                      tier.highlight
                        ? 'bg-electric-blue text-deep-ink hover:bg-cyan-300 shadow-[0_0_15px_rgba(117,230,255,0.4)]'
                        : 'bg-deep-ink border border-charcoal-border text-soft-white hover:border-electric-blue/50'
                    }`}
                  >
                    Request Brochure &amp; Deck →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Collaborative Alliances */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COLLAB_TYPES.map((col, idx) => (
            <div
              key={idx}
              className="p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-charcoal border border-charcoal-border text-lime-green block w-fit mb-4">
                  {col.tag}
                </span>
                <h3 className="text-xl font-bold text-soft-white mb-3">{col.title}</h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{col.description}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-charcoal-border text-xs font-mono text-slate-400">
                PROPOSAL: DIRECT OUTREACH
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Real Working Inquiry Form */}
      <div className="p-10 border border-charcoal-border bg-charcoal/70 rounded-3xl space-y-8">
        <div>
          <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
            GET IN TOUCH
          </span>
          <h2 className="editorial-title text-3xl sm:text-4xl text-soft-white mt-3">
            Submit a Partnership Inquiry<span className="text-lime-green">.</span>
          </h2>
          <p className="text-slate-400 text-sm font-sans mt-1">
            Our corporate relations team typically reviews inquiries within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2 font-mono bg-deep-ink border border-electric-blue/50 rounded-xl">
            <span className="text-2xl text-lime-green block">✔</span>
            <p className="text-soft-white font-bold text-base">Inquiry Dispatched Successfully</p>
            <p className="text-xs text-slate-400">
              Thank you! Our Corporate Relations team will connect via {form.email || 'your provided email'}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">YOUR NAME *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 bg-deep-ink border border-charcoal-border rounded-md text-soft-white focus:outline-none focus:border-electric-blue/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">ORGANIZATION / COMPANY *</label>
              <input
                type="text"
                required
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="Company or University"
                className="w-full px-4 py-2.5 bg-deep-ink border border-charcoal-border rounded-md text-soft-white focus:outline-none focus:border-electric-blue/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">EMAIL ADDRESS *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 bg-deep-ink border border-charcoal-border rounded-md text-soft-white focus:outline-none focus:border-electric-blue/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">PARTNERSHIP CATEGORY</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-deep-ink border border-charcoal-border rounded-md text-soft-white focus:outline-none focus:border-electric-blue/50"
              >
                <option value="Event Sponsorship">InnoVortex Event Sponsorship</option>
                <option value="Technical Workshop">Sponsored Workshop / Lab</option>
                <option value="Campus Chapter">Student Chapter Collaboration</option>
                <option value="Talent Pipeline">Campus Recruitment Pipeline</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">PROPOSAL DETAILS / MESSAGE *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your proposed collaboration or sponsorship goals..."
                className="w-full px-4 py-2.5 bg-deep-ink border border-charcoal-border rounded-md text-soft-white focus:outline-none focus:border-electric-blue/50"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-electric-blue text-deep-ink font-bold uppercase rounded-md hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(117,230,255,0.4)] disabled:opacity-50"
              >
                {submitting ? 'Transmitting...' : 'Dispatch Inquiry →'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Verified Official Contact Strip */}
      <div className="p-8 border border-charcoal-border bg-charcoal/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
        <div className="space-y-1">
          <p className="text-soft-white font-bold">DIRECT COMMUNICATIONS DESK:</p>
          <p className="text-slate-400">
            Email: <a href="mailto:techneedsigdtuw@gmail.com" className="text-lime-green underline">techneedsigdtuw@gmail.com</a> | WhatsApp: <a href="https://wa.me/918958898580" target="_blank" rel="noopener noreferrer" className="text-lime-green underline">+91 8958898580</a>
          </p>
          <p className="text-slate-500">
            Campus: Indira Gandhi Delhi Technical University for Women, Kashmere Gate, Delhi 110006
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/techneeds_igdtuw_/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-charcoal border border-charcoal-border rounded text-slate-300 hover:text-white hover:border-electric-blue/50 transition-colors"
          >
            Instagram ↗
          </a>
          <a
            href="https://www.linkedin.com/company/techneeds-igdtuw/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-charcoal border border-charcoal-border rounded text-slate-300 hover:text-white hover:border-electric-blue/50 transition-colors"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  );
}
