'use client';

import { useGitHubStats } from '@/lib/use-github-stats';

export default function GitHubStatsRow({ repoPath }: { repoPath?: string }) {
  const stats = useGitHubStats(repoPath);
  if (!repoPath || !stats) return null;

  const daysAgo = stats.updatedAt
    ? Math.floor((Date.now() - new Date(stats.updatedAt).getTime()) / 86_400_000)
    : null;

  return (
    <div
      className="flex items-center gap-3 text-xs font-mono flex-wrap pb-4 mb-1"
      style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border-color)' }}
    >
      {stats.language && (
        <span
          className="px-2 py-0.5 rounded"
          style={{
            backgroundColor: 'rgba(0,128,255,0.1)',
            border: '1px solid rgba(0,128,255,0.2)',
            color: 'var(--accent-cyan)',
          }}
        >
          {stats.language}
        </span>
      )}
      {daysAgo !== null && (
        <span>Updated {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}</span>
      )}
      {stats.stars > 0 && <span>★ {stats.stars}</span>}
      {stats.forks > 0 && <span>⑂ {stats.forks}</span>}
    </div>
  );
}
