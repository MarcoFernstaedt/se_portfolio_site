import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Marco Fernstaedt Full Stack Software Engineer';
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
            background: 'linear-gradient(90deg, #00d4ff, #0080ff, transparent)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
          <div
            style={{
              fontSize: '13px',
              color: '#00d4ff',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            ◈ PORTFOLIO
          </div>

          <div
            style={{
              fontSize: '68px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Marco Fernstaedt
          </div>

          <div
            style={{
              fontSize: '26px',
              color: '#94a3b8',
              fontWeight: '400',
            }}
          >
            Full Stack Software Engineer
          </div>

          {/* Tech stack row */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'AI APIs'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#00d4ff',
                  border: '1px solid rgba(0,212,255,0.3)',
                  background: 'rgba(0,212,255,0.07)',
                }}
              >
                {tag}
              </div>
            ))}
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
          marcofernstaedt.com
        </div>

        {/* Bottom right: open to work */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#00ff88',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00ff88',
            }}
          />
          OPEN TO WORK
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
