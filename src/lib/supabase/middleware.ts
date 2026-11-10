import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' && input.includes('placeholder.supabase.co')) {
          return Promise.reject(new Error('Placeholder Supabase URL'));
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        return fetch(input, {
          ...init,
          signal: init?.signal || controller.signal,
        }).finally(() => clearTimeout(timeoutId));
      },
    },
  });

  // 1. Check Supabase auth user
  let user = null;
  let profile = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
    if (user) {
      const { data: p } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      profile = p;
    }
  } catch {
    user = null;
  }

  // 2. Check custom signed session cookie (techneeds_session)
  const customSessionCookie = request.cookies.get('techneeds_session')?.value;
  let customSession: { userId: string; email: string; role: string; expiresAt: number } | null = null;
  if (customSessionCookie) {
    try {
      const parts = customSessionCookie.split('.');
      if (parts.length === 2) {
        // Base64url decode payload
        const base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = atob(base64);
        const parsed = JSON.parse(jsonStr);
        if (parsed && parsed.expiresAt && Date.now() < parsed.expiresAt) {
          customSession = parsed;
        }
      }
    } catch {
      customSession = null;
    }
  }

  const isAuthenticated = !!user || !!customSession;
  const pathname = request.nextUrl.pathname;

  // Protected student routes
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Protected admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAuthenticated) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }

    const isAdmin =
      (customSession && ['admin', 'super_admin'].includes(customSession.role)) ||
      (profile && ['admin', 'super_admin'].includes(profile.role));

    if (!isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
