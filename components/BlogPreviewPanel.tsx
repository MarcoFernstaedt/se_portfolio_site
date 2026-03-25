import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedPosts } from '@/lib/blog-data';

export default function BlogPreviewPanel() {
  const posts = getFeaturedPosts();

  return (
    <section aria-labelledby="blog-heading" id="writing">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h2 id="blog-heading" className="section-heading mb-1">
            ◈ Engineering Notes
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Recruiter-friendly posts on what Marco built, learned, and shipped.
          </p>
        </div>
        <Link
          href="/writing"
          className="text-xs px-3 py-2 rounded transition-all inline-flex items-center gap-2"
          style={{
            border: '1px solid rgba(0,212,255,0.25)',
            color: 'var(--accent-cyan)',
            backgroundColor: 'rgba(0,212,255,0.05)',
          }}
        >
          View all notes <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-lg p-4 h-full"
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-3 text-xs" style={{ color: 'var(--text-dim)' }}>
              <span>{post.category}</span>
              <span>{post.readTime}</span>
            </div>

            <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {post.title}
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {post.excerpt}
            </p>

            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent-green)' }}>
                recruiter signal
              </div>
              <ul className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {post.recruiterSignal.slice(0, 2).map((signal) => (
                  <li key={signal}>• {signal}</li>
                ))}
              </ul>
            </div>

            <Link
              href={`/writing/${post.slug}`}
              className="inline-flex items-center gap-2 text-xs"
              style={{ color: 'var(--accent-cyan)' }}
            >
              Read note <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
