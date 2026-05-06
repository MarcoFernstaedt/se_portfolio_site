import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AccessibilityProvider } from '@/lib/accessibility-context';

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
    default: 'Marco Fernstaedt | Full-Stack Software Engineer',
    template: '%s | Marco Fernstaedt',
  },
  description:
    'Full-stack software engineer building performant web applications with React, Next.js, TypeScript, Node.js, and AI integration. Available for full-time roles.',
  keywords: [
    'Marco Fernstaedt',
    'full stack developer',
    'software engineer',
    'MERN stack',
    'Next.js',
    'TypeScript',
    'React developer',
    'Node.js',
    'AI integration',
    'systems builder',
  ],
  authors: [{ name: 'Marco Fernstaedt' }],
  openGraph: {
    title: 'Marco Fernstaedt | Full-Stack Software Engineer',
    description:
      'Full-stack software engineer building performant web applications with React, Next.js, TypeScript, and AI integration.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Marco Fernstaedt Command Center',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marco Fernstaedt | Full-Stack Software Engineer',
    description: 'Full-stack engineer specializing in MERN stack, Python, and AI APIs.',
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
  jobTitle: 'Full-Stack Software Engineer',
  description: 'Full-stack engineer specializing in MERN stack, Python, and AI APIs.',
  email: 'contact@marcofernstaedt.com',
  sameAs: [
    'https://github.com/MarcoFernstaedt',
    'https://linkedin.com/in/marcofernstaedt',
  ],
  knowsAbout: [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'MongoDB', 'PostgreSQL', 'OpenAI API', 'Socket.IO',
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
