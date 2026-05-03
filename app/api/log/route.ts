import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (body) {
    setImmediate(async () => {
      try {
        const logDir = process.env.LOG_PATH || '/var/log/portfolio';
        await mkdir(logDir, { recursive: true });
        const logPath = path.join(logDir, 'events.jsonl');
        const line =
          JSON.stringify({
            ...body,
            serverTimestamp: new Date().toISOString(),
          }) + '\n';
        await appendFile(logPath, line, 'utf8');
      } catch {
        // logging is best-effort
      }
    });
  }

  return NextResponse.json({ ok: true });
}
