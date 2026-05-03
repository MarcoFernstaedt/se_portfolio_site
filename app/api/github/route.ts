import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get('repo');

  if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return NextResponse.json(null, { status: 400 });
  }

  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 300 },
    });

    if (!res.ok) return NextResponse.json(null);

    const data = await res.json();
    return NextResponse.json({
      language: data.language ?? null,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      updatedAt: data.updated_at,
    });
  } catch {
    return NextResponse.json(null);
  }
}
