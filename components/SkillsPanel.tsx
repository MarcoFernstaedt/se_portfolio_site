'use client';

import { motion } from 'framer-motion';
import { skills } from '@/lib/data';
import { Skill } from '@/types';

const categoryColors: Record<Skill['category'], string> = {
  frontend: '#00d4ff',
  backend: '#0080ff',
  accessibility: '#00ff88',
  infrastructure: '#ffaa00',
};

const categoryLabels: Record<Skill['category'], string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  accessibility: 'Accessibility',
  infrastructure: 'Infrastructure',
};

export default function SkillsPanel() {
  return (
    <section
      aria-labelledby="skills-heading"
      className="rounded-lg p-5"
      style={{
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          id="skills-heading"
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: '#00d4ff' }}
        >
          ◈ Engineering Skills
        </h2>
        <span className="text-xs" style={{ color: '#4a5568' }}>
          {skills.length} modules
        </span>
      </div>

      {/* Skills list */}
      <div className="space-y-3" role="list" aria-label="Skill proficiency levels">
        {skills.map((skill, i) => {
          const color = categoryColors[skill.category];
          const filledBlocks = skill.level;
          const emptyBlocks = 10 - skill.level;
          const percentage = skill.level * 10;

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              role="listitem"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono" style={{ color: '#e2e8f0' }}>
                  {skill.name}
                </span>
                <span
                  className="text-xs px-1.5 rounded"
                  style={{
                    color: color,
                    backgroundColor: `${color}15`,
                    fontSize: '10px',
                  }}
                >
                  {categoryLabels[skill.category]}
                </span>
              </div>
              <div
                className="flex items-center gap-2"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name}: ${percentage}% proficiency`}
              >
                <div className="flex-1 flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <motion.span
                      key={j}
                      className="flex-1 h-2 rounded-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.06 + j * 0.03 }}
                      style={{
                        backgroundColor:
                          j < filledBlocks ? color : 'rgba(30,58,95,0.5)',
                        boxShadow: j < filledBlocks ? `0 0 6px ${color}40` : 'none',
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs w-8 text-right font-mono"
                  style={{ color: '#4a5568' }}
                  aria-hidden="true"
                >
                  {percentage}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
