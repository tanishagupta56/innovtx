import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
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

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .insert({
      ...body,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'CREATE_OPPORTUNITY',
    table_name: 'opportunities',
    record_id: opportunity.id,
    new_data: opportunity,
  });

  return NextResponse.json({ success: true, opportunity });
}
