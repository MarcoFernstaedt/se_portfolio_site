import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { normalizeBlogPostRecord } from '@/lib/blog-schema';

export const runtime = 'nodejs';

const REPO = 'MarcoFernstaedt/se_portfolio_site';
const POSTS_PATH = 'content/blog/posts';
const TARGET_BRANCH = 'main';

function safeEquals(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
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

  const authorization = request.headers.get('authorization') ?? '';
  const bearerToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const bodyKey = typeof body.key === 'string' ? body.key : '';
  const candidateKey = bearerToken || bodyKey;

  if (!candidateKey || !safeEquals(candidateKey, authorKey)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const postInput = body.post && typeof body.post === 'object' ? body.post : null;
  if (!postInput) {
    return NextResponse.json({ error: 'Missing post object.' }, { status: 400 });
  }

  let postRecord;
  try {
    postRecord = normalizeBlogPostRecord(postInput, 'draft');
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid post object.' },
      { status: 400 }
    );
  }

  const slug = postRecord.slug;
  const filePath = `${POSTS_PATH}/${slug}.json`;
  const apiBase = `https://api.github.com/repos/${REPO}/contents/${filePath}`;

  // Check for existing file
  const checkRes = await fetch(`${apiBase}?ref=${TARGET_BRANCH}`, {
    headers: githubHeaders(githubToken),
    signal: AbortSignal.timeout(8_000),
  });

  if (checkRes.ok) {
    return NextResponse.json({ error: `A post with slug "${slug}" already exists.` }, { status: 409 });
  }
  if (checkRes.status !== 404) {
    return NextResponse.json({ error: 'GitHub API error while checking for existing post.' }, { status: 502 });
  }

  const content = Buffer.from(JSON.stringify(postRecord, null, 2) + '\n').toString('base64');

  const commitRes = await fetch(apiBase, {
    method: 'PUT',
    headers: githubHeaders(githubToken),
    body: JSON.stringify({
      message: `blog: add draft post ${slug}`,
      content,
      branch: TARGET_BRANCH,
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
