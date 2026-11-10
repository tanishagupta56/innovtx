import Hero from '@/components/Hero';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import MagneticButton from '@/components/MagneticButton';
import ScrollReveal from '@/components/ScrollReveal';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { getEventTiming, formatDate } from '@/lib/utils';
import {
  SOCIETY_STATS,
  SOCIETY_DEPARTMENTS,
  SOCIETY_INITIATIVES,
  WHAT_WE_DO,
  TESTIMONIALS,
  FAQS,
} from '@/data/societyData';
import { TIMELINE_MILESTONES } from '@/data/timelineData';

export default async function HomePage() {
  let dbEvents: any[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('events')
      .select('id, title, slug, short_description, category, start_date, end_date, poster_url, venue')
      .eq('status', 'published')
      .order('start_date', { ascending: false })
      .limit(4);
    if (data && data.length > 0) {
      dbEvents = data;
    }
  } catch {
    // fallback gracefully
  }

  // Fallback to verified events if db is unseeded
  const events = dbEvents.length > 0 ? dbEvents : [
    {
      id: 'innovortex-4',
      title: 'InnoVortex 4.0 Hackathon',
      slug: 'innovortex-4',
      short_description: 'Our annual 36-hour national collegiate hackathon spotlighting Autonomous AI Agents, Decentralized Systems, and Climate Tech.',
      category: 'hackathon',
      start_date: '2026-11-20T09:00:00Z',
      end_date: '2026-11-21T21:00:00Z',
      venue: 'IGDTUW Campus Auditorium & Hybrid',
      poster_url: null,
    },
    {
      id: 'sssc-interview-prep',
      title: 'SSSC Technical Interview Prep Sprint',
      slug: 'sssc-interview-prep',
      short_description: 'Intensive boot camp with senior mentors covering DSA mock interviews, resume critiques, and system design drills.',
      category: 'mentorship',
      start_date: '2026-12-05T14:00:00Z',
      end_date: '2026-12-05T18:00:00Z',
      venue: 'Computer Science Lab 3, IGDTUW',
      poster_url: null,
    },
    {
      id: 'mlsa-cloud-arch',
      title: 'MLSA Azure Cloud Architecture Lab',
      slug: 'mlsa-cloud-arch',
      short_description: 'Hands-on deployment session exploring microservices containerization, CI/CD with GitHub Actions, and free Azure student credits.',
      category: 'workshop',
      start_date: '2026-12-15T10:00:00Z',
      end_date: '2026-12-15T13:00:00Z',
      venue: 'Online Teams & Discord Stage',
      poster_url: null,
    },
  ];

  const featuredEvent = events[0];
  const secondaryEvents = events.slice(1);

  return (
    <div className="relative w-full overflow-hidden bg-deep-ink text-soft-white">
      {/* 1. CINEMATIC HERO WITH OFFICIAL LOGO & LIGHT FIELD INTEGRATION */}
      <Hero />

      {/* 2. DUAL-DIRECTION CONTINUOUS MARQUEE */}
      <section className="relative z-20">
        <InfiniteMarquee
          items={[
            'TECHNEEDS IGDTUW',
            'LEARN. BUILD. EXPLORE. CONNECT.',
            'INNOVORTEX ARENA',
            'SSSC MENTORSHIP CADRE',
            '21-DAY CS SPRINT',
            'SYSTEM ARCHITECTS',
            'LIGHT FIELD ACTIVE',
          ]}
          speed={22}
          bordered={true}
        />
      </section>

      {/* 3. ABOUT TECHNEEDS (Cinematic Narrative Introduction) */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Mission Badge & Sticky Title */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-ice-cyan rounded-full animate-ping" />
                <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                  02 // ABOUT THE SOCIETY
                </span>
              </div>

              <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white leading-tight">
                ARCHITECTING THE FUTURE OF <br />
                <span className="text-ice-cyan">WOMEN IN TECH.</span>
              </h2>

              <p className="font-mono text-xs text-slate-400 uppercase tracking-widest leading-relaxed">
                ESTABLISHED AT INDIRA GANDHI DELHI TECHNICAL UNIVERSITY FOR WOMEN. BRIDGING CLASSROOM THEORY WITH 36-HOUR PRODUCTION SPRINT DEPLOYS.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ice-cyan hover:underline font-bold"
                >
                  Explore Complete Society Manifesto →
                </Link>
              </div>
            </div>

            {/* Right Column: Narrative Overview with Editorial Cards */}
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal direction="up" distance={25}>
                <div className="p-8 sm:p-10 border border-charcoal-border bg-charcoal/70 rounded-2xl relative overflow-hidden group hover:border-ice-cyan transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-ice-cyan uppercase font-bold tracking-widest">
                      FOUNDATIONAL PURPOSE
                    </span>
                    <span className="font-mono text-sm text-slate-500">IGDTUW / DELHI</span>
                  </div>
                  <h3 className="text-2xl font-bold text-soft-white mb-3">
                    A Student-Driven Technology Ecosystem
                  </h3>
                  <p className="text-slate-300 font-sans text-base leading-relaxed">
                    TechNeeds IGDTUW is the official innovation society dedicated to accelerating technical excellence among undergraduate women engineers. We operate student-led mentorship cohorts, curate regional collegiate hackathons, and maintain open engineering knowledge platforms.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" distance={25} delay={0.15}>
                <div className="p-8 sm:p-10 border border-charcoal-border bg-charcoal/70 rounded-2xl relative overflow-hidden group hover:border-ice-cyan transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-electric-blue-light uppercase font-bold tracking-widest">
                      CORE PEDAGOGY
                    </span>
                    <span className="font-mono text-sm text-slate-500">PEER-LED</span>
                  </div>
                  <h3 className="text-2xl font-bold text-soft-white mb-3">
                    Hands-On Code Over Theoretical Passive Learning
                  </h3>
                  <p className="text-slate-300 font-sans text-base leading-relaxed">
                    We believe real engineering mastery is forged when students ship real code to production, participate in code reviews, debug distributed systems, and pitch before industry leaders.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE DO (4 Editorial Pillars) */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                03 // CAPABILITIES & OPERATIONS
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
                WHAT WE DO<span className="text-ice-cyan">.</span>
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              FOUR CORE TENETS OF TECHNEEDS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WHAT_WE_DO.map((item, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-10 border border-charcoal-border bg-charcoal/60 rounded-2xl relative overflow-hidden group hover:border-ice-cyan transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-bold text-electric-blue-light">
                      {item.num}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-charcoal border border-charcoal-border text-slate-300">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-soft-white group-hover:text-ice-cyan transition-colors mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-charcoal-border flex items-center justify-between font-mono text-xs text-slate-500">
                  <span>DISCIPLINE: VERIFIED</span>
                  <span className="text-ice-cyan group-hover:translate-x-1 transition-transform">
                    EXPLORE →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR IMPACT (Full-Bleed Metrics Telemetry Grid) */}
      <section className="py-20 px-6 sm:px-12 border-b border-charcoal-border bg-charcoal/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
              04 // VERIFIED IMPACT
            </span>
            <h2 className="editorial-title text-3xl sm:text-5xl text-soft-white mt-3">
              BY THE NUMBERS<span className="text-ice-cyan">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {SOCIETY_STATS.map((stat, i) => (
              <div
                key={i}
                className="p-8 border border-charcoal-border bg-deep-ink/90 rounded-2xl relative group hover:border-ice-cyan transition-all text-center"
              >
                <span className="text-4xl sm:text-6xl font-mono font-black text-ice-cyan tracking-tight block mb-2 drop-shadow-[0_0_20px_rgba(117,230,255,0.3)]">
                  {stat.number}
                </span>
                <span className="text-sm sm:text-base font-bold text-soft-white uppercase tracking-wider block font-mono">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-400 mt-2 block font-sans">
                  {stat.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED PROGRAMMES (InnoVortex, SSSC, 21-Day CS Sprint, Open Source) */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                05 // SIGNATURE COHORTS
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
                FEATURED PROGRAMMES<span className="text-ice-cyan">.</span>
              </h2>
            </div>
            <Link
              href="/initiatives"
              className="font-mono text-xs uppercase tracking-widest text-ice-cyan hover:underline pb-1 font-bold"
            >
              All Programmes [↗]
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SOCIETY_INITIATIVES.map((init) => (
              <div
                key={init.id}
                className="p-8 sm:p-10 border border-charcoal-border bg-charcoal/60 rounded-2xl relative overflow-hidden group hover:border-ice-cyan transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-ice-cyan/15 text-ice-cyan border border-ice-cyan/30">
                      {init.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {init.subtitle}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-soft-white group-hover:text-ice-cyan transition-colors">
                    {init.title}
                  </h3>

                  <p className="text-slate-300 text-sm mt-3 leading-relaxed font-sans">
                    {init.description}
                  </p>

                  <div className="mt-5 pt-3 border-t border-charcoal-border text-xs font-mono text-ice-cyan font-bold">
                    📊 {init.metrics}
                  </div>
                </div>

                <div className="mt-6 pt-4 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {init.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 text-[10px] font-mono text-slate-400 bg-charcoal rounded border border-charcoal-border">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={init.link}
                    className="font-mono text-xs text-ice-cyan group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURED EVENTS & PASSES */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink/90">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                06 // UPCOMING &amp; CURRENT
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
                FEATURED EVENTS<span className="text-ice-cyan">.</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="font-mono text-xs uppercase tracking-widest text-ice-cyan hover:underline pb-1 font-bold"
            >
              Browse Event Calendar [↗]
            </Link>
          </div>

          {featuredEvent && (
            <div className="border border-charcoal-border bg-charcoal/70 p-8 sm:p-12 rounded-2xl relative overflow-hidden group hover:border-ice-cyan transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 relative aspect-[4/3] bg-black border border-charcoal-border rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-electric-blue/20 to-black text-center">
                  <span className="font-display font-extrabold text-3xl text-soft-white">
                    {featuredEvent.title}
                  </span>
                  <span className="font-mono text-xs text-ice-cyan mt-3">
                    OFFICIAL HACKATHON PASS // VERIFIED ENTRY
                  </span>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded bg-ice-cyan/20 text-ice-cyan border border-ice-cyan/40">
                      {getEventTiming(featuredEvent.start_date, featuredEvent.end_date).toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      📍 {featuredEvent.venue || 'IGDTUW Campus, Delhi'}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-soft-white tracking-tight">
                    {featuredEvent.title}
                  </h3>

                  <p className="text-slate-300 font-sans text-base leading-relaxed">
                    {featuredEvent.short_description}
                  </p>

                  <div className="pt-4 border-t border-charcoal-border flex flex-wrap items-center gap-6 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 uppercase block">DATE:</span>
                      <span className="text-soft-white font-bold">{formatDate(featuredEvent.start_date)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block">VENUE:</span>
                      <span className="text-ice-cyan font-bold">{featuredEvent.venue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase block">ENTRY:</span>
                      <span className="text-soft-white font-bold">HMAC DYNAMIC QR</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <MagneticButton href={`/events/${featuredEvent.slug}`}>
                      <span className="px-6 py-3.5 bg-ice-cyan text-deep-ink font-mono text-xs font-bold uppercase tracking-wider rounded-md inline-block shadow-[0_0_15px_rgba(117,230,255,0.35)]">
                        Register For Event Pass →
                      </span>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Events Grid */}
          {secondaryEvents.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryEvents.map((evt, idx) => (
                <Link
                  key={evt.id}
                  href={`/events/${evt.slug}`}
                  className="p-8 border border-charcoal-border bg-charcoal/60 rounded-xl hover:border-ice-cyan transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-3">
                      <span className="text-ice-cyan">[0{idx + 2}] // {evt.category.toUpperCase()}</span>
                      <span>{formatDate(evt.start_date)}</span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-soft-white group-hover:text-ice-cyan transition-colors">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 font-sans">
                      {evt.short_description}
                    </p>
                  </div>
                  <div className="pt-4 mt-6 border-t border-charcoal-border flex justify-between items-center text-xs font-mono text-ice-cyan font-bold">
                    <span>📍 {evt.venue}</span>
                    <span className="group-hover:translate-x-1 transition-transform">CLAIM PASS →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. INNOVORTEX SPOTLIGHT (Signature Hackathon Arena) */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink">
        <div className="max-w-7xl mx-auto">
          <div className="p-10 sm:p-16 border border-electric-blue/40 bg-charcoal/80 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-ice-cyan/15 text-ice-cyan border border-ice-cyan/30 rounded">
                    FLAGSHIP SPOTLIGHT
                  </span>
                  <span className="font-mono text-xs text-slate-400 uppercase">
                    INNOVORTEX HACKATHON SERIES
                  </span>
                </div>

                <h2 className="editorial-title text-4xl sm:text-6xl font-black text-soft-white tracking-tight">
                  INNOVORTEX: <br />
                  <span className="text-ice-cyan">THE ARENA OF BUILDERS.</span>
                </h2>

                <p className="text-slate-300 font-sans text-base sm:text-lg leading-relaxed">
                  From our 2023 campus ideathon to multi-campus iterations hosted at IIIT Delhi, InnoVortex brings together over 1,200 applicants and 90+ finalist teams to solve challenging problems in Autonomous AI, Climate Tech, and Distributed Systems.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-charcoal-border font-mono text-center">
                  <div className="p-4 bg-deep-ink/80 rounded-xl border border-charcoal-border">
                    <span className="text-2xl sm:text-3xl font-bold text-soft-white block">4</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">Editions</span>
                  </div>
                  <div className="p-4 bg-deep-ink/80 rounded-xl border border-charcoal-border">
                    <span className="text-2xl sm:text-3xl font-bold text-ice-cyan block">1,200+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">Hackers</span>
                  </div>
                  <div className="p-4 bg-deep-ink/80 rounded-xl border border-charcoal-border">
                    <span className="text-2xl sm:text-3xl font-bold text-soft-white block">₹2.5L+</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">Prizes</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/events"
                    className="px-6 py-3.5 bg-ice-cyan text-deep-ink font-mono text-xs font-bold uppercase tracking-wider rounded-md hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(117,230,255,0.4)]"
                  >
                    View InnoVortex Editions →
                  </Link>
                  <Link
                    href="/timeline"
                    className="px-6 py-3.5 bg-charcoal border border-charcoal-border text-soft-white font-mono text-xs font-bold uppercase tracking-wider rounded-md hover:border-ice-cyan transition-colors"
                  >
                    Inspect 3D Hackathon History
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-deep-ink/90 border border-charcoal-border rounded-2xl text-center space-y-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                  <Image
                    src="/brand/techneeds-logo.png"
                    alt="InnoVortex Brand"
                    fill
                    sizes="112px"
                    className="object-contain drop-shadow-[0_0_20px_rgba(117,230,255,0.5)]"
                  />
                </div>
                <h4 className="font-display font-bold text-xl text-soft-white">
                  InnoVortex 4.0 Registration
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Autonomous agents, climate robotics, distributed compute tracks. Fast-track reviews for IGDTUW teams.
                </p>
                <span className="px-3 py-1 bg-charcoal border border-charcoal-border text-ice-cyan font-mono text-xs rounded-full">
                  STATUS: APPLICATIONS ROLLING
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE HISTORICAL TIMELINE PREVIEW (DO NOT DESTROY 3D TIMELINE!) */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink/95">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                08 // SPATIAL ARCHIVE
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
                CHRONOLOGICAL TIMELINE<span className="text-ice-cyan">.</span>
              </h2>
            </div>
            <Link
              href="/timeline"
              className="px-6 py-2.5 bg-ice-cyan text-deep-ink font-mono text-xs font-bold uppercase rounded-md hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(117,230,255,0.4)]"
            >
              Launch Full 3D Timeline →
            </Link>
          </div>

          <div className="p-8 sm:p-12 border border-charcoal-border bg-charcoal/70 rounded-2xl relative">
            <p className="text-slate-300 font-sans text-base max-w-3xl mb-8">
              Explore 14 verified society milestones mapped along an undulating 3D spline from September 2023 to the present. Scrub through years, filter by track, and inspect outcomes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TIMELINE_MILESTONES.slice(0, 3).map((m) => (
                <div key={m.id} className="p-6 bg-deep-ink/80 rounded-xl border border-charcoal-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-ice-cyan font-bold">{m.year} · {m.month}</span>
                    <span className="px-2 py-0.5 rounded bg-charcoal text-[10px] uppercase text-slate-400">
                      {m.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-soft-white text-lg">{m.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. MEET OUR COMMUNITY */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                09 // THE COLLECTIVE
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
                MEET OUR COMMUNITY<span className="text-ice-cyan">.</span>
              </h2>
            </div>
            <Link
              href="/community"
              className="font-mono text-xs uppercase tracking-widest text-ice-cyan hover:underline pb-1 font-bold"
            >
              Explore Community Hub [↗]
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-4 block">💬</span>
                <h3 className="text-xl font-bold text-soft-white mb-2">Discord Server</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Real-time project troubleshooting, system architecture debates, and hackathon team formations.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-charcoal-border font-mono text-xs text-ice-cyan">
                950+ Engineers Active
              </div>
            </div>

            <div className="p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-4 block">📢</span>
                <h3 className="text-xl font-bold text-soft-white mb-2">WhatsApp Matrix</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Instant alerts for event pass drops, cohort applications, and internship opportunities.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-charcoal-border font-mono text-xs text-ice-cyan">
                1,200+ Members Broadcast
              </div>
            </div>

            <div className="p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-4 block">🐙</span>
                <h3 className="text-xl font-bold text-soft-white mb-2">GitHub Org</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Society open-source repositories, platform tooling, and student code templates.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-charcoal-border font-mono text-xs text-ice-cyan">
                40+ Public Repos
              </div>
            </div>

            <div className="p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-4 block">💼</span>
                <h3 className="text-xl font-bold text-soft-white mb-2">LinkedIn Network</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Verified alumni updates, corporate partnerships, and technical career achievements.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-charcoal-border font-mono text-xs text-ice-cyan">
                1,500+ Connections
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TECHBOARD & LEARNING RESOURCES PREVIEW */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink/90">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                10 // KNOWLEDGE ARSENAL
              </span>
              <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
                TECHBOARD RESOURCES<span className="text-ice-cyan">.</span>
              </h2>
            </div>
            <Link
              href="/resources"
              className="font-mono text-xs uppercase tracking-widest text-ice-cyan hover:underline pb-1 font-bold"
            >
              Open Full TechBoard [↗]
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl space-y-4">
              <span className="px-2 py-0.5 rounded bg-charcoal border border-charcoal-border text-[10px] font-mono text-ice-cyan uppercase">
                CORE CS // SPRINT
              </span>
              <h3 className="text-xl font-bold text-soft-white">21-Day CS Fundamentals Guide</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Curated question sets, visual architecture sheets, and peer review problems covering Operating Systems, DBMS, Networks, and OOP.
              </p>
              <Link href="/resources" className="text-xs font-mono text-ice-cyan font-bold block pt-2">
                Access Sheets →
              </Link>
            </div>

            <div className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl space-y-4">
              <span className="px-2 py-0.5 rounded bg-charcoal border border-charcoal-border text-[10px] font-mono text-ice-cyan uppercase">
                DSA IN C/C++ // ROADMAP
              </span>
              <h3 className="text-xl font-bold text-soft-white">Data Structures Master Roadmap</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Structured pathway led by experienced cohort leads covering Leetcode patterns, recursion trees, dynamic programming, and graphs.
              </p>
              <Link href="/resources" className="text-xs font-mono text-ice-cyan font-bold block pt-2">
                Access Roadmap →
              </Link>
            </div>

            <div className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl space-y-4">
              <span className="px-2 py-0.5 rounded bg-charcoal border border-charcoal-border text-[10px] font-mono text-ice-cyan uppercase">
                OPEN SOURCE // TOOLKIT
              </span>
              <h3 className="text-xl font-bold text-soft-white">Git &amp; Upstream Hygiene Handbook</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Practical drills on Git merge conflicts, interactive rebasing, writing clear pull request descriptions, and GSSoC workflows.
              </p>
              <Link href="/resources" className="text-xs font-mono text-ice-cyan font-bold block pt-2">
                Access Handbook →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. TESTIMONIALS (Voices of Mentees & Builders) */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-deep-ink">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
              11 // VOICES OF THE COMMUNITY
            </span>
            <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
              WHAT OUR BUILDERS SAY<span className="text-ice-cyan">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col justify-between group hover:border-ice-cyan transition-all"
              >
                <div>
                  <span className="text-3xl text-ice-cyan font-serif leading-none block mb-4">“</span>
                  <p className="text-slate-300 text-sm leading-relaxed font-sans mb-6">
                    {t.quote}
                  </p>
                </div>

                <div className="pt-4 border-t border-charcoal-border font-mono">
                  <p className="text-sm font-bold text-soft-white">{t.author}</p>
                  <p className="text-[11px] text-ice-cyan">{t.role}</p>
                  <p className="text-[10px] text-slate-500">{t.batch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. COLLABORATE & SPONSOR CALLOUT */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 border-b border-charcoal-border relative z-10 bg-charcoal/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="p-10 sm:p-14 border border-charcoal-border bg-deep-ink rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
                12 // PARTNERSHIPS
              </span>
              <h2 className="editorial-title text-3xl sm:text-5xl text-soft-white">
                Partner with TechNeeds IGDTUW<span className="text-ice-cyan">.</span>
              </h2>
              <p className="text-slate-400 text-sm font-sans leading-relaxed">
                Empower premier women software architects and researchers. Connect through hackathon sponsorships, technical workshops, and direct campus recruitment pipelines.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/collaborate"
                className="px-6 py-3.5 bg-ice-cyan text-deep-ink font-mono text-xs font-bold uppercase rounded-md hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(117,230,255,0.4)] text-center"
              >
                Partnership Packages →
              </Link>
              <a
                href="mailto:techneedsigdtuw@gmail.com"
                className="px-6 py-3.5 bg-charcoal border border-charcoal-border text-soft-white font-mono text-xs font-bold uppercase rounded-md hover:border-ice-cyan transition-colors text-center"
              >
                Email Corporate Team ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 sm:py-36 px-6 sm:px-12 relative z-10 bg-deep-ink">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
              13 // KNOWLEDGE BASE
            </span>
            <h2 className="editorial-title text-4xl sm:text-6xl text-soft-white mt-3">
              FREQUENT QUESTIONS<span className="text-ice-cyan">.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 border border-charcoal-border bg-charcoal/70 rounded-xl">
                <h4 className="text-lg font-bold text-soft-white mb-2 flex items-center gap-2">
                  <span className="text-ice-cyan font-mono">0{idx + 1}.</span>
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed pl-7 font-sans">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="font-mono text-xs text-ice-cyan uppercase tracking-widest hover:underline font-bold"
            >
              Browse Complete Helpdesk &amp; FAQ Accordion →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
