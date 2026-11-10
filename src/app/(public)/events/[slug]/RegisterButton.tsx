'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RegistrationStatus } from '@/lib/utils';

export default function RegisterButton({
  eventId,
  isLoggedIn,
  isRegistered,
  regStatus,
}: {
  eventId: string;
  isLoggedIn: boolean;
  isRegistered: boolean;
  regStatus: RegistrationStatus;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [justRegistered, setJustRegistered] = useState(false);
  const router = useRouter();

  if (isRegistered || justRegistered) {
    return (
      <div className="p-4 bg-lime/10 border border-lime/30 text-lime text-sm">
        <p className="font-semibold">✓ You are registered for this event.</p>
        <p className="text-xs text-gray-300 mt-1">
          Your attendance QR code is ready in your{' '}
          <a href="/dashboard/registrations" className="text-lime underline hover:text-white">
            Dashboard
          </a>.
        </p>
      </div>
    );
  }

  if (regStatus !== 'open') {
    return (
      <div className="p-4 bg-charcoal/50 border border-cobalt/20 text-gray-400 text-sm">
        Registration is {regStatus === 'not_started' ? 'not yet open' : regStatus === 'full' ? 'full' : 'closed'}.
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <a href={`/login?redirect=/events/${eventId}`} className="btn-accent">
        Sign in to register
      </a>
    );
  }

  async function handleRegister() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Registration failed');
      } else {
        if (data.token && data.registrationId) {
          localStorage.setItem(`qr_token_${data.registrationId}`, data.token);
        }
        setJustRegistered(true);
        setMessage('Registration confirmed! Access your QR code on the Dashboard.');
        router.refresh();
      }
    } catch {
      setMessage('Something went wrong. Please check connection and try again.');
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={handleRegister} disabled={loading} className="btn-accent">
        {loading ? 'Registering...' : 'Register for Event'}
      </button>
      {message && (
        <p className={`mt-3 text-sm ${justRegistered ? 'text-lime' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
