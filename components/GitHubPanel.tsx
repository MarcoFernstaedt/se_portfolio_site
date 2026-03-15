'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GitHubRepo } from '@/app/api/github/route';

// ─── language → color map (GitHub-style) ─────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dockerfile: '#384d54',
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// ─── sub-components ───────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg p-4 animate-pulse"
          style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', height: 200 }}
        >
          <div className="h-3 w-3/4 rounded mb-3" style={{ backgroundColor: 'var(--border-color)' }} />
          <div className="h-2 w-full rounded mb-2" style={{ backgroundColor: 'var(--border-color)' }} />
          <div className="h-2 w-2/3 rounded mb-4" style={{ backgroundColor: 'var(--border-color)' }} />
          <div className="h-2 w-1/2 rounded" style={{ backgroundColor: 'var(--border-color)' }} />
        </div>
      ))}
    </div>
  );
}

function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#94a3b8') : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
      whileHover={{ borderColor: 'rgba(0,212,255,0.4)', y: -2 }}
    >
      {/* ── header ── */}
      <div className="p-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold leading-tight hover:underline truncate"
            style={{ color: 'var(--accent-cyan)' }}
            aria-label={`Open ${repo.name} on GitHub`}
          >
            {repo.name}
          </a>
          {/* stars */}
          <span
            className="text-xs flex items-center gap-1 shrink-0"
            style={{ color: 'var(--accent-amber)' }}
            aria-label={`${repo.stars} stars`}
          >
            ★ {repo.stars}
          </span>
        </div>

        {/* description */}
        {repo.description && (
          <p
            className="text-xs leading-relaxed mb-3 line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {repo.description}
          </p>
        )}

        {/* topics */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {repo.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'rgba(0,128,255,0.08)',
                  border: '1px solid rgba(0,128,255,0.18)',
                  color: 'var(--accent-blue)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--text-dim)' }}>
          {langColor && (
            <span className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: langColor }}
                aria-hidden="true"
              />
              <span style={{ color: 'var(--text-secondary)' }}>{repo.language}</span>
            </span>
          )}
          {repo.forks > 0 && <span>⑂ {repo.forks}</span>}
          {repo.openIssues > 0 && (
            <span style={{ color: 'var(--accent-amber)' }}>◉ {repo.openIssues}</span>
          )}
          <span className="ml-auto">{timeAgo(repo.pushedAt)}</span>
        </div>
      </div>

      {/* ── git log section ── */}
      {repo.commits.length > 0 && (
        <div
          className="px-4 pb-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full text-left py-2 text-xs flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-green)' }}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse commit log' : 'Expand commit log'}
          >
            <span aria-hidden="true">$</span>
            <span>git log --oneline</span>
            <span className="ml-auto" aria-hidden="true">{expanded ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="space-y-1 pb-1">
                  {repo.commits.map((c) => (
                    <li key={c.sha} className="flex items-start gap-2 text-xs">
                      <span
                        className="font-mono shrink-0 mt-px"
                        style={{ color: 'var(--accent-amber)', minWidth: '3.5rem' }}
                      >
                        {c.sha}
                      </span>
                      <span
                        className="truncate"
                        style={{ color: 'var(--text-secondary)' }}
                        title={c.message}
                      >
                        {c.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Always show most recent commit preview when collapsed */}
          {!expanded && repo.commits[0] && (
            <p
              className="text-xs font-mono truncate"
              style={{ color: 'var(--text-dim)' }}
              title={repo.commits[0].message}
            >
              <span style={{ color: 'var(--accent-amber)' }}>{repo.commits[0].sha}</span>
              {' '}
              {repo.commits[0].message}
            </p>
          )}
        </div>
      )}

      {/* ── footer link ── */}
      <div
        className="px-4 py-2 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <span style={{ color: 'var(--text-dim)' }}>
          branch: <span style={{ color: 'var(--accent-blue)' }}>{repo.defaultBranch}</span>
        </span>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: 'var(--accent-cyan)' }}
          aria-label={`Open ${repo.name} repository on GitHub`}
        >
          › OPEN REPO
        </a>
      </div>
    </motion.article>
  );
}

// ─── main panel ──────────────────────────────────────────────────────────────
export default function GitHubPanel() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [syncedAt, setSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/github')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: GitHubRepo[]) => {
        setRepos(data);
        setSyncedAt(new Date());
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = repos.filter((r) =>
    filter === '' ||
    r.name.toLowerCase().includes(filter.toLowerCase()) ||
    (r.description ?? '').toLowerCase().includes(filter.toLowerCase()) ||
    (r.language ?? '').toLowerCase().includes(filter.toLowerCase()) ||
    r.topics.some((t) => t.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <section
      className="rounded-xl p-4 sm:p-5"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
      aria-labelledby="github-panel-heading"
    >
      {/* ── panel header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" style={{ color: 'var(--accent-cyan)' }}>◈</span>
          <h2
            id="github-panel-heading"
            className="section-heading"
          >
            GITHUB FEED
          </h2>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.15)',
              color: 'var(--accent-cyan)',
            }}
          >
            {loading ? '…' : filtered.length} / {repos.length}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-dim)' }}>
          {/* live indicator */}
          <span className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ backgroundColor: error ? '#ff4444' : '#00ff88' }}
              aria-hidden="true"
            />
            {syncedAt ? `synced ${timeAgo(syncedAt.toISOString())}` : 'syncing…'}
          </span>
          <span>USER: MarcoFernstaedt</span>
        </div>
      </div>

      {/* ── search / filter ── */}
      <div className="mb-4 relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
          style={{ color: 'var(--accent-green)' }}
          aria-hidden="true"
        >
          $
        </span>
        <input
          type="search"
          placeholder="filter repos, languages, topics…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded pl-7 pr-3 py-2 text-xs font-mono outline-none focus:ring-1"
          style={{
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            caretColor: 'var(--accent-cyan)',
          }}
          aria-label="Filter repositories"
        />
      </div>

      {/* ── content ── */}
      {loading && <Skeleton />}

      {error && (
        <div
          className="rounded-lg p-4 text-sm font-mono text-center"
          style={{
            backgroundColor: 'rgba(255,68,68,0.05)',
            border: '1px solid rgba(255,68,68,0.2)',
            color: '#ff4444',
          }}
          role="alert"
        >
          ✗ FETCH FAILED: {error}
          <br />
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
            GitHub API rate limit may be exceeded — try again in a minute
          </span>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-center py-8 text-xs" style={{ color: 'var(--text-dim)' }}>
          no repositories match &ldquo;{filter}&rdquo;
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} index={i} />
          ))}
        </div>
      )}

      {/* ── footer terminal prompt ── */}
      <div
        className="mt-4 pt-3 text-xs font-mono flex items-center gap-2"
        style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-dim)' }}
        aria-hidden="true"
      >
        <span style={{ color: 'var(--accent-green)' }}>$</span>
        <span>gh repo list MarcoFernstaedt --public</span>
        <span className="cursor-blink" style={{ color: 'var(--accent-cyan)' }}>█</span>
      </div>
    </section>
  );
}
