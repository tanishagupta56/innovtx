import Hero from '@/components/Hero';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import MagneticButton from '@/components/MagneticButton';
import SplitHeading from '@/components/SplitHeading';
import ScrollReveal from '@/components/ScrollReveal';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { getEventTiming, formatDate } from '@/lib/utils';

export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: events },
    { data: opportunities },
  ] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, slug, short_description, category, start_date, end_date, poster_url, venue')
      .eq('status', 'published')
      .order('start_date', { ascending: false })
      .limit(4),
    supabase
      .from('opportunities')
      .select('id, title, company, type, deadline, location, apply_url')
      .eq('is_published', true)
      .order('deadline', { ascending: true })
      .limit(3),
  ]);

  const featuredEvent = events?.[0];
  const remainingEvents = events?.slice(1) || [];

  return (
    <div className="relative w-full overflow-hidden bg-midnight">
      {/* 1. CINEMATIC HERO */}
      <Hero />

      {/* 2. DUAL-DIRECTION CONTINUOUS MARQUEE */}
      <section className="relative z-20">
        <InfiniteMarquee
          items={[
            'TECHNEEDS IGDTUW',
            'INNOVORTEX 2025',
            'ENGINEERING EXCELLENCE',
            'SYSTEM ARCHITECTS',
            'OPEN SOURCE COLLECTIVE',
          ]}
          speed={25}
          bordered={true}
        />
      </section>

      {/* 3. MANIFESTO & PHILOSOPHY (Editorial Asymmetric Magazine Layout) */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 relative">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cobalt/10 blur-[160px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left sticky column: Manifesto headline */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
              <span className="tag-telemetry-lime">01 // MANIFESTO</span>
              <h2 className="editorial-title text-4xl sm:text-6xl xl:text-7xl text-white">
                WE DO NOT BUILD ORDINARY<span className="text-lime">.</span>
              </h2>
              <p className="font-mono text-xs text-gray-400 uppercase tracking-widest leading-relaxed">
                TECHNICAL PROFICIENCY IS NOT TAUGHT IN AUDITORIUMS. IT IS FORGED IN 36-HOUR SPRINT COMMITS, PRODUCTION DEPLOYS, AND PEER REVIEW.
              </p>
            </div>

            {/* Right column: 3 Editorial Narrative Pillars */}
            <div className="lg:col-span-7 space-y-12">
              <ScrollReveal direction="up" distance={30}>
                <div className="p-8 sm:p-12 border border-cobalt/25 bg-[#050816] relative overflow-hidden group hover:border-lime/50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-lime uppercase font-bold tracking-widest">
                      PILLAR [01]
                    </span>
                    <span className="text-2xl font-mono text-cobalt-300 font-bold">01</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                    High-Octane Hackathons &amp; InnoVortex
                  </h3>
                  <p className="text-gray-300 font-body text-base leading-relaxed">
                    Flagship events that test the extreme bounds of ideation, rapid engineering, and system resilience. From annual tech fest partnerships to our signature InnoVortex sprints, we assemble the fiercest engineering teams in Delhi.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" distance={30} delay={0.15}>
                <div className="p-8 sm:p-12 border border-cobalt/25 bg-[#050816] relative overflow-hidden group hover:border-lime/50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-lime uppercase font-bold tracking-widest">
                      PILLAR [02]
                    </span>
                    <span className="text-2xl font-mono text-cobalt-300 font-bold">02</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                    System Architecture &amp; Web3 Literacy
                  </h3>
                  <p className="text-gray-300 font-body text-base leading-relaxed">
                    Going beyond basic frontend scripts. We dissect distributed databases, low-latency APIs, cryptography, and smart contracts to ensure IGDTUW graduates lead Tier-1 engineering organizations globally.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" distance={30} delay={0.25}>
                <div className="p-8 sm:p-12 border border-cobalt/25 bg-[#050816] relative overflow-hidden group hover:border-lime/50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-lime uppercase font-bold tracking-widest">
                      PILLAR [03]
                    </span>
                    <span className="text-2xl font-mono text-cobalt-300 font-bold">03</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                    The Fast-Track Opportunity Matrix
                  </h3>
                  <p className="text-gray-300 font-body text-base leading-relaxed">
                    A zero-fluff pipeline directly connecting verified society members with top-tier fellowships, internship openings, research grants, and mentor office hours with alumni.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLAGSHIP EVENT SPOTLIGHT (Full-Bleed Asymmetric Hero Unit) */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 bg-[#030611] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="tag-telemetry">FEATURED ARCHIVE</span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-white mt-3">
                FLAGSHIP SPOTLIGHT<span className="text-lime">.</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="font-mono text-xs uppercase tracking-widest text-lime hover:underline pb-1"
            >
              All Events &amp; Passes [↗]
            </Link>
          </div>

          {featuredEvent ? (
            <div className="border border-cobalt/30 bg-[#050917] p-8 sm:p-14 relative overflow-hidden group hover:border-lime/40 transition-all">
              {/* Telemetry Corner Accent */}
              <div className="absolute top-4 right-4 font-mono text-[10px] text-lime">
                [LIVE STATUS: {featuredEvent.category.toUpperCase()}]
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Poster Display with Mask Reveal */}
                <div className="lg:col-span-5 relative aspect-[4/3] bg-black border border-cobalt/30 overflow-hidden">
                  {featuredEvent.poster_url ? (
                    <img
                      src={featuredEvent.poster_url}
                      alt={featuredEvent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-cobalt/30 to-black text-center">
                      <span className="font-display font-extrabold text-3xl text-white">
                        {featuredEvent.title}
                      </span>
                      <span className="font-mono text-xs text-lime mt-2">
                        OFFICIAL POSTER // VERIFIED EVENT
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Event Metadata & Registration CTA */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="tag-telemetry-lime font-bold">
                      {getEventTiming(featuredEvent.start_date, featuredEvent.end_date).toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-gray-400">
                      📍 {featuredEvent.venue || 'IGDTUW Campus, Delhi'}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {featuredEvent.title}
                  </h3>

                  <p className="text-gray-300 font-body text-base sm:text-lg leading-relaxed">
                    {featuredEvent.short_description ||
                      'Join hundreds of university developers competing in intensive sprint rounds. HMAC cryptographically signed passes available for registered attendees.'}
                  </p>

                  <div className="pt-4 border-t border-cobalt/20 flex flex-wrap items-center gap-6 font-mono text-xs">
                    <div>
                      <span className="text-gray-500 uppercase block">START DATE:</span>
                      <span className="text-white font-bold">{formatDate(featuredEvent.start_date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase block">VENUE:</span>
                      <span className="text-lime font-bold">{featuredEvent.venue || 'CAMPUS AUDITORIUM'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase block">ENTRY:</span>
                      <span className="text-white font-bold">DIGITAL PASS (QR)</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <MagneticButton href={`/events/${featuredEvent.slug}`}>
                      <span className="btn-magnetic">
                        Book Event Pass &amp; Details →
                      </span>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 border border-cobalt/20 bg-[#050814] text-center font-mono text-gray-500">
              [SYSTEM NOTICE: Events are currently being scheduled for the upcoming session.]
            </div>
          )}

          {/* Secondary Events Grid (Asymmetric 3-piece layout) */}
          {remainingEvents.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {remainingEvents.map((evt, idx) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.slug}`}
                  className="p-6 border border-cobalt/20 bg-[#040713] hover:border-lime/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-3">
                      <span className="text-lime">[0{idx + 2}]</span>
                      <span>{formatDate(evt.start_date)}</span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-white group-hover:text-lime transition-colors">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {evt.short_description || 'Click to view event details and schedule.'}
                    </p>
                  </div>
                  <div className="pt-4 mt-6 border-t border-cobalt/15 flex justify-between items-center text-xs font-mono text-cobalt-300">
                    <span>{evt.category}</span>
                    <span className="group-hover:translate-x-1 transition-transform">PASS →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. CAREER OPPORTUNITIES & GRANTS (Live Feed) */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 bg-midnight relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="tag-telemetry-lime">RADAR // CAREERS</span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-white mt-3">
                OPPORTUNITY BOARD<span className="text-lime">.</span>
              </h2>
            </div>
            <Link
              href="/opportunities"
              className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-white"
            >
              Browse Full Board [↗]
            </Link>
          </div>

          {opportunities && opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-8 border border-cobalt/25 bg-[#050816] flex flex-col justify-between group hover:border-lime/40 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-4">
                      <span className="tag-telemetry">{opp.type}</span>
                      {opp.deadline && (
                        <span className="text-lime font-bold">
                          Due {formatDate(opp.deadline)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-1">
                      {opp.title}
                    </h3>
                    <p className="font-mono text-xs text-gray-400 mb-4 font-semibold">
                      {opp.company || 'Host Organization'}
                    </p>
                    {opp.location && (
                      <p className="text-xs text-gray-500 font-mono">📍 {opp.location}</p>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-cobalt/15">
                    {opp.apply_url ? (
                      <a
                        href={opp.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-hollow w-full text-center text-xs py-2.5"
                      >
                        Apply Now ↗
                      </a>
                    ) : (
                      <Link
                        href="/opportunities"
                        className="btn-hollow w-full text-center text-xs py-2.5"
                      >
                        Inspect Opening
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 border border-cobalt/20 bg-[#050814] text-center font-mono text-gray-500">
              [NO ACTIVE EXTERNAL OPENINGS POSTED · CHECK BACK SOON]
            </div>
          )}
        </div>
      </section>

      {/* 6. IMMERSIVE CALL TO ACTION (Curved Energy Horizon) */}
      <section className="py-32 sm:py-44 px-6 sm:px-12 relative overflow-hidden text-center bg-[#020409]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cobalt/25 via-transparent to-transparent pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <span className="tag-telemetry-lime">READY TO COMMENCE</span>
          <h2 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            BECOME PART OF THE <span className="text-lime">COLLECTIVE.</span>
          </h2>
          <p className="text-gray-300 font-body text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Register your student identity, claim HMAC cryptographically verified event passes, and build alongside IGDTUW&apos;s most ambitious developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <MagneticButton href="/signup" strength={30}>
              <span className="btn-magnetic px-10 py-4 text-base">
                Create Student Account →
              </span>
            </MagneticButton>

            <MagneticButton href="/resources" strength={20}>
              <span className="btn-hollow px-8 py-4 text-base">
                Launch TechBoard
              </span>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
