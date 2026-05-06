import { NextRequest, NextResponse } from 'next/server';
import { featuredProjects, skills } from '@/lib/data';

export const runtime = 'nodejs';

interface SentinelResponse {
  message: string;
  highlightId?: string;
  scrollToSection?: string;
  openProjectId?: string;
}

const PROJECT_OVERVIEW: SentinelResponse[] = [
  {
    message:
      "Marco's strongest project is AI Image to Audio: deployed AI, accessibility, server-side API routing, and audio generation in one focused product.",
    scrollToSection: 'projects',
    highlightId: 'projects',
    openProjectId: 'ai-image-audio',
  },
  {
    message:
      'Next is Saguaro Blossoms Client Website: a live client site with responsive UI, SEO metadata, Resend contact email, Vercel deployment, and custom-domain production polish.',
    scrollToSection: 'projects',
    highlightId: 'projects',
    openProjectId: 'saguaro-blossoms-client-site',
  },
  {
    message:
      'Then Real Time Messaging: React, Socket.IO, MongoDB, Node/Express, JWT auth, presence, and event-driven UI/backend behavior.',
    scrollToSection: 'projects',
    highlightId: 'projects',
    openProjectId: 'realtime-messaging',
  },
  {
    message:
      'Fourth is Code Interview Platform: TypeScript, Monaco Editor, backend orchestration, collaboration flow, and Docker/sandbox design thinking.',
    scrollToSection: 'projects',
    highlightId: 'projects',
    openProjectId: 'code-interview',
  },
];

function buildSystemPrompt(): string {
  const portfolio = {
    engineer: 'Marco Fernstaedt',
    title: 'Full-Stack Software Engineer',
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
  "message": "Your response (1-3 sentences, direct)",
  "scrollToSection": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "highlightId": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "openProjectId": "ai-image-audio" | "saguaro-blossoms-client-site" | "realtime-messaging" | "code-interview" | null
}

Rules:
- Keep the answer under 80 words.
- The site intentionally displays only the best four systems from 83 public repos.
- Order matters: AI Image to Audio, Saguaro Blossoms Client Website, Real Time Messaging Platform, Code Interview Platform.
- Prefer AI Image to Audio when asked what to review first.
- Mention exact GitHub/demo links only when relevant.`;
}

function buildUserMessage(
  event: 'project_overview' | 'project_step' | 'user_message',
  message: string | null,
  step: number,
  currentSection: string
): string {
  if (event === 'project_overview') {
    return 'Summarize the best four projects in order, starting with the strongest project.';
  }
  if (event === 'project_step') {
    const project = featuredProjects[Math.min(step, featuredProjects.length - 1)];
    return `Explain this featured project briefly: ${project.name}. Current section: ${currentSection}.`;
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
        'Frontend skills: React, Next.js, TypeScript, Tailwind CSS, accessibility-focused UI, SEO metadata, structured content, and polished responsive layout. Best proof: AI Image to Audio and Saguaro Blossoms.',
      scrollToSection: 'skills',
      highlightId: 'skills',
      openProjectId: 'saguaro-blossoms-client-site',
    };
  }

  if (q.includes('backend') || q.includes('api') || q.includes('node') || q.includes('express') || q.includes('database') || q.includes('email')) {
    return {
      message:
        'Backend skills: Node.js, Express, API routes, JWT auth, MongoDB/PostgreSQL concepts, Resend email, server-side credential protection, binary audio responses, and webhook-style integration patterns.',
      scrollToSection: 'skills',
      highlightId: 'skills',
      openProjectId: 'realtime-messaging',
    };
  }

  if (q.includes('ai') || q.includes('llm') || q.includes('openai') || q.includes('automation')) {
    return {
      message:
        'AI API integration is clearest in AI Image to Audio: OpenAI Vision plus TTS, server-side routing, accessible upload flow, generated descriptions, and browser audio playback.',
      scrollToSection: 'projects',
      highlightId: 'projects',
      openProjectId: 'ai-image-audio',
    };
  }

  if (q.includes('deploy') || q.includes('vercel') || q.includes('docker') || q.includes('infrastructure')) {
    return {
      message:
        'Deployment and infrastructure skills show up in Vercel production apps, custom-domain client delivery, API boundaries, Docker/sandbox design, and data-flow architecture.',
      scrollToSection: 'projects',
      highlightId: 'projects',
      openProjectId: 'saguaro-blossoms-client-site',
    };
  }

  return {
    message:
      'Core skills: React, Next.js, TypeScript, Tailwind CSS, accessibility, OpenAI Vision/TTS, Node/Express APIs, JWT auth, MongoDB/PostgreSQL concepts, Socket.IO, Resend, SEO metadata, Vercel, Monaco Editor, and Docker/sandbox design.',
    scrollToSection: 'skills',
    highlightId: 'skills',
  };
}

function experienceSummary(): SentinelResponse {
  return {
    message:
      'Experience summary: Marco builds full-stack products from UI through backend APIs and deployment. The strongest proof is deployed AI accessibility work, a live client website, realtime messaging, and developer-tooling architecture.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  };
}

function answerFromPortfolio(message: string | null): SentinelResponse {
  const q = (message ?? '').toLowerCase();

  if (!q.trim()) {
    return {
      message:
        'Ask about the best project, skills, experience, demos, source code, accessibility, AI, backend, frontend, deployment, or client delivery. I answer from the project database.',
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
        'Use filters to inspect the four systems by strength area: Accessibility for AI Image to Audio, Platform for Saguaro Blossoms and realtime messaging, Tooling for code interview work, and Infrastructure for deployment depth.',
      scrollToSection: 'projects',
      highlightId: 'projects',
    };
  }

  if (q.includes('cynthia') || q.includes('saguaro') || q.includes('client') || q.includes('seo') || q.includes('resend') || q.includes('tutoring')) {
    return projectSummary('saguaro-blossoms-client-site');
  }

  if (q.includes('image') || q.includes('audio') || q.includes('accessib') || q.includes('vision') || q.includes('tts') || q.includes('demo')) {
    return projectSummary('ai-image-audio');
  }

  if (q.includes('socket') || q.includes('chat') || q.includes('message') || q.includes('realtime') || q.includes('websocket')) {
    return projectSummary('realtime-messaging');
  }

  if (q.includes('code') || q.includes('interview') || q.includes('monaco') || q.includes('sandbox') || q.includes('tool')) {
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
        'Start with AI Image to Audio. It is deployed, accessibility-focused, and proves Marco can turn AI APIs into useful product work. Then review Saguaro Blossoms at https://saguaroblossomslearningservices.com for client delivery and production polish.',
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
      'The clearest story: Marco builds accessible, full-stack systems with deployed product value. The best sequence is AI Image to Audio, Saguaro Blossoms client site, Real Time Messaging, then Code Interview Platform.',
    scrollToSection: 'projects',
    highlightId: 'projects',
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { message, event, context } = body as {
    message: string | null;
    event: 'project_overview' | 'project_step' | 'user_message';
    context: { currentSection: string; step: number };
  };

  const hermesUrl = process.env.HERMES_API_URL;
  const hermesKey = process.env.HERMES_API_KEY;

  if (!hermesUrl) {
    if (event === 'project_overview' || event === 'project_step') {
      const step = context?.step ?? 0;
      return NextResponse.json(PROJECT_OVERVIEW[Math.min(step, PROJECT_OVERVIEW.length - 1)]);
    }
    return NextResponse.json(answerFromPortfolio(message));
  }

  try {
    const userContent = buildUserMessage(event, message, context?.step ?? 0, context?.currentSection ?? 'projects');

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
      const step = context?.step ?? 0;
      return NextResponse.json(PROJECT_OVERVIEW[Math.min(step, PROJECT_OVERVIEW.length - 1)]);
    }

    const data = await res.json();
    const rawContent: string = data?.choices?.[0]?.message?.content ?? '';

    try {
      const parsed: SentinelResponse = JSON.parse(rawContent);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ message: rawContent.slice(0, 300) });
    }
  } catch {
    return NextResponse.json({
      message:
        'Sentinel is taking a moment. Open any project card for verified links, demos, and engineering details.',
    });
  }
}
