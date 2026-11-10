import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { getEventTiming, formatDate } from '@/lib/utils';

export const metadata = { title: 'Events — TechNeeds IGDTUW' };

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

  // Get unique categories and years for filters
  const { data: allEvents } = await supabase
    .from('events')
    .select('category, start_date')
    .eq('status', 'published');

  const categories = [...new Set(allEvents?.map((e) => e.category) || [])];
  const years = [...new Set(allEvents?.map((e) => new Date(e.start_date).getFullYear()) || [])].sort((a, b) => b - a);

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">Discover</p>
          <h1 className="section-heading text-white">Events</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          <form className="flex flex-wrap gap-3 w-full md:w-auto">
            <input
              name="search"
              type="text"
              placeholder="Search events..."
              defaultValue={searchParams.search || ''}
              className="input-field max-w-xs"
            />
            <select name="category" defaultValue={searchParams.category || ''} className="input-field max-w-[180px]">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select name="year" defaultValue={searchParams.year || ''} className="input-field max-w-[140px]">
              <option value="">All Years</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary py-2 px-4 text-sm">Filter</button>
            {(searchParams.search || searchParams.category || searchParams.year) && (
              <Link href="/events" className="btn-ghost py-2 px-4 text-sm">Clear</Link>
            )}
          </form>
        </div>

        {/* Events grid */}
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const timing = getEventTiming(event.start_date, event.end_date);
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group card"
                >
                  {event.poster_url && (
                    <div className="aspect-[16/9] mb-4 overflow-hidden bg-charcoal">
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-mono px-2 py-0.5 ${
                      timing === 'upcoming' ? 'bg-lime/10 text-lime' :
                      timing === 'ongoing' ? 'bg-cobalt/10 text-cobalt-300' :
                      'bg-gray-800 text-gray-500'
                    }`}>
                      {timing.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-600">{event.category}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white group-hover:text-lime transition-colors">
                    {event.title}
                  </h3>
                  {event.short_description && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{event.short_description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-gray-600 text-xs font-mono">
                    <span>{formatDate(event.start_date)}</span>
                    {event.venue && <span>· {event.venue}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-16">
            <p className="text-gray-500">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
