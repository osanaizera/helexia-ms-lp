export default function Hero({ onPrimaryCTAClick }: { onPrimaryCTAClick?: () => void }) {
  return (
    <section
      className="relative"
      style={{
        backgroundImage: 'url(/images/hero-ms-solar.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      aria-label="Sion — Energia solar no MS"
    >
      <div className="highlight-gradient absolute inset-0" aria-hidden="true" />
      <div className="container-pad pt-24 pb-16 md:pt-32 md:pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-3 py-1 text-sm mb-6">
            <span className="block w-2 h-2 rounded-full bg-[color:var(--brand-accent)]" aria-hidden />
            <span>Mato Grosso do Sul</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Reduza <span className="text-[color:var(--brand-accent)]">até 40%</span> da sua conta de energia sem obras, sem investimento e com energia 100% limpa.
          </h1>
          <p className="mt-6 text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
            Empresas no Mato Grosso do Sul estão economizando em média até 40% por mês com a Sion, sem instalar nada, com adesão 100% digital e energia produzida no próprio estado.
          </p>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:text-base text-white/90 font-medium">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Economia de até 40% na fatura
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Sem investimento e sem obras
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Adesão 100% digital em &lt; 10 min
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Atendimento humano
            </li>
          </ul>

          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <button className="btn btn-primary text-lg px-8 py-4 rounded-full shine-sweep shadow-xl hover:scale-105 transition-transform" onClick={() => {
              const el = document.getElementById('leadform'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              onPrimaryCTAClick?.()
            }} data-testid="cta-simular">
              Calcular minha economia agora
            </button>
            <p className="text-xs text-white/70 max-w-md">
              Mais de 12 mil empresas economizam com a Sion em todo o Brasil. Sujeito à disponibilidade na região e perfil de consumo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
