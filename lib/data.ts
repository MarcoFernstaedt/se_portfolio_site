/**
 * Static data for the portfolio: projects, skills, and boot sequence messages.
 *
 * Keep this file focused. The public site shows Marco's strongest systems in
 * order. Older practice repos stay on GitHub, not in the featured grid.
 */

import { Project, Skill } from '@/types';

export const BEST_PROJECT_LIMIT = 4;

export const projects: Project[] = [
  {
    id: 'ai-image-audio',
    name: 'AI Image to Audio',
    status: 'Deployed',
    stack: ['Next.js', 'TypeScript', 'OpenAI Vision', 'OpenAI TTS', 'Node.js', 'Vercel'],
    description:
      'A deployed multimodal app that turns uploaded images into spoken descriptions. It shows AI API integration, protected API routing, MP3 response handling, and product thinking for people who rely on audio output.',
    function: 'Converts uploaded images into spoken descriptions using OpenAI multimodal vision and TTS APIs',
    challenges: [
      'Binary MP3 response handling from API to browser playback and download',
      'Protected API routing that keeps provider credentials out of the client',
      'Upload, status, generated description, and audio control flow',
      'Clear loading states for AI image analysis and speech generation latency',
    ],
    engineeringSignal:
      'Best technical proof: deployed AI, image understanding, API routing, audio generation, and real user value in one focused product.',
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
      'A production tutoring business website for Saguaro Blossoms Learning Services with polished responsive UI, Tucson focused SEO metadata, structured content, contact form email delivery, and custom domain deployment.',
    function: 'Publishes a live tutoring services site with SEO, contact intake, branded Resend email templates, and production deployment',
    challenges: [
      'Responsive mobile polish across hero, footer, image, and content sections',
      'SEO metadata, sitemap, robots, Tucson service copy, and social preview assets',
      'Resend contact flow with owner and sender email behavior protected by tests',
      'Vercel production deployment with custom domain verification and asset path checks',
    ],
    engineeringSignal:
      'Strong delivery proof: real business website, production domain, SEO implementation, email integration, visual QA, and deployment discipline.',
    github: 'https://github.com/MarcoFernstaedt/cynthia-tutoring-platform',
    demo: 'https://saguaroblossomslearningservices.com',
    category: 'platform',
    repoPath: 'MarcoFernstaedt/cynthia-tutoring-platform',
  },
  {
    id: 'realtime-messaging',
    name: 'Real Time Messaging Platform',
    status: 'Active',
    stack: ['React', 'Socket.IO', 'MongoDB', 'Node.js', 'Express', 'JWT Auth'],
    description:
      'A full stack messaging platform with Socket.IO communication, online presence, authentication, and Cloudinary backed image messages. It shows product behavior across frontend and backend boundaries.',
    function: 'Enables realtime communication with online presence and image sharing via Cloudinary',
    challenges: [
      'Authenticated Socket.IO connection and disconnect handling with presence cleanup',
      'Optimistic UI updates with eventual consistency',
      'JWT cookie authentication and protected routes',
      'Text and image message persistence across client and server boundaries',
    ],
    engineeringSignal:
      'Strong full stack proof: React UI, Node and Express backend, MongoDB persistence, auth, Socket.IO events, and Cloudinary image messages.',
    github: 'https://github.com/MarcoFernstaedt/socketio_chat_app',
    category: 'platform',
    repoPath: 'MarcoFernstaedt/socketio_chat_app',
  },
  {
    id: 'code-interview',
    name: 'Code Interview Platform',
    status: 'Active',
    stack: ['React', 'TypeScript', 'Monaco Editor', 'Node.js', 'Piston API', 'Stream Video'],
    description:
      'A coding interview workspace with Monaco Editor, Stream video and chat, session records, and external sandboxed code execution through Piston. It shows developer tool work plus backend orchestration.',
    function: 'Supports live coding interview sessions with editor, video, chat, session records, and sandboxed code execution through Piston',
    challenges: [
      'Embedding Monaco Editor into a usable interview workflow',
      'Coordinating session state, video, chat, editor, and output in one workspace',
      'Using Piston sandbox API for safer code execution flow',
      'Orchestrating Clerk, MongoDB, Stream, and Inngest across the backend',
    ],
    engineeringSignal:
      'Developer tools proof: Monaco integration, TypeScript, backend orchestration, Stream video and chat, and sandbox aware execution through Piston.',
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
  { name: 'Inclusive UI', level: 8, category: 'accessibility' },
  { name: 'OpenAI Vision / TTS', level: 8, category: 'backend' },
  { name: 'Node.js / Express', level: 8, category: 'backend' },
  { name: 'Backend APIs', level: 8, category: 'backend' },
  { name: 'JWT Auth', level: 7, category: 'backend' },
  { name: 'PostgreSQL / MongoDB', level: 7, category: 'backend' },
  { name: 'Socket.IO / WebSockets', level: 8, category: 'backend' },
  { name: 'Cloudinary', level: 7, category: 'backend' },
  { name: 'Resend Email', level: 7, category: 'backend' },
  { name: 'SEO / Structured Data', level: 8, category: 'frontend' },
  { name: 'Vercel Deployment', level: 8, category: 'infrastructure' },
  { name: 'Monaco Editor', level: 7, category: 'frontend' },
  { name: 'Piston API', level: 7, category: 'backend' },
  { name: 'Stream Video / Chat', level: 7, category: 'backend' },
  { name: 'Systems Architecture', level: 7, category: 'infrastructure' },
];

export const bootMessages = [
  'Initializing Systems...',
  'Loading Marco Fernstaedt Command Center',
  'Calibrating Interface Modules...',
  'Audio Friendly Mode Ready',
  'Establishing Secure Connection...',
  'Loading Project Database...',
  'Systems Online',
];
