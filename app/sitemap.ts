import { MetadataRoute } from 'next';
import { getPublicBlogPosts } from '@/lib/blog-data';

const SITE_URL = 'https://marcofernstaedt.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublicBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: new Date(post.publishAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/writing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogRoutes,
  ];
}
