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
      "Welcome to Marco's Command Center. I'm Sentinel, the portfolio guide. I’ll show recruiters the strongest proof first: deployed AI accessibility work, full-stack realtime systems, developer tooling, and business intelligence software.",
    scrollToSection: 'projects',
    highlightId: 'projects',
  },
  {
    message:
      "The standout project is the AI Image to Audio Accessibility System: deployed on Vercel, backed by a real GitHub repo, and built around a practical accessibility use case. The other projects show realtime, tooling, and data-system range.",
    highlightId: 'projects',
  },
  {
    message:
      "The Systems Map shows how Marco thinks: projects are not isolated demos, they are connected systems with UI, APIs, data flow, realtime events, and deployment concerns.",
    scrollToSection: 'systems',
    highlightId: 'systems',
  },
  {
    message:
      "The skills panel backs up the projects: React, Next.js, TypeScript, Node APIs, Python, accessibility, realtime sockets, deployment, and AI API integration all show up in shipped work.",
    scrollToSection: 'skills',
    highlightId: 'skills',
  },
  {
    message:
      "That’s the tour. Ask a question like: what should a recruiter look at first, where is the live demo, what stack does Marco use, or which project proves accessibility and AI ability.",
    scrollToSection: 'founder',
    highlightId: 'founder',
  },
];

// System prompt injected into every live guide request.
// Instructs Sentinel to respond as a portfolio guide and output structured JSON.
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
      recruiterSignal: p.recruiterSignal,
      github: p.github,
      demo: p.demo,
      repoPath: p.repoPath,
    })),
    githubInventory: {
      publicRepoCount: 83,
      verifiedFeaturedRepos: projects.map((p) => p.repoPath),
      profile: 'https://github.com/MarcoFernstaedt',
    },
    contact: {
      github: 'https://github.com/MarcoFernstaedt',
      email: 'contact@marcofernstaedt.com',
    },
  };

  return `You are Sentinel, an AI portfolio guide embedded in Marco Fernstaedt's software engineering portfolio.
Your role is to guide recruiters and visitors through the portfolio in a knowledgeable, concise, and confident tone.
You answer only from Marco's verified portfolio context below. If asked about a missing repo, point to GitHub rather than inventing details.

Portfolio context:
${JSON.stringify(portfolio, null, 2)}

IMPORTANT: You MUST respond with valid JSON only — no markdown fences, no extra text. Use this exact schema:
{
  "message": "Your spoken response (1-3 sentences, conversational, direct)",
  "scrollToSection": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "highlightId": "projects" | "skills" | "systems" | "founder" | "writing" | null,
  "openProjectId": "ai-image-audio" | "realtime-messaging" | "code-interview" | "real-estate-tools" | null
}

Rules:
- scrollToSection: scroll to this section when relevant to your message (null otherwise)
- highlightId: same as scrollToSection in most cases (null otherwise)
- openProjectId: only set this when you are directly discussing a specific project and the user would benefit from seeing its detail modal
- Keep message under 70 words; recruiters skim
- Prefer the AI Image to Audio project when asked what to review first
- Mention exact GitHub/demo links only when relevant`;
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


function projectSummary(projectId: string): HermesResponse {
  const p = projects.find((project) => project.id === projectId)!;
  const links = [p.demo ? `Live demo: ${p.demo}` : null, p.github ? `GitHub: ${p.github}` : null]
    .filter(Boolean)
    .join(' | ');
  return {
    message: `${p.name}: ${p.function}. Recruiter signal: ${p.recruiterSignal ?? 'Strong portfolio proof.'} ${links}`.slice(0, 360),
    scrollToSection: 'projects',
    highlightId: 'projects',
    openProjectId: p.id,
  };
}

function answerFromPortfolio(message: string | null): HermesResponse {
  const q = (message ?? '').toLowerCase();

  if (!q.trim()) {
    return {
      message:
        'Ask me what project to review first, where the live demos are, what stack Marco uses, or which repo proves a specific skill. I answer from the portfolio project database.',
      scrollToSection: 'projects',
      highlightId: 'projects',
    };
  }

  if (q.includes('image') || q.includes('audio') || q.includes('accessib') || q.includes('vision') || q.includes('tts') || q.includes('vercel') || q.includes('demo')) {
    return projectSummary('ai-image-audio');
  }

  if (q.includes('socket') || q.includes('chat') || q.includes('message') || q.includes('realtime') || q.includes('websocket')) {
    return projectSummary('realtime-messaging');
  }

  if (q.includes('code') || q.includes('interview') || q.includes('monaco') || q.includes('sandbox') || q.includes('tool')) {
    return projectSummary('code-interview');
  }

  if (q.includes('real estate') || q.includes('deal') || q.includes('acquisition') || q.includes('data') || q.includes('dominion')) {
    return projectSummary('real-estate-tools');
  }

  if (q.includes('github') || q.includes('repo') || q.includes('source')) {
    return {
      message:
        'Marco has 83 public GitHub repos. The featured projects now link directly to their exact repos, with the AI Image to Audio source at github.com/MarcoFernstaedt/image_accessibility_tool and the full profile at github.com/MarcoFernstaedt.',
      scrollToSection: 'founder',
      highlightId: 'founder',
    };
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language')) {
    return {
      message:
        'Marco’s strongest recruiter stack is React, Next.js, TypeScript, Node APIs, Python, accessibility, Socket.IO/WebSockets, and AI API integration. The projects show those skills in deployed or repo-backed systems.',
      scrollToSection: 'skills',
      highlightId: 'skills',
    };
  }

  if (q.includes('recruit') || q.includes('hire') || q.includes('first') || q.includes('best') || q.includes('strongest')) {
    return {
      message:
        'Start with AI Image to Audio. It is deployed, accessibility-focused, and proves Marco can turn AI APIs into a useful product. Then review the realtime messaging and code interview projects for full-stack depth.',
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
      'The clearest story: Marco builds accessible, full-stack systems with real product value. The strongest proof is the deployed AI Image to Audio app, backed by realtime, tooling, and data-intelligence projects.',
    scrollToSection: 'projects',
    highlightId: 'projects',
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

  const hermesUrl = process.env.HERMES_API_URL; // e.g. http://localhost:8642
  const hermesKey = process.env.HERMES_API_KEY; // API_SERVER_KEY from ~/.hermes/.env

  // --- Offline / fallback path ---
  if (!hermesUrl) {
    if (event === 'tour_start' || event === 'tour_step') {
      const step = context?.tourStep ?? 0;
      return NextResponse.json(FALLBACK_TOUR[Math.min(step, FALLBACK_TOUR.length - 1)]);
    }
    return NextResponse.json(answerFromPortfolio(message));
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
        'Sentinel is taking a moment. Explore freely — click any project card for verified project links, demos, and recruiter signals.',
    });
  }
}
