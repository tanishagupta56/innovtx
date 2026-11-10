import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Manage Events — Admin Console' };

export default async function AdminEventsPage() {
  const supabase = createClient();

  const { data: events } = await supabase
    .from('events')
    .select(`
      id, title, slug, category, status, start_date, end_date, max_participants,
      event_registrations (count),
      attendance (count)
    `)
    .order('start_date', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Events Management
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Publish events, manage attendee lists, and operate check-in scanners.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="btn-accent text-xs py-2.5 px-5 font-mono uppercase tracking-wider self-start sm:self-auto"
        >
          + Create Event
        </Link>
      </div>

      <div className="border border-cobalt/25 bg-[#050814] overflow-hidden">
        {events && events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cobalt/25 bg-black/40 text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-center">Registrations</th>
                  <th className="py-3 px-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cobalt/15">
                {events.map((evt: any) => {
                  const regCount = evt.event_registrations?.[0]?.count ?? 0;
                  return (
                    <tr key={evt.id} className="hover:bg-cobalt/5">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-white text-sm">{evt.title}</p>
                        <p className="text-[11px] text-gray-500 font-mono">slug: /{evt.slug}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-400">{evt.category}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-mono border ${
                          evt.status === 'published'
                            ? 'bg-lime/10 text-lime border-lime/30'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                        {formatDate(evt.start_date)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-white font-bold">{regCount}</span>
                        {evt.max_participants ? (
                          <span className="text-gray-500"> / {evt.max_participants}</span>
                        ) : null}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-3">
                        <Link
                          href={`/admin/events/${evt.id}/checkin`}
                          className="px-2 py-1 bg-lime/10 text-lime border border-lime/30 hover:bg-lime/20"
                        >
                          Check-in Scanner
                        </Link>
                        <Link
                          href={`/admin/events/${evt.id}/registrations`}
                          className="text-cobalt-300 hover:underline"
                        >
                          Registrations
                        </Link>
                        <Link
                          href={`/admin/events/${evt.id}/edit`}
                          className="text-gray-400 hover:text-white"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center font-mono text-gray-500">
            No events found. Click &quot;+ Create Event&quot; to publish your first one.
          </div>
        )}
      </div>
    </div>
  );
}
