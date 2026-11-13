/**
 * GET  /api/mentorship/programs          — list all programs (public)
 * POST /api/mentorship/programs          — create program (admin only)
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';
import { ensureMentorshipAdminSeeded } from '@/lib/mentorship/seed';
import type { MentorshipProgram } from '@/lib/mentorship/types';

export async function GET() {
  await ensureMentorshipAdminSeeded();
  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_programs')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ programs: (data as MentorshipProgram[]) ?? [] });
}

export async function POST(request: Request) {
  const session = await requireMentorshipRole(request, ['admin']);
  if (session instanceof NextResponse) return session;

  let body: Partial<MentorshipProgram>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (!body.title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const db = getMentorshipDb();
  const { data, error } = await db
    .from('mentorship_programs')
    .insert({
      title: body.title,
      description: body.description ?? null,
      tech_tags: body.tech_tags ?? [],
      start_date: body.start_date ?? null,
      end_date: body.end_date ?? null,
      status: body.status ?? 'upcoming',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ program: data as MentorshipProgram }, { status: 201 });
}
