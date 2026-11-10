'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReplyForm({ ticketId }: { ticketId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/tickets/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId,
        message: form.get('message'),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to send reply');
    } else {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}
      <textarea
        name="message"
        required
        rows={3}
        className="input-field resize-none"
        placeholder="Type your reply..."
      />
      <button type="submit" disabled={loading} className="btn-primary text-sm">
        {loading ? 'Sending...' : 'Send Reply'}
      </button>
    </form>
  );
}
