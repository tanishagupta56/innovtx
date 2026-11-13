/**
 * GET  /api/mentorship/submissions          — list submissions
 *   ?resource_id= ?mentee_id= (mentee sees own; mentor/admin see all in their programs)
 * POST /api/mentorship/submissions          — submit (mentee only)
 *   Server-side deadline enforcement: 403 if past deadline.
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';
import { getMentorshipSession } from '@/lib/mentorship/jwt';
import type { MentorshipResource, MentorshipSubmission } from '@/lib/mentorship/types';

export async function GET(request: Request) {
  const session = await getMentorshipSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const resourceId = searchParams.get('resource_id');
  const menteeId = searchParams.get('mentee_id');

  const db = getMentorshipDb();
  let query = db.from('mentorship_submissions').select('*').order('submitted_at', { ascending: false });

  if (session.role === 'mentee') {
    query = query.eq('mentee_id', session.sub);
  } else if (menteeId) {
    query = query.eq('mentee_id', menteeId);
  }

  if (resourceId) query = query.eq('resource_id', resourceId);

  const { data, error } = await query as { data: MentorshipSubmission[] | null; error: unknown };
  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
  return NextResponse.json({ submissions: data ?? [] });
}

export async function POST(request: Request) {
  const session = await requireMentorshipRole(request, ['mentee']);
  if (session instanceof NextResponse) return session;

  let body: {
    resource_id?: string;
    answers?: Record<string, string | number>;
    link?: string;
    repo_url?: string;
    demo_url?: string;
    notes?: string;
  };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { resource_id, answers, link, repo_url, demo_url, notes } = body;
  if (!resource_id) return NextResponse.json({ error: 'resource_id required' }, { status: 400 });

  const db = getMentorshipDb();

  // Fetch resource to check deadline and type
  const { data: resource } = await db
    .from('mentorship_resources')
    .select('id, type, deadline, max_score, questions')
    .eq('id', resource_id)
    .single() as { data: Partial<MentorshipResource> | null };

  if (!resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

  // Server-side deadline enforcement
  if (resource.deadline && new Date() > new Date(resource.deadline)) {
    return NextResponse.json({ error: 'Deadline passed — submission no longer accepted' }, { status: 403 });
  }

  // Check for existing submission
  const { data: existing } = await db
    .from('mentorship_submissions')
    .select('id')
    .eq('resource_id', resource_id)
    .eq('mentee_id', session.sub)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Already submitted' }, { status: 409 });
  }

  // Auto-score MCQ quizzes
  let score: number | null = null;
  let status = 'submitted';

  if (resource.type === 'quiz' && resource.questions && answers) {
    const questions = resource.questions;
    let earned = 0;
    for (const q of questions) {
      if (answers[q.id] !== undefined && String(answers[q.id]) === String(q.correctAnswer)) {
        earned += q.points ?? 1;
      }
    }
    const maxPoints = questions.reduce((acc, q) => acc + (q.points ?? 1), 0);
    score = maxPoints > 0 ? Math.round((earned / maxPoints) * (resource.max_score ?? 100)) : 0;
    status = 'graded';
  }

  if (resource.type === 'video') {
    score = resource.max_score ?? 10;
    status = 'graded';
  }

  const { data: submission, error } = await db
    .from('mentorship_submissions')
    .insert({
      resource_id,
      mentee_id: session.sub,
      status,
      answers: answers ?? null,
      link: link ?? demo_url ?? repo_url ?? null,
      repo_url: repo_url ?? null,
      demo_url: demo_url ?? null,
      notes: notes ?? null,
      score,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single() as { data: MentorshipSubmission | null; error: unknown };

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });
  return NextResponse.json({ submission }, { status: 201 });
}
