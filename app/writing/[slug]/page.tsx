import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPublishDate, getBlogPost, getPublicBlogPosts } from '@/lib/blog-data';
import { safeJsonLd } from '@/lib/blog-schema';

const SITE_URL = 'https://marcofernstaedt.com';

export function generateStaticParams() {
  return getPublicBlogPosts().map((post) => ({ slug: post.slug }));
}

type BlogPostPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Post not found | Marco Fernstaedt' };
  }

  const postUrl = `${SITE_URL}/writing/${post.slug}`;

  return {
    title: `${post.title} | Marco Fernstaedt`,
    description: post.excerpt,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: postUrl,
      siteName: 'Marco Fernstaedt Command Center',
      publishedTime: post.publishAt,
      authors: ['Marco Fernstaedt'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Marco Fernstaedt',
      url: SITE_URL,
    },
    datePublished: post.publishAt,
    url: `${SITE_URL}/writing/${post.slug}`,
    publisher: {
      '@type': 'Person',
      name: 'Marco Fernstaedt',
      url: SITE_URL,
    },
  };

  return (
    <main className="min-h-screen grid-bg scanlines px-4 sm:px-6 py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      <article className="max-w-3xl mx-auto">
        <Link href="/writing" className="text-xs" style={{ color: 'var(--accent-cyan)' }}>
          ← Back to engineering notes
        </Link>

        <header className="mt-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            <span>{formatPublishDate(post.publishAt)}</span>
            <span>•</span>
            <span>{post.category}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </h1>

          <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            {post.summary}
          </p>

          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.2)',
            }}
          >
            <div className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent-green)' }}>
              engineering takeaway
            </div>
            <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {post.engineeringSignal.map((signal) => (
                <li key={signal}>• {signal}</li>
              ))}
            </ul>
          </div>
        </header>

        <div className="space-y-8">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--accent-cyan)' }}>
                {section.heading}
              </h2>

              {section.content?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm sm:text-base leading-8 mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets ? (
                <ul className="space-y-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
