import { createClient } from '@supabase/supabase-js';

// Admin-only server client using secret key — NEVER import in client code
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error('Missing SUPABASE_SECRET_KEY or NEXT_PUBLIC_SUPABASE_URL');
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
