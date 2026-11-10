import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;

if (!url || !secretKey || !adminEmail) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, or ADMIN_BOOTSTRAP_EMAIL.');
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runSeed() {
  console.log(`Bootstrapping admin role for: ${adminEmail}...`);

  // Look up profile by email
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('email', adminEmail)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error.message);
    process.exit(1);
  }

  if (!profile) {
    console.log(`Profile with email ${adminEmail} not found. Please register this user via /signup or invite them in Supabase Auth first, then rerun this script.`);
    return;
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'super_admin' })
    .eq('id', profile.id);

  if (updateError) {
    console.error('Failed to promote user to super_admin:', updateError.message);
    process.exit(1);
  }

  console.log(`Successfully promoted ${adminEmail} (id: ${profile.id}) to super_admin!`);
}

runSeed();
