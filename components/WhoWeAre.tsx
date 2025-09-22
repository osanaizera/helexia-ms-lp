// Coherent, minimal icons for bullets
function IGlobe({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2c3 3 3 17 0 20m0-20c-3 3-3 17 0 20" />
    </svg>
  )
}
function IPin({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 10c0 5-9 12-9 12S3 15 3 10a9 9 0 1 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function IBolt({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z" />
    </svg>
  )
}
function ICheck({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
function IHandshake({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 12l3 3m-3-3l-3 3M2 12l4-4 6 6 6-6 4 4" />
    </svg>
  )
}
function IChart({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 3v18h18" />
      <rect x="6" y="11" width="3" height="6" />
      <rect x="11" y="7" width="3" height="10" />
      <rect x="16" y="9" width="3" height="8" />
    </svg>
  )
}
function IShield({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}
function IClock({ className='' }){
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

export default function WhoWeAre(){
  return (
    <section className="bg-white" aria-labelledby="about-heading">
      <div className="container-pad py-12">
        <h2 id="about-heading" className="section-title">Quem Somos</h2>
        <p className="section-sub">Helexia e Sion: solidez global e gestão local para sua economia</p>

        {/* Helexia */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-xl font-bold">Sobre a Helexia</h3>
            <p className="mt-3 text-sm text-ink/80">
              A Helexia é uma multinacional francesa fundada em 2010, integrante do Grupo Mulliez, o mesmo que controla marcas globais como Leroy Merlin e Decathlon. Atuamos em mais de 10 países e fazemos parte do grupo energético Voltalia, com presença relevante no setor de energias renováveis.
            </p>
            <p className="mt-3 text-sm text-ink/80">
              No Brasil, investimos em usinas próprias no Mato Grosso do Sul, oferecendo energia limpa, sem investimento inicial e com economia imediata para empresas e consumidores.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2"><IGlobe className="text-[color:var(--brand-accent)]" /><span>Solidez global e presença em diversos países</span></li>
              <li className="flex items-start gap-2"><IPin className="text-[color:var(--brand-accent)]" /><span>Operação local no MS com usinas próprias</span></li>
              <li className="flex items-start gap-2"><IBolt className="text-[color:var(--brand-accent)]" /><span>Energia limpa com desconto imediato</span></li>
              <li className="flex items-start gap-2"><ICheck className="text-[color:var(--brand-accent)]" /><span>Experiência apoiando marcas líderes</span></li>
            </ul>
          </div>
          <div className="flex flex-col items-center gap-4">
            <img src="/images/logohlx.png" alt="Helexia" className="h-10 w-auto" />
            <div className="text-xs text-muted">do mesmo grupo que</div>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <img src="/images/logoleroy.png" alt="Leroy Merlin" className="h-36 w-auto" />
              <img src="/images/logodecathlon.png" alt="Decathlon" className="h-36 w-auto" />
              <img src="/images/logovoltalia.png" alt="Voltalia" className="h-36 w-auto" />
            </div>
          </div>
        </div>

        {/* Sion Energia */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="order-2 md:order-1 flex flex-col items-center gap-4">
            <img src="/images/logosion.png" alt="Sion Energia" className="h-48 w-auto" />
          </div>
          <div className="order-1 md:order-2 rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(32,178,142,0.08), rgba(15,42,47,0.06))' }}>
            <h3 className="text-xl font-bold">Sobre a Sion Energia</h3>
            <p className="mt-3 text-sm text-ink/80">
              A Sion Energia é uma empresa brasileira especializada na gestão e comercialização de energia. Atuamos no modelo de consórcio/cooperativa, administrando cadastros, alocação de energia e relacionamento direto com distribuidoras.
            </p>
            <p className="mt-3 text-sm text-ink/80">
              Somos o parceiro local que garante que a energia gerada nas usinas da Helexia chegue até você de forma simples, eficiente e transparente. Cuidamos da operação e da gestão contratual para que sua única preocupação seja aproveitar a economia.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2"><IHandshake className="text-[color:var(--brand-accent)]" /><span>Gestão local e atendimento próximo no MS</span></li>
              <li className="flex items-start gap-2"><IChart className="text-[color:var(--brand-accent)]" /><span>Experiência em consórcios/cooperativas de energia</span></li>
              <li className="flex items-start gap-2"><IShield className="text-[color:var(--brand-accent)]" /><span>Transparência na execução dos contratos</span></li>
              <li className="flex items-start gap-2"><IClock className="text-[color:var(--brand-accent)]" /><span>Agilidade operacional para empresas e residenciais</span></li>
            </ul>
            <div className="mt-4 text-xs text-muted bg-white/70 border border-line rounded-2xl p-3">
              Na prática: a Helexia gera a energia em suas usinas, e a Sion garante que ela seja gerida e distribuída até a sua fatura.
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-ink/80">
          Helexia e Sion juntas: energia limpa, gestão transparente, economia com responsabilidade.
        </div>
      </div>
    </section>
  )
}
