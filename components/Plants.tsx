"use client"
import { useRef } from 'react'

export default function Plants() {
  const plants = [
    { name: 'Cassilândia I', loc: 'Cassilândia, MS', src: '/images/CassilandiaI.jpeg' },
    { name: 'Cassilândia II', loc: 'Cassilândia, MS', src: '/images/CassilandiaII.jpeg' },
    { name: 'Paranaíba', loc: 'Paranaíba, MS', src: '/images/Bacuri.jpeg' },
    { name: 'Barro Branco', loc: 'Paranaíba, MS', src: '/images/BarroBranco.jpeg' },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-pad">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Energia produzida aqui, no Mato Grosso do Sul</h2>
          <p className="mt-4 text-muted text-lg">
            Usinas em Cassilândia I e II, Paranaíba e Bacuri geram energia 100% limpa e renovável.
            A economia movimenta a economia local e fortalece a região.
          </p>
        </div>

        <div className="relative flex w-full overflow-hidden mask-linear-gradient">
          <div className="flex animate-scroll min-w-full shrink-0 items-center justify-around gap-16 px-8">
            {plants.map((p, i) => (
              <div key={i} className="snap-center shrink-0 w-[280px] rounded-3xl overflow-hidden shadow-soft group relative aspect-[4/3]">
                <img src={p.src} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="text-sm opacity-90 mt-1">{p.loc}</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[color:var(--brand-accent)]" />
                    Em operação
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex animate-scroll min-w-full shrink-0 items-center justify-around gap-16 px-8" aria-hidden="true">
            {plants.map((p, i) => (
              <div key={i} className="snap-center shrink-0 w-[280px] rounded-3xl overflow-hidden shadow-soft group relative aspect-[4/3]">
                <img src={p.src} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="text-sm opacity-90 mt-1">{p.loc}</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[color:var(--brand-accent)]" />
                    Em operação
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { document.getElementById('leadform')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="btn btn-outline-blue px-8 py-3 rounded-full hover:bg-[color:var(--brand-accent)] hover:border-[color:var(--brand-accent)] hover:text-white transition-all"
          >
            Ver se atendemos sua cidade
          </button>
        </div>
      </div>
    </section>
  )
}
