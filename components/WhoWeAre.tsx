export default function WhoWeAre() {
  return (
    <section className="py-16 bg-bg">
      <div className="container-pad">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title">Sion Energia: confiança, tecnologia e transparência</h2>
            <p className="text-lg text-[color:var(--brand-accent)] font-medium mt-2">Desde 2019 conectando empresas a energia limpa e acessível.</p>

            <div className="mt-6 space-y-4 text-muted">
              <p>
                Presente em 15 estados, +12 mil clientes e +85 usinas, a Sion é uma das maiores empresas de energia por assinatura do país.
              </p>
              <p>
                Usinas locais garantem energia produzida no MS e suporte dedicado. Sem obras, sem investimentos, com total segurança jurídica.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-[color:var(--brand)]">+12 mil</div>
                <div className="text-sm text-muted">clientes ativos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[color:var(--brand)]">+R$ 1,1 bi</div>
                <div className="text-sm text-muted">em investimentos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[color:var(--brand)]">+85</div>
                <div className="text-sm text-muted">usinas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[color:var(--brand)]">15</div>
                <div className="text-sm text-muted">estados com presença ativa</div>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <img src="/images/hero-ms-solar.png" alt="Usinas Sion" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <div className="font-bold text-xl">Energia do MS para o MS</div>
                <div className="text-sm opacity-90">Usinas em Cassilândia e região</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
