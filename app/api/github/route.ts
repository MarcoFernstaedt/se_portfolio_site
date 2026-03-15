import { NextResponse } from 'next/server';

export const revalidate = 600; // Cache for 10 minutes

const GH_HEADERS = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'marco-portfolio-site',
};

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string;
  updatedAt: string;
  topics: string[];
  defaultBranch: string;
  commits: GitHubCommit[];
}

export async function GET() {
  try {
    const reposRes = await fetch(
      'https://api.github.com/users/MarcoFernstaedt/repos?sort=pushed&per_page=12&type=public',
      { headers: GH_HEADERS }
    );

    if (!reposRes.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${reposRes.status}` },
        { status: reposRes.status }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawRepos: any[] = await reposRes.json();

    // Fetch commits for each repo in parallel (top 10 only to stay within rate limits)
    const repos: GitHubRepo[] = await Promise.all(
      rawRepos.slice(0, 10).map(async (repo) => {
        let commits: GitHubCommit[] = [];
        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/MarcoFernstaedt/${repo.name}/commits?per_page=5`,
            { headers: GH_HEADERS }
          );
          if (commitsRes.ok) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw: any[] = await commitsRes.json();
            commits = Array.isArray(raw)
              ? raw.map((c) => ({
                  sha: (c.sha as string).slice(0, 7),
                  message: (c.commit?.message as string)?.split('\n')[0] ?? '',
                  author: (c.commit?.author?.name as string) ?? '',
                  date: (c.commit?.author?.date as string) ?? '',
                }))
              : [];
          }
        } catch {
          // commits stay empty on error
        }

        return {
          id: repo.id as number,
          name: repo.name as string,
          description: (repo.description as string | null) ?? null,
          url: repo.html_url as string,
          homepage: (repo.homepage as string | null) ?? null,
          language: (repo.language as string | null) ?? null,
          stars: (repo.stargazers_count as number) ?? 0,
          forks: (repo.forks_count as number) ?? 0,
          openIssues: (repo.open_issues_count as number) ?? 0,
          pushedAt: repo.pushed_at as string,
          updatedAt: repo.updated_at as string,
          topics: (repo.topics as string[]) ?? [],
          defaultBranch: (repo.default_branch as string) ?? 'main',
          commits,
        };
      })
    );

    return NextResponse.json(repos);
  } catch (err) {
    console.error('GitHub API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
