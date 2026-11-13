/**
 * GET  /api/mentorship/resources          — list resources for a program
 * POST /api/mentorship/resources          — create resource (mentor/admin)
 *
 * Query params for GET: ?program_id=&type=
 * Server-side deadline enforcement: past-deadline submissions blocked in submission route.
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';
import { getMentorshipSession } from '@/lib/mentorship/jwt';
import type { MentorshipResource } from '@/lib/mentorship/types';

export async function GET(request: Request) {
  const session = await getMentorshipSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const programId = searchParams.get('program_id');
  const type = searchParams.get('type');

  const db = getMentorshipDb();
  let query = db
    .from('mentorship_resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (programId) query = query.eq('program_id', programId);
  if (type) query = query.eq('type', type);

  const { data, error } = await query as { data: MentorshipResource[] | null; error: unknown };
  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
  return NextResponse.json({ resources: data ?? [] });
}

export async function POST(request: Request) {
  const session = await requireMentorshipRole(request, ['admin', 'mentor']);
  if (session instanceof NextResponse) return session;

  let body: Partial<MentorshipResource> & { program_id: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (!body.program_id || !body.type || !body.title) {
    return NextResponse.json({ error: 'program_id, type, title required' }, { status: 400 });
  }
  if (!body.deadline) return NextResponse.json({ error: 'deadline is required' }, { status: 400 });
  if (body.max_score === undefined || body.max_score === null) {
    return NextResponse.json({ error: 'max_score is required' }, { status: 400 });
  }

  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_resources')
    .insert({ ...(body as Record<string, unknown>), created_by: session.sub })
    .select()
    .single() as { data: MentorshipResource | null; error: unknown };

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });
  return NextResponse.json({ resource: data }, { status: 201 });
}
