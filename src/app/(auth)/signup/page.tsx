'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signup } from '@/app/(auth)/actions';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    setSuccess('');
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-2xl font-bold">
          <span className="text-white">Tech</span>
          <span className="text-lime">Needs</span>
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mt-6">Create Account</h1>
        <p className="text-gray-500 mt-2">Join TechNeeds IGDTUW</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-lime/10 border border-lime/20 text-lime text-sm">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="block text-sm text-gray-400 mb-1.5">Full Name</label>
          <input id="fullName" name="fullName" type="text" required className="input-field" placeholder="Your full name" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5">Email</label>
          <input id="email" name="email" type="email" required className="input-field" placeholder="you@igdtuw.ac.in" />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-400 mb-1.5">Password</label>
          <input id="password" name="password" type="password" required minLength={8} className="input-field" placeholder="Min. 8 characters" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-cobalt-300 hover:text-lime transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
