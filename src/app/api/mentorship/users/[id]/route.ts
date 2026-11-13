/**
 * GET    /api/mentorship/users/[id]   — get user profile
 * PATCH  /api/mentorship/users/[id]   — update user (admin or self for limited fields)
 * DELETE /api/mentorship/users/[id]   — remove user (admin only)
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin', 'mentor', 'mentee']);
  if (session instanceof NextResponse) return session;

  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_users')
    .select('id, name, role, email, enrollment_no, program_ids, tags, created_at')
    .eq('id', params.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ user: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin', 'mentor', 'mentee']);
  if (session instanceof NextResponse) return session;

  // Non-admins can only edit themselves
  if (session.role !== 'admin' && session.sub !== params.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  // Strip protected fields for non-admins
  if (session.role !== 'admin') {
    delete body.role;
    delete body.program_ids;
    delete body.password_hash;
  }

  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_users')
    .update(body)
    .eq('id', params.id)
    .select('id, name, role, email, enrollment_no, program_ids, tags')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ user: data });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin']);
  if (session instanceof NextResponse) return session;

  const db = getMentorshipDb();
  const { error } = await db.from('mentorship_users').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
