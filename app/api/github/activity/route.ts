import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GITHUB_USERNAME = 'MarcoFernstaedt';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const ZERO_SHA = /^0+$/;

type GitHubEvent = {
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: {
    before?: string;
    head?: string;
    commits?: Array<{ sha?: string }>;
  };
};

type GitHubCompareCommit = {
  sha?: string;
  commit?: { author?: { date?: string } };
};

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'marcofernstaedt-portfolio',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchGitHubJson(url: string, headers: HeadersInit) {
  const response = await fetch(url, {
    headers,
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8_000),
  } as RequestInit & { next: { revalidate: number } });

  if (response.status === 403 || response.status === 429) {
    throw new Error('GitHub rate limited');
  }
  if (!response.ok) {
    throw new Error('GitHub request failed');
  }

  return response.json();
}

function eventFallbackCommitShas(event: GitHubEvent): string[] {
  return Array.isArray(event.payload?.commits)
    ? event.payload.commits.map((commit) => commit.sha).filter((sha): sha is string => Boolean(sha))
    : [];
}

async function addComparedPushCommits(
  event: GitHubEvent,
  headers: HeadersInit,
  cutoff: number,
  commitShas: Set<string>,
) {
  const repoName = event.repo?.name;
  const before = event.payload?.before;
  const head = event.payload?.head;

  if (!repoName || !before || !head || ZERO_SHA.test(before)) {
    for (const sha of eventFallbackCommitShas(event)) commitShas.add(sha);
    return;
  }

  try {
    const compareData = await fetchGitHubJson(
      `https://api.github.com/repos/${repoName}/compare/${before}...${head}`,
      headers,
    );
    const commits: GitHubCompareCommit[] = Array.isArray(compareData.commits) ? compareData.commits : [];

    for (const commit of commits) {
      const committedAt = commit.commit?.author?.date;
      if (!commit.sha || (committedAt && new Date(committedAt).getTime() < cutoff)) continue;
      commitShas.add(commit.sha);
    }
  } catch {
    for (const sha of eventFallbackCommitShas(event)) commitShas.add(sha);
  }
}

export async function GET() {
  const headers = githubHeaders();

  try {
    const [userData, events] = await Promise.all([
      fetchGitHubJson(`https://api.github.com/users/${GITHUB_USERNAME}`, headers),
      fetchGitHubJson(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`, headers),
    ]);

    const publicRepos = Number.isFinite(userData.public_repos) ? Number(userData.public_repos) : 0;
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const commitShas = new Set<string>();

    if (Array.isArray(events)) {
      const recentPushes = (events as GitHubEvent[]).filter((event) => {
        if (event.type !== 'PushEvent') return false;
        if (typeof event.created_at !== 'string') return false;
        return new Date(event.created_at).getTime() >= cutoff;
      });

      await Promise.all(
        recentPushes.map((event) => addComparedPushCommits(event, headers, cutoff, commitShas)),
      );
    }

    return NextResponse.json({ commitsLast30Days: commitShas.size, publicRepos });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GitHub request unavailable';
    const status = message === 'GitHub rate limited' ? 429 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
