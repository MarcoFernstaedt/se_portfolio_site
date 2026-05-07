import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { BlogPostRecord, BlogWorkflowStatus } from '@/types';
import { normalizeBlogPostRecord } from '@/lib/blog-schema';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog', 'posts');

let cachedPosts: BlogPostRecord[] | null = null;

function loadAllPosts(): BlogPostRecord[] {
  if (cachedPosts) return cachedPosts;

  cachedPosts = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.json') && !file.startsWith('_'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      try {
        return normalizeBlogPostRecord(JSON.parse(raw));
      } catch (error) {
        throw new Error(`Invalid blog post ${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

  return cachedPosts;
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
