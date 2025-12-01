export default function HowItWorks() {
  return (
    <section className="py-16 bg-bg">
      <div className="container-pad">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-title">Como você economiza sem complicação</h2>
          <p className="section-sub text-lg">Em 3 passos simples, sua empresa começa a pagar menos:</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[color:var(--brand)]/20 via-[color:var(--brand-accent)]/40 to-[color:var(--brand)]/20 -z-0" />

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-2xl bg-white border border-line shadow-soft flex items-center justify-center mb-6 z-10 group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl">☀️</span>
            </div>
            <h3 className="text-xl font-bold mb-3">1. Geramos energia limpa</h3>
            <p className="text-muted text-sm leading-relaxed">
              Usinas da Sion no MS injetam energia na rede da Energisa normalmente.
            </p>
          </div>

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-2xl bg-white border border-line shadow-soft flex items-center justify-center mb-6 z-10 group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-xl font-bold mb-3">2. Você recebe créditos</h3>
            <p className="text-muted text-sm leading-relaxed">
              Créditos de energia reduzem automaticamente sua fatura mensal.
            </p>
          </div>

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-2xl bg-white border border-line shadow-soft flex items-center justify-center mb-6 z-10 group-hover:scale-110 transition-transform duration-300">
              <span className="text-4xl">💰</span>
            </div>
            <h3 className="text-xl font-bold mb-3">3. Você economiza</h3>
            <p className="text-muted text-sm leading-relaxed">
              Sem equipamentos, sem obras, sem trocar de distribuidora.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => { document.getElementById('leadform')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="btn btn-outline-blue px-8 py-3 rounded-full hover:bg-[color:var(--brand-accent)] hover:border-[color:var(--brand-accent)] hover:text-white transition-all"
          >
            Ver quanto posso economizar
          </button>
        </div>
      </div>
    </section>
  )
}
