import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const REPO = 'MarcoFernstaedt/se_portfolio_site';
const POSTS_PATH = 'content/blog/posts';

const REQUIRED_FIELDS = ['slug', 'title', 'excerpt', 'publishAt', 'readTime', 'category', 'sections'] as const;

function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
}

function isValidSections(sections: unknown): boolean {
  if (!Array.isArray(sections) || sections.length === 0) return false;
  return sections.every(
    (s) =>
      s &&
      typeof s === 'object' &&
      typeof (s as Record<string, unknown>).heading === 'string' &&
      ((s as Record<string, unknown>).content !== undefined ||
        (s as Record<string, unknown>).bullets !== undefined)
  );
}

function githubHeaders(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'User-Agent': 'marcofernstaedt-portfolio',
  };
}

export async function POST(request: NextRequest) {
  const githubToken = process.env.GITHUB_TOKEN;
  const authorKey = process.env.BLOG_AUTHOR_KEY;

  if (!authorKey || !githubToken) {
    return NextResponse.json({ error: 'Blog API not configured.' }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Auth
  if (body.key !== authorKey) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const post = body.post && typeof body.post === 'object' ? body.post as Record<string, unknown> : null;
  if (!post) {
    return NextResponse.json({ error: 'Missing post object.' }, { status: 400 });
  }

  // Required field validation
  for (const field of REQUIRED_FIELDS) {
    if (post[field] === undefined || post[field] === null || post[field] === '') {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  if (!isValidSlug(post.slug)) {
    return NextResponse.json(
      { error: 'slug must be lowercase letters, numbers, and hyphens only.' },
      { status: 400 }
    );
  }

  if (!isValidSections(post.sections)) {
    return NextResponse.json(
      { error: 'sections must be a non-empty array where each item has a heading and content or bullets.' },
      { status: 400 }
    );
  }

  const slug = post.slug as string;
  const filePath = `${POSTS_PATH}/${slug}.json`;
  const apiBase = `https://api.github.com/repos/${REPO}/contents/${filePath}`;

  // Check for existing file
  const checkRes = await fetch(apiBase, {
    headers: githubHeaders(githubToken),
    signal: AbortSignal.timeout(8_000),
  });

  if (checkRes.ok) {
    return NextResponse.json({ error: `A post with slug "${slug}" already exists.` }, { status: 409 });
  }
  if (checkRes.status !== 404) {
    return NextResponse.json({ error: 'GitHub API error while checking for existing post.' }, { status: 502 });
  }

  // Build the post record — status always forced to draft
  const postRecord = {
    slug,
    title: String(post.title).slice(0, 200),
    excerpt: String(post.excerpt).slice(0, 300),
    publishAt: String(post.publishAt),
    readTime: String(post.readTime || '5 min read'),
    category: String(post.category).slice(0, 80),
    featured: post.featured === true,
    status: 'draft',
    engineeringSignal: Array.isArray(post.engineeringSignal)
      ? (post.engineeringSignal as unknown[]).slice(0, 5).map(String)
      : [],
    summary: typeof post.summary === 'string' ? post.summary.slice(0, 400) : '',
    sections: post.sections,
  };

  const content = Buffer.from(JSON.stringify(postRecord, null, 2) + '\n').toString('base64');

  const commitRes = await fetch(apiBase, {
    method: 'PUT',
    headers: githubHeaders(githubToken),
    body: JSON.stringify({
      message: `blog: add draft post ${slug}`,
      content,
    }),
    signal: AbortSignal.timeout(12_000),
  });

  if (!commitRes.ok) {
    const detail = await commitRes.text().catch(() => '');
    return NextResponse.json(
      { error: 'Failed to commit post to GitHub.', detail: detail.slice(0, 200) },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      slug,
      message: `Draft created at content/blog/posts/${slug}.json. To publish: npm run blog:approve -- ${slug}, then commit and push.`,
    },
    { status: 201 }
  );
}
