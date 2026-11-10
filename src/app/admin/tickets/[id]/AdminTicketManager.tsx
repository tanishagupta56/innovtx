'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminTicketManagerProps {
  ticket: {
    id: string;
    ticket_id: string;
    subject: string;
    status: string;
    priority: string;
    assignee_id: string | null;
  };
  messages: Array<{
    id: string;
    message: string;
    is_internal: boolean;
    created_at: string;
    sender: {
      full_name: string;
      role: string;
    };
  }>;
}

export default function AdminTicketManager({ ticket, messages }: AdminTicketManagerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [updating, setUpdating] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [replying, setReplying] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleUpdateMeta = async (newStatus?: string, newPriority?: string) => {
    setUpdating(true);
    setFeedback('');
    try {
      const res = await fetch(`/api/admin/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus || status,
          priority: newPriority || priority,
        }),
      });

      if (!res.ok) throw new Error('Update failed');
      if (newStatus) setStatus(newStatus);
      if (newPriority) setPriority(newPriority);
      setFeedback('Ticket updated.');
      router.refresh();
    } catch {
      setFeedback('Error updating ticket.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplying(true);
    setFeedback('');

    try {
      const res = await fetch('/api/tickets/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticket.id,
          message: replyText.trim(),
          isInternal,
        }),
      });

      if (!res.ok) throw new Error('Reply failed');
      setReplyText('');
      setIsInternal(false);
      setFeedback(isInternal ? 'Internal note appended.' : 'Reply dispatched to student.');
      router.refresh();
    } catch {
      setFeedback('Failed to post message.');
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Messages Column */}
      <div className="lg:col-span-8 space-y-6">
        <div className="border border-cobalt/25 bg-[#050814] p-6 space-y-4">
          <h2 className="font-display font-bold text-white text-base">Conversation Thread</h2>

          <div className="space-y-4">
            {messages.map((m) => {
              const isStaff = m.sender?.role === 'admin' || m.sender?.role === 'super_admin';
              return (
                <div
                  key={m.id}
                  className={`p-4 border text-xs ${
                    m.is_internal
                      ? 'bg-yellow-950/20 border-yellow-500/30'
                      : isStaff
                      ? 'bg-cobalt/10 border-cobalt/30'
                      : 'bg-[#0a0f20] border-cobalt/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{m.sender?.full_name || 'User'}</span>
                      {isStaff && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-cobalt/30 text-cobalt-300 border border-cobalt/40 uppercase">
                          Staff
                        </span>
                      )}
                      {m.is_internal && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 uppercase">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 font-mono text-[10px]">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                    {m.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reply form */}
        <form onSubmit={handleSendReply} className="border border-cobalt/25 bg-[#050814] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-white text-sm">Post Reply / Note</h3>
            <label className="flex items-center gap-2 text-xs font-mono cursor-pointer text-gray-300">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-cobalt/40"
              />
              <span className={isInternal ? 'text-yellow-400 font-bold' : ''}>
                Private Internal Note
              </span>
            </label>
          </div>

          <textarea
            rows={4}
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              isInternal
                ? 'Internal note visible only to admins...'
                : 'Reply message that will be delivered to the student...'
            }
            className={`input-field text-sm ${isInternal ? 'border-yellow-500/40 focus:border-yellow-400' : ''}`}
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={replying}
              className={`text-xs font-mono uppercase tracking-wider py-2.5 px-6 ${
                isInternal ? 'btn-ghost border-yellow-500 text-yellow-400' : 'btn-accent'
              }`}
            >
              {replying ? 'Posting...' : isInternal ? 'Save Internal Note' : 'Send Student Reply'}
            </button>
            {feedback && <span className="text-xs font-mono text-lime">{feedback}</span>}
          </div>
        </form>
      </div>

      {/* Triage Side Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="border border-cobalt/25 bg-[#050814] p-6 space-y-5">
          <h3 className="font-mono text-xs uppercase text-gray-300 tracking-wider pb-3 border-b border-cobalt/15">
            Ticket Controls
          </h3>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => handleUpdateMeta(e.target.value, undefined)}
              disabled={updating}
              className="input-field text-xs font-mono"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="awaiting_response">Awaiting Response</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => handleUpdateMeta(undefined, e.target.value)}
              disabled={updating}
              className="input-field text-xs font-mono"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="pt-4 border-t border-cobalt/15">
            <button
              type="button"
              onClick={() => handleUpdateMeta('resolved', undefined)}
              disabled={updating || status === 'resolved'}
              className="w-full btn-primary text-xs font-mono uppercase tracking-wider py-2.5"
            >
              {status === 'resolved' ? 'Ticket Closed' : '✓ Resolve & Close Ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
