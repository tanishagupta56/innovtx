import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server component invocation
        }
      },
    },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const urlStr = typeof input === 'string' ? input : input.toString();
        // If placeholder URL, respond immediately with 400 so Postgrest does not retry
        if (urlStr.includes('placeholder.supabase.co')) {
          return Promise.resolve(
            new Response(JSON.stringify({ message: 'Placeholder Supabase credentials configured. Please set real credentials in .env.local' }), {
              status: 400,
              statusText: 'Bad Request',
              headers: { 'Content-Type': 'application/json' },
            })
          );
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        return fetch(input, {
          ...init,
          signal: init?.signal || controller.signal,
        })
          .catch((err) => {
            return new Response(JSON.stringify({ message: err.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          })
          .finally(() => clearTimeout(timeoutId));
      },
    },
  });
}
