"use client"
import { useRef } from 'react'

const PLANTS = [
  {name:'Cassilândia I',       city:'Cassilândia',  img:'/images/CassilandiaI.jpeg'},
  {name:'Cassilândia II',      city:'Cassilândia',  img:'/images/CassilandiaII.jpeg'},
  {name:'Bacuri',              city:'Paranaíba',    img:'/images/Bacuri.jpeg'},
  {name:'Barro Branco',        city:'Paranaíba',    img:'/images/BarroBranco.jpeg'},
  {name:'Paraíso das Águas',   city:'Paraíso das Águas', img:'/images/paraisoDasAguas.jpeg'},
]

export default function Plants(){
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollByCards = (dir: 'prev'|'next') => {
    const el = trackRef.current
    if(!el) return
    const amount = el.clientWidth * 0.45 // ~2.2 cards per viewport
    el.scrollBy({ left: dir==='next' ? amount : -amount, behavior: 'smooth' })
  }
  return (
    <section className="container-pad py-12" aria-labelledby="plants-heading">
      <h2 id="plants-heading" className="section-title">Nossas Usinas no MS</h2>
      <p className="section-sub">Energia 100% gerada em Mato Grosso do Sul</p>
      <p className="mt-2 text-sm text-muted max-w-3xl">Nossas usinas em Cassilândia, Paranaíba e Paraíso das Águas garantem fornecimento local, limpo e renovável.</p>

      <div className="relative mt-6">
        <button
          type="button"
          aria-label="Anterior"
          className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 border border-line shadow-soft absolute -left-3 top-1/2 -translate-y-1/2 z-10"
          onClick={()=>scrollByCards('prev')}
        >
          <span className="text-xl">‹</span>
        </button>
        <div ref={trackRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth">
          {PLANTS.map(p => (
            <article key={p.name} className="card overflow-hidden relative flex-shrink-0 basis-[85%] sm:basis-[60%] md:basis-[48%] lg:basis-[44%] snap-start">
              <div className="h-56 sm:h-64 bg-line relative">
                <img src={p.img} alt={`Usina ${p.name} — ${p.city} - MS`} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-[color:var(--brand)]/5" aria-hidden />
              </div>
              <span className="absolute top-3 left-3 text-xs bg-[color:var(--brand-accent)] text-white px-3 py-1 rounded-full shadow-soft">100% energia do MS</span>
              <div className="card-body">
                <h3 className="text-base font-semibold">{p.name}</h3>
                <p className="text-xs text-muted">{p.city} - MS</p>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          aria-label="Próximo"
          className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 border border-line shadow-soft absolute -right-3 top-1/2 -translate-y-1/2 z-10"
          onClick={()=>scrollByCards('next')}
        >
          <span className="text-xl">›</span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <a href="#leadform" className="btn btn-primary px-7 py-3">Veja como nossa energia local pode reduzir sua conta</a>
      </div>
    </section>
  )
}
