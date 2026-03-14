/**
 * Core type definitions for the portfolio application.
 *
 * Defines the data shapes for projects and skills, which are sourced from
 * `lib/data.ts` and consumed by the various panel and map components.
 */

/** A portfolio project shown in the Projects panel, Systems Map, and modal. */
export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Deployed' | 'In Development' | 'Archived';
  stack: string[];
  description: string;
  function: string;
  challenges: string[];
  github?: string;
  demo?: string;
  category: 'accessibility' | 'platform' | 'tooling' | 'infrastructure';
}

/** A technical skill shown in the Skills panel with a 0-10 proficiency level. */
export interface Skill {
  name: string;
  /** Proficiency score on a 0–10 scale (10 = expert). Rendered as a block bar. */
  level: number;
  category: 'frontend' | 'backend' | 'infrastructure' | 'accessibility';
}

export interface SystemNode {
  id: string;
  label: string;
  type: 'root' | 'system' | 'tool';
  description?: string;
  projectId?: string;
}
