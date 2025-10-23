import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function TwitterImage() {
  const { width, height } = size
  const brand = '#0F2A2F'
  const accent = '#20B28E'
  const blue = '#0095D9'
  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: `linear-gradient(135deg, ${brand} 0%, ${blue} 55%, ${accent} 100%)`,
          color: '#fff',
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif'
        }}
      >
        <div style={{ position:'relative', zIndex:1, textAlign:'center', padding: '0 64px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.15,
            textShadow: '0 6px 24px rgba(0,0,0,0.35)'
          }}>
            Economize até 35% na conta de energia
          </div>
          <div style={{ marginTop: 18, fontSize: 28, opacity: 0.92 }}>
            Sem investimento inicial • Usinas no MS • Gestão Sion
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
