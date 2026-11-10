import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'super_admin';
  createdAt: number;
  expiresAt: number;
}

const COOKIE_NAME = 'techneeds_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SIGNING_SECRET =
  process.env.QR_SIGNING_SECRET || 'techneeds-secure-session-signing-key-igdtuw-2026';

function signData(dataStr: string): string {
  const signature = crypto.createHmac('sha256', SIGNING_SECRET).update(dataStr).digest('base64url');
  return `${Buffer.from(dataStr).toString('base64url')}.${signature}`;
}

function verifySignedData(signedStr: string): string | null {
  const parts = signedStr.split('.');
  if (parts.length !== 2) return null;

  const [b64Data, signature] = parts;
  const dataStr = Buffer.from(b64Data, 'base64url').toString('utf8');
  const expectedSignature = crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(dataStr)
    .digest('base64url');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return dataStr;
  }
  return null;
}

/**
 * Creates and persists a secure HTTP-only session cookie for the verified student or admin
 */
export async function createStudentSession(email: string, customName?: string): Promise<UserSession> {
  const cookieStore = cookies();
  const normalizedEmail = email.trim().toLowerCase();
  const isAdmin = normalizedEmail === (process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@techneeds.live');

  let userId = crypto.randomUUID();
  let name = customName || normalizedEmail.split('@')[0];
  let role: 'student' | 'admin' | 'super_admin' = isAdmin ? 'admin' : 'student';

  // Attempt to check/upsert into Supabase profiles if database is configured
  try {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (profile) {
      userId = profile.id;
      name = profile.full_name || name;
      role = profile.role || role;
    } else {
      // Create new profile record
      await supabase.from('profiles').insert({
        id: userId,
        email: normalizedEmail,
        full_name: name,
        role,
      });
    }
  } catch {
    // If Supabase is placeholder or offline, continue with secure signed session
  }

  const now = Date.now();
  const session: UserSession = {
    userId,
    email: normalizedEmail,
    name,
    role,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };

  const signedToken = signData(JSON.stringify(session));

  cookieStore.set(COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });

  return session;
}

/**
 * Reads and verifies the current session from HTTP-only cookie
 */
export async function getStudentSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    const rawJson = verifySignedData(cookie.value);
    if (!rawJson) return null;

    const session = JSON.parse(rawJson) as UserSession;
    if (Date.now() > session.expiresAt) {
      cookieStore.delete(COOKIE_NAME);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Universal authenticated user retriever:
 * Checks signed session cookie first, then falls back to Supabase auth user
 */
export async function getAuthenticatedUser(): Promise<{
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'super_admin';
} | null> {
  // 1. Check custom signed cookie session
  const session = await getStudentSession();
  if (session) {
    return {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    };
  }

  // 2. Check Supabase auth
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let role: 'student' | 'admin' | 'super_admin' = 'student';
      let name = user.email ? user.email.split('@')[0] : 'Student';
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .maybeSingle();
        if (profile?.role) role = profile.role as any;
        if (profile?.full_name) name = profile.full_name;
      } catch {
        // continue
      }
      return {
        id: user.id,
        email: user.email || '',
        name,
        role,
      };
    }
  } catch {
    // continue
  }

  return null;
}

/**
 * Destroys the current session
 */
export async function destroyStudentSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}
