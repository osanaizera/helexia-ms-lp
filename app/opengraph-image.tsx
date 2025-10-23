import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
        {/* soft overlay for readability */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 100%)'
          }}
        />
        <div style={{ position:'absolute', top: 48, left: 64, display:'flex', alignItems:'center', gap: 16 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 72, height: 24, background:'#fff', borderRadius: 6 }} />
            <div style={{ fontSize: 28, fontWeight: 700 }}>Sion</div>
          </div>
        </div>

        <div style={{ position:'relative', zIndex:1, textAlign:'center', padding: '0 64px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{
            fontSize: 60,
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

        <div style={{ position:'absolute', bottom: 48, left: 64, right: 64, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize: 22, opacity: 0.9 }}>suacontamenor.com.br</div>
          <div style={{
            background: '#fff', color: brand, padding: '12px 20px', borderRadius: 999,
            fontSize: 22, fontWeight: 700
          }}>
            Simule sua economia agora
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
