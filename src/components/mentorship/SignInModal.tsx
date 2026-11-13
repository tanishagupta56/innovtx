'use client';

import React, { useState, useEffect } from 'react';
import { mentorshipApi } from '@/lib/mentorship/client-api';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'signin' | 'signup';
}

const INTEREST_TAG_OPTIONS = [
  'Full-Stack Web',
  'AI & Machine Learning',
  'Data Structures & Algorithms',
  'System Design',
  'Cloud & DevOps',
  'Cybersecurity',
  'Open Source',
  'Mobile Systems',
];

export default function SignInModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}: SignInModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'success'>(initialMode);
  const [activeSignInTab, setActiveSignInTab] = useState<'staff' | 'mentee'>('mentee');

  // Sign In Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpCohort, setSignUpCohort] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activePrograms, setActivePrograms] = useState<any[]>([]);

  // Success State
  const [createdUser, setCreatedUser] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setCopied(false);
      // Fetch active cohorts for registration
      mentorshipApi.getPrograms()
        .then((res) => {
          const active = (res.programs || []).filter((p: any) => p.status === 'active');
          setActivePrograms(active);
          if (active.length > 0 && !signUpCohort) {
            setSignUpCohort(active[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await mentorshipApi.login(identifier.trim(), password);
      if (res.user) {
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid identifier or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signUpName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!signUpCohort) {
      setError('Please select an active cohort');
      return;
    }

    setLoading(true);
    try {
      const res = await mentorshipApi.signup({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        program_id: signUpCohort,
        interest_tags: selectedTags,
      });

      if (res.success && res.user) {
        setCreatedUser(res.user);
        setMode('success');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyEnrollmentNo = () => {
    if (createdUser?.enrollment_no) {
      navigator.clipboard.writeText(createdUser.enrollment_no);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const proceedFromSuccess = () => {
    if (createdUser) {
      onSuccess(createdUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-charcoal border border-charcoal-border hover:border-electric-blue/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_35px_rgba(49,94,255,0.15)] my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-charcoal-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-lime-green/15 text-lime-green border border-lime-green/30">
                PORTAL ACCESS
              </span>
              <span className="text-[11px] font-mono text-slate-400">SSSC CADRE</span>
            </div>
            <h3 className="text-2xl font-bold text-soft-white font-sans">
              {mode === 'signin' && 'Cadre Authentication'}
              {mode === 'signup' && 'Mentee Registration'}
              {mode === 'success' && 'Enrollment Confirmed'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-sm p-1 rounded-md hover:bg-deep-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3 bg-burnt-orange/15 border border-burnt-orange/30 rounded-lg text-xs font-mono text-burnt-orange-light flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* MODE: SUCCESS CARD */}
        {mode === 'success' && createdUser && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-deep-ink border border-lime-green/50 rounded-xl space-y-4 shadow-[0_0_20px_rgba(184,217,76,0.15)] text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-lime-green/15 border border-lime-green/40 flex items-center justify-center text-lime-green text-xl font-bold">
                ✓
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-lime-green font-bold block mb-1">
                  OFFICIAL CADRE ENROLLMENT
                </span>
                <h4 className="text-xl font-bold text-soft-white">
                  Welcome, {createdUser.name}!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  You are registered for active mentorship. Your unique enrollment identification is ready.
                </p>
              </div>

              {/* Enrollment Number Box */}
              <div className="p-4 bg-charcoal border border-charcoal-border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Assigned Enrollment No.
                  </span>
                  <span className="font-mono text-lg font-bold text-lime-green tracking-wider">
                    {createdUser.enrollment_no}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyEnrollmentNo}
                  className={`px-4 py-2 rounded font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                    copied
                      ? 'bg-lime-green text-deep-ink shadow-[0_0_10px_rgba(184,217,76,0.5)]'
                      : 'bg-deep-ink hover:bg-charcoal text-soft-white border border-charcoal-border'
                  }`}
                >
                  {copied ? (
                    <>
                      <span>✓</span> COPIED!
                    </>
                  ) : (
                    <>
                      <span>📋</span> COPY ENROLLMENT NO
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400 bg-charcoal/50 p-2.5 rounded border border-charcoal-border text-left">
                💡 <strong>Important:</strong> You can sign in using either your enrollment number (<strong>{createdUser.enrollment_no}</strong>) or your registered email address.
              </div>
            </div>

            <button
              type="button"
              onClick={proceedFromSuccess}
              className="w-full py-3.5 bg-lime-green hover:bg-lime-green-light text-deep-ink font-mono text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(184,217,76,0.4)] transition-all flex items-center justify-center gap-2"
            >
              PROCEED TO MENTEE DASHBOARD →
            </button>
          </div>
        )}

        {/* MODE: SIGN IN */}
        {mode === 'signin' && (
          <div className="space-y-5 animate-fade-in">
            {/* Tab Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-deep-ink border border-charcoal-border rounded-xl font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveSignInTab('mentee');
                  setIdentifier('');
                  setError(null);
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  activeSignInTab === 'mentee'
                    ? 'bg-lime-green text-deep-ink shadow-[0_0_12px_rgba(184,217,76,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mentee
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSignInTab('staff');
                  setIdentifier('');
                  setError(null);
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  activeSignInTab === 'staff'
                    ? 'bg-electric-blue text-soft-white shadow-[0_0_12px_rgba(49,94,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mentor / Admin
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  {activeSignInTab === 'staff'
                    ? 'Work Email'
                    : 'Enrollment No. (TN-YYYY-XXXX) or Email'}
                </label>
                <input
                  type={activeSignInTab === 'staff' ? 'email' : 'text'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    activeSignInTab === 'staff'
                      ? 'mentor@techneeds.live'
                      : 'TN-2026-0001 or mentee@igdtuw.ac.in'
                  }
                  className="w-full px-4 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-electric-blue placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-electric-blue placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-electric-blue hover:bg-electric-blue-light disabled:opacity-50 text-soft-white font-mono text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(49,94,255,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                      AUTHENTICATING...
                    </>
                  ) : (
                    'SIGN IN TO CADRE →'
                  )}
                </button>
              </div>
            </form>

            {/* Switch to Sign Up */}
            <div className="pt-3 border-t border-charcoal-border flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">New mentee without an ID?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-lime-green hover:underline font-bold"
              >
                Enroll in Cohort →
              </button>
            </div>
          </div>
        )}

        {/* MODE: SIGN UP */}
        {mode === 'signup' && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-xs text-slate-300 font-sans">
              Sign up directly to join an active SSSC mentorship cohort. You will receive an official enrollment ID immediately upon registration.
            </p>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-slate-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-lime-green placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="ananya@igdtuw.ac.in"
                    className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-lime-green placeholder:text-slate-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-lime-green placeholder:text-slate-600 transition-colors"
                />
              </div>

              {/* Active Cohorts Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  Select Active Cohort *
                </label>
                {activePrograms.length > 0 ? (
                  <select
                    value={signUpCohort}
                    onChange={(e) => setSignUpCohort(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white font-mono text-xs focus:outline-none focus:border-lime-green transition-colors"
                  >
                    {activePrograms.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title} (Active Cohort)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-deep-ink border border-charcoal-border rounded-lg text-xs font-mono text-slate-400">
                    No active cohorts currently open for enrollment. Please check back soon or contact a mentor.
                  </div>
                )}
              </div>

              {/* Interest Tags (Clickable Chips) */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  Interest Tags (Select your focuses)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-lime-green text-deep-ink font-bold shadow-[0_0_10px_rgba(184,217,76,0.4)] border border-lime-green'
                            : 'bg-deep-ink text-slate-400 border border-charcoal-border hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || activePrograms.length === 0}
                  className="w-full py-3.5 bg-lime-green hover:bg-lime-green-light disabled:opacity-50 text-deep-ink font-mono text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(184,217,76,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-deep-ink border-t-transparent rounded-full" />
                      CREATING ACCOUNT...
                    </>
                  ) : (
                    'COMPLETE REGISTRATION →'
                  )}
                </button>
              </div>
            </form>

            {/* Switch to Sign In */}
            <div className="pt-3 border-t border-charcoal-border flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Already have an enrollment ID?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="text-electric-blue hover:underline font-bold"
              >
                Sign In to Portal →
              </button>
            </div>
          </div>
        )}

        {/* Footer tip */}
        <div className="pt-2 border-t border-charcoal-border text-[11px] font-mono text-slate-500 text-center">
          Separate portal session • Protected by scoped JWT
        </div>
      </div>
    </div>
  );
}
