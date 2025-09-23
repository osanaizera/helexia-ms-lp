export default function Hero({ onPrimaryCTAClick }: { onPrimaryCTAClick?: () => void }){
  return (
    <section
      className="relative"
      style={{
        backgroundImage: 'url(/images/hero-ms-solar.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      aria-label="Helexia — Energia solar no MS"
    >
      <div className="highlight-gradient absolute inset-0" aria-hidden="true" />
      <div className="container-pad pt-24 pb-16 md:pt-32 md:pb-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-3 py-1 text-sm mb-4">
            <span className="block w-2 h-2 rounded-full bg-[color:var(--brand-accent)]" aria-hidden />
            <span>Mato Grosso do Sul</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Economize <span className="text-gradient">até 45%</span> na sua conta de energia no Mato Grosso do Sul
          </h1>
          <p className="mt-4 text-white/90 text-lg">
            Sem investimento inicial. Energia limpa e local, direto de nossas usinas no MS.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <button className="btn btn-primary text-base px-8 py-3 rounded-full" onClick={()=>{
              const el = document.getElementById('leadform'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              onPrimaryCTAClick?.()
            }} data-testid="cta-simular">
              Simular minha economia agora
            </button>
          </div>
          <p className="mt-3 text-xs text-white/70">Sujeito à disponibilidade na região.</p>
        </div>
      </div>
    </section>
  )
}
