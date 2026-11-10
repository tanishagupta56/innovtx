import Hero from '@/components/Hero';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import MagneticButton from '@/components/MagneticButton';
import ScrollReveal from '@/components/ScrollReveal';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { getEventTiming, formatDate } from '@/lib/utils';
import { SOCIETY_STATS, SOCIETY_DEPARTMENTS, SOCIETY_INITIATIVES, FAQS } from '@/data/societyData';
import { TIMELINE_MILESTONES } from '@/data/timelineData';

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
    <div className="relative w-full overflow-hidden">
      {/* 1. CINEMATIC 3D HERO */}
      <Hero />

      {/* 2. DUAL-DIRECTION CONTINUOUS MARQUEE */}
      <section className="relative z-20">
        <InfiniteMarquee
          items={[
            'TECHNEEDS IGDTUW',
            'INNOVORTEX 4.0',
            'SSSC MENTORSHIP CADRE',
            '21-DAY CS SPRINT',
            'AUTONOMOUS AGENTS',
            'SYSTEM ARCHITECTS',
            'PERSISTENT 3D WORLD',
          ]}
          speed={24}
          bordered={true}
        />
      </section>

      {/* 3. SOCIETY METRICS TELEMETRY (AssetMerkle inspired) */}
      <section className="py-16 px-6 sm:px-12 border-b border-cobalt/20 bg-midnight-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {SOCIETY_STATS.map((stat, i) => (
              <div key={i} className="p-6 border border-white/10 bg-midnight-900/40 rounded-xl relative group hover:border-electric-lime transition-all">
                <span className="text-3xl sm:text-5xl font-mono font-black text-electric-lime tracking-tight block mb-2">
                  {stat.number}
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-wider block font-mono">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {stat.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MANIFESTO & PHILOSOPHY (Asymmetric Editorial Layout) */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left sticky column: Manifesto headline */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
                01 // MANIFESTO & CORE
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl xl:text-7xl text-white">
                WE DO NOT BUILD ORDINARY<span className="text-electric-lime">.</span>
              </h2>
              <p className="font-mono text-xs text-slate-400 uppercase tracking-widest leading-relaxed">
                TECHNICAL MASTERY IS NOT TAUGHT IN AUDITORIUMS. IT IS FORGED IN 36-HOUR HACKATHON COMMITS, OPEN SOURCE UPSTREAMING, AND PEER MENTORSHIP.
              </p>
              <div className="pt-2">
                <Link
                  href="/timeline"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-electric-lime hover:underline"
                >
                  Explore 3D Archival Timeline (14 Nodes) →
                </Link>
              </div>
            </div>

            {/* Right column: 3 Editorial Narrative Pillars */}
            <div className="lg:col-span-7 space-y-10">
              <ScrollReveal direction="up" distance={30}>
                <div className="p-8 sm:p-12 border border-cobalt/30 bg-midnight-950/80 backdrop-blur-md rounded-xl relative overflow-hidden group hover:border-electric-lime transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-electric-lime uppercase font-bold tracking-widest">
                      PILLAR [01]
                    </span>
                    <span className="text-2xl font-mono text-cobalt-bright font-bold">01</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    InnoVortex Hackathon Arena
                  </h3>
                  <p className="text-slate-300 font-sans text-base leading-relaxed">
                    Our flagship collegiate innovation arena. From our 2023 campus ideathon to multi-campus editions at IIIT Delhi, we challenge engineering students to solve hard problems in Autonomous AI, Climate Tech, and Distributed Systems.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" distance={30} delay={0.15}>
                <div className="p-8 sm:p-12 border border-cobalt/30 bg-midnight-950/80 backdrop-blur-md rounded-xl relative overflow-hidden group hover:border-electric-lime transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-electric-lime uppercase font-bold tracking-widest">
                      PILLAR [02]
                    </span>
                    <span className="text-2xl font-mono text-cobalt-bright font-bold">02</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Society Student Support Cell (SSSC)
                  </h3>
                  <p className="text-slate-300 font-sans text-base leading-relaxed">
                    Structured peer mentoring matching incoming freshers and sophomores with experienced senior engineers. Weekly coding sprints, resume clinics, and FAANG mock interview series.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" distance={30} delay={0.25}>
                <div className="p-8 sm:p-12 border border-cobalt/30 bg-midnight-950/80 backdrop-blur-md rounded-xl relative overflow-hidden group hover:border-electric-lime transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-electric-lime uppercase font-bold tracking-widest">
                      PILLAR [03]
                    </span>
                    <span className="text-2xl font-mono text-cobalt-bright font-bold">03</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    21-Day CS Fundamentals &amp; Open Source
                  </h3>
                  <p className="text-slate-300 font-sans text-base leading-relaxed">
                    Daily challenge cohorts covering Operating Systems, DBMS, Networks, and Low-Level Design alongside Microsoft Learn Student Ambassador (MLSA) workshops and Git/GitHub bootcamps.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLAGSHIP INITIATIVES SHOWCASE */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 bg-midnight-950/70 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
                PROGRAMS // FLAGSHIPS
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-white mt-3">
                KEY INITIATIVES<span className="text-electric-lime">.</span>
              </h2>
            </div>
            <Link
              href="/initiatives"
              className="font-mono text-xs uppercase tracking-widest text-electric-lime hover:underline pb-1"
            >
              All Society Programs [↗]
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SOCIETY_INITIATIVES.map((init) => (
              <div
                key={init.id}
                className="p-8 sm:p-10 border border-white/10 bg-midnight-900/60 rounded-xl relative overflow-hidden group hover:border-electric-lime transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-electric-lime/10 text-electric-lime border border-electric-lime/30">
                      {init.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {init.subtitle}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-electric-lime transition-colors">
                    {init.title}
                  </h3>

                  <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                    {init.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 text-xs font-mono text-electric-cobalt-light font-bold">
                    📊 {init.metrics}
                  </div>
                </div>

                <div className="mt-6 pt-4 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {init.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 rounded border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={init.link}
                    className="font-mono text-xs text-electric-lime group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold"
                  >
                    Explore Program →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SOCIETY DEPARTMENTS / WINGS MATRIX */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
              ORGANIZATIONAL ARCHITECTURE
            </span>
            <h2 className="editorial-title text-4xl sm:text-6xl text-white mt-3">
              DEPARTMENT CADRES<span className="text-electric-lime">.</span>
            </h2>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mt-2">
              SPECIALIZED WINGS DRIVING RESEARCH, ENGINEERING, MENTORSHIP &amp; OUTREACH
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SOCIETY_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="p-6 border border-white/10 bg-midnight-950/70 backdrop-blur-md rounded-xl hover:border-electric-cobalt transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="font-mono text-[10px] text-electric-lime uppercase tracking-widest mb-2">
                    {dept.codename}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-electric-lime transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">CORE DOMAINS:</span>
                  {dept.focusAreas.slice(0, 2).map((fa, i) => (
                    <div key={i} className="text-[11px] font-mono text-slate-300">
                      ▹ {fa}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 3D TIMELINE TEASER BAR (14 Verified Milestones) */}
      <section className="py-20 px-6 sm:px-12 border-b border-cobalt/20 bg-midnight-900/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 border border-electric-cobalt/40 rounded-xl bg-midnight-950/90 relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-electric-lime animate-ping" />
                <span className="font-mono text-xs text-electric-lime uppercase tracking-widest font-bold">
                  SPATIAL 3D CHRONICLE ACTIVE
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-white">
                Inspect 14 Verified Society Milestones (2023–2026)
              </h3>
              <p className="text-slate-300 text-sm max-w-2xl">
                Explore our full chronological journey: InnoVortex 1.0 to 4.0, Microsoft MLSA collaborations, SSSC mentorship cohorts, and our university-wide platform launch.
              </p>
            </div>

            <Link
              href="/timeline"
              className="px-8 py-4 bg-electric-lime text-black font-bold font-mono text-sm uppercase rounded-lg hover:bg-lime-400 shadow-[0_0_20px_#D4FF24] transition-all whitespace-nowrap"
            >
              Launch 3D Timeline →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FEATURED EVENT SPOTLIGHT */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
                UPCOMING &amp; PASSES
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-white mt-3">
                EVENT SPOTLIGHT<span className="text-electric-lime">.</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="font-mono text-xs uppercase tracking-widest text-electric-lime hover:underline pb-1"
            >
              All Events &amp; Passes [↗]
            </Link>
          </div>

          {featuredEvent ? (
            <div className="border border-cobalt/40 bg-midnight-950/80 backdrop-blur-md p-8 sm:p-14 rounded-xl relative overflow-hidden group hover:border-electric-lime transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 relative aspect-[4/3] bg-black border border-white/10 rounded-lg overflow-hidden">
                  {featuredEvent.poster_url ? (
                    <img
                      src={featuredEvent.poster_url}
                      alt={featuredEvent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-electric-cobalt/30 to-black text-center">
                      <span className="font-display font-extrabold text-3xl text-white">
                        {featuredEvent.title}
                      </span>
                      <span className="font-mono text-xs text-electric-lime mt-2">
                        OFFICIAL PASS // VERIFIED EVENT
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase rounded bg-electric-lime/20 text-electric-lime border border-electric-lime/40">
                      {getEventTiming(featuredEvent.start_date, featuredEvent.end_date).toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      📍 {featuredEvent.venue || 'IGDTUW Campus, Delhi'}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {featuredEvent.title}
                  </h3>

                  <p className="text-slate-300 font-sans text-base sm:text-lg leading-relaxed">
                    {featuredEvent.short_description ||
                      'Join hundreds of university developers competing in intensive sprint rounds. HMAC cryptographically signed passes available for registered attendees.'}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 uppercase block">START DATE:</span>
                      <span className="text-white font-bold">{formatDate(featuredEvent.start_date)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block">VENUE:</span>
                      <span className="text-electric-lime font-bold">{featuredEvent.venue || 'CAMPUS AUDITORIUM'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block">CHECK-IN:</span>
                      <span className="text-white font-bold">HMAC DYNAMIC QR</span>
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
            <div className="p-16 border border-white/10 bg-midnight-950/70 rounded-xl text-center font-mono text-slate-400">
              [SYSTEM NOTICE: Events are currently being scheduled for the upcoming session.]
            </div>
          )}

          {remainingEvents.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {remainingEvents.map((evt, idx) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.slug}`}
                  className="p-6 border border-white/10 bg-midnight-950/70 rounded-xl hover:border-electric-lime transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-3">
                      <span className="text-electric-lime">[0{idx + 2}]</span>
                      <span>{formatDate(evt.start_date)}</span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-white group-hover:text-electric-lime transition-colors">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {evt.short_description || 'Click to view event details and schedule.'}
                    </p>
                  </div>
                  <div className="pt-4 mt-6 border-t border-white/10 flex justify-between items-center text-xs font-mono text-cobalt-bright">
                    <span>{evt.category}</span>
                    <span className="group-hover:translate-x-1 transition-transform">PASS →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 9. OPPORTUNITY RADAR */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 bg-midnight-950/70 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
                CAREERS // OPPORTUNITIES
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-white mt-3">
                OPPORTUNITY BOARD<span className="text-electric-lime">.</span>
              </h2>
            </div>
            <Link
              href="/opportunities"
              className="font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-white"
            >
              Browse Full Board [↗]
            </Link>
          </div>

          {opportunities && opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-8 border border-white/10 bg-midnight-900/60 rounded-xl flex flex-col justify-between group hover:border-electric-lime transition-all"
                >
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-4">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300">{opp.type}</span>
                      {opp.deadline && (
                        <span className="text-electric-lime font-bold">
                          Due {formatDate(opp.deadline)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mb-1">
                      {opp.title}
                    </h3>
                    <p className="font-mono text-xs text-slate-400 mb-4 font-semibold">
                      {opp.company || 'Host Organization'}
                    </p>
                    {opp.location && (
                      <p className="text-xs text-slate-500 font-mono">📍 {opp.location}</p>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10">
                    {opp.apply_url ? (
                      <a
                        href={opp.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-hollow w-full text-center text-xs py-2.5 block"
                      >
                        Apply Now ↗
                      </a>
                    ) : (
                      <Link
                        href="/opportunities"
                        className="btn-hollow w-full text-center text-xs py-2.5 block"
                      >
                        Inspect Opening
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 border border-white/10 bg-midnight-950/70 rounded-xl text-center font-mono text-slate-400">
              [NO ACTIVE EXTERNAL OPENINGS POSTED · CHECK BACK SOON]
            </div>
          )}
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS (AssetMerkle style) */}
      <section className="py-28 sm:py-36 px-6 sm:px-12 border-b border-cobalt/20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
              KNOWLEDGE BASE // FAQ
            </span>
            <h2 className="editorial-title text-4xl sm:text-6xl text-white mt-3">
              COMMON INQUIRIES<span className="text-electric-lime">.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 border border-white/10 bg-midnight-950/70 backdrop-blur-md rounded-xl">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-electric-lime font-mono">0{idx + 1}.</span>
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. IMMERSIVE CALL TO ACTION */}
      <section className="py-32 sm:py-44 px-6 sm:px-12 relative overflow-hidden text-center z-10">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
            COMMENCE JOIN SEQUENCE
          </span>
          <h2 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            BECOME PART OF THE <span className="text-electric-lime">COLLECTIVE.</span>
          </h2>
          <p className="text-slate-300 font-sans text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Register your student identity, claim HMAC cryptographically verified event passes, and build alongside IGDTUW&apos;s most ambitious developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <MagneticButton href="/signup" strength={30}>
              <span className="btn-magnetic px-10 py-4 text-base">
                Create Student Account →
              </span>
            </MagneticButton>

            <MagneticButton href="/community" strength={20}>
              <span className="btn-hollow px-8 py-4 text-base">
                Community Hub
              </span>
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
