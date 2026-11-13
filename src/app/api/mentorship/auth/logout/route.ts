/**
 * POST /api/mentorship/auth/logout
 * Clears the mentorship_token cookie.
 */
import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/mentorship/jwt';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
