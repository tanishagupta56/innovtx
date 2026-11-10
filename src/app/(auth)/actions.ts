'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { loginSchema, signupSchema, forgotPasswordSchema } from '@/lib/validations';
import { requestEmailOtp, verifyEmailOtp } from '@/lib/auth/otp-service';
import { createStudentSession, destroyStudentSession } from '@/lib/auth/session';

/**
 * Password login (legacy / alternative)
 */
export async function login(formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const email = result.data.email.trim().toLowerCase();

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(result.data);

    if (error) {
      if (error.message.includes('fetch') || error.message.includes('Placeholder')) {
        return {
          error:
            'Direct password auth requires Supabase credentials. Use Email OTP login for instant passwordless access.',
        };
      }
      return { error: error.message };
    }

    // Also establish cookie session
    await createStudentSession(email);
  } catch (err: any) {
    return { error: err?.message || 'Authentication request failed. Please try again.' };
  }

  const redirectTo = (formData.get('redirect') as string) || '/dashboard';
  redirect(redirectTo);
}

/**
 * Step 1: Request 6-digit secure OTP delivered via Resend
 */
export async function sendLoginOtp(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid student email address.' };
  }

  const result = await requestEmailOtp(email);

  if (!result.success) {
    return { error: result.error, cooldownRemaining: result.cooldownRemaining };
  }

  return { success: result.message };
}

/**
 * Step 2: Verify 6-digit OTP, authenticate user, create session & redirect
 */
export async function verifyLoginOtp(email: string, token: string, redirectTo?: string) {
  if (!token || token.length < 6) {
    return { error: 'Please enter a valid 6-digit verification code.' };
  }

  const result = await verifyEmailOtp(email, token);

  if (!result.success) {
    return { error: result.error, expired: result.expired };
  }

  // Create secure HTTP-only signed session & auto-provision account if new
  await createStudentSession(email);

  redirect(redirectTo || '/dashboard');
}

/**
 * Student Registration Flow: Request Email OTP with student metadata
 */
export async function signup(formData: FormData) {
  const result = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const email = result.data.email.trim().toLowerCase();
  const fullName = result.data.fullName.trim();

  // Send real email OTP via Resend
  const otpRes = await requestEmailOtp(email);

  if (!otpRes.success) {
    return { error: otpRes.error };
  }

  return {
    success: otpRes.message || `Verification code sent to ${email}`,
    needsOtp: true,
    email,
    fullName,
  };
}

/**
 * Verify Signup OTP & Provision User Account
 */
export async function verifySignupOtp(email: string, token: string, fullName?: string) {
  if (!token || token.length < 6) {
    return { error: 'Please enter a valid 6-digit verification code.' };
  }

  const result = await verifyEmailOtp(email, token);

  if (!result.success) {
    return { error: result.error, expired: result.expired };
  }

  // Create session & persist profile
  await createStudentSession(email, fullName);

  redirect('/dashboard');
}

/**
 * Password Recovery
 */
export async function forgotPassword(formData: FormData) {
  const result = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const email = result.data.email.trim().toLowerCase();

  // Trigger secure OTP for passwordless recovery
  const otpRes = await requestEmailOtp(email);
  if (!otpRes.success) {
    return { error: otpRes.error };
  }

  return {
    success: `A 6-digit security code has been dispatched to ${email}. You can use it to log in directly.`,
  };
}

/**
 * Destroy session and sign out
 */
export async function signOut() {
  await destroyStudentSession();
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  redirect('/');
}

/**
 * Administrator Login
 */
export async function adminLogin(formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const email = result.data.email.trim().toLowerCase();
  const adminEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@techneeds.live').toLowerCase();

  // Check if credentials match bootstrap or supabase admin
  if (email === adminEmail && result.data.password === (process.env.ADMIN_BOOTSTRAP_PASSWORD || 'TechNeeds@Admin2026!')) {
    await createStudentSession(email, 'Administrator');
    redirect('/admin');
  }

  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword(result.data);

    if (authError) {
      return { error: authError.message };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      await supabase.auth.signOut();
      return { error: 'Access denied. Administrator privileges required.' };
    }

    await createStudentSession(email, profile.role);
  } catch (err: any) {
    return { error: err?.message || 'Admin authentication failed.' };
  }

  redirect('/admin');
}
