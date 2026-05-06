/**
 * Static data for the portfolio: projects, skills, and boot-sequence messages.
 *
 * All arrays are read-only at runtime. Add new projects or skills here to have
 * them automatically appear in the Projects panel, Systems Map, and Skills panel.
 */

import { Project, Skill } from '@/types';

export const BEST_PROJECT_LIMIT = 4;

export const projects: Project[] = [
  {
    id: 'ai-image-audio',
    name: 'AI Image to Audio Accessibility System',
    status: 'Deployed',
    stack: ['Next.js', 'TypeScript', 'OpenAI Vision', 'OpenAI TTS', 'Node.js'],
    description:
      'A deployed accessibility-first multimodal app that turns uploaded images into spoken descriptions. It proves Marco can ship AI API integrations with a real UI, server-side routing, binary audio handling, and screen-reader-aware product thinking.',
    function: 'Converts images into spoken descriptions using GPT-4 Vision and OpenAI TTS',
    challenges: [
      'Binary audio streaming from API response to browser playback',
      'Server-side API routing that keeps provider credentials out of the client',
      'Accessible UX for image upload, generated descriptions, and audio controls',
      'Latency-aware user flow for multimodal AI processing and text-to-speech',
    ],
    recruiterSignal:
      'Best proof for accessibility-focused engineering roles: it combines AI APIs, Next.js, TypeScript, and low-vision user value in a deployed product.',
    github: 'https://github.com/MarcoFernstaedt/image_accessibility_tool',
    demo: 'https://ita-orpin.vercel.app',
    category: 'accessibility',
    repoPath: 'MarcoFernstaedt/image_accessibility_tool',
  },
  {
    id: 'realtime-messaging',
    name: 'Real Time Messaging Platform',
    status: 'Deployed',
    stack: ['React', 'Socket.IO', 'MongoDB', 'Node.js', 'Express', 'JWT'],
    description:
      'A full-stack messaging platform with real-time sockets, user presence, authentication, and media-sharing flows. It shows Marco can build event-driven product surfaces, not only static pages.',
    function: 'Enables real-time communication with live user presence and media sharing',
    challenges: [
      'WebSocket connection lifecycle and reconnect behavior',
      'Optimistic UI updates with eventual consistency',
      'Secure authentication and user-session handling',
      'Message/media data modeling across client and server boundaries',
    ],
    recruiterSignal:
      'Strong full-stack signal: React UI, Node/Express backend, MongoDB persistence, auth, and Socket.IO event architecture.',
    github: 'https://github.com/MarcoFernstaedt/socketio_chat_app',
    category: 'platform',
    repoPath: 'MarcoFernstaedt/socketio_chat_app',
  },
  {
    id: 'code-interview',
    name: 'Code Interview Platform',
    status: 'Deployed',
    stack: ['React', 'TypeScript', 'Monaco Editor', 'Node.js', 'Docker'],
    description:
      'A collaborative coding interview environment with a live editor and execution-sandbox architecture. It highlights Marco’s ability to combine developer tooling, realtime collaboration, and safer execution boundaries.',
    function: 'Enables live collaborative coding interviews with execution sandbox design',
    challenges: [
      'Embedding Monaco Editor into a usable interview workflow',
      'Designing safer code execution boundaries with containerized thinking',
      'Synchronizing editor state and output between participants',
      'Keeping a technical tool understandable for recruiters and candidates',
    ],
    recruiterSignal:
      'Developer-tools signal: editor integration, TypeScript, backend orchestration, and sandbox/security awareness.',
    github: 'https://github.com/MarcoFernstaedt/code_live_platform',
    category: 'tooling',
    repoPath: 'MarcoFernstaedt/code_live_platform',
  },
  {
    id: 'real-estate-tools',
    name: 'Deal Intelligence / Acquisition Research Tools',
    status: 'In Development',
    stack: ['Next.js', 'Python', 'PostgreSQL', 'Pandas', 'Chart.js'],
    description:
      'An operator-focused data intelligence lane for acquisition research and market analysis. It shows Marco applying software engineering to business ownership: data collection, scoring, dashboards, and decision support.',
    function: 'Aggregates and analyzes market and operator data for acquisition targeting',
    challenges: [
      'Multi-source data normalization and enrichment',
      'Scoring models that turn raw market signals into operator decisions',
      'Dashboarding for acquisition research and pipeline review',
      'Balancing automation with human verification before strategic action',
    ],
    recruiterSignal:
      'Business-systems signal: Python data work, dashboard thinking, and pragmatic automation tied to real decision-making.',
    github: 'https://github.com/MarcoFernstaedt/dominion_edge_holdings',
    category: 'infrastructure',
    repoPath: 'MarcoFernstaedt/dominion_edge_holdings',
  },
];

export const featuredProjects: Project[] = projects.slice(0, BEST_PROJECT_LIMIT);

export const skills: Skill[] = [
  { name: 'React / Next.js', level: 9, category: 'frontend' },
  { name: 'TypeScript', level: 8, category: 'frontend' },
  { name: 'Accessibility / WCAG', level: 10, category: 'accessibility' },
  { name: 'Node.js / Express', level: 8, category: 'backend' },
  { name: 'Backend APIs', level: 7, category: 'backend' },
  { name: 'PostgreSQL / MongoDB', level: 7, category: 'backend' },
  { name: 'Socket.IO / WebSockets', level: 8, category: 'backend' },
  { name: 'Docker / Deployment', level: 6, category: 'infrastructure' },
  { name: 'AI / LLM Integration', level: 8, category: 'frontend' },
  { name: 'Systems Architecture', level: 7, category: 'infrastructure' },
];

export const bootMessages = [
  'Initializing Systems...',
  'Loading Marco Fernstaedt Command Center',
  'Calibrating Interface Modules...',
  'Accessibility Mode: Enabled',
  'Establishing Secure Connection...',
  'Loading Project Database...',
  'Systems Online',
];
