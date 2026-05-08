import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GITHUB_USERNAME = 'MarcoFernstaedt';

export async function GET() {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'marcofernstaedt-portfolio',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8_000),
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`, {
        headers,
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8_000),
      }),
    ]);

    if (userRes.status === 403 || userRes.status === 429) {
      return NextResponse.json({ error: 'GitHub rate limited' }, { status: 429 });
    }
    if (!userRes.ok) {
      return NextResponse.json({ error: 'GitHub request failed' }, { status: 502 });
    }
    if (!eventsRes.ok) {
      return NextResponse.json({ error: 'GitHub request failed' }, { status: 502 });
    }

    const userData = await userRes.json();
    const publicRepos: number = Number.isFinite(userData.public_repos)
      ? (userData.public_repos as number)
      : 0;

    const events: unknown[] = await eventsRes.json();
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let commitsLast30Days = 0;

    if (Array.isArray(events)) {
      for (const event of events) {
        if (!event || typeof event !== 'object') continue;
        const e = event as Record<string, unknown>;
        if (e.type !== 'PushEvent') continue;
        if (typeof e.created_at !== 'string') continue;
        if (new Date(e.created_at).getTime() < cutoff) continue;

        const payload = e.payload as Record<string, unknown> | null;
        if (!payload) continue;
        const size = Number.isFinite(payload.distinct_size)
          ? (payload.distinct_size as number)
          : Array.isArray(payload.commits)
            ? payload.commits.length
            : 0;
        commitsLast30Days += size;
      }
    }

    return NextResponse.json({ commitsLast30Days, publicRepos });
  } catch {
    return NextResponse.json({ error: 'GitHub request unavailable' }, { status: 502 });
  }
}
