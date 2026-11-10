'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QRDisplay({
  registrationId,
  eventTitle,
}: {
  registrationId: string;
  eventTitle: string;
}) {
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [token, setToken] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [manualInputOpen, setManualInputOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`qr_token_${registrationId}`);
    if (stored) {
      setToken(stored);
    }
  }, [registrationId]);

  useEffect(() => {
    if (token && showQR) {
      QRCode.toDataURL(token, {
        width: 260,
        margin: 2,
        color: { dark: '#030407', light: '#D4FF24' },
      }).then(setQrDataUrl);
    }
  }, [token, showQR]);

  const handleSaveManualToken = () => {
    if (manualToken.trim()) {
      localStorage.setItem(`qr_token_${registrationId}`, manualToken.trim());
      setToken(manualToken.trim());
      setManualInputOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-start md:items-end">
      {token ? (
        <button
          onClick={() => setShowQR(!showQR)}
          className="btn-accent text-xs py-2 px-3 tracking-wide"
        >
          {showQR ? 'Hide Event QR' : 'Show Event Pass QR'}
        </button>
      ) : (
        <div className="text-right">
          <button
            onClick={() => setManualInputOpen(!manualInputOpen)}
            className="btn-ghost text-xs py-1.5 px-3"
          >
            Enter Token
          </button>
          {manualInputOpen && (
            <div className="mt-2 flex gap-1">
              <input
                type="text"
                placeholder="Paste pass token"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="input-field text-xs py-1 px-2 w-48"
              />
              <button
                onClick={handleSaveManualToken}
                className="btn-primary text-xs py-1 px-2"
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}

      {showQR && qrDataUrl && (
        <div className="mt-4 p-4 bg-midnight border border-cobalt/40 flex flex-col items-center">
          <img
            src={qrDataUrl}
            alt={`QR code for ${eventTitle}`}
            className="w-[200px] h-[200px] border border-lime/20"
          />
          <p className="text-[11px] font-mono text-lime mt-2 text-center uppercase tracking-wider">
            Verification Pass
          </p>
          <p className="text-[10px] text-gray-500 max-w-[200px] truncate text-center mt-0.5">
            Token: {token.slice(0, 16)}...
          </p>
        </div>
      )}
    </div>
  );
}
