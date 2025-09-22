const PLANTS = [
  {name:'Cassilândia I',  city:'MS', img:'/images/CassilandiaI.jpeg'},
  {name:'Cassilândia II', city:'MS', img:'/images/CassilandiaII.jpeg'},
  {name:'Bacuri',         city:'MS', img:'/images/Bacuri.jpeg'},
  {name:'Barro Branco',   city:'MS', img:'/images/BarroBranco.jpeg'},
]

export default function Plants(){
  return (
    <section className="container-pad py-12" aria-labelledby="plants-heading">
      <h2 id="plants-heading" className="section-title">Nossas Usinas no MS</h2>
      <p className="section-sub">Energia 100% gerada em Mato Grosso do Sul</p>
      <p className="mt-2 text-sm text-muted max-w-3xl">Nossas usinas em Cassilândia, Bacuri e outras cidades garantem fornecimento local, limpo e renovável.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANTS.map(p => (
          <article key={p.name} className="card overflow-hidden relative">
            <div className="aspect-[4/3] bg-line relative">
              <img src={p.img} alt={`Usina ${p.name} — Mato Grosso do Sul`} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-[color:var(--brand-accent)]/10" aria-hidden />
            </div>
            <span className="absolute top-3 left-3 text-xs bg-[color:var(--brand-accent)] text-white px-3 py-1 rounded-full shadow-soft">100% energia do MS</span>
            <div className="card-body">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-xs text-muted">Mato Grosso do Sul</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href="#leadform" className="btn btn-primary px-7 py-3">Veja como nossa energia local pode reduzir sua conta</a>
      </div>
    </section>
  )
}
