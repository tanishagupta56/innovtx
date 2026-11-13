/**
 * GET    /api/mentorship/programs/[id]    — get one program
 * PATCH  /api/mentorship/programs/[id]    — update program (admin)
 * DELETE /api/mentorship/programs/[id]    — delete program (admin)
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';
import type { MentorshipProgram } from '@/lib/mentorship/types';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_programs')
    .select('*')
    .eq('id', params.id)
    .single() as { data: MentorshipProgram | null; error: unknown };

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ program: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin']);
  if (session instanceof NextResponse) return session;

  let body: Partial<MentorshipProgram>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_programs')
    .update(body as Record<string, unknown>)
    .eq('id', params.id)
    .select()
    .single() as { data: MentorshipProgram | null; error: unknown };

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });
  return NextResponse.json({ program: data });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin']);
  if (session instanceof NextResponse) return session;

  const db = getMentorshipDb();
  const { error } = await db.from('mentorship_programs').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });
  return NextResponse.json({ success: true });
}
