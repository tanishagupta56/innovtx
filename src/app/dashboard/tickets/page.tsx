import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import TicketForm from './TicketForm';

export const metadata = { title: 'My Tickets — TechNeeds' };

const statusColors: Record<string, string> = {
  open: 'bg-cobalt/10 text-cobalt-300',
  in_progress: 'bg-yellow-500/10 text-yellow-400',
  awaiting_response: 'bg-orange-500/10 text-orange-400',
  resolved: 'bg-lime/10 text-lime',
};

export default async function TicketsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');

  let tickets: any[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) tickets = data;
  } catch {
    tickets = [];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-white">My Tickets</h1>
      </div>

      <TicketForm />

      {tickets && tickets.length > 0 ? (
        <div className="space-y-3 mt-8">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/dashboard/tickets/${ticket.id}`}
              className="card block hover:border-cobalt/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-mono">{ticket.ticket_id}</p>
                  <h3 className="font-display text-white mt-1">{ticket.subject}</h3>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 whitespace-nowrap ${statusColors[ticket.status] || ''}`}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12 mt-8">
          <p className="text-gray-500">No tickets yet.</p>
        </div>
      )}
    </div>
  );
}
