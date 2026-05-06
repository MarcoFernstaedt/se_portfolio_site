/**
 * Static data for the portfolio: projects, skills, and boot-sequence messages.
 *
 * Keep this file focused: the public site shows Marco's strongest systems,
 * ordered from highest-signal to next-best proof. Older practice repos stay on
 * GitHub, not in the featured portfolio grid.
 */

import { Project, Skill } from '@/types';

export const BEST_PROJECT_LIMIT = 4;

export const projects: Project[] = [
  {
    id: 'ai-image-audio',
    name: 'AI Image to Audio Accessibility System',
    status: 'Deployed',
    stack: ['Next.js', 'TypeScript', 'OpenAI Vision', 'OpenAI TTS', 'Node.js', 'Vercel'],
    description:
      'A deployed accessibility-first multimodal app that turns uploaded images into spoken descriptions. It shows AI API integration, server-side routing, binary audio handling, and product thinking for blind and low-vision users.',
    function: 'Converts images into spoken descriptions using GPT-4 Vision and OpenAI TTS',
    challenges: [
      'Binary audio streaming from API response to browser playback',
      'Server-side API routing that keeps provider credentials out of the client',
      'Accessible UX for image upload, generated descriptions, and audio controls',
      'Latency-aware user flow for multimodal AI processing and text-to-speech',
    ],
    engineeringSignal:
      'Best technical proof: deployed AI, accessibility, API routing, audio generation, and real user value in one focused product.',
    github: 'https://github.com/MarcoFernstaedt/image_accessibility_tool',
    demo: 'https://ita-orpin.vercel.app',
    category: 'accessibility',
    repoPath: 'MarcoFernstaedt/image_accessibility_tool',
  },
  {
    id: 'saguaro-blossoms-client-site',
    name: 'Saguaro Blossoms Client Website',
    status: 'Deployed',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Resend', 'SEO Metadata', 'Vercel'],
    description:
      'A production client website for Saguaro Blossoms Learning Services with polished responsive UI, local SEO pages, structured metadata, contact form email delivery, and deployment on a custom domain.',
    function: 'Publishes a live tutoring-services site with SEO, contact intake, branded email, and production deployment',
    challenges: [
      'Responsive mobile polish across hero, footer, image, and content sections',
      'SEO metadata, sitemap, robots, local service copy, and social preview assets',
      'Resend contact flow with owner and sender email behavior protected by tests',
      'Vercel production deployment with custom domain verification and asset-path checks',
    ],
    engineeringSignal:
      'Best client-delivery proof: real business website, production domain, SEO work, email integration, visual QA, and deployment discipline.',
    github: 'https://github.com/MarcoFernstaedt/cynthia-tutoring-platform',
    demo: 'https://saguaroblossomslearningservices.com',
    category: 'platform',
    repoPath: 'MarcoFernstaedt/cynthia-tutoring-platform',
  },
  {
    id: 'realtime-messaging',
    name: 'Real Time Messaging Platform',
    status: 'Deployed',
    stack: ['React', 'Socket.IO', 'MongoDB', 'Node.js', 'Express', 'JWT Auth'],
    description:
      'A full-stack messaging platform with real-time sockets, user presence, authentication, and media-sharing flows. It shows event-driven product surfaces across frontend and backend boundaries.',
    function: 'Enables real-time communication with live user presence and media sharing',
    challenges: [
      'WebSocket connection lifecycle and reconnect behavior',
      'Optimistic UI updates with eventual consistency',
      'JWT authentication and user-session handling',
      'Message/media data modeling across client and server boundaries',
    ],
    engineeringSignal:
      'Strong full-stack proof: React UI, Node/Express backend, MongoDB persistence, auth, and Socket.IO event architecture.',
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
      'A collaborative coding interview environment with a live editor and execution-sandbox architecture. It shows developer tooling, realtime collaboration, and safer execution-boundary thinking.',
    function: 'Enables live collaborative coding interviews with execution sandbox design',
    challenges: [
      'Embedding Monaco Editor into a usable interview workflow',
      'Designing safer code execution boundaries with containerized thinking',
      'Synchronizing editor state and output between participants',
      'Keeping a technical tool understandable for practical hiring workflows',
    ],
    engineeringSignal:
      'Developer-tools proof: Monaco editor integration, TypeScript, backend orchestration, and sandbox/security awareness.',
    github: 'https://github.com/MarcoFernstaedt/code_live_platform',
    category: 'tooling',
    repoPath: 'MarcoFernstaedt/code_live_platform',
  },
];

export const featuredProjects: Project[] = projects.slice(0, BEST_PROJECT_LIMIT);

export const skills: Skill[] = [
  { name: 'React / Next.js', level: 9, category: 'frontend' },
  { name: 'TypeScript', level: 8, category: 'frontend' },
  { name: 'Tailwind CSS', level: 8, category: 'frontend' },
  { name: 'Accessibility / WCAG', level: 10, category: 'accessibility' },
  { name: 'OpenAI Vision / TTS', level: 8, category: 'backend' },
  { name: 'Node.js / Express', level: 8, category: 'backend' },
  { name: 'Backend APIs', level: 8, category: 'backend' },
  { name: 'JWT Auth', level: 7, category: 'backend' },
  { name: 'PostgreSQL / MongoDB', level: 7, category: 'backend' },
  { name: 'Socket.IO / WebSockets', level: 8, category: 'backend' },
  { name: 'Resend Email', level: 7, category: 'backend' },
  { name: 'SEO / Structured Data', level: 8, category: 'frontend' },
  { name: 'Vercel Deployment', level: 8, category: 'infrastructure' },
  { name: 'Docker / Sandbox Design', level: 6, category: 'infrastructure' },
  { name: 'Monaco Editor', level: 7, category: 'frontend' },
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
