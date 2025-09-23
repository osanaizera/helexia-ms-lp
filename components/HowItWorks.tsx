export default function HowItWorks(){
  const steps = [
    {
      title: 'Geração local (Helexia)',
      body: 'A Helexia projeta, constrói e opera usinas solares no Mato Grosso do Sul. As usinas já estão prontas e gerando energia — você não precisa investir em equipamentos ou obras.'
    },
    {
      title: 'Gestão do consórcio/cooperativa (Sion)',
      body: 'A Sion administra o consórcio/cooperativa: realiza o cadastro, gerencia os participantes e a alocação da energia gerada, além de organizar a comercialização junto à distribuidora.'
    },
    {
      title: 'Créditos de energia na sua fatura',
      body: 'A energia gerada é convertida em créditos e lançada na sua fatura oficial da distribuidora (TE+TUSD). Isso reduz o valor que você pagaria à tarifa cheia.'
    },
    {
      title: 'Você paga menos — sem investimento',
      body: 'Você paga pela energia com um desconto predefinido no plano escolhido. A diferença entre a tarifa cheia e o valor com desconto é a sua economia mensal.'
    }
  ]

  return (
    <section className="bg-white" aria-labelledby="how-heading">
      <div className="container-pad py-12">
        <h2 id="how-heading" className="section-title">Como funciona a sua economia</h2>
        <p className="section-sub">Helexia + Sion: geração local e gestão do consórcio/cooperativa</p>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src="/images/logohlx.png" alt="Helexia" className="h-8 sm:h-9 md:h-10 lg:h-12 max-w-full object-contain" />
            <span className="text-muted text-sm">parceria</span>
            <img src="/images/logosion.png" alt="Sion" className="h-8 sm:h-9 md:h-10 lg:h-12 max-w-full object-contain" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <article key={s.title} className="card rounded-3xl p-6 h-full">
              <div className="w-8 h-8 rounded-full bg-[color:var(--brand-accent)] text-white flex items-center justify-center font-semibold mb-4">
                {i+1}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-ink/80">{s.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-sm text-muted max-w-3xl">
          <p>
            Este modelo é conhecido como geração compartilhada (consórcio/cooperativa), regulamentado no Brasil. A energia é gerada nas usinas da Helexia e a Sion faz a gestão dos participantes e da comercialização, enquanto a distribuidora lança os créditos diretamente na sua fatura. Assim, você passa a pagar menos, sem instalar nada no seu imóvel.
          </p>
        </div>

        <div className="mt-8 text-center">
          <a href="#leadform" className="btn btn-primary px-7 py-3 rounded-full">Quero participar e economizar</a>
        </div>
      </div>
    </section>
  )
}
