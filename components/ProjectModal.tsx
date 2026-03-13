'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import StatusBadge from './StatusBadge';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (project) {
      closeRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

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
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg"
              style={{
                backgroundColor: '#0a0e17',
                border: '1px solid #1e3a5f',
                boxShadow: '0 0 60px rgba(0,212,255,0.1)',
              }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal title bar */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderBottom: '1px solid #1e3a5f',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <button
                      onClick={onClose}
                      className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: '#ff5f57' }}
                      aria-label="Close project details"
                      ref={closeRef}
                    />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
                  </div>
                  <span className="text-xs font-mono ml-2" style={{ color: '#4a5568' }}>
                    system_inspector.sh
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{ color: '#94a3b8', border: '1px solid #1e3a5f' }}
                  aria-label="Close"
                >
                  ESC
                </button>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm space-y-5">
                {/* Command line */}
                <div>
                  <span style={{ color: '#4a5568' }}>$ </span>
                  <span style={{ color: '#00d4ff' }}>OPEN PROJECT: </span>
                  <span
                    id="modal-title"
                    style={{ color: '#00ff88' }}
                    className="font-bold uppercase tracking-wide"
                  >
                    {project.id.replace(/-/g, '_').toUpperCase()}
                  </span>
                </div>

                {/* Name + Status */}
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-base font-bold" style={{ color: '#e2e8f0' }}>
                    {project.name}
                  </h2>
                  <StatusBadge status={project.status} />
                </div>

                {/* Purpose */}
                <section aria-labelledby="purpose-heading">
                  <div
                    id="purpose-heading"
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: '#00d4ff' }}
                  >
                    Purpose:
                  </div>
                  <p style={{ color: '#94a3b8' }} className="leading-relaxed">
                    {project.description}
                  </p>
                </section>

                {/* Stack */}
                <section aria-labelledby="stack-heading">
                  <div
                    id="stack-heading"
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: '#00d4ff' }}
                  >
                    Stack:
                  </div>
                  <ul className="space-y-1" aria-label="Technologies used">
                    {project.stack.map((tech) => (
                      <li key={tech} className="flex items-center gap-2">
                        <span style={{ color: '#4a5568' }}>├─</span>
                        <span style={{ color: '#e2e8f0' }}>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Engineering Challenges */}
                <section aria-labelledby="challenges-heading">
                  <div
                    id="challenges-heading"
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: '#00d4ff' }}
                  >
                    Key Engineering Challenges:
                  </div>
                  <ul className="space-y-1.5" aria-label="Engineering challenges">
                    {project.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span style={{ color: '#ffaa00' }} aria-hidden="true">
                          •
                        </span>
                        <span style={{ color: '#94a3b8' }}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Links */}
                {(project.github || project.demo) && (
                  <section aria-labelledby="links-heading" className="pt-2 border-t" style={{ borderColor: '#1e3a5f' }}>
                    <div
                      id="links-heading"
                      className="text-xs uppercase tracking-widest mb-3"
                      style={{ color: '#00d4ff' }}
                    >
                      Links:
                    </div>
                    <div className="flex gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-4 py-2 rounded transition-all hover:opacity-80"
                          style={{
                            border: '1px solid #1e3a5f',
                            color: '#94a3b8',
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
