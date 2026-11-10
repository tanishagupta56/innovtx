'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="w-full max-w-md p-8 sm:p-10 border border-charcoal-border bg-charcoal/90 backdrop-blur-xl relative shadow-[0_0_50px_rgba(49,94,255,0.15)] rounded-2xl">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group">
          <div className="relative w-12 h-12 mx-auto mb-3">
            <Image
              src="/brand/techneeds-logo.png"
              alt="TechNeeds IGDTUW"
              fill
              sizes="48px"
              className="object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(49,94,255,0.4)]"
            />
          </div>
          <h1 className="editorial-title text-3xl font-extrabold text-soft-white tracking-tight uppercase">
            RESET <span className="text-lime-green">SECRET</span>
          </h1>
        </Link>
        <p className="font-mono text-xs text-muted-text mt-1 uppercase tracking-widest">
          PASSWORD RECOVERY PROTOCOL
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-950/70 border border-burnt-orange/50 text-red-200 text-xs font-mono rounded-lg">
            <span className="text-burnt-orange font-bold mr-1">[ALERT]</span> {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-lime-green/10 border border-lime-green/30 text-lime-green text-xs font-mono rounded-lg">
            <span className="font-bold mr-1">✓</span> {success}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-mono text-muted-text uppercase mb-2">
            Registered Student Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-field font-mono text-xs rounded-lg"
            placeholder="you@igdtuw.ac.in"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 mt-2 rounded-lg font-bold"
        >
          {loading ? 'Transmitting Link...' : 'Send Reset Link →'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-charcoal-border text-center font-mono text-xs">
        <Link href="/login" className="text-muted-text hover:text-lime-green">
          ← Return to Student Sign In
        </Link>
      </div>
    </div>
  );
}
