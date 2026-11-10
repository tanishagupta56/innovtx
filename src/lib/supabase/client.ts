import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  return createBrowserClient(url, key, {
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const urlStr = typeof input === 'string' ? input : input.toString();
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
        const timeoutId = setTimeout(() => controller.abort(), 3500);
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
