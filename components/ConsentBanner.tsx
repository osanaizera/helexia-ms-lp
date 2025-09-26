"use client"
import { useEffect, useState } from 'react'

export default function ConsentBanner(){
  const [show, setShow] = useState(false)
  useEffect(()=>{
    try{
      const v = localStorage.getItem('consent_analytics')
      if(!v) setShow(true)
    }catch{}
  },[])

  function grant(){
    try{ localStorage.setItem('consent_analytics','granted') }catch{}
    try{ (window as any)?.gtag?.('consent','update',{ analytics_storage:'granted' }) }catch{}
    setShow(false)
  }
  function deny(){
    try{ localStorage.setItem('consent_analytics','denied') }catch{}
    try{ (window as any)?.gtag?.('consent','update',{ analytics_storage:'denied' }) }catch{}
    setShow(false)
  }

  if(!show) return null
  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-3">
      <div className="mx-auto max-w-3xl bg-white border border-line rounded-2xl shadow-xl p-4 flex items-center justify-between gap-3">
        <div className="text-sm text-ink/80">
          Usamos cookies para medir uso (GA). Consulte nossa <a className="underline" href="/privacidade">Política de Privacidade</a>.
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost" onClick={deny}>Somente essenciais</button>
          <button className="btn btn-primary" onClick={grant}>Aceitar analytics</button>
        </div>
      </div>
    </div>
  )
}

