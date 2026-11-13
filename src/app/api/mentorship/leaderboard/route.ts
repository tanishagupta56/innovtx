/**
 * GET /api/mentorship/leaderboard
 * Query: ?program_id=&limit=50
 *
 * Returns mentees ranked by total score, with cohort rank,
 * completion percentage, and submission counts.
 */
import { NextResponse } from 'next/server';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { getMentorshipSession } from '@/lib/mentorship/jwt';
import type { MentorshipUser, MentorshipSubmission } from '@/lib/mentorship/types';

export async function GET(request: Request) {
  const session = await getMentorshipSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const programId = searchParams.get('program_id');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

  const db = getMentorshipDb();

  // Get all mentees in the program
  let menteeQuery = db
    .from('mentorship_users')
    .select('id, name, enrollment_no, tags, program_ids')
    .eq('role', 'mentee');

  if (programId) {
    menteeQuery = menteeQuery.overlaps('program_ids', [programId]);
  }

  const { data: mentees, error: menteeErr } = await menteeQuery as {
    data: Array<Pick<MentorshipUser, 'id' | 'name' | 'enrollment_no' | 'tags' | 'program_ids'>> | null;
    error: unknown;
  };

  if (menteeErr) return NextResponse.json({ error: (menteeErr as { message: string }).message }, { status: 500 });
  if (!mentees || mentees.length === 0) return NextResponse.json({ leaderboard: [] });

  const menteeIds = mentees.map((m) => m.id);

  // Get total resources for the program (for completion %)
  let resourceQuery = db
    .from('mentorship_resources')
    .select('id', { count: 'exact', head: true });
  if (programId) resourceQuery = resourceQuery.eq('program_id', programId);
  const { count: totalResources } = await resourceQuery;

  // Get all submissions for these mentees
  const { data: submissions } = await db
    .from('mentorship_submissions')
    .select('mentee_id, score, status, resource_id')
    .in('mentee_id', menteeIds) as {
    data: Array<Pick<MentorshipSubmission, 'mentee_id' | 'score' | 'status' | 'resource_id'>> | null;
  };

  // Build leaderboard
  const rows = mentees.map((mentee) => {
    const menteeSubmissions = (submissions ?? []).filter((s) => s.mentee_id === mentee.id);
    const totalScore = menteeSubmissions.reduce((acc, s) => acc + (s.score ?? 0), 0);
    const completed = menteeSubmissions.filter(
      (s) => s.status === 'graded' || s.status === 'submitted'
    ).length;
    const completionPct = totalResources ? Math.round((completed / totalResources) * 100) : 0;

    return {
      id: mentee.id,
      name: mentee.name,
      enrollment_no: mentee.enrollment_no,
      tags: mentee.tags,
      total_score: totalScore,
      completed_count: completed,
      total_resources: totalResources ?? 0,
      completion_pct: completionPct,
    };
  });

  // Sort by total score descending, then alphabetically
  rows.sort((a, b) => b.total_score - a.total_score || a.name.localeCompare(b.name));

  const ranked = rows.slice(0, limit).map((row, idx) => ({ ...row, rank: idx + 1 }));

  return NextResponse.json({ leaderboard: ranked, total: rows.length });
}
