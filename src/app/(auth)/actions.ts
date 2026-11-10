'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { loginSchema, signupSchema, forgotPasswordSchema } from '@/lib/validations';

export async function login(formData: FormData) {
  const supabase = createClient();

  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return { error: error.message };
  }

  const redirectTo = formData.get('redirect') as string;
  redirect(redirectTo || '/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const result = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { full_name: result.data.fullName },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Check your email to confirm your account.' };
}

export async function forgotPassword(formData: FormData) {
  const supabase = createClient();

  const result = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : 'http://localhost:3000'}/auth/callback?type=recovery`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'If an account exists with that email, you will receive a password reset link.' };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function adminLogin(formData: FormData) {
  const supabase = createClient();

  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(result.data);

  if (authError) {
    return { error: authError.message };
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    await supabase.auth.signOut();
    return { error: 'Access denied. Admin privileges required.' };
  }

  redirect('/admin');
}
