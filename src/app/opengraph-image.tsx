import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Grain Overlay Effect */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)' }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
          <h1
            style={{
              fontSize: '120px',
              fontFamily: 'serif',
              color: 'white',
              margin: 0,
              letterSpacing: '-0.05em',
            }}
          >
            NILXNJXN
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#22D3EE',
              textTransform: 'uppercase',
              letterSpacing: '0.5em',
              margin: 0,
            }}
          >
            SHADES — DEBUT EP 2026
          </p>
          <div
            style={{
              marginTop: '40px',
              padding: '12px 32px',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '100px',
              color: 'white',
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            Assam Hip-Hop New Wave
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
