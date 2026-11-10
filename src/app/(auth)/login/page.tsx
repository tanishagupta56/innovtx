'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login } from '@/app/(auth)/actions';

function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    if (redirectTo) formData.set('redirect', redirectTo);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-2xl font-bold">
          <span className="text-white">Tech</span>
          <span className="text-lime">Needs</span>
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mt-6">Sign In</h1>
        <p className="text-gray-500 mt-2">Welcome back to TechNeeds</p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-1.5 font-mono">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="you@igdtuw.ac.in"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-400 mb-1.5 font-mono">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input-field"
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-cobalt-300 hover:text-cobalt-200">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-cobalt-300 hover:text-lime transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-xs font-mono text-gray-500">Loading sign-in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
