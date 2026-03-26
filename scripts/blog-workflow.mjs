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

function usage() {
  console.log(`Blog workflow helper

Commands:
  npm run blog:list
  npm run blog:approve -- <slug> [publishAt]
  npm run blog:unapprove -- <slug>

Examples:
  npm run blog:list
  npm run blog:approve -- approval-workflow-example-post 2026-04-15T14:00:00.000Z
  npm run blog:unapprove -- approval-workflow-example-post
`);
}

const [, , command, slug, publishAt] = process.argv;

if (!command) {
  usage();
  process.exit(1);
}

const posts = readPosts();

if (command === 'list') {
  for (const { post } of posts) {
    console.log(`${post.slug}\n  status: ${post.status}\n  publishAt: ${post.publishAt}\n  visibility: ${publicStatus(post)}\n`);
  }
  process.exit(0);
}

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
