'use client';

import Link from 'next/link';
import InfiniteMarquee from './InfiniteMarquee';
import MagneticButton from './MagneticButton';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-cobalt/30 bg-[#020307] overflow-hidden pt-16 pb-12">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-cobalt/15 blur-[160px] pointer-events-none -z-10" />

      {/* Marquee ticker running before the footer body */}
      <div className="mb-16">
        <InfiniteMarquee
          items={[
            'JOIN THE MOVEMENT',
            'IGDTUW TECHNICAL SOCIETY',
            'INNOVORTEX',
            'SYSTEM ARCHITECTS',
            'WOMEN IN CODING',
          ]}
          speed={22}
          bordered={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-cobalt/20">
          {/* Brand Manifesto & Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-lime" />
              <span className="font-mono text-xs text-lime uppercase tracking-widest font-bold">
                TECHNEEDS ARCHIVE
              </span>
            </div>

            <p className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              Empowering the next generation of women software architects, researchers, and tech founders.
            </p>

            <p className="text-gray-400 font-body text-sm leading-relaxed max-w-md">
              Based at Indira Gandhi Delhi Technical University for Women, Kashmere Gate, Delhi. Cultivating relentless technical ambition through code, collaboration, and community.
            </p>

            <div className="font-mono text-xs text-gray-500 space-y-1">
              <p>CAMPUS: IGDTUW, KASHMERE GATE, DELHI - 110006</p>
              <p>COORDINATES: 28.6652° N, 77.2324° E</p>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 font-mono text-xs">
            {/* Column 1: Ecosystem */}
            <div className="space-y-4">
              <h4 className="text-lime uppercase tracking-widest font-bold border-b border-cobalt/20 pb-2">
                {'// PLATFORM'}
              </h4>
              <ul className="space-y-2.5 text-gray-400">
                <li><Link href="/timeline" className="hover:text-lime transition-colors">⏳ 3D Spatial Timeline</Link></li>
                <li><Link href="/initiatives" className="hover:text-lime transition-colors">🚀 Society Initiatives</Link></li>
                <li><Link href="/events" className="hover:text-lime transition-colors">⚡ Events &amp; Passes</Link></li>
                <li><Link href="/community" className="hover:text-lime transition-colors">🌐 Community Ecosystem</Link></li>
                <li><Link href="/gallery" className="hover:text-lime transition-colors">📸 Vibes &amp; Moments</Link></li>
                <li><Link href="/collaborate" className="hover:text-lime transition-colors">🤝 Partner &amp; Sponsor</Link></li>
              </ul>
            </div>

            {/* Column 2: Governance & Verify */}
            <div className="space-y-4">
              <h4 className="text-cobalt-300 uppercase tracking-widest font-bold border-b border-cobalt/20 pb-2">
                {'// GOVERNANCE'}
              </h4>
              <ul className="space-y-2.5 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Society Manifesto</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">Helpdesk &amp; Tickets</Link></li>
                <li><Link href="/verify/CERT-DEMO" className="hover:text-white transition-colors">Verify Certificate ↗</Link></li>
                <li><Link href="/recruitment" className="hover:text-white transition-colors">Recruitment Desk</Link></li>
                <li><Link href="/admin/login" className="text-lime hover:underline">Restricted Ops 🔒</Link></li>
              </ul>
            </div>

            {/* Column 3: Live Channels */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-white uppercase tracking-widest font-bold border-b border-cobalt/20 pb-2">
                {'// EXTERNAL'}
              </h4>
              <ul className="space-y-2.5 text-gray-400">
                <li>
                  <a
                    href="https://www.techneeds.live/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime transition-colors"
                  >
                    Official Domain ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://igdtuw.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime transition-colors"
                  >
                    IGDTUW Portal ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://assetmerkle.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime transition-colors"
                  >
                    AssetMerkle Hub ↗
                  </a>
                </li>
              </ul>

              <div className="pt-2">
                <MagneticButton strength={15} onClick={scrollToTop}>
                  <button className="px-3 py-2 border border-cobalt/40 bg-[#060a17] hover:border-lime text-lime font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <span>↑ BACK TO TOP</span>
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Full-Width Editorial Brand Wordmark (Awwwards Signature element) */}
        <div className="pt-10 select-none overflow-hidden text-center">
          <h2 className="editorial-title text-[15vw] sm:text-[16vw] font-black leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(21,88,201,0.3)] hover:[-webkit-text-stroke:1.5px_#D4FF24] transition-all duration-700">
            TECHNEEDS
          </h2>
        </div>

        {/* Micro Copyright & Status Bar */}
        <div className="mt-8 pt-6 border-t border-cobalt/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TECHNEEDS IGDTUW. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <span className="text-lime">● ZERO DOWNTIME OBSERVED</span>
            <span className="text-gray-600">{'// NEXT.JS 14 HYPER-ENGINE'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
