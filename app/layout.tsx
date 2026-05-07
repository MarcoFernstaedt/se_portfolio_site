import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { safeJsonLd } from '@/lib/blog-schema';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

// Update this when the production domain is confirmed
const SITE_URL = 'https://marcofernstaedt.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Marco Fernstaedt | Full Stack Software Engineer',
    template: '%s | Marco Fernstaedt',
  },
  description:
    'Full stack software engineer building production web apps with React, Next.js, TypeScript, Node.js, and AI APIs. Deployed client work, realtime systems, and developer tools. Open to full time roles.',
  keywords: [
    'Marco Fernstaedt',
    'full stack developer',
    'full stack software engineer',
    'software engineer portfolio',
    'React developer',
    'Next.js developer',
    'TypeScript engineer',
    'Node.js developer',
    'JavaScript developer',
    'MERN stack',
    'web developer for hire',
    'AI integration engineer',
    'OpenAI API developer',
    'frontend developer',
    'backend developer',
    'systems builder',
    'software engineer open to work',
    'remote software engineer',
    'hire software engineer',
  ],
  authors: [{ name: 'Marco Fernstaedt' }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Marco Fernstaedt | Full Stack Software Engineer',
    description:
      'Full stack software engineer with deployed client work, AI product experience, realtime systems, and developer tools. Open to full time roles.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Marco Fernstaedt Command Center',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Marco Fernstaedt Full Stack Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marco Fernstaedt | Full Stack Software Engineer',
    description:
      'Full stack engineer: React, Next.js, TypeScript, Node.js, AI APIs, and deployed production systems. Open to full time roles.',
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marco Fernstaedt',
  url: SITE_URL,
  jobTitle: 'Full Stack Software Engineer',
  description:
    'Full stack software engineer building production web applications with React, Next.js, TypeScript, Node.js, and AI integration. Deployed client work, realtime systems, and developer tools. Open to full time roles.',
  email: 'contact@marcofernstaedt.com',
  sameAs: [
    'https://github.com/MarcoFernstaedt',
    'https://www.linkedin.com/in/marcofernstaedt',
  ],
  knowsAbout: [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'MongoDB', 'PostgreSQL', 'OpenAI API', 'Socket.IO',
    'Tailwind CSS', 'Vercel', 'REST APIs', 'JWT Authentication',
    'WebSockets', 'AI Integration', 'SEO', 'Accessibility',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Full Stack Software Engineer',
    occupationLocation: { '@type': 'Country', name: 'United States' },
    skills: 'React, Next.js, TypeScript, Node.js, Express, MongoDB, PostgreSQL, OpenAI API, Socket.IO, Tailwind CSS, Vercel',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': SITE_URL,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Marco Fernstaedt Command Center',
  url: SITE_URL,
  author: { '@type': 'Person', name: 'Marco Fernstaedt' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AccessibilityProvider>{children}</AccessibilityProvider>
        <Analytics />
      </body>
    </html>
  );
}
