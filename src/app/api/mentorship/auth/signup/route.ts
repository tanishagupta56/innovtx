/**
 * POST /api/mentorship/auth/signup
 * Self sign-up for mentees into active cohorts.
 * Auto-assigns unique enrollment number TN-YYYY-XXXX.
 */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { generateEnrollmentNo } from '@/lib/mentorship/credentials';
import { signMentorshipToken, COOKIE_NAME } from '@/lib/mentorship/jwt';
import { ensureMentorshipAdminSeeded } from '@/lib/mentorship/seed';
import type { MentorshipProgram, MentorshipUser } from '@/lib/mentorship/types';

export async function POST(request: Request) {
  await ensureMentorshipAdminSeeded();
  let body: {
    name?: string;
    email?: string;
    password?: string;
    program_id?: string;
    interest_tags?: string[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  const { name, email, password, program_id, interest_tags } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
  }
  if (!email || !email.trim() || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }
  if (!program_id) {
    return NextResponse.json({ error: 'Active cohort selection is required' }, { status: 400 });
  }

  const db = getMentorshipDb();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if cohort exists and is active
  const { data: program } = await db
    .from('mentorship_programs')
    .select('id, title, status')
    .eq('id', program_id)
    .single() as { data: Partial<MentorshipProgram> | null };

  if (!program) {
    return NextResponse.json({ error: 'Selected cohort does not exist' }, { status: 404 });
  }
  if (program.status !== 'active') {
    return NextResponse.json({ error: 'Registration is only available for active cohorts' }, { status: 400 });
  }

  // Check if email already registered
  const { data: existingUser } = await db
    .from('mentorship_users')
    .select('id')
    .eq('email', normalizedEmail)
    .limit(1) as { data: Partial<MentorshipUser>[] | null };

  if (existingUser && existingUser.length > 0) {
    return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 });
  }

  // Generate unique enrollment number
  const enrollmentNo = await generateEnrollmentNo();
  const passwordHash = await bcrypt.hash(password, 12);
  const tags = Array.isArray(interest_tags) ? interest_tags : [];

  const defaultAvatar = {
    preset: 'Cyber Architect',
    accent: '#315EFF',
    seed: name.trim().toLowerCase().replace(/\s+/g, '-'),
  };

  const { data: user, error } = await db
    .from('mentorship_users')
    .insert({
      name: name.trim(),
      role: 'mentee',
      email: normalizedEmail,
      enrollment_no: enrollmentNo,
      password_hash: passwordHash,
      program_ids: [program_id],
      tags,
      interest_tags: tags,
      avatar_config: defaultAvatar,
    })
    .select('id, name, role, email, enrollment_no, program_ids, tags, interest_tags, avatar_config, created_at')
    .single() as { data: MentorshipUser | null; error: unknown };

  if (error || !user) {
    return NextResponse.json(
      { error: (error as { message?: string })?.message || 'Failed to create mentee account' },
      { status: 500 }
    );
  }

  const token = await signMentorshipToken({
    sub: user.id,
    role: 'mentee',
    name: user.name,
  });

  const response = NextResponse.json({
    success: true,
    user,
    enrollment_no: enrollmentNo,
    token,
  }, { status: 201 });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
