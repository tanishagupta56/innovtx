/**
 * Custom JWT helpers for the mentorship portal.
 * Uses jose (pure-JS) + a MENTORSHIP_JWT_SECRET env var.
 * Tokens are stored in a httpOnly `mentorship_token` cookie — 
 * completely separate from any Supabase auth session.
 * Also supports Bearer token in Authorization header for API clients.
 */
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'mentorship_token';
const EXPIRY = '7d';

function getSecret() {
  const raw = process.env.MENTORSHIP_JWT_SECRET || 'mentorship-dev-secret-min-32-chars-long!!';
  return new TextEncoder().encode(raw);
}

export interface MentorshipJwtPayload {
  sub: string;      // user row id
  role: 'admin' | 'mentor' | 'mentee';
  name: string;
  iat?: number;
  exp?: number;
}

export async function signMentorshipToken(payload: Omit<MentorshipJwtPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

export async function verifyMentorshipToken(token: string): Promise<MentorshipJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as MentorshipJwtPayload;
  } catch {
    return null;
  }
}

/** Read portal token from Authorization header or cookie. */
export async function getMentorshipSession(request?: Request): Promise<MentorshipJwtPayload | null> {
  let token: string | undefined;

  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // In some execution contexts cookies() may throw
    }
  }

  if (!token) return null;
  return verifyMentorshipToken(token);
}

export { COOKIE_NAME };
