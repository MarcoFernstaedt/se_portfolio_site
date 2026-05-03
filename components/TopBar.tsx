'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';
import TrafficLightDots from './TrafficLightDots';

/**
 * Sticky top navigation bar.
 *
 * Shows the site identity (name + traffic-light dots), a real-time clock and
 * "ALL SYSTEMS ONLINE" status indicator on desktop, and an accessibility-mode
 * toggle button. Updates the clock every second.
 */
export default function TopBar() {
  const [time, setTime] = useState('');
  const { accessibilityMode, toggleAccessibilityMode } = useAccessibility();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header
      role="banner"
      style={{
        backgroundColor: 'rgba(10, 14, 23, 0.95)',
        borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(10px)',
      }}
      className="sticky top-0 z-40 px-4 md:px-6 py-2"
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Left — identity */}
        <div className="flex items-center gap-3">
          <TrafficLightDots />
          <span
            className="text-sm font-bold tracking-widest md:hidden"
            style={{ color: 'var(--accent-cyan)' }}
          >
            M.F.
          </span>
          <span
            className="text-sm font-bold tracking-widest hidden md:block"
            style={{ color: 'var(--accent-cyan)' }}
          >
            MARCO FERNSTAEDT
          </span>
          <span
            className="text-xs hidden md:block"
            style={{ color: 'var(--text-dim)' }}
            aria-hidden="true"
          >
            ── COMMAND CENTER
          </span>
        </div>

        {/* Center — status and quick nav */}
        <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: 'var(--text-dim)' }}>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span
              className="w-2 h-2 rounded-full pulse-dot"
              style={{ backgroundColor: 'var(--accent-green)' }}
            />
            ALL SYSTEMS ONLINE
          </span>
          <span aria-hidden="true">|</span>
          <Link href="/writing" style={{ color: 'var(--accent-cyan)' }}>
            Engineering Notes
          </Link>
          <span aria-hidden="true">|</span>
          <span style={{ color: 'var(--text-secondary)' }}>{time}</span>
        </div>

        {/* Right — accessibility toggle */}
        <nav aria-label="Site controls" className="flex items-center gap-2">
          <Link
            href="/writing"
            className="md:hidden text-xs px-3 py-1.5 rounded"
            style={{
              border: '1px solid rgba(0,212,255,0.25)',
              color: 'var(--accent-cyan)',
              backgroundColor: 'rgba(0,212,255,0.05)',
            }}
          >
            Notes
          </Link>
          <button
            onClick={toggleAccessibilityMode}
            aria-pressed={accessibilityMode}
            aria-label={
              accessibilityMode
                ? 'Disable accessibility mode'
                : 'Enable screen reader optimized mode'
            }
            title={accessibilityMode ? 'A11Y: ON — click to disable' : 'Enable screen reader optimized mode'}
            className="flex items-center text-xs px-2 py-1.5 rounded transition-all"
            style={{
              border: `1px solid ${accessibilityMode ? 'var(--accent-green)' : 'var(--border-color)'}`,
              backgroundColor: accessibilityMode ? 'rgba(0,255,136,0.1)' : 'transparent',
              color: accessibilityMode ? 'var(--accent-green)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <span aria-hidden="true">{accessibilityMode ? '◉' : '○'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
