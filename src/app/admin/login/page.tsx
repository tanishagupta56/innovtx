'use client';

import { useState } from 'react';
import { adminLogin } from '@/app/(auth)/actions';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const result = await adminLogin(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020306] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background technical accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cobalt/20 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10 p-8 border border-cobalt/30 bg-[#070a12] shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span className="font-mono text-xs text-lime uppercase tracking-widest">
              Restricted Console
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-mono">
            TechNeeds IGDTUW Society Governance
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
              [AUTH ERROR] {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">
              Admin Identity (Email)
            </label>
            <input
              name="email"
              type="email"
              required
              className="input-field border-cobalt/40 bg-black/60 focus:border-lime"
              placeholder="admin@igdtuw.ac.in"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">
              Access Secret (Password)
            </label>
            <input
              name="password"
              type="password"
              required
              className="input-field border-cobalt/40 bg-black/60 focus:border-lime"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-cobalt text-white font-display font-semibold hover:bg-cobalt-400 transition-all border border-cobalt/60 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Console'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-cobalt/15 text-center">
          <Link
            href="/"
            className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Return to public platform
          </Link>
        </div>
      </div>
    </div>
  );
}
