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

export interface Skill {
  name: string;
  level: number; // 0-10
  category: 'frontend' | 'backend' | 'infrastructure' | 'accessibility';
}

export interface SystemNode {
  id: string;
  label: string;
  type: 'root' | 'system' | 'tool';
  description?: string;
  projectId?: string;
}
