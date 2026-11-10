import { createClient } from '@/lib/supabase/server';
import { generateSignedQRToken, hashToken } from '@/lib/qr';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  const body = await request.json();
  const { eventId } = body;

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
  }

  // Check event exists and is published
  const { data: event, error: eventErr } = await supabase
    .from('events')
    .select('id, title, registration_start, registration_end, max_participants')
    .eq('id', eventId)
    .eq('status', 'published')
    .single();

  if (eventErr || !event) {
    return NextResponse.json({ error: 'Event not found or not published' }, { status: 404 });
  }

  // Check registration window
  const now = new Date();
  if (event.registration_start && now < new Date(event.registration_start)) {
    return NextResponse.json({ error: 'Registration has not started yet' }, { status: 400 });
  }
  if (event.registration_end && now > new Date(event.registration_end)) {
    return NextResponse.json({ error: 'Registration has closed' }, { status: 400 });
  }

  // Check capacity
  if (event.max_participants) {
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (count !== null && count >= event.max_participants) {
      return NextResponse.json({ error: 'Event capacity reached. Registration full.' }, { status: 400 });
    }
  }

  // Check duplicate
  const { data: existing } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 400 });
  }

  // Generate HMAC-signed QR token and store SHA-256 hash only
  const signedToken = generateSignedQRToken();
  const tokenHash = hashToken(signedToken);

  const { data: reg, error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: user.id,
      qr_token_hash: tokenHash,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Registration failed: ' + error.message }, { status: 500 });
  }

  // Return the raw signed token (no PII inside) and registration id
  return NextResponse.json({
    success: true,
    token: signedToken,
    registrationId: reg.id,
    message: 'Registered successfully!',
  });
}
