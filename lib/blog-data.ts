import accessibleWorkflow from '@/content/blog/posts/building-accessible-ai-image-audio-workflows.json';
import messagingNotes from '@/content/blog/posts/realtime-messaging-system-design-notes.json';
import postTemplate from '@/content/blog/posts/portfolio-post-template.json';
import approvalWorkflowExample from '@/content/blog/posts/approval-workflow-example-post.json';
import { BlogPostRecord, BlogWorkflowStatus } from '@/types';

const blogPosts: BlogPostRecord[] = [
  accessibleWorkflow,
  messagingNotes,
  postTemplate,
  approvalWorkflowExample,
] as BlogPostRecord[];

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
  return sortNewestFirst(blogPosts);
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
