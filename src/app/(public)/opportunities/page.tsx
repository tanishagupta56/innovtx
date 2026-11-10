import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Opportunities Radar & Grants — TechNeeds IGDTUW',
  description: 'Verified internships, hackathons, fellowships, and open-source programs curated for IGDTUW students.',
};

const VERIFIED_OPPORTUNITIES = [
  {
    id: 'opp-innovortex',
    title: 'InnoVortex 4.0 Hackathon Developer Track',
    company: 'TechNeeds & Industry Partners',
    type: 'competition',
    category: 'Hackathon',
    location: 'IGDTUW Campus & Hybrid',
    deadline: '2026-11-18T23:59:59Z',
    apply_url: '/events/innovortex-4',
    description: 'Autonomous AI, Climate Tech, and Distributed Systems track applications for undergraduate female engineering teams with ₹2.5L+ in prize bounties.',
    eligibility: 'All collegiate engineering students across batches',
  },
  {
    id: 'opp-mlsa',
    title: 'Microsoft Learn Student Ambassador Cohort',
    company: 'Microsoft',
    type: 'fellowship',
    category: 'Fellowship',
    location: 'Global Virtual Campus',
    deadline: '2026-12-30T23:59:59Z',
    apply_url: 'https://studentambassadors.microsoft.com/',
    description: 'Global campus leader program offering free Azure subscriptions, technical mentorship, and networking opportunities with Microsoft developers.',
    eligibility: 'Currently enrolled undergraduate or postgraduate students',
  },
  {
    id: 'opp-gssoc',
    title: 'GirlScript Summer of Code Contributor Drive',
    company: 'GirlScript Foundation',
    type: 'open-source',
    category: 'Open Source',
    location: 'Remote / Global',
    deadline: '2026-12-15T23:59:59Z',
    apply_url: 'https://gssoc.girlscript.tech/',
    description: '3-month open-source contribution program for beginners and seasoned developers to build real-world GitHub repositories under assigned mentor guidance.',
    eligibility: 'Open to all developers irrespective of prior experience',
  },
  {
    id: 'opp-sssc-lead',
    title: 'SSSC Junior Mentor & Lead Applications',
    company: 'TechNeeds IGDTUW',
    type: 'fellowship',
    category: 'Society Leadership',
    location: 'IGDTUW Delhi Campus',
    deadline: '2026-11-28T23:59:59Z',
    apply_url: '/signup',
    description: 'Lead next-semester peer cohorts in Web Development, DSA, and System Design. Guide freshers through mock interviews and technical workshops.',
    eligibility: 'Pre-final & final year IGDTUW undergraduates with prior project experience',
  },
];

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { type?: string; search?: string; sort?: string };
}) {
  let dbOpps: any[] = [];
  try {
    const supabase = createClient();
    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('is_published', true);

    if (searchParams.type) {
      query = query.eq('type', searchParams.type);
    }
    if (searchParams.search) {
      query = query.or(`title.ilike.%${searchParams.search}%,company.ilike.%${searchParams.search}%`);
    }

    const { data } = await query;
    if (data && data.length > 0) {
      dbOpps = data;
    }
  } catch {
    // fallback gracefully
  }

  const allOpps = dbOpps.length > 0 ? dbOpps : VERIFIED_OPPORTUNITIES;

  const filteredOpps = allOpps.filter((opp) => {
    const matchesType = !searchParams.type || opp.type?.toLowerCase() === searchParams.type.toLowerCase();
    const matchesSearch = !searchParams.search || opp.title.toLowerCase().includes(searchParams.search.toLowerCase()) || opp.company?.toLowerCase().includes(searchParams.search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const types = ['all', 'competition', 'fellowship', 'open-source', 'internship'];

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-transparent min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              RADAR // OPPORTUNITY DIRECTORY
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              VERIFIED LISTINGS &amp; FELLOWSHIPS
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            OPPORTUNITY <br />
            <span className="text-lime-green">RADAR.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Zero-fluff pipeline connecting verified society members with top-tier hackathons, fellowships, open-source programs, and student internships.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs">
          <form className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              name="search"
              type="text"
              placeholder="Search opportunity, company..."
              defaultValue={searchParams.search || ''}
              className="px-4 py-2 bg-deep-ink border border-charcoal-border rounded-md text-soft-white placeholder:text-slate-500 w-full sm:w-64 focus:outline-none focus:border-electric-blue/50"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-electric-blue hover:bg-electric-blue-light text-soft-white uppercase font-bold rounded-md transition-colors"
            >
              Filter
            </button>
            {(searchParams.search || searchParams.type) && (
              <Link
                href="/opportunities"
                className="px-4 py-2 bg-charcoal hover:bg-charcoal-surface text-slate-400 uppercase rounded-md transition-colors"
              >
                Reset
              </Link>
            )}
          </form>

          {/* Type Quick Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 uppercase mr-1">TYPE:</span>
            {types.map((t) => (
              <Link
                key={t}
                href={t === 'all' ? '/opportunities' : `/opportunities?type=${t}`}
                className={`px-3 py-1 rounded-full uppercase transition-all ${
                  (t === 'all' && !searchParams.type) || searchParams.type === t
                    ? 'bg-electric-blue text-deep-ink font-bold shadow-[0_0_12px_#315EFF]'
                    : 'bg-deep-ink border border-charcoal-border text-slate-300 hover:text-white'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        {/* Opportunity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredOpps.map((opp) => {
            const isExpired = opp.deadline && new Date(opp.deadline) < new Date();

            return (
              <div
                key={opp.id}
                className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl flex flex-col justify-between group hover:border-electric-blue/50 transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-charcoal border border-charcoal-border text-lime-green">
                      {opp.category || opp.type}
                    </span>
                    {opp.deadline && (
                      <span className={`text-xs font-mono font-bold ${isExpired ? 'text-red-400' : 'text-lime-green'}`}>
                        {isExpired ? 'EXPIRED' : `Due ${formatDate(opp.deadline)}`}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-2xl text-soft-white mb-1 group-hover:text-lime-green transition-colors">
                    {opp.title}
                  </h3>

                  <p className="font-mono text-xs text-electric-blue-light font-semibold mb-3">
                    {opp.company || 'Host Organization'}
                  </p>

                  <p className="text-slate-300 font-sans text-sm leading-relaxed mb-4">
                    {opp.description}
                  </p>

                  {opp.eligibility && (
                    <div className="text-xs font-mono text-slate-400 pt-3 border-t border-charcoal-border">
                      <strong className="text-slate-300">ELIGIBILITY:</strong> {opp.eligibility}
                    </div>
                  )}

                  {opp.location && (
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      📍 {opp.location}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-charcoal-border">
                  {opp.apply_url ? (
                    <a
                      href={opp.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center text-xs py-3 font-mono uppercase tracking-wider flex items-center justify-center gap-2 bg-electric-blue text-deep-ink font-bold rounded-md hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(117,230,255,0.3)]"
                    >
                      <span>Apply For Listing</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    <span className="w-full text-center text-xs py-3 font-mono uppercase block text-slate-500 bg-charcoal rounded-md">
                      Registration Closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
