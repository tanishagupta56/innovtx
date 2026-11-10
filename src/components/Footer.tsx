'use client';

import Link from 'next/link';
import Image from 'next/image';
import InfiniteMarquee from './InfiniteMarquee';
import MagneticButton from './MagneticButton';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-charcoal-border bg-deep-ink overflow-hidden pt-16 pb-12 z-10">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-electric-blue/15 blur-[160px] pointer-events-none -z-10" />

      {/* Marquee ticker running before the footer body */}
      <div className="mb-16">
        <InfiniteMarquee
          items={[
            'JOIN THE MOVEMENT',
            'IGDTUW TECHNICAL SOCIETY',
            'INNOVORTEX',
            'SYSTEM ARCHITECTS',
            'WOMEN IN TECH',
            'LEARN BUILD EXPLORE CONNECT',
          ]}
          speed={22}
          bordered={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-charcoal-border">
          {/* Brand Manifesto, Official Logo & Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/brand/techneeds-logo.png"
                  alt="TechNeeds Logo"
                  fill
                  sizes="40px"
                  className="object-contain drop-shadow-[0_0_12px_rgba(49,94,255,0.4)]"
                />
              </div>
              <div>
                <span className="font-display font-black text-xl text-soft-white tracking-tight">
                  TECH<span className="text-lime-green">NEEDS</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400 block tracking-widest">
                  IGDTUW TECHNICAL SOCIETY
                </span>
              </div>
            </div>

            <p className="font-display text-2xl sm:text-3xl font-bold text-soft-white leading-tight">
              All you need to know about tech. Learn. Build. Explore. Connect.
            </p>

            <p className="text-slate-400 font-sans text-sm leading-relaxed max-w-md">
              Based at Indira Gandhi Delhi Technical University for Women, Kashmere Gate, Delhi. Cultivating relentless technical ambition through code, collaboration, and peer mentorship.
            </p>

            {/* Verified Contact Details */}
            <div className="space-y-2 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-lime-green font-bold">EMAIL:</span>
                <a href="mailto:techneedsigdtuw@gmail.com" className="hover:text-lime-green underline">
                  techneedsigdtuw@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime-green font-bold">WHATSAPP:</span>
                <a href="https://wa.me/918958898580" target="_blank" rel="noopener noreferrer" className="hover:text-lime-green underline">
                  +91 8958898580
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime-green font-bold">CAMPUS:</span>
                <span>IGDTUW, Kashmere Gate, Delhi 110006</span>
              </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 font-mono text-xs">
            {/* Column 1: Ecosystem */}
            <div className="space-y-4">
              <h4 className="text-lime-green uppercase tracking-widest font-bold border-b border-charcoal-border pb-2">
                {'// DISCOVER'}
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/about" className="hover:text-lime-green transition-colors">⚡ About Society</Link></li>
                <li><Link href="/events" className="hover:text-lime-green transition-colors">📅 Events &amp; Passes</Link></li>
                <li><Link href="/timeline" className="hover:text-lime-green transition-colors">⏳ 3D Spatial Timeline</Link></li>
                <li><Link href="/mentorship" className="hover:text-lime-green transition-colors">🤝 Mentorship Cadre</Link></li>
                <li><Link href="/resources" className="hover:text-lime-green transition-colors">📚 TechBoard Docs</Link></li>
                <li><Link href="/team" className="hover:text-lime-green transition-colors">👥 Leadership &amp; Alumni</Link></li>
              </ul>
            </div>

            {/* Column 2: Governance & Community */}
            <div className="space-y-4">
              <h4 className="text-electric-blue-light uppercase tracking-widest font-bold border-b border-charcoal-border pb-2">
                {'// ENGAGE'}
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/community" className="hover:text-soft-white transition-colors">🌐 Community Ecosystem</Link></li>
                <li><Link href="/gallery" className="hover:text-soft-white transition-colors">📸 Vibes &amp; Moments</Link></li>
                <li><Link href="/collaborate" className="hover:text-soft-white transition-colors">🤝 Partner &amp; Sponsor</Link></li>
                <li><Link href="/showcase" className="hover:text-soft-white transition-colors">🚀 Student Showcase</Link></li>
                <li><Link href="/opportunities" className="hover:text-soft-white transition-colors">💼 Opportunity Radar</Link></li>
                <li><Link href="/faq" className="hover:text-soft-white transition-colors">❓ Helpdesk &amp; FAQ</Link></li>
              </ul>
            </div>

            {/* Column 3: Live Channels & Socials */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-soft-white uppercase tracking-widest font-bold border-b border-charcoal-border pb-2">
                {'// OFFICIAL CHANNELS'}
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li>
                  <a
                    href="https://www.instagram.com/techneeds_igdtuw_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-green transition-colors flex items-center gap-1.5"
                  >
                    <span>Instagram</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/techneeds-igdtuw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-green transition-colors flex items-center gap-1.5"
                  >
                    <span>LinkedIn</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://igdtuw.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-green transition-colors flex items-center gap-1.5"
                  >
                    <span>IGDTUW Portal</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://assetmerkleigdtuw.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-green transition-colors flex items-center gap-1.5"
                  >
                    <span>AssetMerkle Hub</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </li>
              </ul>

              <div className="pt-2">
                <MagneticButton strength={15} onClick={scrollToTop}>
                  <button className="px-3 py-2 border border-charcoal-border bg-charcoal hover:border-electric-blue/60 text-lime-green font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 rounded">
                    <span>↑ BACK TO TOP</span>
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Full-Width Editorial Brand Wordmark */}
        <div className="pt-10 select-none overflow-hidden text-center">
          <h2 className="editorial-title text-[14vw] sm:text-[15vw] font-black leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(49,94,255,0.25)] hover:[-webkit-text-stroke:1.5px_#75E6FF] transition-all duration-700">
            TECHNEEDS
          </h2>
        </div>

        {/* Micro Copyright & Status Bar */}
        <div className="mt-8 pt-6 border-t border-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TECHNEEDS IGDTUW. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <span className="text-lime-green">● LIGHT FIELD ACTIVE</span>
            <span className="text-slate-600">{'// NEXT.JS 14 ENGINE'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
