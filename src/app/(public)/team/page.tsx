import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Team & Alumni — TechNeeds IGDTUW' };

export default async function TeamPage({
  searchParams,
}: {
  searchParams: { year?: string; tab?: string };
}) {
  const supabase = createClient();
  const isAlumni = searchParams.tab === 'alumni';

  let query = supabase
    .from('team_members')
    .select('*')
    .eq('is_published', true)
    .eq('is_alumni', isAlumni)
    .order('display_order', { ascending: true });

  if (searchParams.year) {
    query = query.eq('year', parseInt(searchParams.year));
  }

  const { data: members } = await query;

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">
            The Community
          </p>
          <h1 className="section-heading text-white">Leadership &amp; Alumni</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            Meet the engineers, organizers, and alumni driving technical excellence at IGDTUW.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-4 mb-10 border-b border-cobalt/20 pb-4">
          <a
            href="/team"
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all ${
              !isAlumni
                ? 'bg-cobalt text-white border-cobalt'
                : 'text-gray-400 border-cobalt/20 hover:text-white'
            }`}
          >
            Current Leads &amp; Core Team
          </a>
          <a
            href="/team?tab=alumni"
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-all ${
              isAlumni
                ? 'bg-cobalt text-white border-cobalt'
                : 'text-gray-400 border-cobalt/20 hover:text-white'
            }`}
          >
            Alumni Network
          </a>
        </div>

        {/* Members grid */}
        {members && members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div key={member.id} className="card group">
                <div className="aspect-square mb-4 bg-[#0a0f20] border border-cobalt/20 overflow-hidden flex items-center justify-center">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="font-mono text-xs text-gray-600 uppercase">
                      Profile Photo
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-white text-lg">{member.name}</h3>
                <p className="text-xs font-mono text-lime mt-1">{member.role_title}</p>
                {member.department && (
                  <p className="text-xs text-gray-500 mt-1">{member.department}</p>
                )}
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs font-mono text-cobalt-300 hover:text-lime"
                  >
                    LinkedIn Profile ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <p className="text-gray-400 text-base">To be added by admin.</p>
            <p className="text-gray-600 text-xs mt-1 font-mono">
              Official roster updates will be populated following tenure handovers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
