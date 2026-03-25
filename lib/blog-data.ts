import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-accessible-ai-image-audio-workflows',
    title: 'Building an accessible AI image-to-audio workflow',
    excerpt:
      'How I approached image understanding, speech generation, and UX tradeoffs when building an accessibility-first tool for blind and low-vision users.',
    publishedAt: '2026-03-10',
    readTime: '5 min read',
    category: 'Accessibility + AI',
    featured: true,
    recruiterSignal: [
      'Ships accessibility-focused product work',
      'Integrates external AI APIs into production UX',
      'Thinks in user outcomes, not demos',
    ],
    summary:
      'This post breaks down the engineering decisions behind an accessibility tool that converts images into spoken descriptions. It focuses on system flow, latency constraints, and product decisions that matter in real use.',
    sections: [
      {
        heading: 'Problem',
        content: [
          'A generic image caption is rarely enough for a blind user. The output needs to prioritize context, spatial relationships, and what is actually useful to act on.',
          'That changed the engineering goal from “describe an image” to “deliver actionable context quickly and reliably.”',
        ],
      },
      {
        heading: 'What I built',
        content: [
          'A pipeline that accepts an image, sends it through a vision model, transforms the response into narration-friendly output, and streams generated speech back to the browser.',
          'The frontend was designed to keep the interaction simple, keyboard-friendly, and usable with assistive tech from the start rather than as a retrofit.',
        ],
      },
      {
        heading: 'Engineering decisions',
        bullets: [
          'Optimized prompts for useful detail instead of generic captions',
          'Handled binary audio responses end-to-end',
          'Reduced friction in the UI for repeat use',
          'Designed for graceful failure when model or network calls slow down',
        ],
      },
      {
        heading: 'Why it matters',
        content: [
          'The interesting part of this project was not just calling an AI API. It was translating model output into an experience that works for real users with specific access needs.',
        ],
      },
    ],
  },
  {
    slug: 'realtime-messaging-system-design-notes',
    title: 'What building a real-time messaging platform taught me',
    excerpt:
      'Presence, optimistic updates, image handling, and reconnect logic were the parts that turned a chat app from a tutorial project into real engineering work.',
    publishedAt: '2026-02-19',
    readTime: '6 min read',
    category: 'Systems Design',
    featured: true,
    recruiterSignal: [
      'Works across frontend and backend boundaries',
      'Understands real-time state synchronization',
      'Builds practical auth and media flows',
    ],
    summary:
      'This post focuses on the parts of chat systems that actually get difficult: keeping state believable, handling reconnects, and making media and auth feel stable.',
    sections: [
      {
        heading: 'The easy version vs the real version',
        content: [
          'A basic chat demo is straightforward. A usable messaging product is not. The hard part is handling the moments when reality is messy: stale presence, dropped sockets, duplicate events, and uploads that lag behind UI state.',
        ],
      },
      {
        heading: 'Core lessons',
        bullets: [
          'Optimistic UI makes the product feel fast, but only if rollback paths are clear',
          'Reconnect behavior is part of the product, not just infrastructure',
          'Presence indicators become noisy quickly without careful event rules',
          'Image upload flows need security and UX considered together',
        ],
      },
      {
        heading: 'What I would highlight to a team',
        content: [
          'I am comfortable moving between UI polish and backend event handling. This project forced me to think about both at the same time instead of treating them as separate worlds.',
        ],
      },
    ],
  },
  {
    slug: 'portfolio-post-template',
    title: 'Post template: learned, built, impact',
    excerpt:
      'A reusable structure for writing high-signal engineering posts that recruiters can skim in under a minute.',
    publishedAt: '2026-03-25',
    readTime: '3 min read',
    category: 'Writing System',
    featured: false,
    recruiterSignal: [
      'Communicates clearly about engineering work',
      'Frames technical work in business terms',
      'Makes projects easy to evaluate quickly',
    ],
    summary:
      'This template sets a clear structure for future posts so each one shows scope, technical depth, and outcome without turning into a diary entry.',
    sections: [
      {
        heading: 'Recommended structure',
        bullets: [
          'What I built or worked on',
          'Why the problem mattered',
          'Key technical decisions',
          'What was difficult',
          'What I learned or would improve next',
          'Recruiter takeaway: what this says about how I work',
        ],
      },
      {
        heading: 'Keep it high signal',
        content: [
          'The best posts are specific. Name the stack, the tradeoffs, the constraints, and the outcome. Avoid generic motivational writing.',
          'A recruiter or hiring manager should be able to skim the post and understand the scope, ownership, and engineering judgment involved.',
        ],
      },
    ],
  },
];

export function getFeaturedPosts() {
  return blogPosts.filter((post) => post.featured);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
