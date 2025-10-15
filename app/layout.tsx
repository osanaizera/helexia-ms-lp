import '../styles/globals.css'
import { GtmHeadScript, GtmNoScript } from '@/lib/gtm'
// Vercel Analytics/SpeedInsights imports removed to avoid build errors when packages aren't installed
import { GA4HeadScript } from '@/lib/ga'
import ConsentBanner from '@/components/ConsentBanner'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { FbPixelHeadScript, FbPixelNoScript } from '@/lib/fbpixel'
import FbqRoute from '@/components/FbqRoute'

export const metadata = {
  metadataBase: new URL('https://suacontamenor.com.br'),
  title: 'Sua Conta Menor — Energia com desconto',
  description: 'Economize até 35% na sua fatura de energia no MS.',
  openGraph: {
    title: 'Sua Conta Menor — Energia com desconto',
    description: 'Economize até 35% na sua fatura de energia no MS.',
    url: 'https://suacontamenor.com.br',
    siteName: 'Sua Conta Menor',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Economia na conta de energia no MS' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sua Conta Menor — Energia com desconto',
    description: 'Economize até 35% na sua fatura de energia no MS.',
    images: ['/twitter-image']
  }
}

export default function RootLayout({ children }: { children: ReactNode }){
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XMNXWQXQJZ'
  const fbId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1305029297374794'
  return (
    <html lang="pt-BR">
      <head>
        <GtmHeadScript id={gtmId} />
        <GA4HeadScript id={gaId} />
        <FbPixelHeadScript id={fbId} />
        <script
          dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'granted',
            'security_storage': 'granted'
          });
        ` }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="has-sticky-cta">
        {/* Fixed brand logo header */}
        <header id="brand-header" className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
          <div className="bg-white/15 backdrop-blur rounded-xl border border-white/30 px-3 py-2 shadow-soft inline-flex items-center gap-3">
            <img src="/images/logosion.png" alt="Sion" className="h-14 md:h-16 w-auto" />
          </div>
        </header>
        <GtmNoScript id={gtmId} />
        <FbPixelNoScript id={fbId} />
        {children}
        <Suspense fallback={null}>
          <FbqRoute />
        </Suspense>
        <ConsentBanner />
      </body>
    </html>
  )
}
