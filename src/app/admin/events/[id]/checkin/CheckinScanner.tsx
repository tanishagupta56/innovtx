'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface CheckinScannerProps {
  eventId: string;
  eventTitle: string;
}

interface ScanLog {
  id: string;
  status: 'success' | 'duplicate' | 'error';
  message: string;
  time: string;
  attendeeName?: string;
}

export default function CheckinScanner({ eventId, eventTitle }: CheckinScannerProps) {
  const [manualToken, setManualToken] = useState('');
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<ScanLog | null>(null);
  const [recentLogs, setRecentLogs] = useState<ScanLog[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const processToken = async (token: string) => {
    if (processing || !token.trim()) return;
    setProcessing(true);

    try {
      const res = await fetch(`/api/admin/events/${eventId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();
      const nowStr = new Date().toLocaleTimeString();

      let logEntry: ScanLog;

      if (res.ok && data.status === 'success') {
        logEntry = {
          id: Math.random().toString(),
          status: 'success',
          message: data.message,
          attendeeName: data.attendee?.full_name || 'Attendee',
          time: nowStr,
        };
      } else if (data.status === 'duplicate') {
        logEntry = {
          id: Math.random().toString(),
          status: 'duplicate',
          message: data.error,
          attendeeName: data.attendee?.full_name,
          time: nowStr,
        };
      } else {
        logEntry = {
          id: Math.random().toString(),
          status: 'error',
          message: data.error || 'Verification failed',
          time: nowStr,
        };
      }

      setLastResult(logEntry);
      setRecentLogs((prev) => [logEntry, ...prev.slice(0, 19)]);
    } catch {
      const errorLog: ScanLog = {
        id: Math.random().toString(),
        status: 'error',
        message: 'Network or scanner communication failure',
        time: new Date().toLocaleTimeString(),
      };
      setLastResult(errorLog);
      setRecentLogs((prev) => [errorLog, ...prev.slice(0, 19)]);
    } finally {
      setProcessing(false);
      setManualToken('');
    }
  };

  useEffect(() => {
    // Initialize html5-qrcode scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        processToken(decodedText);
      },
      () => {
        // scan error / frame without QR — silence
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [eventId]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken) {
      processToken(manualToken);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Scanner & Manual Lookup Panel */}
      <div className="lg:col-span-7 space-y-6">
        {/* Status Banner */}
        {lastResult && (
          <div
            className={`p-5 border transition-all ${
              lastResult.status === 'success'
                ? 'bg-lime/10 border-lime/40 text-lime'
                : lastResult.status === 'duplicate'
                ? 'bg-orange-950/60 border-orange-500/50 text-orange-300'
                : 'bg-red-950/60 border-red-500/50 text-red-300'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs mb-1">
              <span className="uppercase font-bold tracking-wider">
                [{lastResult.status.toUpperCase()}]
              </span>
              <span>{lastResult.time}</span>
            </div>
            <p className="font-display font-semibold text-lg">{lastResult.message}</p>
            {lastResult.attendeeName && (
              <p className="text-xs font-mono mt-1 opacity-80">Attendee: {lastResult.attendeeName}</p>
            )}
          </div>
        )}

        {/* Camera Scanner Viewport */}
        <div className="border border-cobalt/30 bg-[#040714] p-4">
          <div className="flex items-center justify-between mb-3 font-mono text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-lime animate-ping" />
              CAMERA OPTICAL FEED
            </span>
            <span>{processing ? 'VERIFYING...' : 'READY'}</span>
          </div>

          <div id="qr-reader" className="overflow-hidden border border-cobalt/20 bg-black min-h-[300px]" />
        </div>

        {/* Manual Fallback Lookup */}
        <div className="border border-cobalt/25 bg-[#050814] p-5">
          <h3 className="font-mono text-xs uppercase text-gray-300 tracking-wider mb-2">
            Manual Token Verification
          </h3>
          <p className="text-xs text-gray-500 font-mono mb-4">
            If the attendee&apos;s camera cannot read the QR or screen is dim, paste the raw token below.
          </p>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="e.g. 5d7e31b... (Signed pass token)"
              className="input-field text-xs font-mono py-2.5"
              disabled={processing}
            />
            <button
              type="submit"
              disabled={processing || !manualToken.trim()}
              className="btn-accent text-xs font-mono uppercase tracking-wider py-2.5 px-6 whitespace-nowrap"
            >
              Verify Entry
            </button>
          </form>
        </div>
      </div>

      {/* Real-time Event Feed */}
      <div className="lg:col-span-5">
        <div className="border border-cobalt/25 bg-[#050814] p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-cobalt/15">
            <h3 className="font-display font-bold text-white text-base">
              Live Check-In Stream
            </h3>
            <span className="text-[11px] font-mono text-lime bg-lime/10 px-2 py-0.5 border border-lime/30">
              {recentLogs.filter((l) => l.status === 'success').length} verified
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px]">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 border text-xs font-mono ${
                    log.status === 'success'
                      ? 'border-lime/20 bg-lime/5 text-gray-200'
                      : log.status === 'duplicate'
                      ? 'border-orange-500/20 bg-orange-950/20 text-orange-300'
                      : 'border-red-500/20 bg-red-950/20 text-red-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold uppercase tracking-wider">
                      {log.status === 'success' ? '✓ Checked In' : log.status === 'duplicate' ? '⚠ Duplicate' : '✕ Rejected'}
                    </span>
                    <span className="text-gray-500 text-[10px]">{log.time}</span>
                  </div>
                  <p className="text-[11px] truncate">{log.message}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs font-mono text-gray-500">
                Ready for scans. Scanned passes will display here instantly.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
