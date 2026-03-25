import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';

export const metadata = {
  title: 'Engineering Notes | Marco Fernstaedt',
  description:
    'Practical engineering notes on projects built, lessons learned, system design decisions, and accessible software work.',
};

export default function WritingPage() {
  return (
    <main className="min-h-screen grid-bg scanlines px-4 sm:px-6 py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-xs" style={{ color: 'var(--accent-cyan)' }}>
            ← Back to command center
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-wide" style={{ color: 'var(--accent-cyan)' }}>
            Engineering Notes
          </h1>
          <p className="mt-3 text-sm sm:text-base max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Short, high-signal writeups about what Marco built, how he thinks through engineering problems,
            and what each project says about the kind of teammate he is.
          </p>
        </div>

        <div className="space-y-4">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-lg p-5"
              style={{
                backgroundColor: 'var(--bg-panel)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                <Link href={`/writing/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {post.summary}
              </p>

              <div className="mb-4">
                <div className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent-green)' }}>
                  recruiter signal
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {post.recruiterSignal.map((signal) => (
                    <li key={signal}>• {signal}</li>
                  ))}
                </ul>
              </div>

              <Link href={`/writing/${post.slug}`} className="text-sm" style={{ color: 'var(--accent-cyan)' }}>
                Open note →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
