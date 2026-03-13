'use client';

import { useState } from 'react';
import { projects } from '@/lib/data';
import { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface ProjectsPanelProps {
  onProjectClick: (project: Project) => void;
}

const categories = [
  { id: 'all', label: 'All Systems' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'platform', label: 'Platforms' },
  { id: 'tooling', label: 'Tooling' },
  { id: 'infrastructure', label: 'Infrastructure' },
] as const;

type CategoryId = (typeof categories)[number]['id'];

export default function ProjectsPanel({ onProjectClick }: ProjectsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section aria-labelledby="projects-heading" id="projects">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="projects-heading"
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: '#00d4ff' }}
        >
          ◈ Project Systems
        </h2>
        <span className="text-xs" style={{ color: '#4a5568' }}>
          {filtered.length} / {projects.length} systems
        </span>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="text-xs px-3 py-1 rounded transition-all shrink-0"
            style={{
              border: `1px solid ${activeCategory === cat.id ? '#00d4ff' : '#1e3a5f'}`,
              color: activeCategory === cat.id ? '#00d4ff' : '#4a5568',
              backgroundColor:
                activeCategory === cat.id ? 'rgba(0,212,255,0.1)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        role="tabpanel"
        aria-label={`Projects: ${activeCategory}`}
      >
        {filtered.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={onProjectClick}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
