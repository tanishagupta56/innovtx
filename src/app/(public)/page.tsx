import Hero from '@/components/Hero';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { getEventTiming, formatDate } from '@/lib/utils';

export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: events },
    { data: opportunities },
  ] = await Promise.all([
    supabase
      .from('events')
      .select('id, title, slug, short_description, category, start_date, end_date, poster_url')
      .eq('status', 'published')
      .order('start_date', { ascending: false })
      .limit(3),
    supabase
      .from('opportunities')
      .select('id, title, company, type, deadline, location')
      .eq('is_published', true)
      .order('deadline', { ascending: true })
      .limit(3),
  ]);

  return (
    <>
      <Hero />

      {/* Society Pillars */}
      <section className="py-20 px-6 border-b border-cobalt/15 bg-black/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-cobalt/20 bg-[#050814] relative group hover:border-lime/40 transition-colors">
            <span className="text-lime font-mono text-xs uppercase tracking-widest block mb-2">01 // INNOVATION</span>
            <h3 className="font-display font-bold text-xl text-white mb-3">Hackathons &amp; Ideathons</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Organizing premier competitive hackathons like InnoVortex and flagship collabs with Innerve to solve real-world problems.
            </p>
          </div>

          <div className="p-8 border border-cobalt/20 bg-[#050814] relative group hover:border-lime/40 transition-colors">
            <span className="text-cobalt-300 font-mono text-xs uppercase tracking-widest block mb-2">02 // MASTERY</span>
            <h3 className="font-display font-bold text-xl text-white mb-3">Skill Sprints</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hands-on workshops in systems engineering, fullstack architectures, Web3, and artificial intelligence for women in tech.
            </p>
          </div>

          <div className="p-8 border border-cobalt/20 bg-[#050814] relative group hover:border-lime/40 transition-colors">
            <span className="text-lime font-mono text-xs uppercase tracking-widest block mb-2">03 // ECOSYSTEM</span>
            <h3 className="font-display font-bold text-xl text-white mb-3">Career Launchpad</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Direct pipeline to verified internships, industry fellowships, project showcases, and peer-to-peer mentorship networks.
            </p>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">
                Calendar &amp; Hackathons
              </p>
              <h2 className="section-heading text-white">
                Upcoming Initiatives
              </h2>
            </div>
            <Link
              href="/events"
              className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-lime transition-colors border-b border-gray-700 hover:border-lime pb-1 self-start sm:self-auto"
            >
              All Events &amp; Passes →
            </Link>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => {
                const timing = getEventTiming(event.start_date, event.end_date);
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group card hover:border-cobalt/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {event.poster_url && (
                        <div className="aspect-[16/9] mb-4 overflow-hidden bg-charcoal border border-cobalt/20">
                          <img
                            src={event.poster_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 border ${
                          timing === 'upcoming' ? 'bg-lime/10 text-lime border-lime/30' :
                          timing === 'ongoing' ? 'bg-cobalt/20 text-cobalt-300 border-cobalt/40' :
                          'bg-gray-800 text-gray-500 border-gray-700'
                        }`}>
                          {timing.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{event.category}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-lime transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {event.short_description || 'Click to view event details, registration criteria, and schedule.'}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-cobalt/15 flex items-center justify-between text-xs font-mono text-gray-500">
                      <span>{formatDate(event.start_date)}</span>
                      <span className="text-lime group-hover:translate-x-1 transition-transform">Register →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="card text-center py-16">
              <p className="text-gray-400 font-mono text-sm">To be added by admin.</p>
              <p className="text-gray-600 text-xs mt-1">Upcoming schedules are currently being finalized.</p>
            </div>
          )}
        </div>
      </section>

      {/* Opportunities preview */}
      <section className="py-20 px-6 border-t border-cobalt/15 bg-[#03060f]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-lime font-mono text-sm tracking-widest uppercase mb-3">
                Careers &amp; Grants
              </p>
              <h2 className="section-heading text-white">
                Live Opportunities
              </h2>
            </div>
            <Link
              href="/opportunities"
              className="text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-lime transition-colors border-b border-gray-700 hover:border-lime pb-1 self-start sm:self-auto"
            >
              Browse Board →
            </Link>
          </div>

          {opportunities && opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div key={opp.id} className="card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="uppercase text-cobalt-300">{opp.type}</span>
                      {opp.deadline && (
                        <span className="text-lime">Due {formatDate(opp.deadline)}</span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-white text-lg">{opp.title}</h3>
                    {opp.company && <p className="text-xs text-gray-400 mt-1 font-semibold">{opp.company}</p>}
                  </div>
                  <div className="mt-4 pt-3 border-t border-cobalt/15">
                    <Link href="/opportunities" className="text-xs font-mono text-cobalt-300 hover:text-white">
                      View details ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-16">
              <p className="text-gray-400 font-mono text-sm">To be added by admin.</p>
              <p className="text-gray-600 text-xs mt-1">New roles and internships will appear here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-24 px-6 border-t border-cobalt/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cobalt/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-lime font-mono text-xs uppercase tracking-widest mb-3">
            Join the Network
          </p>
          <h2 className="section-heading text-white mb-6">
            Build with TechNeeds
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Get exclusive access to hackathon registrations, generate HMAC-verified digital passes, and access curated engineering roadmaps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-accent text-sm uppercase font-mono tracking-wider px-8 py-3.5">
              Create Student Account
            </Link>
            <Link href="/events" className="btn-ghost text-sm uppercase font-mono tracking-wider px-8 py-3.5">
              Browse Calendar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
