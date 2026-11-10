import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Opportunities — TechNeeds IGDTUW' };

const typeLabels: Record<string, string> = {
  internship: 'Internship',
  job: 'Full-Time Job',
  fellowship: 'Fellowship',
  competition: 'Hackathon / Contest',
  workshop: 'Workshop',
  other: 'Other Opportunity',
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { type?: string; search?: string; sort?: string };
}) {
  const supabase = createClient();
  const now = new Date().toISOString();

  // Query published opportunities that are not expired (deadline >= now or no deadline)
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
    // Default: Sort by nearest deadline
    query = query.order('deadline', { ascending: true, nullsFirst: false });
  }

  const { data: opportunities } = await query;

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">
            Career &amp; Growth
          </p>
          <h1 className="section-heading text-white">Opportunities</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            Curated internships, hackathons, job roles, and fellowships for the IGDTUW community.
          </p>
        </div>

        {/* Filter bar */}
        <form className="flex flex-wrap gap-3 mb-10">
          <input
            name="search"
            type="text"
            placeholder="Search by role or company..."
            defaultValue={searchParams.search || ''}
            className="input-field max-w-xs"
          />

          <select name="type" defaultValue={searchParams.type || ''} className="input-field max-w-[200px]">
            <option value="">All Types</option>
            <option value="internship">Internship</option>
            <option value="job">Job</option>
            <option value="fellowship">Fellowship</option>
            <option value="competition">Hackathon / Contest</option>
            <option value="workshop">Workshop</option>
            <option value="other">Other</option>
          </select>

          <select name="sort" defaultValue={searchParams.sort || 'deadline'} className="input-field max-w-[180px]">
            <option value="deadline">Nearest Deadline</option>
            <option value="newest">Recently Posted</option>
          </select>

          <button type="submit" className="btn-primary py-2 px-5 text-sm">
            Apply Filters
          </button>
          {(searchParams.search || searchParams.type || searchParams.sort) && (
            <a href="/opportunities" className="btn-ghost py-2 px-4 text-sm inline-flex items-center">
              Clear
            </a>
          )}
        </form>

        {/* Opportunities grid */}
        {opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((item) => (
              <div key={item.id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 bg-cobalt/20 text-cobalt-300">
                      {typeLabels[item.type] || item.type}
                    </span>
                    {item.deadline && (
                      <span className="text-xs font-mono text-lime">
                        Due {formatDate(item.deadline)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  {item.company && (
                    <p className="text-sm font-semibold text-gray-400 mb-3">{item.company}</p>
                  )}

                  {item.location && (
                    <p className="text-xs text-gray-500 font-mono mb-3">
                      📍 {item.location}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-sm text-gray-400 line-clamp-3 mb-6 whitespace-pre-wrap">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-cobalt/10">
                  {item.apply_url ? (
                    <a
                      href={item.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent w-full text-center text-sm py-2"
                    >
                      Apply Now ↗
                    </a>
                  ) : (
                    <button disabled className="btn-ghost w-full text-sm py-2 opacity-50 cursor-not-allowed">
                      Direct Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <p className="text-gray-400 text-base">No active opportunities found matching criteria.</p>
            <p className="text-gray-600 text-xs mt-1">To be added by admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
