"use client"
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function FbqRoute(){
  const pathname = usePathname()
  const search = useSearchParams()
  useEffect(()=>{
    try{
      // Trigger PageView on route change
      ;(window as any)?.fbq?.('track', 'PageView')
    }catch{}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search?.toString()])
  return null
}

