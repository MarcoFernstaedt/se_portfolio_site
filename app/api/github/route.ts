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
  repoName?: string;
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
  createdAt: string;
  size: number; // KB
  topics: string[];
  defaultBranch: string;
  commits: GitHubCommit[];
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  company: string | null;
  location: string | null;
  blog: string | null;
}

export interface GitHubPayload {
  profile: GitHubProfile;
  repos: GitHubRepo[];
}

export async function GET() {
  try {
    // Fetch profile + all repos in parallel
    const [profileRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/MarcoFernstaedt', { headers: GH_HEADERS }),
      fetch(
        'https://api.github.com/users/MarcoFernstaedt/repos?sort=pushed&per_page=30&type=public',
        { headers: GH_HEADERS }
      ),
    ]);

    if (!reposRes.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${reposRes.status}` },
        { status: reposRes.status }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawProfile: any = profileRes.ok ? await profileRes.json() : {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawRepos: any[] = await reposRes.json();

    const profile: GitHubProfile = {
      login: rawProfile.login ?? 'MarcoFernstaedt',
      name: rawProfile.name ?? null,
      bio: rawProfile.bio ?? null,
      avatar: rawProfile.avatar_url ?? '',
      profileUrl: rawProfile.html_url ?? 'https://github.com/MarcoFernstaedt',
      followers: rawProfile.followers ?? 0,
      following: rawProfile.following ?? 0,
      publicRepos: rawProfile.public_repos ?? rawRepos.length,
      createdAt: rawProfile.created_at ?? '',
      company: rawProfile.company ?? null,
      location: rawProfile.location ?? null,
      blog: rawProfile.blog ?? null,
    };

    // Fetch commits for top 10 repos in parallel
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
                  repoName: repo.name as string,
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
          createdAt: repo.created_at as string,
          size: (repo.size as number) ?? 0,
          topics: (repo.topics as string[]) ?? [],
          defaultBranch: (repo.default_branch as string) ?? 'main',
          commits,
        };
      })
    );

    const payload: GitHubPayload = { profile, repos };
    return NextResponse.json(payload);
  } catch (err) {
    console.error('GitHub API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
