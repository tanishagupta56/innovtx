import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import ExportCSVButton from './ExportCSVButton';

export const metadata = { title: 'Event Registrations — Admin Console' };

export default async function EventRegistrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: event } = await supabase
    .from('events')
    .select('id, title, slug')
    .eq('id', params.id)
    .single();

  if (!event) notFound();

  const { data: registrations } = await supabase
    .from('event_registrations')
    .select(`
      id, registered_at, qr_token_hash,
      profiles:user_id (id, full_name, email, batch_year, branch),
      attendance (id, checked_in_at)
    `)
    .eq('event_id', params.id)
    .order('registered_at', { ascending: false });

  const formattedData = (registrations || []).map((r: any) => ({
    id: r.id,
    name: r.profiles?.full_name || 'N/A',
    email: r.profiles?.email || 'N/A',
    batch: r.profiles?.batch_year || 'N/A',
    branch: r.profiles?.branch || 'N/A',
    registered_at: r.registered_at,
    attended: !!r.attendance && (Array.isArray(r.attendance) ? r.attendance.length > 0 : true),
    checked_in_at: Array.isArray(r.attendance)
      ? r.attendance[0]?.checked_in_at
      : r.attendance?.checked_in_at || 'Not Checked In',
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/events" className="text-xs font-mono text-gray-400 hover:text-white">
              ← Events
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-xs font-mono text-lime">{event.title}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Attendee Roster
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Total Registrations: {formattedData.length} | Checked In:{' '}
            {formattedData.filter((d) => d.attended).length}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/events/${event.id}/checkin`}
            className="btn-accent text-xs font-mono uppercase tracking-wider py-2.5 px-4"
          >
            Open Check-In Scanner
          </Link>
          <ExportCSVButton data={formattedData} eventTitle={event.title} />
        </div>
      </div>

      <div className="border border-cobalt/25 bg-[#050814] overflow-hidden">
        {formattedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cobalt/25 bg-black/40 text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Attendee Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Branch / Batch</th>
                  <th className="py-3 px-4">Registered On</th>
                  <th className="py-3 px-4">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cobalt/15">
                {formattedData.map((item) => (
                  <tr key={item.id} className="hover:bg-cobalt/5">
                    <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-gray-300">{item.email}</td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {item.branch !== 'N/A' ? `${item.branch} (${item.batch})` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">{formatDate(item.registered_at)}</td>
                    <td className="py-3.5 px-4">
                      {item.attended ? (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-mono bg-lime/10 text-lime border border-lime/30">
                          CHECKED IN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-mono bg-gray-800 text-gray-400">
                          PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center font-mono text-gray-500">
            No attendees registered for this event yet.
          </div>
        )}
      </div>
    </div>
  );
}
