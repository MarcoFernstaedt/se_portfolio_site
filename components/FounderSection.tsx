'use client';

import { motion } from 'framer-motion';

/** Professional role tags displayed in the engineer profile card. */
const roles = [
  { label: 'MERN Stack Developer', icon: '⌨', color: '#00d4ff' },
  { label: 'Python Engineer', icon: '🐍', color: '#0080ff' },
  { label: 'AI API Integrator', icon: '◆', color: '#ffaa00' },
  { label: 'Systems Builder', icon: '◈', color: '#00ff88' },
];

/** Key statistics shown in the profile card footer. */
const stats = [
  { value: '83', label: 'Public Repos' },
  { value: '4', label: 'Featured Systems' },
  { value: 'Audio', label: 'Core Strength' },
];

/**
 * Sidebar profile card for the engineer.
 *
 * Displays name, title, animated role tags, mission statement, key stats,
 * and contact/social links including a resume download button.
 *
 * RESUME: Place your PDF at public/Marco-Fernstaedt-Resume-2025.pdf
 * The download button below links to that path automatically.
 */
export default function FounderSection() {
  return (
    <section
      aria-labelledby="founder-heading"
      className="rounded-lg p-6"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
      }}
    >
      <h2
        id="founder-heading"
        className="section-heading mb-5"
      >
        ◈ Engineer Profile
      </h2>

      {/* Identity block */}
      <div className="mb-6">
        <div
          className="text-2xl font-bold mb-1 tracking-wide"
          style={{ color: 'var(--text-primary)' }}
        >
          Marco Fernstaedt
        </div>
        <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
          Full Stack Software Engineer
        </div>
        {/* Availability badge */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ backgroundColor: 'var(--accent-green)' }}
            aria-hidden="true"
          />
          <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-green)' }}>
            OPEN TO WORK
          </span>
        </div>
      </div>

      {/* Role tags */}
      <div
        className="grid grid-cols-2 gap-2 mb-6"
        role="list"
        aria-label="Professional roles"
      >
        {roles.map((role, i) => (
          <motion.div
            key={role.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            role="listitem"
            className="flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 rounded"
            style={{
              backgroundColor: `${role.color}0d`,
              border: `1px solid ${role.color}30`,
              color: role.color,
            }}
          >
            <span aria-hidden="true">{role.icon}</span>
            <span>{role.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Mission statement */}
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: '#94a3b8', borderLeft: '2px solid #1e3a5f', paddingLeft: '12px' }}
      >
        Building performant software from the ground up. This portfolio
        highlights the strongest systems from a broader GitHub body of work, with
        live demos and source links where they strengthen the engineering signal.
      </p>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-4 py-4"
        style={{ borderTop: '1px solid var(--border-color)' }}
        role="list"
        aria-label="Key statistics"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center" role="listitem">
            <div
              className="text-xl font-bold font-mono"
              style={{ color: 'var(--accent-cyan)' }}
              aria-label={`${stat.value} ${stat.label}`}
            >
              {stat.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Contact + social links */}
      <div
        data-scroll-target="contact"
        className="grid grid-cols-2 gap-2 mt-4 pt-4"
        style={{ borderTop: '1px solid var(--border-color)' }}
        aria-label="Contact and social links"
      >
        <a
          href="https://github.com/MarcoFernstaedt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center py-2 rounded text-xs transition-all hover:opacity-80"
          style={{
            border: '1px solid #1e3a5f',
            color: '#94a3b8',
            backgroundColor: 'rgba(30,58,95,0.2)',
          }}
        >
          ↗ GitHub
        </a>
        <a
          data-scroll-target="linkedin"
          href="https://www.linkedin.com/in/marco-f-19a372219"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center py-2 rounded text-xs transition-all hover:opacity-80"
          style={{
            border: '1px solid #1e3a5f',
            color: '#94a3b8',
            backgroundColor: 'rgba(30,58,95,0.2)',
          }}
          aria-label="Open Marco Fernstaedt LinkedIn profile"
        >
          ↗ LinkedIn
        </a>
        <a
          href="mailto:contact@marcofernstaedt.com"
          className="text-center py-2 rounded text-xs transition-all hover:opacity-80"
          style={{
            border: '1px solid rgba(0,212,255,0.3)',
            color: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.05)',
          }}
        >
          ✉ Contact
        </a>
        {/* Resume: place file at public/Marco-Fernstaedt-Resume-2025.pdf */}
        <a
          data-scroll-target="resume"
          href="/Marco-Fernstaedt-Resume-2025.pdf"
          download="Marco-Fernstaedt-Resume-2025.pdf"
          className="text-center py-2 rounded text-xs font-bold transition-all hover:opacity-90"
          style={{
            border: '1px solid rgba(0,255,136,0.4)',
            color: '#00ff88',
            backgroundColor: 'rgba(0,255,136,0.07)',
          }}
          aria-label="Download Marco Fernstaedt resume PDF"
        >
          ↓ Resume
        </a>
      </div>
    </section>
  );
}
