import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
  }

  const body = await request.json();

  const { data: oldEvent } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  const { data: updated, error } = await supabase
    .from('events')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Audit log
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'UPDATE_EVENT',
    table_name: 'events',
    record_id: params.id,
    old_data: oldEvent,
    new_data: updated,
  });

  return NextResponse.json({ success: true, event: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Admin permission required' }, { status: 403 });
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'DELETE_EVENT',
    table_name: 'events',
    record_id: params.id,
  });

  return NextResponse.json({ success: true });
}
