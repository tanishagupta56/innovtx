import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { ticketSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const body = await request.json();
  const result = ticketSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .insert({
      subject: result.data.subject,
      user_id: user.id,
    })
    .select('id, ticket_id')
    .single();

  if (ticketError) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }

  // Add initial message
  await supabase.from('ticket_messages').insert({
    ticket_id: ticket.id,
    sender_id: user.id,
    message: result.data.message,
  });

  return NextResponse.json({ success: true, ticketId: ticket.ticket_id });
}
