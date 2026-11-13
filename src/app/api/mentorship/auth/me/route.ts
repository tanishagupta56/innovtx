/**
 * GET  /api/mentorship/auth/me
 * Returns the current mentorship session user (from cookie).
 */
import { NextResponse } from 'next/server';
import { getMentorshipSession } from '@/lib/mentorship/jwt';
import { getMentorshipDb } from '@/lib/mentorship/db';

export async function GET(request: Request) {
  const session = await getMentorshipSession(request);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const db = getMentorshipDb();
  const { data: user } = await db
    .from('mentorship_users')
    .select('id, name, role, email, enrollment_no, program_ids, tags, interest_tags, avatar_config')
    .eq('id', session.sub)
    .single();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user });
}
