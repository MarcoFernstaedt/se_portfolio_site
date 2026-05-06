'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0a0e17', color: '#e2e8f0', fontFamily: 'monospace' }}
    >
      <div
        className="max-w-md w-full rounded-lg p-6 space-y-4"
        style={{
          backgroundColor: '#0f1520',
          border: '1px solid rgba(255,68,68,0.3)',
          boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: '#ff4444' }}>◈</span>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: '#ff4444' }}
          >
            System Error
          </span>
        </div>
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          An unexpected error occurred. The system has logged this event.
        </p>
        {error.digest && (
          <p className="text-xs font-mono" style={{ color: '#4a5568' }}>
            Ref: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="text-xs px-4 py-2 rounded font-mono font-bold transition-all hover:opacity-90"
          style={{
            backgroundColor: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.4)',
            color: '#00d4ff',
            cursor: 'pointer',
          }}
        >
          ↺ RETRY
        </button>
      </div>
    </div>
  );
}
