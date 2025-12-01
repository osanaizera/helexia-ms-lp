"use client"
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDiscountPct } from '@/lib/estimate'

function CountUp({ value, format = (v:number)=>String(v), duration=800 }: { value: number; format?: (v:number)=>string; duration?: number }){
  const [display, setDisplay] = useState(0)
  useEffect(()=>{
    let raf = 0
    const start = performance.now()
    const from = display
    const to = value
    const delta = to - from
    const tick = (t:number)=>{
      const p = Math.min((t - start)/duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(from + delta * eased)
      if(p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return ()=> cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value])
  return <span>{format(Math.round(display))}</span>
}

function AnimatedBar({ bill, pct }: { bill: number; pct: number }){
  const icmsShare = 0.17
  const pisShare = 0.05
  const taxes = Math.max(Math.round(bill * (icmsShare + pisShare)),0)
  const energyBase = Math.max(bill - taxes, 0)
  const discountValue = Math.max(Math.round(energyBase * (pct/100)),0)
  const targetTaxes = bill ? (taxes/bill)*100 : 0
  const targetEnergy = bill ? (energyBase/bill)*100 : 0
  const targetDiscount = bill ? (discountValue/bill)*100 : 0
  const [w, setW] = useState({ taxes:0, energy:0, discount:0 })
  useEffect(()=>{
    const id = requestAnimationFrame(()=> setW({ taxes: targetTaxes, energy: targetEnergy, discount: targetDiscount }))
    return ()=> cancelAnimationFrame(id)
  },[targetTaxes, targetEnergy, targetDiscount])
  return (
    <div className="mt-6">
      <div className="relative w-full h-5 md:h-6 rounded-full bg-line overflow-hidden" aria-label="Composição da sua fatura">
        <div className="absolute inset-y-0 left-0 transition-all duration-700 ease-out" style={{ width: `${Math.max(w.energy,0)}%`, background:'rgba(0,149,217,0.5)' }} title="Energia (TE+TUSD) — parte variável" />
        <div className="absolute inset-y-0 right-0 transition-all duration-700 ease-out" style={{ width: `${Math.max(w.taxes,0)}%`, background:'rgba(226,232,240,1)' }} title="Impostos (ICMS+PIS/COFINS) — parte fixa" />
        <div className="absolute inset-y-0 left-0 transition-all duration-700 ease-out" style={{ width: `${Math.max(w.discount,0)}%`, background:'var(--brand-accent)', boxShadow:'inset -1px 0 0 rgba(255,255,255,0.7)' }} title={`Desconto aplicado (estimativa): ${discountValue.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}`} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-xs">
        <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:'var(--brand-accent)'}} /> Desconto sobre energia ({pct}%)</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:'rgba(0,149,217,0.5)'}} /> Energia (TE+TUSD)</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:'rgba(226,232,240,1)'}} /> Impostos</span>
      </div>
    </div>
  )
}

function formatBRL(n: number){
  return n.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' })
}

function SuccessModal(){
  const router = useRouter()
  const sp = useSearchParams()
  const plan = (sp.get('plan')||'').toString() as 'Livre'|'Prata'|'Ouro'
  const bill = Number(sp.get('bill')||0)
  const qPct = Number(sp.get('pct')||0)
  const pct = useMemo(()=> qPct>0 ? qPct : (bill>0 && plan ? getDiscountPct(plan, bill) : 0), [qPct, bill, plan])

  const planLabel = plan === 'Livre' ? 'Sem fidelidade' : plan === 'Prata' ? '12 meses' : plan === 'Ouro' ? '24 meses' : ''

  const icmsShare = 0.17
  const pisShare = 0.05
  const taxes = Math.max(Math.round(bill * (icmsShare + pisShare)),0)
  const energyBase = Math.max(bill - taxes, 0)
  const discountValue = Math.max(Math.round(energyBase * (pct/100)),0)
  const annualSaving = discountValue * 12

  useEffect(()=>{
    try{
      const dbg = process.env.NEXT_PUBLIC_GA_DEBUG === '1'
      ;(window as any)?.gtag?.('event','page_view', { page_title: 'Formulário Enviado', page_location: window.location.href, ...(dbg ? { debug_mode: true } : {}) })
    }catch{}
  },[])

  function close(){ router.push('/') }
  useEffect(()=>{
    const onKey = (e: KeyboardEvent)=>{ if(e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  },[])

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div role="dialog" aria-modal className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-white">
        <div className="relative bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)] px-6 py-5 text-white">
          <button aria-label="Fechar" onClick={close} className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">Formulário enviado com sucesso!</h1>
          <p className="text-white/90 mt-1">{planLabel ? `Plano: ${planLabel}` : 'Obrigado pelo interesse. Em breve entraremos em contato.'}</p>
        </div>
        <div className="p-6">
          {(bill>0 && pct>0) ? (
            <>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-8 text-center">
                <div className="relative">
                  <div className="px-5 py-3 rounded-full bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)] text-white text-xl md:text-2xl font-bold shadow-soft">
                    {pct}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted">Economia mensal</div>
                  <div className="text-3xl md:text-4xl font-bold text-[color:var(--brand-accent)]"><CountUp value={discountValue} format={formatBRL} /></div>
                </div>
                <div>
                  <div className="text-sm text-muted">Economia anual</div>
                  <div className="text-3xl md:text-4xl font-bold text-[color:var(--brand-accent)]"><CountUp value={annualSaving} format={formatBRL} /></div>
                </div>
              </div>
              <AnimatedBar bill={bill} pct={pct} />
              <p className="mt-2 text-xs text-muted text-center">O desconto é aplicado apenas sobre a parte de energia (TE+TUSD). Impostos como ICMS e PIS/COFINS não sofrem redução.</p>
            </>
          ) : (
            <p className="text-ink/80">Assim que possível, nossa equipe entrará em contato para concluir sua proposta.</p>
          )}
          <div className="mt-8 flex items-center justify-center gap-3">
            <a className="btn btn-primary" href="/">Ir para a página inicial</a>
            <a className="btn btn-ghost" href="/#leadform">Fazer nova simulação</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage(){
  return (
    <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 text-center">Carregando…</div></div>}>
      <SuccessModal />
    </Suspense>
  )
}
