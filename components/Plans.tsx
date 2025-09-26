"use client"
type PlanKey = 'Flex'|'Economico12'|'Premium36'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

function IconClock(){
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  )
}
function IconCalendar(){
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}
function IconMedal(){
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 3h6l1 5-4 2-4-2 1-5Z"></path>
      <circle cx="12" cy="17" r="4"></circle>
    </svg>
  )
}

const PLANS: { key: PlanKey; title: string; desc: string; badge?: string; range: string; color: string; icon: JSX.Element }[] = [
  { key:'Flex', title:'Flex', desc:'20–25% de desconto, sem fidelidade', badge:'Sem fidelidade', range:'20–25%', color:'from-gray-100 to-brand-accent text-brand', icon:<IconClock/> },
  { key:'Economico12', title:'Econômico 12', desc:'25–30% de desconto, 12 meses', range:'25–30%', color:'from-blue to-brand-accent text-blue', icon:<IconCalendar/> },
  { key:'Premium36', title:'Premium 36', desc:'30–45% de desconto, 36 meses', badge:'Melhor preço', range:'30–45%', color:'from-brand to-brand-accent text-brand', icon:<IconMedal/> },
]

export default function Plans({ onSelect, selected }: { onSelect?: (p: PlanKey) => void, selected?: PlanKey }){
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  function handleKey(e: KeyboardEvent, plan: PlanKey){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      onSelect?.(plan)
    }
  }
  useEffect(()=>{
    const el = trackRef.current
    if(!el) return
    const onScroll = () => {
      const { scrollLeft, clientWidth } = el
      const center = scrollLeft + clientWidth/2
      let best = 0; let bestDist = Infinity
      const children = Array.from(el.children) as HTMLElement[]
      children.forEach((ch, i) => {
        const left = ch.offsetLeft
        const w = ch.offsetWidth
        const c = left + w/2
        const d = Math.abs(c - center)
        if(d < bestDist){ bestDist = d; best = i }
      })
      setActiveIdx(best)
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true } as any)
    const RO = (globalThis as any).ResizeObserver
    const ro = RO ? new RO(onScroll) : null
    if(ro && el) ro.observe(el)
    return ()=>{ el.removeEventListener('scroll', onScroll); ro && ro.disconnect && ro.disconnect() }
  },[])

  return (
    <section className="py-12 bg-bg" aria-labelledby="plans-heading">
      <div className="container-pad">
        <h2 id="plans-heading" className="section-title">Nossos Planos</h2>
        <p className="section-sub">Escolha o que combina com seu perfil</p>
        <div className="mt-6 md:mt-8 relative">
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-r from-bg to-transparent" aria-hidden />
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-bg to-transparent" aria-hidden />
          <div className="md:hidden absolute -top-6 right-0 text-xs text-muted">Deslize →</div>
          <div ref={trackRef} className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible no-scrollbar overscroll-x-contain touch-pan-x snap-x snap-mandatory scroll-smooth -mx-4 px-4" role="radiogroup" aria-label="Seleção de planos">
          {/* Plano Sem Compromisso (Flex) */}
          <article
            className={`group rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl min-h-[360px] sm:min-h-[440px] md:min-h-[520px] p-5 md:p-8 lg:p-10 flex flex-col snap-center shrink-0 min-w-[calc(100%-2rem)] sm:min-w-[70%] md:min-w-0 break-words touch-pan-y ${selected==='Flex' ? 'bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)] text-white border-transparent ring-2 ring-white/20 shadow-2xl' : 'bg-white border-line text-ink shadow-soft'}`}
            role="radio" aria-checked={selected==='Flex'} tabIndex={0}
            onKeyDown={(e)=>handleKey(e,'Flex')}
            onClick={()=>onSelect?.('Flex')}
            aria-label="Plano Sem Compromisso"
          >
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">Plano Sem Compromisso</h3>
                <p className={`text-sm mt-1 ${selected==='Flex' ? 'text-white/80' : 'text-ink/60'}`}>Liberdade total</p>
              </div>
              {selected==='Flex' && (
                <span className="text-xs text-[color:var(--brand-accent)]">Selecionado</span>
              )}
            </div>
            <div className="mt-5">
              <div className={`text-sm ${selected==='Flex' ? 'text-white/80' : 'text-muted'}`}>Desconto</div>
              <div className={`text-5xl font-bold leading-tight ${selected==='Flex' ? 'text-white' : 'text-[color:var(--brand-accent)]'}`}>20%</div>
              <div className={`text-sm mt-2 ${selected==='Flex' ? 'text-white/80' : 'text-ink/70'}`}>Prazo: sem fidelidade</div>
            </div>
            <p className={`mt-5 text-base ${selected==='Flex' ? 'text-white/90' : 'text-ink/80'}`}>Economize 20% hoje mesmo. Cancele quando quiser.</p>
            <div className={`mt-5 flex gap-2 text-xs ${selected==='Flex' ? 'text-white/80' : 'text-ink/70'}`}>
              <span className={`${selected==='Flex' ? 'px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90' : 'px-2 py-1 rounded-full bg-line/60'}`}>Liberdade total</span>
              <span className={`${selected==='Flex' ? 'px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90' : 'px-2 py-1 rounded-full bg-line/60'}`}>Sem multa</span>
            </div>
            <div className="mt-auto">
              <button className="btn btn-primary mt-8 w-full" onClick={(e)=>{e.stopPropagation(); onSelect?.('Flex')}} data-testid={`select-plan-Flex`}>
                Quero economizar 20% agora
              </button>
            </div>
          </article>

          {/* Plano Inteligente (Economico12) */}
          <article
            className={`group rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl min-h-[360px] sm:min-h-[440px] md:min-h-[560px] p-5 md:p-8 lg:p-10 flex flex-col snap-center shrink-0 min-w-[calc(100%-2rem)] sm:min-w-[70%] md:min-w-0 break-words touch-pan-y ${selected==='Economico12' ? 'bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)] text-white border-transparent ring-2 ring-white/20 shadow-2xl' : 'bg-white border-line text-ink shadow-soft'} `}
            role="radio" aria-checked={selected==='Economico12'} tabIndex={0}
            onKeyDown={(e)=>handleKey(e,'Economico12')}
            onClick={()=>onSelect?.('Economico12')}
            aria-label="Plano Inteligente (Mais popular)"
          >
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">Plano Inteligente</h3>
                <p className={`text-sm mt-1 ${selected==='Economico12' ? 'text-white/80' : 'text-ink/60'}`}>Bom desconto, baixa fidelidade</p>
              </div>
              {selected==='Economico12' && (
                <span className="text-xs text-[color:var(--brand-accent)]">Selecionado</span>
              )}
            </div>
            <div className="mt-5">
              <div className={`text-sm ${selected==='Economico12' ? 'text-white/80' : 'text-muted'}`}>Desconto</div>
              <div className={`text-5xl font-bold leading-tight ${selected==='Economico12' ? 'text-white' : 'text-[color:var(--brand-accent)]'}`}>até 30%</div>
              <div className={`text-sm mt-2 ${selected==='Economico12' ? 'text-white/80' : 'text-ink/70'}`}>Prazo: 12 meses</div>
            </div>
            <p className={`mt-5 text-base ${selected==='Economico12' ? 'text-white/90' : 'text-ink/80'}`}>Ganhe até 30% de desconto com apenas 12 meses de fidelidade.</p>
            <div className={`mt-5 flex gap-2 text-xs ${selected==='Economico12' ? 'text-white/80' : 'text-ink/70'}`}>
              <span className={`${selected==='Economico12' ? 'px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90' : 'px-2 py-1 rounded-full bg-line/60'}`}>Melhor custo-benefício</span>
              <span className={`${selected==='Economico12' ? 'px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90' : 'px-2 py-1 rounded-full bg-line/60'}`}>Adesão rápida</span>
            </div>
            <div className="mt-5 text-sm space-y-1">
              <div className={`${selected==='Economico12' ? 'text-white/90' : 'text-ink/90'}`}><b>Desconto:</b> 25% a 30%</div>
              <div className={`${selected==='Economico12' ? 'text-white/90' : 'text-ink/90'}`}><b>Prazo:</b> 12 meses</div>
            </div>
            <div className="mt-auto">
              <button className="btn btn-primary mt-8 w-full" onClick={(e)=>{e.stopPropagation(); onSelect?.('Economico12')}} data-testid={`select-plan-Economico12`}>
                Quero até 30% de desconto
              </button>
            </div>
          </article>

          {/* Plano Premium (Premium36) */}
          <article
            className={`group rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl min-h-[360px] sm:min-h-[440px] md:min-h-[520px] p-5 md:p-8 lg:p-10 flex flex-col snap-center shrink-0 min-w-[calc(100%-2rem)] sm:min-w-[70%] md:min-w-0 break-words touch-pan-y ${selected==='Premium36' ? 'bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)] text-white border-transparent ring-2 ring-white/20 shadow-2xl' : 'bg-white border-line text-ink shadow-soft'} `}
            role="radio" aria-checked={selected==='Premium36'} tabIndex={0}
            onKeyDown={(e)=>handleKey(e,'Premium36')}
            onClick={()=>onSelect?.('Premium36')}
            aria-label="Plano Premium (Melhor preço)"
          >
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">Plano Premium</h3>
                <p className={`text-sm mt-1 ${selected==='Premium36' ? 'text-white/80' : 'text-ink/60'}`}>Máximo desconto, fidelidade longa</p>
              </div>
              {selected==='Premium36' && (
                <span className="text-xs text-[color:var(--brand-accent)]">Selecionado</span>
              )}
            </div>
            <div className="mt-5">
              <div className={`text-sm ${selected==='Premium36' ? 'text-white/80' : 'text-muted'}`}>Desconto</div>
              <div className={`text-5xl font-bold leading-tight ${selected==='Premium36' ? 'text-white' : 'text-[color:var(--brand-accent)]'}`}>até 45%</div>
              <div className={`text-sm mt-2 ${selected==='Premium36' ? 'text-white/80' : 'text-ink/70'}`}>Prazo: 36 meses</div>
            </div>
            <p className={`mt-5 text-base ${selected==='Premium36' ? 'text-white/90' : 'text-ink/80'}`}>Até 45% de desconto garantido para quem quer o máximo de economia.</p>
            <div className={`mt-5 flex gap-2 text-xs ${selected==='Premium36' ? 'text-white/80' : 'text-ink/70'}`}>
              <span className={`${selected==='Premium36' ? 'px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90' : 'px-2 py-1 rounded-full bg-line/60'}`}>Máxima economia</span>
              <span className={`${selected==='Premium36' ? 'px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90' : 'px-2 py-1 rounded-full bg-line/60'}`}>Previsibilidade</span>
            </div>
            <div className="mt-5 text-sm space-y-1">
              <div className={`${selected==='Premium36' ? 'text-white/90' : 'text-ink/90'}`}><b>Desconto:</b> 30% a 45%*</div>
              <div className={`${selected==='Premium36' ? 'text-white/90' : 'text-ink/90'}`}><b>Prazo:</b> 36 meses</div>
            </div>
            <div className="mt-auto">
              <button className="btn btn-primary mt-8 w-full" onClick={(e)=>{e.stopPropagation(); onSelect?.('Premium36')}} data-testid={`select-plan-Premium36`}>
                Quero até 45% de economia
              </button>
            </div>
          </article>
          </div>
          <div className="md:hidden mt-4 flex items-center justify-center gap-2">
            {PLANS.map((_, i)=>(
              <span key={i} className={`inline-block w-2 h-2 rounded-full ${i===activeIdx ? 'bg-[color:var(--brand-accent)]' : 'bg-line'}`} />
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <a href="#leadform" className="btn btn-primary px-7 py-3">Descubra quanto você pode economizar</a>
        </div>
      </div>
    </section>
  )
}
