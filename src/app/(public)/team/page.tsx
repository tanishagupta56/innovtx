import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { VERIFIED_TEAM_MEMBERS } from '@/data/teamData';

export const metadata = {
  title: 'Leadership & Mentors — TechNeeds IGDTUW',
  description: 'Meet the executive leads, cohort mentors, faculty advisors, and alumni of TechNeeds IGDTUW.',
};

export default async function TeamPage({
  searchParams,
}: {
  searchParams: { year?: string; tab?: string; category?: string };
}) {
  const isAlumni = searchParams.tab === 'alumni';
  let dbMembers: any[] = [];

  try {
    const supabase = createClient();
    let query = supabase
      .from('team_members')
      .select('*')
      .eq('is_published', true)
      .eq('is_alumni', isAlumni)
      .order('display_order', { ascending: true });

    if (searchParams.year) {
      query = query.eq('year', parseInt(searchParams.year));
    }

    const { data } = await query;
    if (data && data.length > 0) {
      dbMembers = data;
    }
  } catch {
    // fallback gracefully
  }

  const allMembers = dbMembers.length > 0 ? dbMembers : VERIFIED_TEAM_MEMBERS;

  const filteredMembers = allMembers.filter((m) => {
    const matchesTab = isAlumni ? m.is_alumni : !m.is_alumni;
    const matchesYear = !searchParams.year || m.year === parseInt(searchParams.year);
    const matchesCategory = !searchParams.category || m.category === searchParams.category;
    return matchesTab && matchesYear && matchesCategory;
  });

  const years = [2026, 2025, 2024];

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              LEADERSHIP CADRE // PEOPLE
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              ORGANIZATIONAL DIRECTORY
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            THE ARCHITECTS <br />
            <span className="text-lime-green">&amp; LEADS.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            The engineers, cohort mentors, and organizers steering TechNeeds at IGDTUW. Leading technical initiatives, mentoring cohorts, and driving campus innovation.
          </p>
        </div>

        {/* Tab switcher: Core Leads vs Alumni */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-charcoal-border pb-4 font-mono text-xs">
          <div className="flex gap-3">
            <Link
              href="/team"
              className={`px-5 py-2.5 uppercase tracking-wider rounded-md transition-all ${
                !isAlumni
                  ? 'bg-electric-blue text-deep-ink font-bold shadow-[0_0_15px_rgba(49,94,255,0.4)]'
                  : 'bg-charcoal border border-charcoal-border text-slate-400 hover:text-white'
              }`}
            >
              Current Leads &amp; Council
            </Link>

            <Link
              href="/team?tab=alumni"
              className={`px-5 py-2.5 uppercase tracking-wider rounded-md transition-all ${
                isAlumni
                  ? 'bg-electric-blue text-deep-ink font-bold shadow-[0_0_15px_rgba(49,94,255,0.4)]'
                  : 'bg-charcoal border border-charcoal-border text-slate-400 hover:text-white'
              }`}
            >
              Alumni Mentors &amp; Leads
            </Link>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase text-[11px]">TENURE:</span>
            <Link
              href={isAlumni ? '/team?tab=alumni' : '/team'}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                !searchParams.year ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </Link>
            {years.map((y) => (
              <Link
                key={y}
                href={isAlumni ? `/team?tab=alumni&year=${y}` : `/team?year=${y}`}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  searchParams.year === String(y) ? 'bg-electric-blue text-deep-ink font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl flex flex-col justify-between group hover:border-electric-blue/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-charcoal border border-charcoal-border text-lime-green">
                    {member.department}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {member.year}
                  </span>
                </div>

                {/* Profile Visual Frame */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-electric-blue to-charcoal border border-charcoal-border flex items-center justify-center font-display font-black text-2xl text-soft-white mb-6 group-hover:scale-105 transition-transform">
                  {member.name.charAt(0)}
                </div>

                <h3 className="text-2xl font-bold text-soft-white group-hover:text-lime-green transition-colors mb-1">
                  {member.name}
                </h3>

                <p className="font-mono text-xs text-electric-blue-light font-semibold mb-3">
                  {member.role}
                </p>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-charcoal-border flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  VERIFIED CADRE
                </span>
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-lime-green hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>LinkedIn</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
