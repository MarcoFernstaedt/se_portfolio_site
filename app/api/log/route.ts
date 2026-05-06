import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Logging endpoint intentionally disabled for the public portfolio.
 *
 * Vercel Analytics handles visitor analytics. Keeping this route as a no-op
 * avoids a public unauthenticated write endpoint on Vercel or the VPS while
 * preserving compatibility if old clients still POST here.
 */
export async function POST() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
