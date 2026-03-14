'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bootMessages } from '@/lib/data';
import {
  BOOT_MESSAGE_INTERVAL,
  BOOT_COMPLETION_DELAY,
  BOOT_EXIT_DURATION,
} from '@/lib/constants';

interface BootScreenProps {
  /** Called once the boot animation sequence has fully completed. */
  onComplete: () => void;
}

/**
 * Full-screen boot animation displayed on first load.
 *
 * Cycles through `bootMessages` one line at a time, then fires `onComplete`.
 * Progress and displayed lines are derived from a single `currentLine` counter,
 * avoiding redundant state.
 */
export default function BootScreen({ onComplete }: BootScreenProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [done, setDone] = useState(false);

  // Derive displayed lines and progress directly — no separate state needed
  const displayedLines = bootMessages.slice(0, currentLine + 1);
  const progress = Math.round(((currentLine + 1) / bootMessages.length) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        const next = prev + 1;
        if (next >= bootMessages.length) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, BOOT_EXIT_DURATION);
          }, BOOT_COMPLETION_DELAY);
          return prev;
        }
        return next;
      });
    }, BOOT_MESSAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-primary)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="status"
          aria-label="Loading Command Center"
          aria-live="polite"
        >
          {/* Decorative scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.03) 2px, rgba(0,212,255,0.03) 4px)',
            }}
            aria-hidden="true"
          />

          <div className="w-full max-w-2xl px-4 sm:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <div
                className="text-xs tracking-widest mb-2"
                style={{ color: 'var(--text-dim)' }}
                aria-hidden="true"
              >
                MARCO FERNSTAEDT
              </div>
              <div
                className="text-2xl font-bold tracking-wider"
                style={{ color: 'var(--accent-cyan)', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}
              >
                COMMAND CENTER
              </div>
              <div
                className="text-xs mt-1 tracking-widest"
                style={{ color: 'var(--text-dim)' }}
                aria-hidden="true"
              >
                v2.0.26 ── SYSTEMS INITIALIZATION
              </div>
            </motion.div>

            {/* Terminal output */}
            <div
              className="font-mono text-sm space-y-1 mb-8"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '20px',
                minHeight: 'clamp(140px, 30vw, 220px)',
              }}
              aria-live="polite"
            >
              {displayedLines.map((line, i) => {
                const isLast = i === displayedLines.length - 1;
                const isSuccess = line.includes('Online') || line.includes('Enabled');
                const isWarning = line.includes('Loading');
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      style={{
                        color: isSuccess
                          ? 'var(--accent-green)'
                          : isWarning
                          ? 'var(--accent-amber)'
                          : 'var(--text-secondary)',
                      }}
                    >
                      {isSuccess ? '✓' : isWarning ? '◆' : '›'}
                    </span>
                    <span
                      style={{
                        color: isSuccess
                          ? 'var(--accent-green)'
                          : isWarning
                          ? 'var(--accent-amber)'
                          : 'var(--text-primary)',
                      }}
                    >
                      {line}
                    </span>
                    {isLast && !done && (
                      <span
                        className="cursor-blink"
                        style={{ color: 'var(--accent-cyan)' }}
                        aria-hidden="true"
                      >
                        █
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Loading: ${progress}%`}
            >
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-dim)' }}>
                <span>INITIALIZATION PROGRESS</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{progress}%</span>
              </div>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--border-color)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))',
                    boxShadow: '0 0 10px rgba(0,212,255,0.5)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
