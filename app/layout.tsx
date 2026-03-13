import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/lib/accessibility-context';

export const metadata: Metadata = {
  title: 'Marco Fernstaedt — Command Center',
  description:
    'Full-stack software engineer specializing in accessible, performant web applications. React, Next.js, TypeScript, Node.js, and AI integration.',
  keywords: [
    'full-stack developer',
    'accessibility engineer',
    'Next.js',
    'TypeScript',
    'blind developer',
    'WCAG',
    'systems builder',
  ],
  authors: [{ name: 'Marco Fernstaedt' }],
  openGraph: {
    title: 'Marco Fernstaedt — Command Center',
    description:
      'Full-stack software engineer specializing in accessible, performant web applications.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
