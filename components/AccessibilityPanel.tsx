'use client';

import { motion } from 'framer-motion';
import { useAccessibility } from '@/lib/accessibility-context';

/**
 * Sidebar panel that surfaces the site's accessibility features and lets the
 * user toggle screen-reader optimised mode (high contrast, no animations,
 * linearised layout). Preference is persisted via `AccessibilityContext`.
 */
export default function AccessibilityPanel() {
  const { accessibilityMode, toggleAccessibilityMode } = useAccessibility();

  const features = [
    { id: 'reduced-motion', label: 'Remove all animations', active: accessibilityMode },
    { id: 'linear-layout', label: 'Convert to linear structure', active: accessibilityMode },
    { id: 'aria-landmarks', label: 'Expose ARIA landmarks', active: true },
    { id: 'keyboard-nav', label: 'Full keyboard navigation', active: true },
    { id: 'high-contrast', label: 'High contrast mode', active: accessibilityMode },
    { id: 'screen-reader', label: 'Screen reader optimized', active: true },
  ];

  return (
    <section
      aria-labelledby="a11y-heading"
      className="rounded-lg p-5"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: `1px solid ${accessibilityMode ? 'rgba(0,255,136,0.33)' : 'var(--border-color)'}`,
        boxShadow: accessibilityMode ? '0 0 20px rgba(0,255,136,0.08)' : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="a11y-heading"
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: accessibilityMode ? 'var(--accent-green)' : 'var(--accent-cyan)' }}
        >
          ◈ Accessibility Engine
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            color: accessibilityMode ? 'var(--accent-green)' : 'var(--text-secondary)',
            backgroundColor: accessibilityMode ? 'rgba(0,255,136,0.1)' : 'transparent',
            border: `1px solid ${accessibilityMode ? 'rgba(0,255,136,0.27)' : 'var(--border-color)'}`,
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {accessibilityMode ? 'ACTIVE' : 'STANDBY'}
        </span>
      </div>

      {/* Feature list */}
      <ul className="space-y-2 mb-5" aria-label="Accessibility features">
        {features.map((feat) => (
          <li key={feat.id} className="flex items-center gap-2 text-xs">
            <span
              style={{
                color: feat.active ? 'var(--accent-green)' : 'var(--text-dim)',
                fontSize: '10px',
              }}
              aria-hidden="true"
            >
              {feat.active ? '✓' : '○'}
            </span>
            <span style={{ color: feat.active ? 'var(--text-primary)' : 'var(--text-dim)' }}>
              {feat.label}
            </span>
            <span className="sr-only">{feat.active ? '(enabled)' : '(disabled)'}</span>
          </li>
        ))}
      </ul>

      {/* Toggle button */}
      <motion.button
        onClick={toggleAccessibilityMode}
        aria-pressed={accessibilityMode}
        aria-label={
          accessibilityMode
            ? 'Disable screen reader optimized mode'
            : 'Enable screen reader optimized mode'
        }
        className="w-full py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all"
        style={{
          border: `1px solid ${accessibilityMode ? 'var(--accent-green)' : 'var(--accent-cyan)'}`,
          color: accessibilityMode ? 'var(--accent-green)' : 'var(--accent-cyan)',
          backgroundColor: accessibilityMode ? 'rgba(0,255,136,0.1)' : 'rgba(0,212,255,0.05)',
          cursor: 'pointer',
        }}
        whileTap={{ scale: 0.98 }}
      >
        {accessibilityMode
          ? '◉ Screen Reader Mode: ON'
          : '○ Enable Screen Reader Optimized Mode'}
      </motion.button>
    </section>
  );
}
