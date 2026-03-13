'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';

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
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
          </div>
          <span
            className="text-sm font-bold tracking-widest hidden md:block"
            style={{ color: '#00d4ff' }}
          >
            MARCO FERNSTAEDT
          </span>
          <span
            className="text-xs hidden md:block"
            style={{ color: '#4a5568' }}
            aria-hidden="true"
          >
            ── COMMAND CENTER
          </span>
        </div>

        {/* Center — status */}
        <div
          className="hidden md:flex items-center gap-4 text-xs"
          style={{ color: '#4a5568' }}
          aria-hidden="true"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full pulse-dot"
              style={{ backgroundColor: '#00ff88' }}
            />
            ALL SYSTEMS ONLINE
          </span>
          <span>|</span>
          <span style={{ color: '#94a3b8' }}>{time}</span>
        </div>

        {/* Right — accessibility toggle */}
        <nav aria-label="Site controls">
          <button
            onClick={toggleAccessibilityMode}
            aria-pressed={accessibilityMode}
            aria-label={
              accessibilityMode
                ? 'Disable accessibility mode'
                : 'Enable screen reader optimized mode'
            }
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded transition-all"
            style={{
              border: `1px solid ${accessibilityMode ? '#00ff88' : '#1e3a5f'}`,
              backgroundColor: accessibilityMode ? 'rgba(0,255,136,0.1)' : 'transparent',
              color: accessibilityMode ? '#00ff88' : '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <span aria-hidden="true">{accessibilityMode ? '◉' : '○'}</span>
            <span className="hidden sm:inline">
              {accessibilityMode ? 'A11Y: ON' : 'A11Y MODE'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
