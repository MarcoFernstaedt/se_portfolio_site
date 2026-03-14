'use client';

import { motion } from 'framer-motion';
import { Project } from '@/types';
import StatusBadge from './StatusBadge';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  index: number;
}

/** Icon symbols mapped to project categories for visual identification in card headers. */
const categoryIcon: Record<Project['category'], string> = {
  accessibility: '♿',
  platform: '⚡',
  tooling: '⚙',
  infrastructure: '◈',
};

/**
 * Animated project card shown in the Projects panel grid.
 *
 * Clicking or pressing Enter opens the project detail modal via `onClick`.
 * Displays the project category icon, name, one-line function description,
 * up to four tech-stack tags, and an on-hover "OPEN SYSTEM" prompt.
 */
export default function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => onClick(project)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(project)}
      role="button"
      tabIndex={0}
      aria-label={`Open project: ${project.name}. Status: ${project.status}`}
      className="cursor-pointer group rounded-lg p-4 transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
      }}
      whileHover={{
        borderColor: 'rgba(0,212,255,0.5)',
        backgroundColor: 'rgba(17,24,39,0.95)',
        y: -2,
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            {categoryIcon[project.category]}
          </span>
          <h3
            className="text-sm font-bold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {project.name}
          </h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Function line */}
      <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {project.function}
      </p>

      {/* Stack pills */}
      <div className="flex flex-wrap gap-1.5 mb-3" aria-label="Tech stack">
        {project.stack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(0,128,255,0.1)',
              border: '1px solid rgba(0,128,255,0.2)',
              color: 'var(--text-secondary)',
            }}
          >
            {tech}
          </span>
        ))}
        {project.stack.length > 4 && (
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
            +{project.stack.length - 4} more
          </span>
        )}
      </div>

      {/* Open prompt */}
      <div
        className="text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--accent-cyan)' }}
        aria-hidden="true"
      >
        <span>›</span>
        <span>OPEN SYSTEM</span>
      </div>
    </motion.article>
  );
}
