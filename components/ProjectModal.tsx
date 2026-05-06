'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import StatusBadge from './StatusBadge';
import TrafficLightDots from './TrafficLightDots';
import GitHubStatsRow from './GitHubStatsRow';

interface ProjectModalProps {
  /** Project to display. Pass `null` to close the modal. */
  project: Project | null;
  /** Called when the user dismisses the modal (ESC, backdrop click, or close button). */
  onClose: () => void;
}

/**
 * Slide-up modal (bottom-sheet on mobile, centred on desktop) showing full
 * project details: description, tech stack, engineering challenges, and links.
 *
 * Traps body scroll while open, restores it on close. Closes on ESC key press.
 */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);

      if (focusable.length === 0) {
        e.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 outline-none pt-[env(safe-area-inset-top)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full sm:max-w-2xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto rounded-t-lg sm:rounded-lg"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 0 60px rgba(0,212,255,0.1)',
              }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal title bar */}
              <div
                className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderBottom: '1px solid #1e3a5f',
                }}
              >
                <div className="flex items-center gap-2">
                  <TrafficLightDots />
                  <span className="text-xs font-mono ml-2" style={{ color: 'var(--text-dim)' }}>
                    system_inspector.sh
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                  aria-label="Close project details"
                >
                  Close
                </button>
              </div>

              {/* Terminal content */}
              <div className="p-4 sm:p-6 font-mono text-sm space-y-4 sm:space-y-5">
                {project.repoPath && <GitHubStatsRow repoPath={project.repoPath} />}

                {/* Command line */}
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>$</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>OPEN PROJECT:</span>
                  <span
                    id="modal-title"
                    style={{ color: 'var(--accent-green)' }}
                    className="font-bold uppercase tracking-wide"
                  >
                    {project.id.replace(/-/g, '_').toUpperCase()}
                  </span>
                </div>

                {/* Name + Status */}
                <div className="flex flex-wrap items-center gap-3">
                  <h2 id="project-modal-title" className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    {project.name}
                  </h2>
                  <StatusBadge status={project.status} />
                </div>

                {/* Purpose */}
                <section aria-labelledby="purpose-heading">
                  <div
                    id="purpose-heading"
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: 'var(--accent-cyan)' }}
                  >
                    Purpose:
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                    {project.description}
                  </p>
                </section>

                {/* Engineering Signal */}
                {project.engineeringSignal && (
                  <section
                    aria-labelledby="engineering-signal-heading"
                    className="rounded p-3"
                    style={{
                      border: '1px solid rgba(0,255,136,0.24)',
                      backgroundColor: 'rgba(0,255,136,0.05)',
                    }}
                  >
                    <div
                      id="engineering-signal-heading"
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: 'var(--accent-green)' }}
                    >
                      Engineering Signal:
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                      {project.engineeringSignal}
                    </p>
                  </section>
                )}

                {/* Stack */}
                <section aria-labelledby="stack-heading">
                  <div
                    id="stack-heading"
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: 'var(--accent-cyan)' }}
                  >
                    Stack:
                  </div>
                  <ul className="space-y-1" aria-label="Technologies used">
                    {project.stack.map((tech) => (
                      <li key={tech} className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-dim)' }}>•</span>
                        <span style={{ color: 'var(--text-primary)' }}>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Engineering Challenges */}
                <section aria-labelledby="challenges-heading">
                  <div
                    id="challenges-heading"
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: 'var(--accent-cyan)' }}
                  >
                    Key Engineering Challenges:
                  </div>
                  <ul className="space-y-1.5" aria-label="Engineering challenges">
                    {project.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span style={{ color: 'var(--accent-amber)' }} aria-hidden="true">
                          •
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Links */}
                {(project.github || project.demo) && (
                  <section aria-labelledby="links-heading" className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div
                      id="links-heading"
                      className="text-xs uppercase tracking-widest mb-3"
                      style={{ color: 'var(--accent-cyan)' }}
                    >
                      Links:
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-4 py-2 rounded transition-all hover:opacity-80"
                          style={{
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'rgba(30,58,95,0.3)',
                          }}
                        >
                          ↗ GitHub
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-4 py-2 rounded transition-all hover:opacity-80"
                          style={{
                            border: '1px solid #00d4ff44',
                            color: '#00d4ff',
                            backgroundColor: 'rgba(0,212,255,0.1)',
                          }}
                        >
                          ▶ Live Demo
                        </a>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
