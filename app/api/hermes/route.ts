import { NextRequest, NextResponse } from 'next/server';
import { featuredProjects, skills } from '@/lib/data';

export const runtime = 'nodejs';

interface SentinelResponse {
  message: string;
  highlightId?: string;
  scrollToSection?: string;
  openProjectId?: string;
}

const ALLOWED_SECTIONS = new Set(['projects', 'skills', 'systems', 'founder', 'writing']);
const ALLOWED_PROJECT_IDS = new Set(featuredProjects.map((project) => project.id));
const MAX_MESSAGE_LENGTH = 500;

function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  return value.slice(0, maxLength).trim();
}

function sanitizeSentinelResponse(value: unknown): SentinelResponse | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  const message = cleanString(candidate.message, 500);
  if (!message) return null;

  const scrollToSection = cleanString(candidate.scrollToSection, 40);
  const highlightId = cleanString(candidate.highlightId, 40);
  const openProjectId = cleanString(candidate.openProjectId, 80);

  return {
    message,
    ...(scrollToSection && ALLOWED_SECTIONS.has(scrollToSection) ? { scrollToSection } : {}),
    ...(highlightId && ALLOWED_SECTIONS.has(highlightId) ? { highlightId } : {}),
    ...(openProjectId && ALLOWED_PROJECT_IDS.has(openProjectId) ? { openProjectId } : {}),
  };
}

const FALLBACK_TOUR: SentinelResponse[] = [
  {
    message:
      "Welcome to Marco's site. I am Sentinel. I will guide you through the strongest projects in order and explain what each one proves.",
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      'First is AI Image to Audio. It uses OpenAI multimodal vision and TTS APIs to turn uploaded images into spoken descriptions, with protected API routing and MP3 playback.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      'Next is Saguaro Blossoms Client Website. It shows a real business site with responsive UI, Tucson focused SEO metadata, Resend email templates, Vercel, and a custom domain.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      'Then Real Time Messaging. It shows React, Socket.IO, MongoDB, Node, Express, JWT cookies, presence, optimistic UI, and image sharing via Cloudinary.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      'Fourth is Code Interview Platform. It shows Monaco Editor, Stream video and chat, session records, backend orchestration, and code execution through the Piston sandbox API.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      'That is the project sequence. Ask about skills, experience, demos, source code, client work, AI, backend, frontend, or deployment.',
    scrollToSection: 'skills',
    highlightId: 'skills',
  },
];

function buildSystemPrompt(): string {
  const portfolio = {
    engineer: 'Marco Fernstaedt',
    title: 'Full Stack Software Engineer',
    skills: skills.map((s) => ({ name: s.name, level: s.level })),
    projects: featuredProjects.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      stack: p.stack,
      description: p.description,
      challenges: p.challenges,
      engineeringSignal: p.engineeringSignal,
      github: p.github,
      demo: p.demo,
      repoPath: p.repoPath,
    })),
    githubInventory: {
      publicRepoCount: 83,
      verifiedFeaturedRepos: featuredProjects.map((p) => p.repoPath),
      profile: 'https://github.com/MarcoFernstaedt',
    },
    contact: {
      github: 'https://github.com/MarcoFernstaedt',
      email: 'contact@marcofernstaedt.com',
    },
  };

  return `You are Sentinel, a project guide embedded in Marco Fernstaedt's software engineering portfolio.
Answer only from Marco's verified portfolio context. If asked about a missing repo, point to the GitHub profile rather than inventing details.

Portfolio context:
${JSON.stringify(portfolio, null, 2)}

IMPORTANT: Respond with valid JSON only. Use this exact schema:
{
  "message": "Your response. One to three short sentences.",
  "scrollToSection": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "highlightId": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "openProjectId": "ai-image-audio" | "saguaro-blossoms-client-site" | "realtime-messaging" | "code-interview" | null
}

Rules:
Keep the answer under 80 words.
The site displays only the best four systems from 83 public repos.
Order matters: AI Image to Audio, Saguaro Blossoms Client Website, Real Time Messaging Platform, Code Interview Platform.
Prefer AI Image to Audio when asked what to review first.
Mention exact GitHub or demo links only when relevant.`;
}

function buildUserMessage(
  event: 'tour_start' | 'tour_step' | 'user_message',
  message: string | null,
  step: number,
  currentSection: string
): string {
  if (event === 'tour_start') {
    return 'Start the project guide. Introduce Sentinel and the best projects in order.';
  }
  if (event === 'tour_step') {
    const project = featuredProjects[Math.min(Math.max(step - 1, 0), featuredProjects.length - 1)];
    return `Continue the project guide. Explain ${project.name}. Current section: ${currentSection}.`;
  }
  return message ?? 'Hello';
}

function projectSummary(projectId: string): SentinelResponse {
  const p = featuredProjects.find((project) => project.id === projectId)!;
  const links = [p.demo ? `Live demo: ${p.demo}` : null, p.github ? `GitHub: ${p.github}` : null]
    .filter(Boolean)
    .join(' | ');
  return {
    message: `${p.name}: ${p.function}. Engineering signal: ${p.engineeringSignal ?? 'Strong portfolio proof.'} ${links}`,
    scrollToSection: 'projects',
    highlightId: 'projects',
    openProjectId: p.id,
  };
}

function skillAnswer(q: string): SentinelResponse {
  if (q.includes('frontend') || q.includes('react') || q.includes('next') || q.includes('typescript') || q.includes('tailwind')) {
    return {
      message:
        'Frontend skills: React, Next.js, TypeScript, Tailwind CSS, structured content, polished responsive layout, and inclusive UI work. Best proof: AI Image to Audio and Saguaro Blossoms.',
      scrollToSection: 'skills',
      highlightId: 'skills',
    };
  }

  if (q.includes('backend') || q.includes('api') || q.includes('node') || q.includes('express') || q.includes('database') || q.includes('email')) {
    return {
      message:
        'Backend skills: Node.js, Express, API routes, JWT cookies, MongoDB and PostgreSQL concepts, Resend email, protected credentials, binary MP3 responses, Cloudinary, and webhook style patterns.',
      scrollToSection: 'skills',
      highlightId: 'skills',
    };
  }

  if (q.includes('ai') || q.includes('llm') || q.includes('openai') || q.includes('automation')) {
    return {
      message:
        'AI API integration is clearest in AI Image to Audio: OpenAI multimodal vision plus TTS, protected API routing, image upload flow, generated descriptions, and browser audio playback.',
      scrollToSection: 'projects',
      highlightId: 'projects',
      openProjectId: 'ai-image-audio',
    };
  }

  if (q.includes('deploy') || q.includes('vercel') || q.includes('infrastructure')) {
    return {
      message:
        'Deployment and infrastructure skills show up in Vercel production apps, custom domain client delivery, API boundaries, Piston sandbox usage, and system architecture.',
      scrollToSection: 'projects',
      highlightId: 'projects',
    };
  }

  return {
    message:
      'Core skills: React, Next.js, TypeScript, Tailwind CSS, inclusive UI, OpenAI Vision and TTS, Node and Express APIs, JWT auth, MongoDB and PostgreSQL concepts, Socket.IO, Cloudinary, Resend, SEO metadata, Vercel, Monaco, Piston, Stream, and systems architecture.',
    scrollToSection: 'skills',
    highlightId: 'skills',
  };
}

function experienceSummary(): SentinelResponse {
  return {
    message:
      'Experience summary: Marco builds full stack products from UI through backend APIs and deployment. The strongest proof is deployed AI audio work, a live client website, realtime messaging, and developer tool architecture.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  };
}

function answerFromPortfolio(message: string | null): SentinelResponse {
  const q = (message ?? '').toLowerCase();

  if (!q.trim()) {
    return {
      message:
        'Ask about the best project, skills, experience, demos, source code, AI, backend, frontend, deployment, or client delivery. I answer from the project database.',
      scrollToSection: 'projects',
      highlightId: 'projects',
    };
  }

  if (q.includes('experience') || q.includes('background') || q.includes('worked') || q.includes('career') || q.includes('qualified') || q.includes('fit')) {
    return experienceSummary();
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language') || q.includes('frontend') || q.includes('backend') || q.includes('react') || q.includes('next') || q.includes('typescript') || q.includes('node') || q.includes('api') || q.includes('python') || q.includes('deployment') || q.includes('tailwind') || q.includes('seo') || q.includes('resend')) {
    return skillAnswer(q);
  }

  if (q.includes('filter') || q.includes('category') || q.includes('categories')) {
    return {
      message:
        'Use filters to inspect the four systems by strength area: AI and audio, client platforms, realtime platforms, tooling, and infrastructure depth.',
      scrollToSection: 'projects',
      highlightId: 'projects',
    };
  }

  if (q.includes('cynthia') || q.includes('saguaro') || q.includes('client') || q.includes('seo') || q.includes('resend') || q.includes('tutoring')) {
    return projectSummary('saguaro-blossoms-client-site');
  }

  if (q.includes('image') || q.includes('audio') || q.includes('vision') || q.includes('tts') || q.includes('demo')) {
    return projectSummary('ai-image-audio');
  }

  if (q.includes('socket') || q.includes('chat') || q.includes('message') || q.includes('realtime') || q.includes('websocket')) {
    return projectSummary('realtime-messaging');
  }

  if (q.includes('code') || q.includes('interview') || q.includes('monaco') || q.includes('sandbox') || q.includes('tool') || q.includes('piston')) {
    return projectSummary('code-interview');
  }

  if (q.includes('all repos') || q.includes('all github') || q.includes('every repo') || q.includes('all 83')) {
    return {
      message:
        'No. The portfolio shows only the best four systems from 83 public repos. The full GitHub profile is linked for deeper review, but the page stays focused on the strongest work.',
      scrollToSection: 'projects',
      highlightId: 'projects',
    };
  }

  if (q.includes('github') || q.includes('repo') || q.includes('source')) {
    return {
      message:
        'Marco has 83 public GitHub repos. Featured source links: https://github.com/MarcoFernstaedt/image_accessibility_tool, https://github.com/MarcoFernstaedt/cynthia-tutoring-platform, https://github.com/MarcoFernstaedt/socketio_chat_app, and https://github.com/MarcoFernstaedt/code_live_platform. Full profile: github.com/MarcoFernstaedt.',
      scrollToSection: 'founder',
      highlightId: 'founder',
    };
  }

  if (q.includes('hire') || q.includes('first') || q.includes('best') || q.includes('strongest')) {
    return {
      message:
        'Start with AI Image to Audio. It is deployed and proves Marco can turn AI APIs into useful product work. Then review Saguaro Blossoms at https://saguaroblossomslearningservices.com for client delivery and production polish.',
      scrollToSection: 'projects',
      highlightId: 'projects',
      openProjectId: 'ai-image-audio',
    };
  }

  if (q.includes('contact') || q.includes('email')) {
    return {
      message:
        'Use the profile card for contact. Marco’s GitHub is github.com/MarcoFernstaedt and the portfolio contact email is contact@marcofernstaedt.com.',
      scrollToSection: 'founder',
      highlightId: 'founder',
    };
  }

  return {
    message:
      'The clearest story: Marco builds full stack systems with deployed product value. The best sequence is AI Image to Audio, Saguaro Blossoms client site, Real Time Messaging, then Code Interview Platform.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const event = body.event;
  if (event !== 'tour_start' && event !== 'tour_step' && event !== 'user_message') {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  }

  const rawContext = body.context && typeof body.context === 'object' ? body.context as Record<string, unknown> : {};
  const rawSection = cleanString(rawContext.currentSection, 40);
  const currentSection = rawSection && ALLOWED_SECTIONS.has(rawSection) ? rawSection : 'projects';
  const rawStep = typeof rawContext.step === 'number' && Number.isFinite(rawContext.step) ? rawContext.step : 0;
  const step = Math.min(Math.max(Math.trunc(rawStep), 0), FALLBACK_TOUR.length - 1);
  const message = event === 'user_message' ? cleanString(body.message, MAX_MESSAGE_LENGTH) : null;

  const hermesUrl = process.env.HERMES_API_URL;
  const hermesKey = process.env.HERMES_API_KEY;

  if (!hermesUrl || !hermesKey) {
    if (event === 'tour_start' || event === 'tour_step') {
      return NextResponse.json(FALLBACK_TOUR[step]);
    }
    return NextResponse.json(answerFromPortfolio(message));
  }

  try {
    const userContent = buildUserMessage(event, message, step, currentSection);

    const res = await fetch(`${hermesUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hermesKey ? { Authorization: `Bearer ${hermesKey}` } : {}),
      },
      body: JSON.stringify({
        model: 'hermes-agent',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: userContent },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      if (event === 'tour_start' || event === 'tour_step') {
        return NextResponse.json(FALLBACK_TOUR[step]);
      }
      return NextResponse.json(answerFromPortfolio(message));
    }

    const data = await res.json();
    const rawContent: string = data?.choices?.[0]?.message?.content ?? '';

    try {
      const parsed = sanitizeSentinelResponse(JSON.parse(rawContent));
      return NextResponse.json(parsed ?? answerFromPortfolio(message));
    } catch {
      return NextResponse.json({ message: rawContent.slice(0, 300) || answerFromPortfolio(message).message });
    }
  } catch {
    return NextResponse.json({
      message:
        'Sentinel is taking a moment. Open any project card for verified links, demos, and engineering details.',
    });
  }
}
