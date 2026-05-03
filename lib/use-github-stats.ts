'use client';

import { useState, useEffect } from 'react';
import { GitHubStats } from '@/types';

export function useGitHubStats(repoPath: string | undefined): GitHubStats | null {
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    if (!repoPath) return;
    let cancelled = false;
    fetch(`/api/github?repo=${encodeURIComponent(repoPath)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [repoPath]);

  return stats;
}
