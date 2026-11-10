'use client';

import { useState } from 'react';
import { adminLogin } from '@/app/(auth)/actions';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="min-h-screen bg-deep-ink flex items-center justify-center px-6 py-12 relative overflow-hidden z-10">
      <div className="w-full max-w-md relative z-10 p-8 border border-charcoal-border bg-charcoal/90 backdrop-blur-xl shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <div className="relative w-12 h-12 mx-auto">
              <Image
                src="/brand/techneeds-logo.png"
                alt="TechNeeds Logo"
                fill
                sizes="48px"
                className="object-contain drop-shadow-[0_0_12px_rgba(49,94,255,0.4)]"
              />
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-burnt-orange animate-pulse" />
            <span className="font-mono text-xs text-burnt-orange uppercase tracking-widest">
              Restricted Console
            </span>
          </div>
          <h1 className="editorial-title text-3xl font-bold text-soft-white tracking-tight uppercase">
            Admin <span className="text-electric-blue">Portal</span>
          </h1>
          <p className="text-muted-text text-xs mt-1 font-mono">
            TechNeeds IGDTUW Society Governance
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/70 border border-burnt-orange/50 text-red-200 text-xs font-mono rounded-lg">
              <span className="text-burnt-orange font-bold mr-1">[AUTH ERROR]</span> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-muted-text mb-1.5 uppercase">
              Admin Identity (Email)
            </label>
            <input
              name="email"
              type="email"
              required
              className="input-field rounded-lg font-mono text-xs"
              placeholder="admin@igdtuw.ac.in"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-text mb-1.5 uppercase">
              Access Secret (Password)
            </label>
            <input
              name="password"
              type="password"
              required
              className="input-field rounded-lg font-mono text-xs"
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-magnetic w-full mt-2 py-3.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold"
          >
            {loading ? 'Authenticating...' : 'Enter Console →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-charcoal-border text-center">
          <Link
            href="/"
            className="text-xs font-mono text-muted-text hover:text-soft-white transition-colors"
          >
            ← Return to public platform
          </Link>
        </div>
      </div>
    </div>
  );
}
