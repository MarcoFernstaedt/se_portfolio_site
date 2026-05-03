import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/lib/data';

export const runtime = 'nodejs';

interface HermesResponse {
  message: string;
  highlightId?: string;
  scrollToSection?: string;
  openProjectId?: string;
}

const FALLBACK_TOUR: HermesResponse[] = [
  {
    message:
      "Welcome to Marco's Command Center. I'm Hermes, your guide. This portfolio is structured as an operational dashboard — every panel is a live system. Let's start with the project systems.",
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      "These four projects represent Marco's core engineering range: from AI multimodal pipelines, to real-time WebSocket platforms, to sandboxed code execution environments. Each one solved a non-trivial infrastructure problem.",
    highlightId: 'projects',
  },
  {
    message:
      "The Systems Map visualizes how these components relate architecturally — Marco thinks in systems, not just features. Click any node to inspect the implementation details.",
    scrollToSection: 'systems',
    highlightId: 'systems',
  },
  {
    message:
      "Marco's skill profile spans the full stack: React/Next.js on the frontend, Node.js and Python on the backend, and production deployment with Docker. The accessibility score is perfect — WCAG compliance is engineered in, not bolted on.",
    scrollToSection: 'skills',
    highlightId: 'skills',
  },
  {
    message:
      "That's the tour. You can type any question — about specific projects, Marco's engineering approach, or how to get in touch. I'll answer from what I know about his work.",
    scrollToSection: 'founder',
    highlightId: 'founder',
  },
];

function buildPortfolioContext() {
  return {
    engineer: 'Marco Fernstaedt',
    title: 'Full-Stack Software Engineer',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'Socket.IO',
      'Docker',
      'AI/LLM Integration',
    ],
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      stack: p.stack,
      description: p.description,
      challenges: p.challenges,
    })),
    contact: {
      github: 'https://github.com/MarcoFernstaedt',
      email: 'contact@marcofernstaedt.com',
    },
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { message, event, context } = body as {
    message: string | null;
    event: 'tour_start' | 'tour_step' | 'user_message';
    context: { currentSection: string; tourStep: number };
  };

  const hermesUrl = process.env.HERMES_API_URL;
  const hermesKey = process.env.HERMES_API_KEY;

  if (!hermesUrl) {
    if (event === 'tour_start' || event === 'tour_step') {
      const step = context?.tourStep ?? 0;
      const fallback = FALLBACK_TOUR[Math.min(step, FALLBACK_TOUR.length - 1)];
      return NextResponse.json(fallback);
    }
    return NextResponse.json({
      message:
        "I'm running in offline mode right now. To enable live AI responses, configure HERMES_API_URL on the server. In the meantime, feel free to explore the projects directly!",
    });
  }

  try {
    const res = await fetch(`${hermesUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hermesKey ? { Authorization: `Bearer ${hermesKey}` } : {}),
      },
      body: JSON.stringify({
        message,
        event,
        context: {
          ...context,
          portfolio: buildPortfolioContext(),
        },
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const step = context?.tourStep ?? 0;
      return NextResponse.json(FALLBACK_TOUR[Math.min(step, FALLBACK_TOUR.length - 1)]);
    }

    const data: HermesResponse = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      message:
        'Connection to Hermes timed out. Exploring on your own? Click any project card to inspect the details.',
    });
  }
}
