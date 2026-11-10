import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Support Tickets — Admin Console' };

const statusStyles: Record<string, string> = {
  open: 'bg-cobalt/20 text-cobalt-300 border-cobalt/40',
  in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40',
  awaiting_response: 'bg-orange-500/10 text-orange-400 border-orange-500/40',
  resolved: 'bg-lime/10 text-lime border-lime/30',
};

const priorityStyles: Record<string, string> = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-orange-400 font-bold',
  urgent: 'text-red-400 font-bold animate-pulse',
};

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from('tickets')
    .select(`
      id, ticket_id, subject, status, priority, created_at,
      profiles:user_id (id, full_name, email),
      assignee:assignee_id (id, full_name)
    `)
    .order('created_at', { ascending: false });

  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }

  const { data: tickets } = await query;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Support &amp; Inquiries
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Student ticket resolution, threading, and triage workflow.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {['', 'open', 'in_progress', 'awaiting_response', 'resolved'].map((st) => (
            <Link
              key={st}
              href={st ? `/admin/tickets?status=${st}` : '/admin/tickets'}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border ${
                (searchParams.status || '') === st
                  ? 'bg-cobalt text-white border-cobalt'
                  : 'bg-[#050814] text-gray-400 border-cobalt/20 hover:text-white'
              }`}
            >
              {st ? st.replace('_', ' ') : 'All'}
            </Link>
          ))}
        </div>
      </div>

      <div className="border border-cobalt/25 bg-[#050814] overflow-hidden">
        {tickets && tickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cobalt/25 bg-black/40 text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cobalt/15">
                {tickets.map((t: any) => (
                  <tr key={t.id} className="hover:bg-cobalt/5">
                    <td className="py-3.5 px-4">
                      <p className="text-gray-400 text-[10px]">{t.ticket_id}</p>
                      <p className="font-semibold text-white text-sm mt-0.5">{t.subject}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-white">{t.profiles?.full_name || 'Anonymous'}</p>
                      <p className="text-gray-500 text-[10px]">{t.profiles?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 uppercase">
                      <span className={priorityStyles[t.priority] || ''}>{t.priority}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-mono border ${
                        statusStyles[t.status] || ''
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {t.assignee?.full_name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                      {formatDate(t.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/tickets/${t.id}`}
                        className="px-2.5 py-1 text-xs bg-cobalt/20 text-cobalt-300 border border-cobalt/40 hover:bg-cobalt/40"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center font-mono text-gray-500">
            No tickets found in this view.
          </div>
        )}
      </div>
    </div>
  );
}
