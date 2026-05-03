import { NextRequest, NextResponse } from 'next/server';
import { projects, skills } from '@/lib/data';

export const runtime = 'nodejs';

interface HermesResponse {
  message: string;
  highlightId?: string;
  scrollToSection?: string;
  openProjectId?: string;
}

// Fallback narration used when HERMES_API_URL is not configured (dev / offline)
const FALLBACK_TOUR: HermesResponse[] = [
  {
    message:
      "Welcome to Marco's Command Center. I'm Hermes, your guide. This portfolio is structured as an operational dashboard — every panel is a live system. Let's start with the projects.",
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      "These four projects cover Marco's core engineering range: an AI multimodal pipeline, a real-time WebSocket platform, a sandboxed code execution environment, and a data intelligence platform. Each solved a non-trivial infrastructure problem.",
    highlightId: 'projects',
  },
  {
    message:
      "The Systems Map visualizes how these components relate architecturally. Marco thinks in systems, not just features — click any node to inspect the implementation details.",
    scrollToSection: 'systems',
    highlightId: 'systems',
  },
  {
    message:
      "Marco's skill profile spans the full stack: React/Next.js on the frontend, Node.js and Python on the backend, production Docker deployment, and an 8/10 on AI/LLM integration.",
    scrollToSection: 'skills',
    highlightId: 'skills',
  },
  {
    message:
      "That's the tour. Type any question — about specific projects, his engineering approach, or how to get in touch. I'll answer from what I know about Marco's work.",
    scrollToSection: 'founder',
    highlightId: 'founder',
  },
];

// System prompt injected into every Hermes request.
// Instructs Hermes to respond as a portfolio guide and output structured JSON.
function buildSystemPrompt(): string {
  const portfolio = {
    engineer: 'Marco Fernstaedt',
    title: 'Full-Stack Software Engineer',
    skills: skills.map((s) => ({ name: s.name, level: s.level })),
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

  return `You are Hermes, an AI guide embedded in Marco Fernstaedt's software engineering portfolio.
Your role is to guide recruiters and visitors through the portfolio in a knowledgeable, concise, and confident tone.
You know everything about Marco's projects, skills, and engineering approach from the context below.

Portfolio context:
${JSON.stringify(portfolio, null, 2)}

IMPORTANT: You MUST respond with valid JSON only — no markdown fences, no extra text. Use this exact schema:
{
  "message": "Your spoken response (1–3 sentences, conversational, direct)",
  "scrollToSection": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "highlightId": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "openProjectId": "ai-image-audio" | "realtime-messaging" | "code-interview" | "real-estate-tools" | null
}

Rules:
- scrollToSection: scroll to this section when relevant to your message (null otherwise)
- highlightId: same as scrollToSection in most cases (null otherwise)
- openProjectId: only set this when you are directly discussing a specific project and the user would benefit from seeing its detail modal
- Keep message under 60 words — recruiters skim`;
}

// Build the user message content from the request event and context
function buildUserMessage(
  event: 'tour_start' | 'tour_step' | 'user_message',
  message: string | null,
  tourStep: number,
  currentSection: string
): string {
  if (event === 'tour_start') {
    return 'The visitor has just arrived at the portfolio. Give a brief, engaging introduction (step 0 of the guided tour). Welcome them and set the scene.';
  }
  if (event === 'tour_step') {
    const stepTopics = ['projects overview', 'standout project deep-dive', 'systems architecture', 'skills profile', 'closing and contact'];
    const topic = stepTopics[Math.min(tourStep, stepTopics.length - 1)];
    return `Continue the guided tour (step ${tourStep}). Topic: ${topic}. Current section visible: ${currentSection}.`;
  }
  // user_message
  return message ?? 'Hello';
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { message, event, context } = body as {
    message: string | null;
    event: 'tour_start' | 'tour_step' | 'user_message';
    context: { currentSection: string; tourStep: number };
  };

  const hermesUrl = process.env.HERMES_API_URL; // e.g. http://localhost:8642
  const hermesKey = process.env.HERMES_API_KEY; // API_SERVER_KEY from ~/.hermes/.env

  // --- Offline / fallback path ---
  if (!hermesUrl) {
    if (event === 'tour_start' || event === 'tour_step') {
      const step = context?.tourStep ?? 0;
      return NextResponse.json(FALLBACK_TOUR[Math.min(step, FALLBACK_TOUR.length - 1)]);
    }
    return NextResponse.json({
      message:
        "I'm running in offline mode. Configure HERMES_API_URL to enable live responses from the Hermes agent on your VPS.",
    });
  }

  // --- Live path: Hermes OpenAI-compatible API (port 8642 by default) ---
  try {
    const userContent = buildUserMessage(event, message, context?.tourStep ?? 0, context?.currentSection ?? 'projects');

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
        temperature: 0.7,
        max_tokens: 300,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      const step = context?.tourStep ?? 0;
      return NextResponse.json(FALLBACK_TOUR[Math.min(step, FALLBACK_TOUR.length - 1)]);
    }

    const data = await res.json();
    const rawContent: string = data?.choices?.[0]?.message?.content ?? '';

    // Parse the JSON response Hermes was instructed to return
    try {
      const parsed: HermesResponse = JSON.parse(rawContent);
      return NextResponse.json(parsed);
    } catch {
      // Hermes didn't return valid JSON — wrap the raw text as a plain message
      return NextResponse.json({ message: rawContent.slice(0, 300) });
    }
  } catch {
    return NextResponse.json({
      message:
        'Hermes is taking a moment. Explore freely — click any project card for the full breakdown.',
    });
  }
}
