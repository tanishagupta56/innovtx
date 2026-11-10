'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/app/(auth)/actions';

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    setSuccess('');
    const result = await forgotPassword(formData);
    if (result?.error) setError(result.error);
    else if (result?.success) setSuccess(result.success);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-2xl font-bold">
          <span className="text-white">Tech</span>
          <span className="text-lime">Needs</span>
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mt-6">Reset Password</h1>
        <p className="text-gray-500 mt-2">We&apos;ll send you a reset link</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-lime/10 border border-lime/20 text-lime text-sm">{success}</div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">Email</label>
          <input id="email" name="email" type="email" required className="input-field" placeholder="you@igdtuw.ac.in" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        <Link href="/login" className="text-cobalt-300 hover:text-lime transition-colors">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
