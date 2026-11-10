import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { ticketReplySchema } from '@/lib/validations';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const body = await request.json();
  const result = ticketReplySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }

  // Check access: own ticket or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  const { data: ticket } = await supabase
    .from('tickets')
    .select('id, user_id')
    .eq('id', result.data.ticketId)
    .single();

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  if (ticket.user_id !== user.id && !isAdmin) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const { error } = await supabase.from('ticket_messages').insert({
    ticket_id: result.data.ticketId,
    sender_id: user.id,
    message: result.data.message,
    is_internal: isAdmin ? (result.data.isInternal || false) : false,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }

  // Update ticket status if admin replies
  if (isAdmin) {
    await supabase
      .from('tickets')
      .update({ status: 'awaiting_response' })
      .eq('id', result.data.ticketId);
  }

  return NextResponse.json({ success: true });
}
