'use client';

import React, { useState } from 'react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: {
    name?: string;
    role?: string;
    identifier: string;
    tempPassword: string;
    note?: string;
  } | null;
}

export default function CredentialsModal({ isOpen, onClose, credentials }: CredentialsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !credentials) return null;

  const copyText = `Mentorship Portal Credentials\nName: ${credentials.name || 'Member'}\nRole: ${credentials.role?.toUpperCase() || 'USER'}\nIdentifier: ${credentials.identifier}\nTemporary Password: ${credentials.tempPassword}\n\nSign in at: /mentorship`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-charcoal border border-electric-blue/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(49,94,255,0.2)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-charcoal-border pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-lime-green/15 text-lime-green border border-lime-green/30">
              CREDENTIALS ISSUED // ONETIME
            </span>
            <h3 className="text-xl font-bold text-soft-white font-sans mt-2">
              {credentials.name ? `${credentials.name}'s Access` : 'Account Credentials'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-mono text-sm p-1 rounded-md hover:bg-deep-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3 bg-burnt-orange/15 border border-burnt-orange/30 rounded-lg text-xs font-mono text-burnt-orange-light">
          ⚠️ <strong>SECURITY NOTICE:</strong> Temporary passwords are shown only once and cannot be retrieved again after closing.
        </div>

        {/* Credentials Details */}
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-deep-ink border border-charcoal-border rounded-lg flex items-center justify-between">
            <span className="text-slate-400 uppercase">IDENTIFIER ({credentials.role === 'mentee' ? 'ENROLLMENT NO' : 'EMAIL'}):</span>
            <span className="text-lime-green font-bold select-all">{credentials.identifier}</span>
          </div>

          <div className="p-3 bg-deep-ink border border-charcoal-border rounded-lg flex items-center justify-between">
            <span className="text-slate-400 uppercase">TEMP PASSWORD:</span>
            <span className="text-electric-blue-light font-bold tracking-wider select-all">
              {credentials.tempPassword}
            </span>
          </div>

          {credentials.role && (
            <div className="p-3 bg-deep-ink border border-charcoal-border rounded-lg flex items-center justify-between">
              <span className="text-slate-400 uppercase">ROLE ASSIGNED:</span>
              <span className="text-soft-white uppercase font-bold">{credentials.role}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className={`flex-1 py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
              copied
                ? 'bg-lime-green text-deep-ink shadow-[0_0_20px_rgba(184,217,76,0.5)]'
                : 'bg-electric-blue hover:bg-electric-blue-light text-soft-white shadow-[0_0_15px_rgba(49,94,255,0.4)]'
            }`}
          >
            {copied ? (
              <>
                <span>✓</span> COPIED TO CLIPBOARD
              </>
            ) : (
              <>
                <span>📋</span> COPY CREDENTIALS
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 border border-charcoal-border hover:border-slate-500 rounded-lg font-mono text-xs text-slate-300 hover:text-white uppercase transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
