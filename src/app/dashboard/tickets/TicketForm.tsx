'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TicketForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: form.get('subject'),
        message: form.get('message'),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to create ticket');
    } else {
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary text-sm">
        New Ticket
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="font-display text-lg text-white">Submit a Ticket</h3>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Subject</label>
        <input name="subject" required className="input-field" placeholder="Brief description of your issue" />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Message</label>
        <textarea name="message" required rows={4} className="input-field resize-none" placeholder="Describe your issue in detail..." />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary text-sm">
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
