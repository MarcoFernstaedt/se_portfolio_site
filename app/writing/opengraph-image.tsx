import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Engineering Notes | Marco Fernstaedt';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0e17',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #00ff88, #00d4ff, transparent)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
          <div
            style={{
              fontSize: '13px',
              color: '#00ff88',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            ◈ ENGINEERING NOTES
          </div>

          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Built it. Learned it.
          </div>

          <div
            style={{
              fontSize: '26px',
              color: '#94a3b8',
              fontWeight: '400',
              maxWidth: '700px',
            }}
          >
            High-signal writeups on AI product work, realtime systems, accessibility engineering, and developer tools.
          </div>

          <div
            style={{
              fontSize: '18px',
              color: 'rgba(0,212,255,0.8)',
              marginTop: '8px',
            }}
          >
            Marco Fernstaedt
          </div>
        </div>

        {/* Bottom left: domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '80px',
            fontSize: '18px',
            color: 'rgba(0,212,255,0.7)',
          }}
        >
          marcofernstaedt.com/writing
        </div>

        {/* Bottom right: post count indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '13px',
            color: 'rgba(148,163,184,0.6)',
            letterSpacing: '0.15em',
          }}
        >
          ENGINEERING JOURNAL
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
