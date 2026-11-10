import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = { title: 'Admin Overview — TechNeeds' };

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const [
    { count: totalEvents },
    { count: totalRegistrations },
    { count: totalAttendance },
    { count: openTickets },
    { data: recentEvents },
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
    supabase.from('attendance').select('*', { count: 'exact', head: true }),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('events').select('id, title, slug, status, start_date').order('created_at', { ascending: false }).limit(5),
  ]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Ops Overview
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-1">
            Society operations, real-time attendance, and registration tracking.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/events/new"
            className="btn-accent text-xs py-2 px-4 uppercase font-mono tracking-wider"
          >
            + Create Event
          </Link>
          <Link
            href="/admin/opportunities/new"
            className="btn-ghost text-xs py-2 px-4 uppercase font-mono tracking-wider border-cobalt/40"
          >
            + New Opportunity
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 border border-cobalt/30 bg-[#060a17]">
          <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Total Events</p>
          <p className="font-display text-4xl font-bold text-white mt-2">{totalEvents || 0}</p>
          <p className="text-[11px] font-mono text-cobalt-300 mt-2">Draft &amp; Published</p>
        </div>

        <div className="p-5 border border-cobalt/30 bg-[#060a17]">
          <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Registrations</p>
          <p className="font-display text-4xl font-bold text-white mt-2">{totalRegistrations || 0}</p>
          <p className="text-[11px] font-mono text-lime mt-2">Verified Passes</p>
        </div>

        <div className="p-5 border border-cobalt/30 bg-[#060a17]">
          <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Total Check-Ins</p>
          <p className="font-display text-4xl font-bold text-white mt-2">{totalAttendance || 0}</p>
          <p className="text-[11px] font-mono text-cobalt-300 mt-2">Scanned on-site</p>
        </div>

        <div className="p-5 border border-cobalt/30 bg-[#060a17]">
          <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Open Tickets</p>
          <p className="font-display text-4xl font-bold text-white mt-2">{openTickets || 0}</p>
          <p className="text-[11px] font-mono text-orange-400 mt-2">Awaiting action</p>
        </div>
      </div>

      {/* Recent Events table */}
      <div className="border border-cobalt/25 bg-[#050814] p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-white">Recent Events</h2>
          <Link href="/admin/events" className="text-xs font-mono text-lime hover:underline">
            View all events →
          </Link>
        </div>

        {recentEvents && recentEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cobalt/20 text-gray-400 uppercase">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cobalt/10">
                {recentEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-cobalt/5">
                    <td className="py-3 px-3 font-semibold text-white">{evt.title}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] uppercase ${
                        evt.status === 'published' ? 'bg-lime/10 text-lime border border-lime/30' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      {new Date(evt.start_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <Link
                        href={`/admin/events/${evt.id}/checkin`}
                        className="text-lime hover:underline"
                      >
                        Scanner
                      </Link>
                      <span className="text-gray-600">|</span>
                      <Link
                        href={`/admin/events/${evt.id}/registrations`}
                        className="text-cobalt-300 hover:underline"
                      >
                        Attendees
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-xs font-mono">No events found. Create the first one above.</p>
        )}
      </div>
    </div>
  );
}
