function Icon({ path, size=18, className='' }: { path: string; size?: number; className?: string }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={path} />
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
              <li className="flex items-start gap-2"><Icon path="M12 2a10 10 0 1 0 0 20" className="text-[color:var(--brand-accent)]" /><span>Solidez global e presença em diversos países</span></li>
              <li className="flex items-start gap-2"><Icon path="M13 2H6a2 2 0 0 0-2 2v7m16 0V6a2 2 0 0 0-2-2h-3" className="text-[color:var(--brand-accent)]" /><span>Operação local no MS com usinas próprias</span></li>
              <li className="flex items-start gap-2"><Icon path="M13 12h8M13 18h8M3 6h18" className="text-[color:var(--brand-accent)]" /><span>Energia limpa com desconto imediato</span></li>
              <li className="flex items-start gap-2"><Icon path="M20 6L9 17l-5-5" className="text-[color:var(--brand-accent)]" /><span>Experiência apoiando marcas líderes</span></li>
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
              <li className="flex items-start gap-2"><Icon path="M12 2l4 8H8l4-8zm0 20l-4-8h8l-4 8z" className="text-[color:var(--brand-accent)]" /><span>Gestão local e atendimento próximo no MS</span></li>
              <li className="flex items-start gap-2"><Icon path="M3 3h18v4H3zM3 11h18v10H3z" className="text-[color:var(--brand-accent)]" /><span>Experiência em consórcios/cooperativas de energia</span></li>
              <li className="flex items-start gap-2"><Icon path="M3 12l2-2 4 4 10-10 2 2-12 12z" className="text-[color:var(--brand-accent)]" /><span>Transparência na execução dos contratos</span></li>
              <li className="flex items-start gap-2"><Icon path="M13 2H6a2 2 0 0 0-2 2v7m16 0V6a2 2 0 0 0-2-2h-3" className="text-[color:var(--brand-accent)]" /><span>Agilidade operacional para empresas e residenciais</span></li>
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
