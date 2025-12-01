export default function SocialProof() {
  return (
    <section className="section-dark">
      <div className="container-pad py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Confiada por empresas de todos os portes no Brasil</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-4xl md:text-5xl font-bold text-[color:var(--brand-accent)]">+12 mil</div>
            <div className="mt-2 text-white/90 font-medium">unidades consumidoras ativas</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-4xl md:text-5xl font-bold text-[color:var(--brand-accent)]">+85</div>
            <div className="mt-2 text-white/90 font-medium">usinas solares em operação</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-4xl md:text-5xl font-bold text-[color:var(--brand-accent)]">15</div>
            <div className="mt-2 text-white/90 font-medium">estados com presença ativa</div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            A Sion Energia é referência nacional em energia por assinatura, com usinas próprias, presença regional e atendimento humanizado.
          </p>
        </div>
      </div>
    </section>
  )
}
