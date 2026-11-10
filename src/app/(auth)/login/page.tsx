'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { login, sendLoginOtp, verifyLoginOtp } from '@/app/(auth)/actions';

function LoginForm() {
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirect') || '';

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle password submission
  async function handlePasswordSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    setMessage('');
    if (redirectTo) formData.set('redirect', redirectTo);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  // Handle send OTP
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid student email address.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    const res = await sendLoginOtp(email);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setStep('otp');
      setMessage(`A 6-digit access code has been dispatched to ${email}`);
      setCountdown(45);
    }
  }

  // Handle verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otpToken.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await verifyLoginOtp(email, otpToken, redirectTo);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  // Handle resend OTP
  async function handleResendOtp() {
    if (countdown > 0 || loading) return;
    setLoading(true);
    setError('');
    const res = await sendLoginOtp(email);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setMessage(`A fresh 6-digit code has been dispatched to ${email}`);
      setCountdown(45);
    }
  }

  return (
    <div className="w-full max-w-md p-8 sm:p-10 border border-charcoal-border bg-charcoal/90 backdrop-blur-xl relative shadow-[0_0_50px_rgba(49,94,255,0.15)] rounded-2xl">
      {/* Brand Header */}
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
            STUDENT <span className="text-lime-green">PORTAL</span>
          </h1>
        </Link>
        <p className="font-mono text-xs text-muted-text mt-1 uppercase tracking-widest">
          TECHNEEDS IGDTUW AUTHENTICATION
        </p>
      </div>

      {/* Mode Switcher: One-Time Passcode vs Secret Password */}
      <div className="grid grid-cols-2 p-1 mb-6 bg-deep-ink border border-charcoal-border rounded-lg font-mono text-xs">
        <button
          type="button"
          onClick={() => {
            setAuthMode('otp');
            setStep('email');
            setError('');
            setMessage('');
          }}
          className={`py-2 rounded-md transition-all uppercase tracking-wider font-semibold ${
            authMode === 'otp'
              ? 'bg-electric-blue text-soft-white shadow-[0_0_12px_rgba(49,94,255,0.4)]'
              : 'text-muted-text hover:text-soft-white'
          }`}
        >
          Email OTP
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('password');
            setError('');
            setMessage('');
          }}
          className={`py-2 rounded-md transition-all uppercase tracking-wider font-semibold ${
            authMode === 'password'
              ? 'bg-electric-blue text-soft-white shadow-[0_0_12px_rgba(49,94,255,0.4)]'
              : 'text-muted-text hover:text-soft-white'
          }`}
        >
          Password
        </button>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="p-3 mb-5 bg-red-950/70 border border-burnt-orange/50 text-red-200 text-xs font-mono rounded-lg">
          <span className="text-burnt-orange font-bold mr-1">[AUTH ALERT]</span> {error}
        </div>
      )}

      {message && (
        <div className="p-3 mb-5 bg-lime-green/10 border border-lime-green/30 text-lime-green text-xs font-mono rounded-lg">
          <span className="font-bold mr-1">✓</span> {message}
        </div>
      )}

      {/* MODE 1: OTP AUTHENTICATION */}
      {authMode === 'otp' && (
        <>
          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label htmlFor="otp-email" className="block text-xs font-mono text-muted-text uppercase mb-2">
                  Student Email Address
                </label>
                <input
                  id="otp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field font-mono text-xs rounded-lg"
                  placeholder="e.g. rollnumber@igdtuw.ac.in"
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 rounded-lg font-bold"
              >
                {loading ? 'Transmitting Code...' : 'Request One-Time Code →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="otp-code" className="text-xs font-mono text-muted-text uppercase">
                    6-Digit Security Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtpToken('');
                    }}
                    className="text-[11px] font-mono text-electric-blue hover:underline"
                  >
                    Change Email
                  </button>
                </div>
                <input
                  id="otp-code"
                  type="text"
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                  required
                  className="input-field font-mono text-lg text-center tracking-[0.4em] font-bold rounded-lg"
                  placeholder="000000"
                  autoFocus
                />
                <p className="text-[11px] font-mono text-muted-text mt-2 text-center">
                  Sent to <span className="text-soft-white font-semibold">{email}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otpToken.length < 6}
                className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 rounded-lg font-bold disabled:opacity-50"
              >
                {loading ? 'Validating Token...' : 'Verify Code & Enter Portal →'}
              </button>

              <div className="text-center pt-2 font-mono text-xs">
                {countdown > 0 ? (
                  <span className="text-muted-text">
                    Resend available in <span className="text-lime-green">{countdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-electric-blue hover:text-lime-green underline"
                  >
                    Resend Verification Code
                  </button>
                )}
              </div>
            </form>
          )}
        </>
      )}

      {/* MODE 2: PASSWORD AUTHENTICATION */}
      {authMode === 'password' && (
        <form action={handlePasswordSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-mono text-muted-text uppercase mb-2">
              Student Email
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

          <div>
            <label htmlFor="password" className="block text-xs font-mono text-muted-text uppercase mb-2">
              Password Secret
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field font-mono text-xs rounded-lg"
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex justify-end font-mono text-xs">
            <Link href="/forgot-password" className="text-electric-blue hover:text-lime-green">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 rounded-lg font-bold"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal →'}
          </button>
        </form>
      )}

      {/* Footer link to Registration */}
      <div className="mt-8 pt-6 border-t border-charcoal-border text-center font-mono text-xs text-muted-text">
        New student member?{' '}
        <Link href="/signup" className="text-lime-green hover:underline font-bold">
          Register Member Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="font-mono text-xs text-muted-text">Loading authentication portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
