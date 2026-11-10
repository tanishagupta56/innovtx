'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signup, verifySignupOtp, sendLoginOtp } from '@/app/(auth)/actions';

export default function SignupPage() {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Submit details and trigger OTP / registration
  async function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);

    const result = await signup(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.needsOtp) {
      setStep('otp');
      setSuccess(result.success || `Verification code dispatched to ${email}`);
      setCountdown(45);
    } else if (result?.success) {
      setSuccess(result.success);
    }
  }

  // Step 2: Verify OTP
  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (otpToken.length < 6) {
      setError('Please provide the full 6-digit verification code.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await verifySignupOtp(email, otpToken);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  // Resend verification code
  async function handleResendCode() {
    if (countdown > 0 || loading) return;
    setLoading(true);
    setError('');
    const res = await sendLoginOtp(email);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(`A fresh verification code has been dispatched to ${email}`);
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
            JOIN <span className="text-lime-green">COLLECTIVE</span>
          </h1>
        </Link>
        <p className="font-mono text-xs text-muted-text mt-1 uppercase tracking-widest">
          TECHNEEDS STUDENT REGISTRATION
        </p>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="p-3 mb-5 bg-red-950/70 border border-burnt-orange/50 text-red-200 text-xs font-mono rounded-lg">
          <span className="text-burnt-orange font-bold mr-1">[ALERT]</span> {error}
        </div>
      )}
      {success && (
        <div className="p-3 mb-5 bg-lime-green/10 border border-lime-green/30 text-lime-green text-xs font-mono rounded-lg">
          <span className="font-bold mr-1">✓</span> {success}
        </div>
      )}

      {/* STEP 1: REGISTRATION DETAILS */}
      {step === 'details' ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-mono text-muted-text uppercase mb-1.5">
              Full Legal Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
              className="input-field font-mono text-xs rounded-lg"
              placeholder="e.g. Priya Sharma"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-mono text-muted-text uppercase mb-1.5">
              Student Email (IGDTUW / University)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field font-mono text-xs rounded-lg"
              placeholder="rollnumber@igdtuw.ac.in"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono text-muted-text uppercase mb-1.5">
              Secret Password (Min 8 Characters)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input-field font-mono text-xs rounded-lg"
              placeholder="••••••••••••"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 mt-2 rounded-lg font-bold"
          >
            {loading ? 'Creating Member Pass...' : 'Create Account & Request OTP →'}
          </button>
        </form>
      ) : (
        /* STEP 2: OTP VERIFICATION */
        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="otp-token" className="text-xs font-mono text-muted-text uppercase">
                6-Digit Security Token
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep('details');
                  setOtpToken('');
                  setError('');
                }}
                className="text-[11px] font-mono text-electric-blue hover:underline"
              >
                ← Edit Details
              </button>
            </div>
            <input
              id="otp-token"
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
              Verification token dispatched to <span className="text-soft-white font-semibold">{email}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otpToken.length < 6}
            className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Confirming Token...' : 'Verify Code & Launch Dashboard →'}
          </button>

          <div className="text-center pt-2 font-mono text-xs">
            {countdown > 0 ? (
              <span className="text-muted-text">
                Resend code in <span className="text-lime-green">{countdown}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-electric-blue hover:text-lime-green underline"
              >
                Resend Verification Code
              </button>
            )}
          </div>
        </form>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-charcoal-border text-center font-mono text-xs text-muted-text">
        Already registered?{' '}
        <Link href="/login" className="text-lime-green hover:underline font-bold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
