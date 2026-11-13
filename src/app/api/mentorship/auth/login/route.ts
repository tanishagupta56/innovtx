/**
 * POST /api/mentorship/auth/login
 * Body: { identifier: string, password: string }
 * - Admin/mentor: identifier = email
 * - Mentee: identifier = enrollmentNo (TN-YYYY-XXXX)
 */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { signMentorshipToken, COOKIE_NAME } from '@/lib/mentorship/jwt';
import { ensureMentorshipAdminSeeded } from '@/lib/mentorship/seed';
import type { MentorshipUser } from '@/lib/mentorship/types';

export async function POST(request: Request) {
  await ensureMentorshipAdminSeeded();

  let body: { identifier?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { identifier, password } = body;
  if (!identifier || !password) {
    return NextResponse.json({ error: 'identifier and password required' }, { status: 400 });
  }

  const trimmed = identifier.trim();
  const db = getMentorshipDb();
  const isEnrollment = /^TN-\d{4}-\d{4}$/i.test(trimmed);

  let { data: users } = await db
    .from('mentorship_users')
    .select('id, name, role, email, enrollment_no, password_hash')
    .eq(isEnrollment ? 'enrollment_no' : 'email', isEnrollment ? trimmed.toUpperCase() : trimmed.toLowerCase())
    .limit(1) as { data: Partial<MentorshipUser>[] | null };

  // If not found by primary guess, try searching by the other field
  if (!users || users.length === 0) {
    const fallbackRes = await db
      .from('mentorship_users')
      .select('id, name, role, email, enrollment_no, password_hash')
      .eq(isEnrollment ? 'email' : 'enrollment_no', isEnrollment ? trimmed.toLowerCase() : trimmed.toUpperCase())
      .limit(1) as { data: Partial<MentorshipUser>[] | null };
    users = fallbackRes.data;
  }

  const user = users?.[0];
  if (!user || !user.password_hash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signMentorshipToken({
    sub: user.id!,
    role: user.role!,
    name: user.name!,
  });

  const res = NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, role: user.role },
    token,
  });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return res;
}
