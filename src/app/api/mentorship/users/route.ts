/**
 * GET  /api/mentorship/users          — list users (admin: all; mentor: mentees in their programs)
 * POST /api/mentorship/users          — onboard mentor or mentee (admin for mentor, mentor for mentee)
 */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getMentorshipDb } from '@/lib/mentorship/db';
import { requireMentorshipRole } from '@/lib/mentorship/rbac';
import { generateEnrollmentNo, generateTempPassword } from '@/lib/mentorship/credentials';
import type { MentorshipUser } from '@/lib/mentorship/types';

export async function GET(request: Request) {
  const session = await requireMentorshipRole(request, ['admin', 'mentor']);
  if (session instanceof NextResponse) return session;

  const db = getMentorshipDb();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  type UserRow = Pick<MentorshipUser, 'id' | 'name' | 'role' | 'email' | 'enrollment_no' | 'program_ids' | 'tags' | 'created_at'>;

  let query = db
    .from('mentorship_users')
    .select('id, name, role, email, enrollment_no, program_ids, tags, created_at')
    .order('created_at', { ascending: false });

  if (session.role === 'mentor') {
    const { data: mentor } = await db
      .from('mentorship_users')
      .select('program_ids')
      .eq('id', session.sub)
      .single() as { data: { program_ids: string[] } | null };
    const programIds = mentor?.program_ids ?? [];
    query = query.eq('role', 'mentee').overlaps('program_ids', programIds);
  } else if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query as { data: UserRow[] | null; error: unknown };
  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
  return NextResponse.json({ users: data ?? [] });
}

export async function POST(request: Request) {
  const session = await requireMentorshipRole(request, ['admin', 'mentor']);
  if (session instanceof NextResponse) return session;

  let body: { name?: string; role?: 'mentor' | 'mentee'; email?: string; program_ids?: string[]; tags?: string[] };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { name, role, email, program_ids, tags } = body;

  if (session.role === 'mentor' && role !== 'mentee') {
    return NextResponse.json({ error: 'Mentors can only add mentees' }, { status: 403 });
  }

  if (!name || !role) return NextResponse.json({ error: 'name and role required' }, { status: 400 });

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);
  const db = getMentorshipDb();

  const isMentee = role === 'mentee';
  const enrollmentNo = isMentee ? await generateEnrollmentNo() : null;

  type InsertedUser = Pick<MentorshipUser, 'id' | 'name' | 'role' | 'email' | 'enrollment_no' | 'program_ids' | 'tags' | 'created_at'>;

  const { data: user, error } = await db
    .from('mentorship_users')
    .insert({
      name,
      role,
      email: email ?? null,
      enrollment_no: enrollmentNo,
      password_hash: passwordHash,
      program_ids: program_ids ?? [],
      tags: tags ?? [],
    })
    .select('id, name, role, email, enrollment_no, program_ids, tags, created_at')
    .single() as { data: InsertedUser | null; error: unknown };

  if (error) return NextResponse.json({ error: (error as { message: string }).message }, { status: 400 });

  return NextResponse.json({
    user,
    credentials: {
      identifier: isMentee ? user!.enrollment_no : user!.email,
      tempPassword,
      note: 'Share these credentials once — they cannot be retrieved again.',
    },
  }, { status: 201 });
}
