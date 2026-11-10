import { createClient } from '@/lib/supabase/server';
import { eventSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
  }

  const body = await request.json();

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      ...body,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Audit log
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'CREATE_EVENT',
    table_name: 'events',
    record_id: event.id,
    new_data: event,
  });

  return NextResponse.json({ success: true, event });
}
