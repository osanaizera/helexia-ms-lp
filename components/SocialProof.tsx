export default function SocialProof(){
  return (
    <section className="section-dark">
      <div className="container-pad py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-[color:var(--brand-accent)]">+160 MWp</div>
            <div className="mt-2 text-white/80">já em operação no Brasil</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-[color:var(--brand-accent)]">+470 MWp</div>
            <div className="mt-2 text-white/80">instalados no mundo</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-[color:var(--brand-accent)]">+10</div>
            <div className="mt-2 text-white/80">países</div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90">LGPD Compliance</span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90">Energia 100% Renovável</span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90">Atendimento Local</span>
        </div>
      </div>
    </section>
  )
}
