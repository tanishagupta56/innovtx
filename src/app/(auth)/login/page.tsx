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
    <div className="w-full max-w-md p-8 sm:p-10 border border-cobalt/30 bg-[#050917] relative shadow-[0_0_50px_rgba(21,88,201,0.2)]">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group">
          <span className="w-10 h-10 bg-[#0a1228] border border-cobalt/60 inline-flex items-center justify-center font-mono text-sm text-lime group-hover:border-lime group-hover:shadow-[0_0_15px_#D4FF24] transition-all mb-3">
            TN
          </span>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            STUDENT <span className="text-lime">PORTAL</span>
          </h1>
        </Link>
        <p className="font-mono text-xs text-gray-400 mt-1 uppercase tracking-widest">
          TECHNEEDS IGDTUW AUTHENTICATION
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
            [ACCESS ERROR] {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-mono text-gray-300 uppercase mb-2">
            Student Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-field font-mono text-xs"
            placeholder="you@igdtuw.ac.in"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-mono text-gray-300 uppercase mb-2">
            Password Secret
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input-field font-mono text-xs"
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-end font-mono text-xs">
          <Link href="/forgot-password" className="text-cobalt-300 hover:text-lime">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5"
        >
          {loading ? 'Authenticating...' : 'Sign In to Portal →'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-cobalt/15 text-center font-mono text-xs text-gray-400">
        New student member?{' '}
        <Link href="/signup" className="text-lime hover:underline font-bold">
          Register Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="font-mono text-xs text-gray-500">Loading sign-in console...</div>}>
      <LoginForm />
    </Suspense>
  );
}
