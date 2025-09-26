import '../styles/globals.css'
import { GtmHeadScript, GtmNoScript } from '@/lib/gtm'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GA4HeadScript } from '@/lib/ga'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Helexia MS — Energia com desconto (até 45%)',
  description: 'Pague menos na conta de luz no Mato Grosso do Sul. Planos Flex, Econômico 12 e Premium 36. Simule sua economia.',
  openGraph: {
    title: 'Helexia MS — Energia com desconto',
    description: 'Até 45% de desconto na fatura no MS',
    url: 'https://helexia-ms.example',
    siteName: 'Helexia',
    locale: 'pt_BR',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: ReactNode }){
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-KMG1D0HBYK'
  return (
    <html lang="pt-BR">
      <head>
        <GtmHeadScript id={gtmId} />
        <GA4HeadScript id={gaId} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="has-sticky-cta">
        {/* Fixed brand logo header */}
        <header id="brand-header" className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
          <div className="bg-white/15 backdrop-blur rounded-xl border border-white/30 px-3 py-2 shadow-soft inline-flex items-center gap-3">
            <img src="/images/logohlx.png" alt="Helexia" className="h-4 md:h-5 w-auto" />
            <span className="text-white/80 text-sm">×</span>
            <img src="/images/logosion.png" alt="Sion" className="h-14 md:h-16 w-auto" />
          </div>
        </header>
        <GtmNoScript id={gtmId} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
