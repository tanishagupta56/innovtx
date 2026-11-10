import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = { title: 'Opportunities & Careers — TechNeeds IGDTUW' };

const typeLabels: Record<string, string> = {
  internship: 'Internship',
  job: 'Full-Time Job',
  fellowship: 'Fellowship',
  competition: 'Hackathon / Contest',
  workshop: 'Workshop',
  other: 'Opportunity',
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { type?: string; search?: string; sort?: string };
}) {
  const supabase = createClient();
  const now = new Date().toISOString();

  // Query published non-expired opportunities
  let query = supabase
    .from('opportunities')
    .select('*')
    .eq('is_published', true)
    .or(`deadline.gte.${now},deadline.is.null`);

  if (searchParams.type) {
    query = query.eq('type', searchParams.type);
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,company.ilike.%${searchParams.search}%`);
  }

  if (searchParams.sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('deadline', { ascending: true, nullsFirst: false });
  }

  const { data: opportunities } = await query;

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-cobalt/25 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-telemetry-lime">RADAR // PIPELINE</span>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              CAREERS &amp; GRANTS
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            OPPORTUNITY <br />
            <span className="text-lime">RADAR.</span>
          </h1>

          <p className="mt-4 text-gray-300 font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            Curated internships, hackathons, engineering fellowships, and industry research positions hand-selected for the IGDTUW community.
          </p>
        </div>

        {/* Filter bar */}
        <form className="flex flex-wrap gap-3 mb-12 font-mono text-xs">
          <input
            name="search"
            type="text"
            placeholder="Search role or company..."
            defaultValue={searchParams.search || ''}
            className="input-field max-w-xs font-mono text-xs"
          />

          <select
            name="type"
            defaultValue={searchParams.type || ''}
            className="input-field max-w-[200px] font-mono text-xs"
          >
            <option value="">All Opportunity Types</option>
            <option value="internship">Internships</option>
            <option value="job">Full-Time Roles</option>
            <option value="fellowship">Fellowships</option>
            <option value="competition">Hackathons &amp; Contests</option>
            <option value="workshop">Workshops</option>
            <option value="other">Other Openings</option>
          </select>

          <select
            name="sort"
            defaultValue={searchParams.sort || 'deadline'}
            className="input-field max-w-[180px] font-mono text-xs"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="newest">Recently Published</option>
          </select>

          <button type="submit" className="btn-magnetic-cobalt py-2.5 px-6 font-mono text-xs uppercase">
            Filter Radar
          </button>

          {(searchParams.search || searchParams.type || searchParams.sort) && (
            <Link
              href="/opportunities"
              className="btn-hollow py-2.5 px-4 font-mono text-xs uppercase flex items-center"
            >
              Reset
            </Link>
          )}
        </form>

        {/* Opportunities Matrix */}
        {opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((item) => (
              <div
                key={item.id}
                className="p-8 border border-cobalt/25 bg-[#050816] hover:border-lime/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="tag-telemetry text-lime uppercase font-bold text-[10px]">
                      {typeLabels[item.type] || item.type}
                    </span>
                    {item.deadline && (
                      <span className="font-mono text-xs text-lime">
                        Due {formatDate(item.deadline)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white mb-1 group-hover:text-lime transition-colors">
                    {item.title}
                  </h3>

                  {item.company && (
                    <p className="font-mono text-xs text-gray-400 mb-3 font-semibold">
                      {item.company}
                    </p>
                  )}

                  {item.location && (
                    <p className="text-xs text-gray-500 font-mono mb-4">
                      📍 {item.location}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-gray-400 font-body text-sm line-clamp-3 mb-6 leading-relaxed whitespace-pre-wrap">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-cobalt/15">
                  {item.apply_url ? (
                    <a
                      href={item.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-magnetic w-full text-center text-xs py-2.5 font-mono"
                    >
                      Apply Directly ↗
                    </a>
                  ) : (
                    <button
                      disabled
                      className="btn-hollow w-full text-center text-xs py-2.5 opacity-50 cursor-not-allowed font-mono"
                    >
                      Direct Application Closed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 border border-cobalt/25 bg-[#050814] text-center font-mono">
            <p className="text-white text-lg font-display mb-2">No Active Opportunities</p>
            <p className="text-gray-500 text-xs">
              Check back regularly or subscribe to society announcements for upcoming corporate openings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
