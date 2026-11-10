import { createClient } from '@/lib/supabase/server';
import { verifyQRTokenSignature, hashToken } from '@/lib/qr';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
  }

  const body = await request.json();
  const rawToken = body?.token?.trim();

  if (!rawToken) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  // 1. Verify cryptographic HMAC signature
  const isValidSignature = verifyQRTokenSignature(rawToken);
  if (!isValidSignature) {
    return NextResponse.json({
      status: 'invalid',
      error: 'SECURITY VIOLATION: Forged or corrupted pass token. Cryptographic signature check failed.',
    }, { status: 400 });
  }

  // 2. Hash token to look up registration
  const tokenHash = hashToken(rawToken);

  const { data: registration, error: regError } = await supabase
    .from('event_registrations')
    .select(`
      id,
      event_id,
      registered_at,
      profiles:user_id (id, full_name, email, branch, batch_year)
    `)
    .eq('event_id', eventId)
    .eq('qr_token_hash', tokenHash)
    .maybeSingle();

  if (regError || !registration) {
    return NextResponse.json({
      status: 'not_found',
      error: 'No active registration found for this event matching this token.',
    }, { status: 404 });
  }

  // 3. Check for duplicate attendance
  const { data: existingAttendance } = await supabase
    .from('attendance')
    .select('id, checked_in_at, checked_in_by')
    .eq('registration_id', registration.id)
    .maybeSingle();

  const attendeeProfile = (registration.profiles as any) || {};

  if (existingAttendance) {
    const formattedTime = new Date(existingAttendance.checked_in_at).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return NextResponse.json({
      status: 'duplicate',
      error: `DUPLICATE ATTENDANCE: ${attendeeProfile.full_name || 'Attendee'} was already checked in at ${formattedTime}. Entry denied.`,
      attendee: attendeeProfile,
      checkedInAt: existingAttendance.checked_in_at,
    }, { status: 409 });
  }

  // 4. Record new attendance
  const { data: attendanceRecord, error: attendanceError } = await supabase
    .from('attendance')
    .insert({
      registration_id: registration.id,
      checked_in_by: user.id,
    })
    .select('id, checked_in_at')
    .single();

  if (attendanceError) {
    return NextResponse.json({
      error: 'Failed to record attendance: ' + attendanceError.message,
    }, { status: 500 });
  }

  // 5. Audit log
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'CHECK_IN',
    table_name: 'attendance',
    record_id: attendanceRecord.id,
    new_data: {
      eventId,
      registrationId: registration.id,
      attendeeEmail: attendeeProfile.email,
    },
  });

  return NextResponse.json({
    status: 'success',
    message: `VERIFIED: Welcome, ${attendeeProfile.full_name || attendeeProfile.email}!`,
    attendee: attendeeProfile,
    checkedInAt: attendanceRecord.checked_in_at,
  });
}
