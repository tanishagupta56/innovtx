import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = { title: 'Team & Alumni Roster — TechNeeds IGDTUW' };

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
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-cobalt/25 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-telemetry-lime">PEOPLE // ARCHIVE</span>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              LEADERSHIP &amp; ALUMNI
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            THE ARCHITECTS <br />
            <span className="text-lime">&amp; LEADS.</span>
          </h1>

          <p className="mt-4 text-gray-300 font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            The engineers, designers, and organizers steering TechNeeds at IGDTUW. Leading technical initiatives, mentoring cohorts, and driving campus innovation.
          </p>
        </div>

        {/* Tab switcher: Core Leads vs. Alumni Network */}
        <div className="flex gap-4 border-b border-cobalt/20 pb-4 font-mono text-xs">
          <Link
            href="/team"
            className={`px-5 py-2.5 uppercase tracking-wider border transition-all ${
              !isAlumni
                ? 'bg-lime text-midnight border-lime font-bold shadow-[0_0_15px_rgba(212,255,36,0.3)]'
                : 'border-cobalt/20 text-gray-400 hover:text-white hover:border-cobalt'
            }`}
          >
            Current Leads &amp; Core Team
          </Link>

          <Link
            href="/team?tab=alumni"
            className={`px-5 py-2.5 uppercase tracking-wider border transition-all ${
              isAlumni
                ? 'bg-lime text-midnight border-lime font-bold shadow-[0_0_15px_rgba(212,255,36,0.3)]'
                : 'border-cobalt/20 text-gray-400 hover:text-white hover:border-cobalt'
            }`}
          >
            Distinguished Alumni
          </Link>
        </div>

        {/* Members Showcase */}
        {members && members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="border border-cobalt/25 bg-[#050816] hover:border-lime/40 transition-all p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-6">
                  {/* Portrait Box */}
                  <div className="aspect-[4/5] bg-black border border-cobalt/30 overflow-hidden relative">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cobalt/30 to-black text-center font-mono">
                        <span className="font-display font-extrabold text-4xl text-cobalt-200">
                          {member.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-lime mt-2 uppercase">
                          CORE EXECUTIVE
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div>
                    <span className="tag-telemetry text-lime uppercase font-bold text-[10px]">
                      {member.role_title}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-white mt-2 group-hover:text-lime transition-colors">
                      {member.name}
                    </h3>
                    {member.department && (
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        {member.department} {member.year ? `// CLASS OF ${member.year}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-cobalt/20 flex justify-between items-center text-xs font-mono">
                  {member.linkedin_url ? (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime hover:underline"
                    >
                      Connect on LinkedIn ↗
                    </a>
                  ) : (
                    <span className="text-gray-500">IGDTUW CHAPTER</span>
                  )}
                  <span className="text-gray-600">#{String(index + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 border border-cobalt/25 bg-[#050814] text-center font-mono text-gray-500">
            <p className="text-white text-lg font-display mb-2">Executive Roster Update Pending</p>
            <p className="text-xs">Official leadership verification in progress by faculty and society administrators.</p>
          </div>
        )}
      </div>
    </div>
  );
}
