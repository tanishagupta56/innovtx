import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// Simple in-memory rate limiter (prototype-grade, resets on restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 120; // max requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rate limit mutation endpoints
  if (
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/tickets') ||
    pathname.startsWith('/api/events/register')
  ) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Pass current pathname down to server components via custom request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const res = await updateSession(request);
  res.headers.set('x-pathname', pathname);

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
