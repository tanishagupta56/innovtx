import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AdminTicketManager from './AdminTicketManager';

export const metadata = { title: 'Ticket Triage — Admin Console' };

export default async function AdminTicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: ticket } = await supabase
    .from('tickets')
    .select(`
      id, ticket_id, subject, status, priority, assignee_id, created_at,
      profiles:user_id (id, full_name, email)
    `)
    .eq('id', params.id)
    .single();

  if (!ticket) notFound();

  const { data: messages } = await supabase
    .from('ticket_messages')
    .select(`
      id, message, is_internal, created_at,
      sender:sender_id (full_name, role)
    `)
    .eq('ticket_id', ticket.id)
    .order('created_at', { ascending: true });

  const student = (ticket.profiles as any) || {};

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/admin/tickets" className="text-xs font-mono text-gray-400 hover:text-white">
            ← Tickets
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs font-mono text-lime">{ticket.ticket_id}</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          {ticket.subject}
        </h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Submitted by: {student.full_name || 'Anonymous'} ({student.email})
        </p>
      </div>

      <AdminTicketManager
        ticket={{
          id: ticket.id,
          ticket_id: ticket.ticket_id,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          assignee_id: ticket.assignee_id,
        }}
        messages={(messages as any) || []}
      />
    </div>
  );
}
