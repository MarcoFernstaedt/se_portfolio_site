import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/lib/accessibility-context';

export const metadata: Metadata = {
  title: 'Marco Fernstaedt — Command Center',
  description:
    'Full-stack developer, accessibility engineer, and founder of Dominion Edge Holdings. Building software systems and acquiring real-world assets.',
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
      'Full-stack developer, accessibility engineer, and founder of Dominion Edge Holdings.',
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
