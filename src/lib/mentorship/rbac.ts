/**
 * RBAC middleware for mentorship API routes.
 * Usage:
 *   const session = await requireMentorshipRole(request, ['admin', 'mentor']);
 *   if (session instanceof NextResponse) return session; // unauthorized
 */
import { NextResponse } from 'next/server';
import { getMentorshipSession, MentorshipJwtPayload } from './jwt';

export type MentorshipRole = 'admin' | 'mentor' | 'mentee';

export async function requireMentorshipRole(
  request: Request,
  allowedRoles: MentorshipRole[]
): Promise<MentorshipJwtPayload | NextResponse> {
  const session = await getMentorshipSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: no mentorship session' }, { status: 401 });
  }
  if (!allowedRoles.includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden: insufficient role' }, { status: 403 });
  }
  return session;
}
