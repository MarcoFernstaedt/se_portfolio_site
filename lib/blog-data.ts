// Server-only module — uses Node.js fs. Never import this in a client component.
import fs from 'node:fs';
import path from 'node:path';
import { BlogPostRecord, BlogWorkflowStatus } from '@/types';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog', 'posts');

function loadAllPosts(): BlogPostRecord[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.json') && !file.startsWith('_'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      return JSON.parse(raw) as BlogPostRecord;
    });
}

function sortNewestFirst(posts: BlogPostRecord[]) {
  return [...posts].sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime());
}

export function formatPublishDate(publishAt: string) {
  return publishAt.slice(0, 10);
}

export function isPublishable(post: BlogPostRecord, now = new Date()) {
  if (post.status !== 'approved' && post.status !== 'published') {
    return false;
  }
  return new Date(post.publishAt).getTime() <= now.getTime();
}

export function getAllBlogPosts() {
  return sortNewestFirst(loadAllPosts());
}

export function getBlogPostsByStatus(status: BlogWorkflowStatus) {
  return sortNewestFirst(getAllBlogPosts().filter((post) => post.status === status));
}

export function getPublicBlogPosts(now = new Date()) {
  return sortNewestFirst(getAllBlogPosts().filter((post) => isPublishable(post, now)));
}

export function getFeaturedPosts(now = new Date()) {
  return getPublicBlogPosts(now).filter((post) => post.featured);
}

export function getBlogPost(slug: string, now = new Date()) {
  return getPublicBlogPosts(now).find((post) => post.slug === slug);
}

export function getAnyBlogPost(slug: string) {
  return getAllBlogPosts().find((post) => post.slug === slug);
}
