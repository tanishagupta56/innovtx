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
    <div className="w-full max-w-md p-8 sm:p-10 border border-cobalt/30 bg-[#050917] relative shadow-[0_0_50px_rgba(21,88,201,0.2)]">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group">
          <span className="w-10 h-10 bg-[#0a1228] border border-cobalt/60 inline-flex items-center justify-center font-mono text-sm text-lime group-hover:border-lime group-hover:shadow-[0_0_15px_#D4FF24] transition-all mb-3">
            TN
          </span>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            RESET <span className="text-lime">SECRET</span>
          </h1>
        </Link>
        <p className="font-mono text-xs text-gray-400 mt-1 uppercase tracking-widest">
          PASSWORD RECOVERY PROTOCOL
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
            [ERROR] {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-lime/10 border border-lime/30 text-lime text-xs font-mono">
            [LINK DISPATCHED] {success}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-mono text-gray-300 uppercase mb-2">
            Registered Email
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

        <button
          type="submit"
          disabled={loading}
          className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 mt-2"
        >
          {loading ? 'Transmitting Link...' : 'Send Reset Link →'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-cobalt/15 text-center font-mono text-xs">
        <Link href="/login" className="text-gray-400 hover:text-lime">
          ← Return to Student Sign In
        </Link>
      </div>
    </div>
  );
}
