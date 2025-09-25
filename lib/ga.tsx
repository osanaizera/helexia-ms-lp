"use client"
import Script from 'next/script'

export function GA4HeadScript({ id }: { id?: string }){
  if (!id) return null
  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  )
}

