import { NextRequest, NextResponse } from 'next/server';
import { featuredProjects } from '@/lib/data';

export const runtime = 'nodejs';

const ALLOWED_REPOS = new Set(
  featuredProjects
    .map((project) => project.repoPath)
    .filter((repoPath): repoPath is string => Boolean(repoPath))
);

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get('repo');

  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return NextResponse.json({ error: 'Invalid repository' }, { status: 400 });
  }

  if (!ALLOWED_REPOS.has(repo)) {
    return NextResponse.json({ error: 'Repository not allowed' }, { status: 403 });
  }

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8_000),
    });

    if (res.status === 404) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    if (res.status === 403 || res.status === 429) {
      return NextResponse.json({ error: 'GitHub rate limited' }, { status: 429 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub request failed' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({
      language: typeof data.language === 'string' ? data.language : null,
      stars: Number.isFinite(data.stargazers_count) ? data.stargazers_count : 0,
      forks: Number.isFinite(data.forks_count) ? data.forks_count : 0,
      updatedAt: typeof data.updated_at === 'string' ? data.updated_at : null,
    });
  } catch {
    return NextResponse.json({ error: 'GitHub request unavailable' }, { status: 502 });
  }
}
