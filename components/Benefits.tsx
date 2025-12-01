export default function Benefits() {
    const benefits = [
        {
            title: "Economia real e comprovada",
            desc: "Redução de até 40% sem gastar nada para começar.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        },
        {
            title: "Flexibilidade sem compromisso",
            desc: "Plano Livre sem fidelidade e planos com fidelidade para descontos maiores.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            )
        },
        {
            title: "Processo 100% digital",
            desc: "Simulação → contrato, tudo online em ~10 minutos.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            )
        },
        {
            title: "Atendimento humano",
            desc: "Consultores reais, sem chatbots.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            )
        },
        {
            title: "Energia limpa local",
            desc: "Usinas no Mato Grosso do Sul garantem energia local e sustentável.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        }
    ]

    return (
        <section className="py-16 bg-white">
            <div className="container-pad">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 flex flex-col justify-center">
                        <h2 className="section-title mb-4">Por que escolher a Sion?</h2>
                        <p className="text-muted text-lg">
                            Mais do que economia, oferecemos uma experiência transparente, segura e 100% digital.
                        </p>
                        <div className="mt-8">
                            <a href="#leadform" className="btn btn-primary">Começar agora</a>
                        </div>
                    </div>
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl border border-line hover:border-[color:var(--brand-accent)] transition-colors group">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-[color:var(--brand)]/5 text-[color:var(--brand-accent)] flex items-center justify-center group-hover:bg-[color:var(--brand-accent)] group-hover:text-white transition-colors">
                                    {b.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{b.title}</h3>
                                    <p className="text-sm text-muted mt-1">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
