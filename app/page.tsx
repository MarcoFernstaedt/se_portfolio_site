'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import BootScreen from '@/components/BootScreen';
import TopBar from '@/components/TopBar';
import ProjectsPanel from '@/components/ProjectsPanel';
import ProjectModal from '@/components/ProjectModal';
import SkillsPanel from '@/components/SkillsPanel';
import SystemsMap from '@/components/SystemsMap';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import FounderSection from '@/components/FounderSection';
import VoiceCommand from '@/components/VoiceCommand';
import { Project } from '@/types';

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const systemsRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);

  const handleScrollTo = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      projects: projectsRef,
      skills: skillsRef,
      systems: systemsRef,
      founder: founderRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      {/* Boot screen */}
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      {/* Main app */}
      <div
        className={`min-h-screen grid-bg scanlines transition-opacity duration-700 ${booted ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <TopBar />

        <main id="main-content" className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 sm:pb-32">
          {/* Hero strip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={booted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 sm:mb-8 py-3 sm:py-4 px-4 sm:px-5 rounded-lg flex flex-wrap items-center justify-between gap-3 sm:gap-4"
            style={{
              backgroundColor: 'rgba(0,212,255,0.04)',
              border: '1px solid rgba(0,212,255,0.12)',
            }}
          >
            <div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide mb-1"
                style={{ color: 'var(--accent-cyan)', textShadow: '0 0 20px rgba(0,212,255,0.3)' }}
              >
                COMMAND CENTER
              </h1>
              <p className="text-xs tracking-widest truncate max-w-[280px] sm:max-w-none" style={{ color: 'var(--text-dim)' }}>
                MARCO FERNSTAEDT ── FULL-STACK ENGINEER · ACCESSIBILITY SPECIALIST
              </p>
            </div>
            <div
              className="flex items-center gap-2 text-xs font-mono"
              style={{ color: 'var(--accent-green)' }}
              aria-label="System status: all systems online"
            >
              <span
                className="w-2 h-2 rounded-full pulse-dot"
                style={{ backgroundColor: '#00ff88' }}
                aria-hidden="true"
              />
              ALL SYSTEMS ONLINE
            </div>
          </motion.div>

          {/* Main grid layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-6">
            {/* Left column — projects (2/3 width) */}
            <div className="xl:col-span-2 space-y-5 md:space-y-6">
              <motion.div
                ref={projectsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={booted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <ProjectsPanel onProjectClick={setSelectedProject} />
              </motion.div>

              {/* Systems map */}
              <motion.div
                ref={systemsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={booted ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                id="systems"
              >
                <SystemsMap onProjectClick={setSelectedProject} />
              </motion.div>
            </div>

            {/* Right column — sidebar (1/3 width) */}
            <div className="space-y-5 md:space-y-6">
              {/* Founder / identity */}
              <motion.div
                ref={founderRef}
                initial={{ opacity: 0, x: 20 }}
                animate={booted ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.35 }}
                id="founder"
              >
                <FounderSection />
              </motion.div>

              {/* Skills */}
              <motion.div
                ref={skillsRef}
                initial={{ opacity: 0, x: 20 }}
                animate={booted ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.45 }}
                id="skills"
              >
                <SkillsPanel />
              </motion.div>

              {/* Accessibility panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={booted ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.55 }}
              >
                <AccessibilityPanel />
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={booted ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs"
            style={{ borderTop: '1px solid var(--border-color)', color: '#4a5568' }}
            role="contentinfo"
          >
            <span>© 2026 Marco Fernstaedt · Software Engineer</span>
            <span>Built with Next.js · TypeScript · Tailwind · Framer Motion</span>
          </motion.footer>
        </main>

        {/* Voice command interface */}
        {booted && (
          <VoiceCommand
            onProjectOpen={setSelectedProject}
            onScrollTo={handleScrollTo}
          />
        )}
      </div>

      {/* Project modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
