'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GitHubPayload, GitHubRepo, GitHubCommit } from '@/app/api/github/route';

// ─── language colour map ──────────────────────────────────────────────────────
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
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function yearsSince(iso: string): string {
  if (!iso) return '—';
  const years = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (years < 1) return `${Math.floor(years * 12)}mo`;
  return `${years.toFixed(1)}yr`;
}

function fmtSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

// ─── derived stats ────────────────────────────────────────────────────────────
function buildLangDistribution(repos: GitHubRepo[]) {
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, count]) => ({ lang, count, pct: Math.round((count / total) * 100) }));
}

function buildActivityFeed(repos: GitHubRepo[]): (GitHubCommit & { repoName: string })[] {
  const all = repos.flatMap((r) =>
    r.commits.map((c) => ({ ...c, repoName: r.name }))
  );
  return all
    .filter((c) => c.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12);
}

// ─── skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-4">
      {/* stat bar skeleton */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg p-4 animate-pulse"
        style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-2 w-1/2 rounded" style={{ backgroundColor: 'var(--border-color)' }} />
            <div className="h-5 w-3/4 rounded" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>
        ))}
      </div>
      {/* card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-4 animate-pulse"
            style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', height: 180 }}
          >
            <div className="h-3 w-3/4 rounded mb-3" style={{ backgroundColor: 'var(--border-color)' }} />
            <div className="h-2 w-full rounded mb-2" style={{ backgroundColor: 'var(--border-color)' }} />
            <div className="h-2 w-2/3 rounded" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── stat chip ────────────────────────────────────────────────────────────────
function StatChip({
  label,
  value,
  color = 'var(--accent-cyan)',
  sub,
}: {
  label: string;
  value: string | number;
  color?: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>
        {label}
      </span>
      <span className="text-xl font-bold font-mono" style={{ color }}>
        {value}
      </span>
      {sub && (
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── language distribution bar ────────────────────────────────────────────────
function LangBar({ repos }: { repos: GitHubRepo[] }) {
  const dist = buildLangDistribution(repos);
  if (dist.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>
        Language Distribution
      </p>
      {/* stacked bar */}
      <div className="flex h-2 rounded overflow-hidden gap-px">
        {dist.map(({ lang, pct }) => (
          <div
            key={lang}
            style={{ width: `${pct}%`, backgroundColor: LANG_COLORS[lang] ?? '#94a3b8' }}
            title={`${lang} ${pct}%`}
          />
        ))}
      </div>
      {/* legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {dist.map(({ lang, pct }) => (
          <span key={lang} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: LANG_COLORS[lang] ?? '#94a3b8' }}
            />
            {lang} <span style={{ color: 'var(--text-dim)' }}>{pct}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── activity feed ────────────────────────────────────────────────────────────
function ActivityFeed({ repos }: { repos: GitHubRepo[] }) {
  const feed = buildActivityFeed(repos);
  if (feed.length === 0) return null;
  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
    >
      <p className="section-heading mb-3">⟳ RECENT ACTIVITY</p>
      <ul className="space-y-2">
        {feed.map((c, i) => (
          <li key={`${c.sha}-${i}`} className="flex items-start gap-2 text-xs font-mono">
            <span style={{ color: 'var(--accent-green)' }}>›</span>
            <span style={{ color: 'var(--accent-amber)', minWidth: '3.5rem' }} className="shrink-0">
              {c.sha}
            </span>
            <span
              className="text-xs shrink-0 rounded px-1"
              style={{
                backgroundColor: 'rgba(0,128,255,0.08)',
                color: 'var(--accent-blue)',
                border: '1px solid rgba(0,128,255,0.15)',
                maxWidth: '6rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={c.repoName}
            >
              {c.repoName}
            </span>
            <span
              className="truncate flex-1"
              style={{ color: 'var(--text-secondary)' }}
              title={c.message}
            >
              {c.message}
            </span>
            <span className="shrink-0" style={{ color: 'var(--text-dim)' }}>
              {timeAgo(c.date)}
            </span>
          </li>
        ))}
      </ul>
      <p
        className="mt-3 text-xs font-mono flex items-center gap-2"
        style={{ color: 'var(--text-dim)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}
        aria-hidden="true"
      >
        <span style={{ color: 'var(--accent-green)' }}>$</span>
        git log --all --oneline --author=&quot;MarcoFernstaedt&quot;
        <span className="cursor-blink" style={{ color: 'var(--accent-cyan)' }}>█</span>
      </p>
    </div>
  );
}

// ─── repo card ────────────────────────────────────────────────────────────────
function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#94a3b8') : null;
  const ageLabel = yearsSince(repo.createdAt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-lg flex flex-col"
      style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
      whileHover={{ borderColor: 'rgba(0,212,255,0.4)', y: -2 }}
    >
      {/* header */}
      <div className="p-4 pb-3 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold leading-tight hover:underline truncate"
            style={{ color: 'var(--accent-cyan)' }}
          >
            {repo.name}
          </a>
          <span className="flex items-center gap-1.5 shrink-0 text-xs" style={{ color: 'var(--text-dim)' }}>
            {repo.stars > 0 && (
              <span style={{ color: 'var(--accent-amber)' }}>★ {repo.stars}</span>
            )}
            {repo.forks > 0 && <span>⑂ {repo.forks}</span>}
          </span>
        </div>

        {repo.description && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {repo.description}
          </p>
        )}

        {/* topics */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'rgba(0,128,255,0.08)',
                  border: '1px solid rgba(0,128,255,0.15)',
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
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
              <span style={{ color: 'var(--text-secondary)' }}>{repo.language}</span>
            </span>
          )}
          {repo.openIssues > 0 && (
            <span style={{ color: 'var(--accent-amber)' }}>◉ {repo.openIssues} issues</span>
          )}
          <span title="Repo age">⧗ {ageLabel}</span>
          {repo.size > 0 && <span>{fmtSize(repo.size)}</span>}
          <span className="ml-auto">{timeAgo(repo.pushedAt)}</span>
        </div>
      </div>

      {/* git log */}
      {repo.commits.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)' }} className="px-4 pb-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full text-left py-2 text-xs flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-green)' }}
            aria-expanded={expanded}
          >
            <span aria-hidden="true">$</span>
            <span>git log --oneline</span>
            <span className="ml-auto">{expanded ? '▲' : '▼'}</span>
          </button>

          {/* always show latest commit */}
          {!expanded && repo.commits[0] && (
            <p className="text-xs font-mono truncate" style={{ color: 'var(--text-dim)' }} title={repo.commits[0].message}>
              <span style={{ color: 'var(--accent-amber)' }}>{repo.commits[0].sha}</span>{' '}
              {repo.commits[0].message}
            </p>
          )}

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-1"
              >
                {repo.commits.map((c) => (
                  <li key={c.sha} className="flex items-start gap-2 text-xs font-mono">
                    <span style={{ color: 'var(--accent-amber)', minWidth: '3.5rem' }} className="shrink-0">
                      {c.sha}
                    </span>
                    <span className="truncate" style={{ color: 'var(--text-secondary)' }} title={c.message}>
                      {c.message}
                    </span>
                    <span className="shrink-0" style={{ color: 'var(--text-dim)' }}>
                      {timeAgo(c.date)}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* footer */}
      <div
        className="px-4 py-2 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <span style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--accent-blue)' }}>{repo.defaultBranch}</span>
        </span>
        <div className="flex items-center gap-3">
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-green)' }}
              aria-label={`Live demo for ${repo.name}`}
            >
              ↗ DEMO
            </a>
          )}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-cyan)' }}
            aria-label={`Open ${repo.name} on GitHub`}
          >
            › REPO
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// ─── main panel ───────────────────────────────────────────────────────────────
export default function GitHubPanel() {
  const [data, setData] = useState<GitHubPayload | null>(null);
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
      .then((payload: GitHubPayload) => {
        setData(payload);
        setSyncedAt(new Date());
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const repos = data?.repos ?? [];
  const profile = data?.profile;

  const filtered = repos.filter(
    (r) =>
      filter === '' ||
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      (r.description ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (r.language ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      r.topics.some((t) => t.toLowerCase().includes(filter.toLowerCase()))
  );

  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);
  const topLang = buildLangDistribution(repos)[0]?.lang ?? '—';

  return (
    <section
      className="rounded-xl p-4 sm:p-5 space-y-5"
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
      aria-labelledby="github-panel-heading"
    >
      {/* ── panel title ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" style={{ color: 'var(--accent-cyan)' }}>◈</span>
          <h2 id="github-panel-heading" className="section-heading">
            GITHUB FEED
          </h2>
          {!loading && (
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.15)',
                color: 'var(--accent-cyan)',
              }}
            >
              {filtered.length} / {repos.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-dim)' }}>
          <span className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ backgroundColor: error ? '#ff4444' : '#00ff88' }}
              aria-hidden="true"
            />
            {syncedAt ? `synced ${timeAgo(syncedAt.toISOString())}` : 'syncing…'}
          </span>
          {profile && (
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-cyan)' }}
            >
              @{profile.login}
            </a>
          )}
        </div>
      </div>

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
            GitHub API rate limit may be exceeded — try again shortly
          </span>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* ── operator overview stats ── */}
          <div
            className="rounded-lg p-4 space-y-4"
            style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)' }}
          >
            <p className="section-heading">◆ OPERATOR OVERVIEW</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatChip
                label="Public Repos"
                value={profile?.publicRepos ?? repos.length}
                color="var(--accent-cyan)"
                sub="repositories"
              />
              <StatChip
                label="Total Stars"
                value={totalStars}
                color="var(--accent-amber)"
                sub="across all repos"
              />
              <StatChip
                label="Total Forks"
                value={totalForks}
                color="var(--accent-green)"
                sub="by community"
              />
              <StatChip
                label="Followers"
                value={profile?.followers ?? '—'}
                color="var(--accent-blue)"
                sub={`following ${profile?.following ?? '—'}`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
              <StatChip
                label="Top Language"
                value={topLang}
                color={LANG_COLORS[topLang] ?? 'var(--text-primary)'}
              />
              <StatChip
                label="Member Since"
                value={profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '—'}
                color="var(--text-secondary)"
                sub={profile?.createdAt ? `${yearsSince(profile.createdAt)} tenure` : ''}
              />
              <StatChip
                label="Last Push"
                value={repos[0] ? timeAgo(repos[0].pushedAt) : '—'}
                color="var(--accent-green)"
                sub={repos[0]?.name}
              />
              <StatChip
                label="Recent Commits"
                value={repos.reduce((s, r) => s + r.commits.length, 0)}
                color="var(--text-secondary)"
                sub="across top 10 repos"
              />
            </div>

            {/* language distribution bar */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <LangBar repos={repos} />
            </div>
          </div>

          {/* ── activity feed ── */}
          <ActivityFeed repos={repos} />

          {/* ── filter ── */}
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
              style={{ color: 'var(--accent-green)' }}
              aria-hidden="true"
            >
              $
            </span>
            <input
              type="search"
              placeholder="filter repos by name, language, topic…"
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

          {/* ── repo grid ── */}
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-xs" style={{ color: 'var(--text-dim)' }}>
              no repositories match &ldquo;{filter}&rdquo;
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((repo, i) => (
                <RepoCard key={repo.id} repo={repo} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── terminal footer ── */}
      <div
        className="pt-3 text-xs font-mono flex items-center gap-2"
        style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-dim)' }}
        aria-hidden="true"
      >
        <span style={{ color: 'var(--accent-green)' }}>$</span>
        <span>gh repo list MarcoFernstaedt --public --sort pushed</span>
        <span className="cursor-blink" style={{ color: 'var(--accent-cyan)' }}>█</span>
      </div>
    </section>
  );
}
