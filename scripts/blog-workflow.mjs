#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'blog', 'posts');

function readPosts() {
  return fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => {
      const fullPath = path.join(POSTS_DIRECTORY, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      return {
        file,
        fullPath,
        post: JSON.parse(raw),
      };
    });
}

function writePost(fullPath, post) {
  fs.writeFileSync(fullPath, `${JSON.stringify(post, null, 2)}\n`);
}

function todayIso() {
  return new Date().toISOString();
}

function publicStatus(post) {
  const live = (post.status === 'approved' || post.status === 'published') && new Date(post.publishAt) <= new Date();
  return live ? 'LIVE' : 'HIDDEN';
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function nextPublishAt() {
  // Default: next Tuesday or Thursday at 15:15 UTC
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 2=Tue, 4=Thu
  const daysUntilTue = ((2 - day + 7) % 7) || 7;
  const daysUntilThu = ((4 - day + 7) % 7) || 7;
  const daysAhead = Math.min(daysUntilTue, daysUntilThu);
  const target = new Date(now);
  target.setUTCDate(target.getUTCDate() + daysAhead);
  target.setUTCHours(15, 15, 0, 0);
  return target.toISOString();
}

function usage() {
  console.log(`Blog workflow helper

Commands:
  npm run blog:list
  npm run blog:create -- <slug> <title> <category> [publishAt]
  npm run blog:approve -- <slug> [publishAt]
  npm run blog:unapprove -- <slug>

Examples:
  npm run blog:list
  npm run blog:create -- "my-post-slug" "My Post Title" "AI Product"
  npm run blog:approve -- my-post-slug 2026-05-14T15:15:00.000Z
  npm run blog:unapprove -- my-post-slug
`);
}

const [, , command, ...rest] = process.argv;

if (!command) {
  usage();
  process.exit(1);
}

if (command === 'create') {
  const [rawSlug, title, category, publishAt] = rest;

  if (!rawSlug || !title || !category) {
    console.error('Usage: npm run blog:create -- <slug> <title> <category> [publishAt]');
    process.exit(1);
  }

  const slug = slugify(rawSlug);
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    console.error(`Invalid slug after normalization: "${slug}". Use lowercase letters, numbers, and hyphens.`);
    process.exit(1);
  }

  const outPath = path.join(POSTS_DIRECTORY, `${slug}.json`);
  if (fs.existsSync(outPath)) {
    console.error(`Post already exists: ${outPath}`);
    process.exit(1);
  }

  const post = {
    slug,
    title,
    excerpt: 'TODO: one sentence for preview cards and meta description. Keep under 160 characters.',
    publishAt: publishAt || nextPublishAt(),
    readTime: '5 min read',
    category,
    featured: false,
    status: 'draft',
    engineeringSignal: [
      'TODO: engineering signal 1',
      'TODO: engineering signal 2',
      'TODO: engineering signal 3',
    ],
    summary: 'TODO: 1-2 sentence summary shown at the top of the post. Explain what you built and why it matters.',
    sections: [
      { heading: 'Problem', content: ['TODO: what problem prompted this.'] },
      { heading: 'What I built', content: ['TODO: describe the system or feature.'] },
      { heading: 'Key decisions', bullets: ['TODO: decision 1', 'TODO: decision 2', 'TODO: decision 3'] },
      { heading: 'What this shows', content: ['TODO: what this project signals about how you work.'] },
    ],
  };

  writePost(outPath, post);
  console.log(`Created draft: ${outPath}

Next steps:
  1. Edit the JSON — fill in excerpt, summary, engineeringSignal, and sections
  2. Run: npm run blog:approve -- ${slug}
  3. Commit and push

The post will go live at ${post.publishAt} after the next deploy.`);
  process.exit(0);
}

const posts = readPosts();

if (command === 'list') {
  for (const { post } of posts) {
    console.log(`${post.slug}\n  status: ${post.status}\n  publishAt: ${post.publishAt}\n  visibility: ${publicStatus(post)}\n`);
  }
  process.exit(0);
}

const [slug, publishAt] = rest;

if (!slug) {
  console.error('Missing slug.');
  usage();
  process.exit(1);
}

const match = posts.find(({ post }) => post.slug === slug);

if (!match) {
  console.error(`Post not found: ${slug}`);
  process.exit(1);
}

if (command === 'approve') {
  match.post.status = 'approved';
  match.post.approvedAt = todayIso();
  if (publishAt) {
    match.post.publishAt = publishAt;
  }
  writePost(match.fullPath, match.post);
  console.log(`Approved ${slug} for ${match.post.publishAt}`);
  process.exit(0);
}

if (command === 'unapprove') {
  match.post.status = 'draft';
  delete match.post.approvedAt;
  writePost(match.fullPath, match.post);
  console.log(`Moved ${slug} back to draft.`);
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
usage();
process.exit(1);
