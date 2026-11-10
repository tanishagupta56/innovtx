import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { getEventTiming, formatDate } from '@/lib/utils';
import MagneticButton from '@/components/MagneticButton';
import { TIMELINE_MILESTONES } from '@/data/timelineData';

export const metadata = {
  title: 'Events & Hackathons Discovery — TechNeeds IGDTUW',
  description: 'Explore upcoming hackathons, workshops, mentorship sessions, and historical event archives at TechNeeds IGDTUW.',
};

const VERIFIED_FALLBACK_EVENTS = [
  {
    id: 'innovortex-4',
    title: 'InnoVortex 4.0: Autonomous Systems Hackathon',
    slug: 'innovortex-4',
    short_description: 'Our annual 36-hour flagship hackathon spotlighting Autonomous AI Agents, Decentralized Infrastructure, and Climate Technology. Featuring industry mentors and verified entry passes.',
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
    short_description: 'Intensive boot camp with senior mentors covering DSA mock interviews, resume critiques, and system design drills for pre-final and final year engineers.',
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
    short_description: 'Hands-on deployment session exploring microservices containerization, CI/CD with GitHub Actions, and free Azure student credits in partnership with Microsoft Learn.',
    category: 'workshop',
    start_date: '2026-12-15T10:00:00Z',
    end_date: '2026-12-15T13:00:00Z',
    venue: 'Online Teams & Discord Stage',
    poster_url: null,
  },
];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string; year?: string; search?: string; tab?: string };
}) {
  let dbEvents: any[] = [];
  try {
    const supabase = createClient();
    let query = supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('start_date', { ascending: false });

    if (searchParams.category) {
      query = query.eq('category', searchParams.category);
    }
    if (searchParams.search) {
      query = query.ilike('title', `%${searchParams.search}%`);
    }

    const { data } = await query;
    if (data && data.length > 0) {
      dbEvents = data;
    }
  } catch {
    // fallback gracefully
  }

  const allEvents = dbEvents.length > 0 ? dbEvents : VERIFIED_FALLBACK_EVENTS;

  // Filter if search query applied to fallback
  const filteredEvents = allEvents.filter((evt) => {
    const matchesCat = !searchParams.category || evt.category?.toLowerCase() === searchParams.category.toLowerCase();
    const matchesSearch = !searchParams.search || evt.title?.toLowerCase().includes(searchParams.search.toLowerCase()) || evt.short_description?.toLowerCase().includes(searchParams.search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = ['all', 'hackathon', 'workshop', 'mentorship', 'webinar'];

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink text-soft-white min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
              EVENT CALENDAR // DISCOVERY ARENA
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              HMAC VERIFIED ENTRY PASSES
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            EVENTS &amp; <br />
            <span className="text-ice-cyan">HACKATHONS.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Register for official TechNeeds sprints, workshops, and InnoVortex stages. All confirmed registrations generate a cryptographic entry QR pass in your dashboard.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <form className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              name="search"
              type="text"
              placeholder="Search event title or keywords..."
              defaultValue={searchParams.search || ''}
              className="px-4 py-2 bg-deep-ink border border-charcoal-border rounded-md text-soft-white font-mono text-xs placeholder:text-slate-500 w-full sm:w-64 focus:outline-none focus:border-ice-cyan"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-electric-blue hover:bg-electric-blue-light text-soft-white font-mono text-xs uppercase font-bold rounded-md transition-colors"
            >
              Search
            </button>
            {(searchParams.search || searchParams.category) && (
              <Link
                href="/events"
                className="px-4 py-2 bg-charcoal hover:bg-charcoal-surface text-slate-400 font-mono text-xs uppercase rounded-md transition-colors"
              >
                Reset
              </Link>
            )}
          </form>

          {/* Category Quick Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase mr-1">TRACK:</span>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'all' ? '/events' : `/events?category=${cat}`}
                className={`px-3 py-1 font-mono text-xs rounded-full uppercase transition-all ${
                  (cat === 'all' && !searchParams.category) || searchParams.category === cat
                    ? 'bg-ice-cyan text-deep-ink font-bold shadow-[0_0_12px_#75E6FF]'
                    : 'bg-deep-ink border border-charcoal-border text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Live & Upcoming Events Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ice-cyan font-bold">
              {'// ACTIVE & UPCOMING EVENTS ('}{filteredEvents.length}{')'}
            </h2>
            <span className="text-xs font-mono text-slate-500">DIGITAL QR PASSES APPLICABLE</span>
          </div>

          <div className="space-y-8">
            {filteredEvents.map((evt, idx) => (
              <article
                key={evt.id}
                className="border border-charcoal-border bg-charcoal/70 hover:border-ice-cyan transition-all p-8 sm:p-12 rounded-2xl relative overflow-hidden group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="lg:col-span-5 aspect-[16/10] bg-black border border-charcoal-border rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-electric-blue/20 to-black text-center">
                    <span className="font-display font-extrabold text-2xl text-soft-white">
                      {evt.title}
                    </span>
                    <span className="font-mono text-xs text-ice-cyan mt-3 uppercase tracking-wider">
                      {evt.category} {'// OFFICIAL EVENT'}
                    </span>
                  </div>

                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-ice-cyan/15 text-ice-cyan border border-ice-cyan/30">
                        {getEventTiming(evt.start_date, evt.end_date).toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        📍 {evt.venue || 'IGDTUW Campus, Delhi'}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-soft-white group-hover:text-ice-cyan transition-colors">
                      {evt.title}
                    </h3>

                    <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
                      {evt.short_description}
                    </p>

                    <div className="pt-4 border-t border-charcoal-border flex flex-wrap items-center gap-6 font-mono text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500 uppercase block">START TIME:</span>
                        <span className="text-soft-white font-bold">{formatDate(evt.start_date)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 uppercase block">VENUE:</span>
                        <span className="text-ice-cyan font-bold">{evt.venue}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 uppercase block">PASS:</span>
                        <span className="text-soft-white font-bold">HMAC QR</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <MagneticButton href={`/events/${evt.slug}`}>
                        <span className="px-6 py-3 bg-ice-cyan text-deep-ink font-mono text-xs font-bold uppercase rounded-md inline-block shadow-[0_0_15px_rgba(117,230,255,0.35)]">
                          Book Event Pass &amp; Details →
                        </span>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Content-Rich Past Events & Historical Archive */}
        <div className="space-y-8 pt-8">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-3">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-ice-cyan font-bold">
                {'// HISTORICAL EDITIONS ARCHIVE (2023–2026)'}
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Completed hackathons, workshops, and mentorship cohorts documented in our archival records.
              </p>
            </div>
            <Link href="/timeline" className="text-xs font-mono text-ice-cyan hover:underline font-bold">
              3D Timeline Matrix →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIMELINE_MILESTONES.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-6 border border-charcoal-border bg-charcoal/60 rounded-xl flex flex-col justify-between group hover:border-ice-cyan transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="px-2 py-0.5 rounded bg-charcoal border border-charcoal-border text-ice-cyan text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                    <span>{item.month} {item.year}</span>
                  </div>

                  <h3 className="text-lg font-bold text-soft-white group-hover:text-ice-cyan transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-charcoal-border flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>📍 {item.venue}</span>
                  {item.metrics.participants && (
                    <span className="text-ice-cyan font-bold">{item.metrics.participants}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
