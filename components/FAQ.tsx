export default function FAQ() {
    return (
        <section className="container-pad py-16 bg-white">
            <h2 className="section-title text-center mb-10">Perguntas Frequentes</h2>
            <div className="max-w-3xl mx-auto space-y-4">
                <details className="card group">
                    <summary className="p-6 font-bold cursor-pointer list-none flex justify-between items-center">
                        Preciso instalar placas solares?
                        <span className="transition-transform group-open:rotate-180">
                            <svg className="w-6 h-6 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-muted leading-relaxed">
                        Não. A Sion Energia opera no modelo de geração compartilhada. Nós produzimos a energia em nossas usinas solares no Mato Grosso do Sul e injetamos na rede da distribuidora. Você recebe os créditos na sua fatura e economiza sem precisar fazer obras ou investimentos.
                    </div>
                </details>

                <details className="card group">
                    <summary className="p-6 font-bold cursor-pointer list-none flex justify-between items-center">
                        A economia é garantida?
                        <span className="transition-transform group-open:rotate-180">
                            <svg className="w-6 h-6 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-muted leading-relaxed">
                        Sim. O desconto é garantido em contrato sobre a energia injetada. Se por algum motivo técnico não houver injeção de energia, você paga apenas o valor normal da distribuidora, sem prejuízo. Mas com nossas usinas operando, a economia é certa.
                    </div>
                </details>

          <details className="group border border-line rounded-2xl bg-white overflow-hidden">
            <summary className="p-6 font-bold cursor-pointer list-none flex justify-between items-center">
              <span>Existe fidelidade no contrato?</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="p-6 pt-0 text-muted leading-relaxed">
              Depende do plano escolhido. No <strong>Plano Livre</strong>, não há fidelidade e você pode cancelar a qualquer momento sem multa, apenas com aviso prévio. Nos planos com fidelidade (Prata e Ouro), há um período mínimo de permanência em troca de descontos maiores.
            </div>
          </details>

                <details className="card group">
                    <summary className="p-6 font-bold cursor-pointer list-none flex justify-between items-center">
                        Quando começo a economizar?
                        <span className="transition-transform group-open:rotate-180">
                            <svg className="w-6 h-6 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-muted leading-relaxed">
                        Após a adesão digital, o prazo regulatório para a distribuidora processar o cadastro é de até 60 dias, mas geralmente ocorre antes. Assim que o cadastro for efetivado, você começará a receber os créditos na fatura seguinte.
                    </div>
                </details>

                <details className="card group">
                    <summary className="p-6 font-bold cursor-pointer list-none flex justify-between items-center">
                        Meus dados estão protegidos?
                        <span className="transition-transform group-open:rotate-180">
                            <svg className="w-6 h-6 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-muted leading-relaxed">
                        Sim, 100%. Seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD). Seus dados são utilizados exclusivamente para a formalização do contrato e gestão dos seus créditos de energia.
                    </div>
                </details>

                <details className="card group">
                    <summary className="p-6 font-bold cursor-pointer list-none flex justify-between items-center">
                        Continuo recebendo energia da Energisa MS?
                        <span className="transition-transform group-open:rotate-180">
                            <svg className="w-6 h-6 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-muted leading-relaxed">
                        Sim. A distribuição física da energia continua sendo feita pela Energisa MS. A Sion injeta energia na rede e você recebe isso como crédito financeiro na sua conta. Em caso de falta de luz, você continua acionando a Energisa normalmente.
                    </div>
                </details>
            </div>
        </section>
    )
}
