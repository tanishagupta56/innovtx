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

  try {
    const { error } = await supabase.auth.signInWithPassword(result.data);

    if (error) {
      if (error.message.includes('fetch') || error.message.includes('Placeholder')) {
        return { error: 'Unable to connect to authentication server. Please check network connectivity or production Supabase credentials in .env.local.' };
      }
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: err?.message || 'Authentication request failed. Please try again.' };
  }

  const redirectTo = (formData.get('redirect') as string) || '/dashboard';
  redirect(redirectTo);
}

export async function sendLoginOtp(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid student email address.' };
  }

  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('signups not allowed') || error.message.toLowerCase().includes('user not found')) {
        return { error: 'No account registered with this email. Please register first.' };
      }
      if (error.message.includes('fetch') || error.message.includes('Placeholder')) {
        return { error: 'Unable to connect to authentication server. Please check .env.local configuration.' };
      }
      return { error: error.message };
    }

    return { success: `6-digit verification code sent to ${email}` };
  } catch (err: any) {
    return { error: err?.message || 'Failed to send verification code. Please check connectivity.' };
  }
}

export async function verifyLoginOtp(email: string, token: string, redirectTo?: string) {
  if (!token || token.length < 6) {
    return { error: 'Please enter a valid 6-digit code.' };
  }

  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: token.trim(),
      type: 'email',
    });

    if (error) {
      if (error.message.toLowerCase().includes('expired')) {
        return { error: 'Verification code has expired. Please request a new code.' };
      }
      return { error: error.message };
    }

    if (data?.user) {
      // Ensure profile exists
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!profile) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          });
        }
      } catch {
        // Continue even if profile check fails
      }
    }
  } catch (err: any) {
    return { error: err?.message || 'OTP verification failed. Please try again.' };
  }

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

  try {
    const { data, error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: { full_name: result.data.fullName },
      },
    });

    if (error) {
      if (error.message.includes('fetch') || error.message.includes('Placeholder')) {
        return { error: 'Unable to connect to authentication server. Please verify .env.local configuration.' };
      }
      if (error.message.toLowerCase().includes('already registered')) {
        return { error: 'An account is already registered with this email. Please sign in instead.' };
      }
      return { error: error.message };
    }

    // Check if session was immediately created (when email confirmation is disabled)
    if (data.session) {
      redirect('/dashboard');
    }

    return {
      success: 'Account registration initiated. Please enter the 6-digit verification code sent to your email.',
      needsOtp: true,
      email: result.data.email,
    };
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err;
    return { error: err?.message || 'Registration request failed. Please check network connectivity.' };
  }
}

export async function verifySignupOtp(email: string, token: string) {
  if (!token || token.length < 6) {
    return { error: 'Please enter a valid 6-digit verification code.' };
  }

  const supabase = createClient();
  try {
    // Attempt verification with signup type first, then fallback to email type
    let { data, error } = await supabase.auth.verifyOtp({
      email,
      token: token.trim(),
      type: 'signup',
    });

    if (error) {
      const fallback = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'email',
      });
      if (!fallback.error) {
        data = fallback.data;
        error = null;
      }
    }

    if (error) {
      if (error.message.toLowerCase().includes('expired')) {
        return { error: 'Verification code expired. Please request a new code.' };
      }
      return { error: error.message };
    }

    if (data?.user) {
      // Ensure profile exists
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'student',
        });
      } catch {
        // Continue
      }
    }
  } catch (err: any) {
    return { error: err?.message || 'OTP verification failed. Please try again.' };
  }

  redirect('/dashboard');
}

export async function forgotPassword(formData: FormData) {
  const supabase = createClient();

  const result = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
      redirectTo: `${origin}/auth/callback?type=recovery`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: 'If an account exists with that email, a password recovery link has been dispatched.' };
  } catch (err: any) {
    return { error: err?.message || 'Password reset request failed.' };
  }
}

export async function signOut() {
  const supabase = createClient();
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
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

  try {
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
  } catch (err: any) {
    return { error: err?.message || 'Admin authentication failed.' };
  }

  redirect('/admin');
}
