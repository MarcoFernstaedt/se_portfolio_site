import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Marco Fernstaedt',
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0a0e17', color: '#e2e8f0', fontFamily: 'monospace' }}
    >
      <div
        className="max-w-md w-full rounded-lg p-6 space-y-4 text-center"
        style={{
          backgroundColor: '#0f1520',
          border: '1px solid rgba(0,212,255,0.15)',
          boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="text-5xl font-bold tracking-widest"
          style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.3)' }}
        >
          404
        </div>
        <p className="text-xs tracking-widest uppercase" style={{ color: '#4a5568' }}>
          Signal Lost
        </p>
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          This route does not exist in the system.
        </p>
        <Link
          href="/"
          className="inline-block text-xs px-4 py-2 rounded font-mono font-bold transition-all hover:opacity-90"
          style={{
            backgroundColor: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.4)',
            color: '#00d4ff',
          }}
        >
          ← RETURN TO COMMAND CENTER
        </Link>
      </div>
    </div>
  );
}
