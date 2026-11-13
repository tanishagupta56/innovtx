/**
 * GET    /api/mentorship/submissions/[id]   — get one submission
 * PATCH  /api/mentorship/submissions/[id]   — grade (mentor/admin)
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';
import type { MentorshipSubmission } from '@/lib/mentorship/types';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_submissions')
    .select('*')
    .eq('id', params.id)
    .single() as { data: MentorshipSubmission | null; error: unknown };

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ submission: data });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireMentorshipRole(request, ['admin', 'mentor']);
  if (session instanceof NextResponse) return session;

  let body: { score?: number; status?: string; feedback?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const db = getMentorshipDb();
  const updates: Record<string, unknown> = {};
  if (body.score !== undefined) updates.score = body.score;
  if (body.status) updates.status = body.status;
  if (body.feedback !== undefined) updates.feedback = body.feedback;
  if (body.score !== undefined) updates.status = 'graded';

  const { data, error } = await db
    .from('mentorship_submissions')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single() as { data: MentorshipSubmission | null; error: unknown };

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });
  return NextResponse.json({ submission: data });
}
