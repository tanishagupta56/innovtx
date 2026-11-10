import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { getEventTiming, formatDate } from '@/lib/utils';
import MagneticButton from '@/components/MagneticButton';

export const metadata = { title: 'Events & Hackathons — TechNeeds IGDTUW' };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { category?: string; year?: string; search?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: false });

  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }
  if (searchParams.year) {
    const y = parseInt(searchParams.year);
    query = query.gte('start_date', `${y}-01-01`).lt('start_date', `${y + 1}-01-01`);
  }
  if (searchParams.search) {
    query = query.ilike('title', `%${searchParams.search}%`);
  }

  const { data: events } = await query;

  // Extract categories and years for dynamic filters
  const { data: allEvents } = await supabase
    .from('events')
    .select('category, start_date')
    .eq('status', 'published');

  const categories = Array.from(new Set(allEvents?.map((e) => e.category) || []));
  const years = Array.from(
    new Set(allEvents?.map((e) => new Date(e.start_date).getFullYear()) || [])
  ).sort((a, b) => b - a);

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="border-b border-cobalt/25 pb-12 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-telemetry-lime">CALENDAR // REPOSITORY</span>
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
              HMAC VERIFIED DIGITAL PASSES
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            EVENTS &amp; <br />
            <span className="text-lime">HACKATHONS.</span>
          </h1>

          <p className="mt-4 text-gray-400 font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            Register for official TechNeeds sprints, workshops, and InnoVortex stages. All confirmed registrations generate a cryptographic entry QR pass in your dashboard.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <form className="flex flex-wrap gap-3 mb-14 font-mono text-xs">
          <input
            name="search"
            type="text"
            placeholder="Search event title..."
            defaultValue={searchParams.search || ''}
            className="input-field max-w-xs font-mono text-xs"
          />

          <select
            name="category"
            defaultValue={searchParams.category || ''}
            className="input-field max-w-[180px] font-mono text-xs"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="year"
            defaultValue={searchParams.year || ''}
            className="input-field max-w-[140px] font-mono text-xs"
          >
            <option value="">All Years</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-magnetic-cobalt py-2.5 px-6 font-mono text-xs uppercase">
            Filter Roster
          </button>

          {(searchParams.search || searchParams.category || searchParams.year) && (
            <Link
              href="/events"
              className="btn-hollow py-2.5 px-4 font-mono text-xs uppercase flex items-center"
            >
              Reset
            </Link>
          )}
        </form>

        {/* Asymmetric Editorial Events Roster */}
        {events && events.length > 0 ? (
          <div className="space-y-12">
            {events.map((evt, index) => {
              const timing = getEventTiming(evt.start_date, evt.end_date);
              const isEven = index % 2 === 0;

              return (
                <article
                  key={evt.id}
                  className="border border-cobalt/25 bg-[#050816] hover:border-lime/40 transition-all p-8 sm:p-12 relative overflow-hidden group"
                >
                  {/* Watermark Index Number */}
                  <span className="absolute top-4 right-6 font-display font-black text-6xl sm:text-8xl text-cobalt/10 select-none pointer-events-none group-hover:text-lime/10 transition-colors">
                    0{index + 1}
                  </span>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Visual Poster Frame */}
                    <div
                      className={`lg:col-span-5 aspect-[16/10] bg-black border border-cobalt/30 overflow-hidden relative ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      {evt.poster_url ? (
                        <img
                          src={evt.poster_url}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cobalt/30 to-black text-center">
                          <span className="font-display font-extrabold text-2xl text-white">
                            {evt.title}
                          </span>
                          <span className="font-mono text-[10px] text-lime mt-1 uppercase">
                            OFFICIAL KEYNOTE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div
                      className={`lg:col-span-7 space-y-5 ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`font-mono text-xs px-2.5 py-0.5 border ${
                            timing === 'upcoming'
                              ? 'bg-lime/10 text-lime border-lime/30'
                              : timing === 'ongoing'
                              ? 'bg-cobalt/20 text-cobalt-300 border-cobalt/40'
                              : 'bg-gray-800 text-gray-500 border-gray-700'
                          }`}
                        >
                          {timing.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs text-gray-400 uppercase">
                          {'// ' + evt.category}
                        </span>
                        {evt.venue && (
                          <span className="font-mono text-xs text-gray-500">
                            📍 {evt.venue}
                          </span>
                        )}
                      </div>

                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white group-hover:text-lime transition-colors">
                        <Link href={`/events/${evt.slug}`}>{evt.title}</Link>
                      </h2>

                      <p className="text-gray-300 font-body text-base leading-relaxed line-clamp-3">
                        {evt.short_description ||
                          'Full technical agenda, hackathon tracks, judging criteria, and digital passes available on the event overview page.'}
                      </p>

                      <div className="pt-4 border-t border-cobalt/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                        <div>
                          <span className="text-gray-500 uppercase block text-[10px]">SCHEDULE:</span>
                          <span className="text-white font-bold">{formatDate(evt.start_date)}</span>
                        </div>

                        <Link
                          href={`/events/${evt.slug}`}
                          className="btn-magnetic text-xs py-2.5 px-6 font-mono"
                        >
                          Access Event Pass &amp; Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-20 border border-cobalt/25 bg-[#050814] text-center font-mono">
            <p className="text-gray-400 text-lg mb-2">No events match the selected filter criteria.</p>
            <p className="text-gray-600 text-xs">Try selecting a different year or category above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
