/**
 * Static data for the portfolio: projects, skills, and boot-sequence messages.
 *
 * All arrays are read-only at runtime. Add new projects or skills here to have
 * them automatically appear in the Projects panel, Systems Map, and Skills panel.
 */

import { Project, Skill } from '@/types';

export const projects: Project[] = [
  {
    id: 'ai-image-audio',
    name: 'AI Image to Audio Accessibility System',
    status: 'Active',
    stack: ['Next.js', 'TypeScript', 'OpenAI Vision', 'OpenAI TTS', 'Node.js'],
    description:
      'A multimodal AI pipeline that uses GPT-4 Vision to generate rich semantic image descriptions and pipes them through OpenAI TTS — demonstrating real-time binary audio streaming, latency optimization, and accessibility-first interface design.',
    function: 'Converts images into spoken descriptions using GPT-4 Vision and OpenAI TTS',
    challenges: [
      'Binary audio streaming from API to browser',
      'Real-time speech generation with minimal latency',
      'Accessibility-first interface design principles',
      'Handling diverse image types and content accurately',
    ],
    github: 'https://github.com/MarcoFernstaedt',
    category: 'accessibility',
    repoPath: 'MarcoFernstaedt/ai-image-to-audio',
  },
  {
    id: 'realtime-messaging',
    name: 'Real Time Messaging Platform',
    status: 'Deployed',
    stack: ['React', 'Socket.IO', 'MongoDB', 'Node.js', 'Express', 'JWT'],
    description:
      'Full-stack real-time chat platform with live presence indicators, image messaging, and secure authentication.',
    function: 'Enables real-time communication with live user presence and media sharing',
    challenges: [
      'WebSocket connection management at scale',
      'Optimistic UI updates with eventual consistency',
      'Secure image upload and storage pipeline',
      'Session management across reconnects',
    ],
    github: 'https://github.com/MarcoFernstaedt',
    category: 'platform',
    repoPath: 'MarcoFernstaedt/realtime-messaging',
  },
  {
    id: 'code-interview',
    name: 'Code Interview Platform',
    status: 'Deployed',
    stack: ['React', 'TypeScript', 'Monaco Editor', 'Node.js', 'Docker'],
    description:
      'Live collaborative coding environment designed for technical interviews with real-time code execution and synchronized editing.',
    function: 'Enables live collaborative coding interviews with execution sandbox',
    challenges: [
      'Sandboxed code execution security',
      'Real-time collaborative editor synchronization',
      'Low-latency code output streaming',
      'Multi-language runtime support',
    ],
    github: 'https://github.com/MarcoFernstaedt',
    category: 'tooling',
    repoPath: 'MarcoFernstaedt/code-interview-platform',
  },
  {
    id: 'real-estate-tools',
    name: 'Real Estate Data Intelligence Tools',
    status: 'In Development',
    stack: ['Next.js', 'Python', 'PostgreSQL', 'Pandas', 'Chart.js'],
    description:
      'Data aggregation and analysis platform for real estate market intelligence, supporting data-driven decision making with interactive visualizations.',
    function: 'Aggregates and analyzes real estate market data for acquisition targeting',
    challenges: [
      'Multi-source data normalization',
      'Market trend prediction modeling',
      'Geographic data visualization',
      'Automated deal scoring algorithms',
    ],
    github: 'https://github.com/MarcoFernstaedt',
    category: 'infrastructure',
    repoPath: 'MarcoFernstaedt/real-estate-tools',
  },
];

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
