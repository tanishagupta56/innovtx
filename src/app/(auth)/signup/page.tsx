'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signup, verifySignupOtp, sendLoginOtp } from '@/app/(auth)/actions';

export default function SignupPage() {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [devCode, setDevCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first input box when step becomes OTP
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Step 1: Submit details and trigger OTP / registration
  async function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email.trim().toLowerCase());
    formData.append('password', password);

    const result = await signup(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.needsOtp) {
      setStep('otp');
      setSuccess(result.success || `Verification code dispatched to ${email}`);
      if (result.devCode) {
        setDevCode(result.devCode);
      }
      setCountdown(45);
      setOtpDigits(['', '', '', '', '', '']);
    } else if (result?.success) {
      setSuccess(result.success);
    }
  }

  // Trigger verify OTP
  async function submitOtp(token: string) {
    if (token.length !== 6) {
      setError('Please provide the full 6-digit verification code.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await verifySignupOtp(email.trim().toLowerCase(), token, fullName);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  // Handle individual OTP digit change
  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError('');

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === 5 && newDigits.every((d) => d.length === 1)) {
      submitOtp(newDigits.join(''));
    }
  };

  // Handle backspace and navigation
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste of 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setOtpDigits(newDigits);

    const nextFocusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    if (pasteData.length === 6) {
      submitOtp(pasteData);
    }
  };

  // Step 2 form submission
  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = otpDigits.join('');
    await submitOtp(token);
  }

  // Resend verification code
  async function handleResendCode() {
    if (countdown > 0 || loading) return;
    setLoading(true);
    setError('');
    const res = await sendLoginOtp(email.trim().toLowerCase());
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(`A fresh verification code has been dispatched to ${email}`);
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setCountdown(45);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
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
          {step === 'details' ? 'STUDENT REGISTRATION' : 'VERIFY 6-DIGIT CODE'}
        </p>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="p-3 mb-5 bg-red-950/70 border border-burnt-orange/50 text-red-200 text-xs font-mono rounded-lg flex items-start gap-2">
          <span className="text-burnt-orange font-bold">[ALERT]</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 mb-5 bg-lime-green/10 border border-lime-green/30 text-lime-green text-xs font-mono rounded-lg flex items-start gap-2">
          <span className="font-bold">✓</span>
          <span>{success}</span>
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
              className="input-field font-mono text-xs rounded-lg py-2.5"
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
              className="input-field font-mono text-xs rounded-lg py-2.5"
              placeholder="rollnumber@igdtuw.ac.in"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono text-muted-text uppercase mb-1.5">
              Account Password (Min 8 Characters)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input-field font-mono text-xs rounded-lg py-2.5"
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
        /* STEP 2: 6 INPUT BOXES FOR OTP VERIFICATION */
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono text-muted-text uppercase">
                6-Digit Security Token
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep('details');
                  setError('');
                }}
                className="text-[11px] font-mono text-electric-blue hover:text-lime-green underline"
              >
                ← Edit Details
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 mb-3">
              Sent to: <strong className="text-soft-white">{email}</strong>
            </div>

            {/* In-App One-Click Access Code Helper */}
            {devCode && (
              <div className="p-3 mb-4 bg-electric-blue/10 border border-electric-blue/40 rounded-xl flex items-center justify-between text-xs font-mono shadow-sm">
                <div className="flex items-center gap-2 text-electric-blue">
                  <span className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
                  <span className="text-muted-text">Security Code:</span>
                  <span className="text-soft-white font-bold tracking-widest text-sm bg-charcoal/80 px-2 py-0.5 rounded border border-charcoal-border">
                    {devCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const digits = devCode.split('');
                    setOtpDigits(digits);
                    submitOtp(devCode);
                  }}
                  className="px-2.5 py-1 bg-lime-green/20 hover:bg-lime-green/30 text-lime-green border border-lime-green/40 rounded text-[11px] font-bold transition-all flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>⚡ Autofill & Register</span>
                </button>
              </div>
            )}

            {/* 6 Individual Input Boxes */}
            <div className="flex items-center justify-between gap-2 sm:gap-2.5 my-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                  onPaste={handlePaste}
                  aria-label={`Digit ${idx + 1}`}
                  className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all ${
                    digit
                      ? 'border-lime-green bg-charcoal text-lime-green shadow-[0_0_15px_rgba(184,217,76,0.2)]'
                      : 'border-charcoal-border bg-[#080B12]/80 text-soft-white focus:border-electric-blue focus:shadow-[0_0_15px_rgba(49,94,255,0.25)]'
                  } outline-none`}
                />
              ))}
            </div>

            <p className="text-[11px] font-mono text-muted-text text-center mt-2">
              Valid for <span className="text-soft-white font-semibold">5 minutes</span>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otpDigits.join('').length !== 6}
            className="btn-magnetic w-full text-xs font-mono uppercase tracking-wider py-3.5 rounded-lg font-bold disabled:opacity-40"
          >
            {loading ? 'Confirming Token...' : 'Verify Code & Launch Dashboard →'}
          </button>

          <div className="text-center pt-2 font-mono text-xs">
            {countdown > 0 ? (
              <span className="text-muted-text">
                Resend code in <span className="text-lime-green font-bold">{countdown}s</span>
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
