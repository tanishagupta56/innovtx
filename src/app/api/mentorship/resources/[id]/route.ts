/**
 * GET    /api/mentorship/resources/[id]  — get resource
 * PATCH  /api/mentorship/resources/[id]  — update resource (mentor/admin)
 * DELETE /api/mentorship/resources/[id]  — delete resource (admin)
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';
import type { MentorshipResource } from '@/lib/mentorship/types';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_resources')
    .select('*')
    .eq('id', params.id)
    .single() as { data: MentorshipResource | null; error: unknown };

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ resource: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin', 'mentor']);
  if (session instanceof NextResponse) return session;

  let body: Partial<MentorshipResource>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_resources')
    .update(body as Record<string, unknown>)
    .eq('id', params.id)
    .select()
    .single() as { data: MentorshipResource | null; error: unknown };

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });
  return NextResponse.json({ resource: data });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin']);
  if (session instanceof NextResponse) return session;

  const db = getMentorshipDb();
  const { error } = await db.from('mentorship_resources').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });
  return NextResponse.json({ success: true });
}
