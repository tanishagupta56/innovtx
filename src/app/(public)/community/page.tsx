import React from 'react';
import MagneticButton from '@/components/MagneticButton';

export const metadata = {
  title: 'Community Ecosystem — TechNeeds IGDTUW',
  description: 'Join 1,200+ women developers, mentors, and alumni shaping technical innovation at IGDTUW.',
};

const CHANNELS = [
  {
    title: 'Discord Engineering Hub',
    description: 'Real-time dev discussions, system architecture debates, hackathon team matching, and live project troubleshooting.',
    badge: 'PRIMARY DEV REALM',
    members: '950+ Engineers',
    link: 'https://discord.gg',
  },
  {
    title: 'WhatsApp Announcement Matrix',
    description: 'Instant notifications for event pass drops, hackathon registrations, and high-priority opportunity postings.',
    badge: 'OFFICIAL BROADCAST',
    members: '1,200+ Members',
    link: 'https://chat.whatsapp.com',
  },
  {
    title: 'GitHub Organization',
    description: 'Society platforms, open source projects, workshop repositories, and collaborative collegiate toolkits.',
    badge: 'CODE REPOSITORIES',
    members: '40+ Repositories',
    link: 'https://github.com',
  },
  {
    title: 'LinkedIn Professional Network',
    description: 'Alumni spotlights, corporate partnership announcements, and verified career milestones of society graduates.',
    badge: 'ALUMNI ALLIANCE',
    members: '1,500+ Followers',
    link: 'https://linkedin.com/company/techneeds-igdtuw/',
  },
];

const PERKS = [
  {
    icon: '⚡',
    title: 'Cryptographic Event Passes',
    description: 'Dynamic HMAC-signed QR tickets stored directly in your student passport for seamless on-site check-in.',
  },
  {
    icon: '🎯',
    title: 'SSSC 1-on-1 Mentorship',
    description: 'Direct pairing with senior students and alumni working at top tech firms for roadmap guidance and code reviews.',
  },
  {
    icon: '🚀',
    title: 'Hackathon Fast-Track Tracks',
    description: 'Guaranteed shortlist review and team formation assistance for InnoVortex and regional collegiate hackathons.',
  },
  {
    icon: '💡',
    title: 'Exclusive Cloud & API Credits',
    description: 'Free developer tooling credits provided through our Microsoft MLSA and cloud infrastructure partners.',
  },
];

export default function CommunityPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink text-soft-white min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              ECOSYSTEM // 1,200+ MEMBERS
            </span>
            <span className="font-mono text-xs text-lime-green uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-electric-blue animate-ping" />
              GLOBAL NETWORK
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            COMMUNITY <br />
            <span className="text-lime-green">COLLECTIVE.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            TechNeeds IGDTUW brings together India&apos;s sharpest women engineers, designers, and innovators. Plug into our communication matrix and build with purpose.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              COMMUNICATION MATRIX
            </span>
            <span className="font-mono text-xs text-lime-green">
              DIRECT ACCESS NODES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CHANNELS.map((channel, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-charcoal-border bg-charcoal/70 hover:border-electric-blue/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase bg-charcoal border border-charcoal-border rounded text-slate-300">
                      {channel.badge}
                    </span>
                    <span className="text-xs font-mono text-lime-green font-bold">
                      {channel.members}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-soft-white group-hover:text-lime-green transition-colors">
                    {channel.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-300 font-sans leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-charcoal-border flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">ACCESS: OPEN</span>
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-mono font-bold bg-electric-blue text-deep-ink hover:bg-cyan-300 transition-colors rounded-md shadow-[0_0_12px_rgba(117,230,255,0.3)]"
                  >
                    Enter Channel ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Perks & Benefits */}
        <div className="p-10 rounded-3xl border border-charcoal-border bg-charcoal/50">
          <div className="mb-8">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              MEMBERSHIP PRIVILEGES
            </span>
            <h2 className="editorial-title text-3xl sm:text-5xl text-soft-white mt-3">
              WHAT YOU GAIN IN THE COLLECTIVE<span className="text-lime-green">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((perk, i) => (
              <div key={i} className="p-6 bg-deep-ink rounded-xl border border-charcoal-border">
                <span className="text-3xl block mb-3">{perk.icon}</span>
                <h4 className="text-base font-bold text-soft-white mb-2">{perk.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Charter */}
        <div className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl">
          <h3 className="font-mono text-xs uppercase text-lime-green tracking-widest mb-4 font-bold">
            {'//'} THE TECHNEEDS COMMUNITY CHARTER
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-slate-300">
            <div>
              <strong className="text-soft-white block mb-1">01. MERIT &amp; COLLABORATION</strong>
              We build together. Knowledge is open and contributions to peer learning are celebrated.
            </div>
            <div>
              <strong className="text-soft-white block mb-1">02. RESPECT &amp; INCLUSIVITY</strong>
              Zero tolerance for harassment, elitism, or exclusion. Safe space for every engineer.
            </div>
            <div>
              <strong className="text-soft-white block mb-1">03. ENGINEERING RIGOR</strong>
              We ship code that solves real problems. Respect deadlines and uphold code quality.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-soft-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-sans">
            Create your account today and unlock instant access to event registrations and society cohorts.
          </p>
          <MagneticButton href="/signup" strength={25}>
            <span className="px-8 py-3.5 bg-electric-blue text-deep-ink font-mono text-xs font-bold uppercase rounded-md shadow-[0_0_15px_rgba(117,230,255,0.4)]">
              Create Student Identity →
            </span>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
