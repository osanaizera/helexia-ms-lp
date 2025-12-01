export default function Testimonials() {
    const testimonials = [
        {
            name: "Marco Antonio Azenha Milani",
            type: "Cliente", // Placeholder type
            text: "Pessoas sérias, muito competentes e focadas no andamento do projeto. Muito fácil estabelecer uma grande relação de confiança. Primeiro projeto foi um..."
        },
        {
            name: "Jose das Graças Souza Duarte",
            type: "Cliente", // Placeholder type
            text: "Empresa idônea, presta um bom serviço com bons profissionais!!!!"
        },
        {
            name: "Renan Disner",
            type: "Cliente", // Placeholder type
            text: "Excelente! Ótimo atendimento em todos os sentidos! Parabéns 👏🏻"
        }
    ]

    return (
        <section className="py-16 bg-bg">
            <div className="container-pad">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="section-title">Quem economiza com a Sion, recomenda</h2>
                    <p className="section-sub">Mais de 12 mil empresas já confiam na Sion Energia.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="card p-8 flex flex-col h-full">
                            <div className="flex-1">
                                <div className="flex gap-1 mb-4 text-[color:var(--brand-accent)]">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="text-ink/80 italic">"{t.text}"</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-line">
                                <div className="font-bold text-lg">{t.name}</div>
                                <div className="text-sm text-muted">{t.type}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
