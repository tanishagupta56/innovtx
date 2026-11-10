import Link from 'next/link';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import MagneticButton from '@/components/MagneticButton';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata = { title: 'Manifesto & About — TechNeeds IGDTUW' };

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight text-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header spread */}
        <div className="border-b border-cobalt/25 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="tag-telemetry-lime">MANIFESTO // 01</span>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              COLLECTIVE VALUES
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            ENGINEERING FOR THE <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_#1558C9] hover:[-webkit-text-stroke:1.5px_#D4FF24] transition-all">
              UNAPOLOGETIC
            </span>{' '}
            AMBITIOUS<span className="text-lime">.</span>
          </h1>

          <p className="mt-8 text-gray-300 font-body text-lg sm:text-2xl max-w-3xl leading-relaxed">
            TechNeeds was established at Indira Gandhi Delhi Technical University for Women to bridge the void between academic curriculum and high-performance industry engineering.
          </p>
        </div>

        {/* Narrative Chapters: Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-4 font-mono text-xs">
            <span className="text-lime block uppercase tracking-widest font-bold">
              {'// CHAPTER HIGHLIGHTS'}
            </span>
            <ul className="space-y-2 text-gray-400">
              <li>01. OUR ORIGIN STORY</li>
              <li>02. WHAT WE REJECT</li>
              <li>03. WHAT WE CHAMPION</li>
              <li>04. FLAGSHIP INITIATIVES</li>
            </ul>

            <div className="pt-8">
              <Link href="/timeline" className="text-lime hover:underline flex items-center gap-2">
                <span>View Historical Timeline</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-16">
            {/* Chapter 1 */}
            <ScrollReveal direction="up" distance={25}>
              <div className="p-8 sm:p-12 border border-cobalt/25 bg-[#050816]">
                <span className="text-xs font-mono text-lime uppercase font-bold mb-3 block">
                  CHAPTER 01 // ORIGIN
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
                  Forged in Code &amp; Camaraderie
                </h2>
                <div className="space-y-4 text-gray-300 font-body text-base leading-relaxed">
                  <p>
                    Located in the heart of Kashmere Gate, Delhi, IGDTUW houses some of the most analytically brilliant minds in South Asia. Yet, building breakout open-source projects and winning international hackathons requires more than lectures—it requires an ecosystem that lives and breathes execution.
                  </p>
                  <p>
                    TechNeeds was created as a sanctuary for builders: an autonomous society where students design production backends, deploy AI inference systems, and collaborate with industry veterans.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Chapter 2: The Core Creed */}
            <ScrollReveal direction="up" distance={25} delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-cobalt/20 bg-[#040713]">
                  <span className="text-lime font-mono text-xs font-bold uppercase block mb-2">01 // CODE FIRST</span>
                  <h3 className="font-display font-bold text-xl text-white mb-2">No Bureaucracy</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Ideas are cheap. We measure progress in shipped code, deployed repositories, and live benchmarks.
                  </p>
                </div>

                <div className="p-6 border border-cobalt/20 bg-[#040713]">
                  <span className="text-cobalt-300 font-mono text-xs font-bold uppercase block mb-2">02 // SISTERHOOD</span>
                  <h3 className="font-display font-bold text-xl text-white mb-2">Radical Support</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Women developers lifting other women developers. Peer mentoring, interview prep, and referral networks.
                  </p>
                </div>

                <div className="p-6 border border-cobalt/20 bg-[#040713]">
                  <span className="text-lime font-mono text-xs font-bold uppercase block mb-2">03 // SPEED</span>
                  <h3 className="font-display font-bold text-xl text-white mb-2">Sprint Mindset</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Iterating fast, failing without stigma, and shipping relentless prototypes under pressure.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Chapter 3 */}
            <ScrollReveal direction="up" distance={25} delay={0.2}>
              <div className="p-8 sm:p-12 border border-cobalt/25 bg-[#050816]">
                <span className="text-xs font-mono text-lime uppercase font-bold mb-3 block">
                  CHAPTER 02 // ECOSYSTEM
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
                  Flagship InnoVortex &amp; Collaborations
                </h2>
                <div className="space-y-4 text-gray-300 font-body text-base leading-relaxed">
                  <p>
                    Through our premier hackathon <strong>InnoVortex</strong> and collaborations with annual tech fest <strong>Innerve</strong>, TechNeeds creates Delhi&apos;s most electrifying student hackathon stages.
                  </p>
                  <p>
                    Our members regularly secure podium placements across national competitions, publish research, and lead technical fellowships at global engineering firms.
                  </p>
                </div>

                <div className="pt-8 mt-8 border-t border-cobalt/20 flex flex-wrap gap-4">
                  <MagneticButton href="/events">
                    <span className="btn-magnetic">
                      Browse Upcoming Hackathons →
                    </span>
                  </MagneticButton>
                  <MagneticButton href="/team">
                    <span className="btn-hollow">
                      Meet Society Leads
                    </span>
                  </MagneticButton>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
