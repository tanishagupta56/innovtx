import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
      }
    } catch (err: any) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err?.message || 'Authentication exchange failed')}`);
    }
  }

  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/dashboard/settings`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
