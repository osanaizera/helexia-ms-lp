"use client"
import Hero from '@/components/Hero'
import Plans from '@/components/Plans'
import LeadForm from '@/components/LeadForm'
import Plants from '@/components/Plants'
import Footer from '@/components/Footer'
import SocialProof from '@/components/SocialProof'
import StickyCTA from '@/components/StickyCTA'
import ClientLogos from '@/components/ClientLogos'
import WhoWeAre from '@/components/WhoWeAre'
import HowItWorks from '@/components/HowItWorks'
import { useEffect, useState } from 'react'
import { gtmPush } from '@/lib/gtm'

export default function Page(){
  const [selectedPlan, setSelectedPlan] = useState<'Flex'|'Economico12'|'Premium36'>('Economico12')

  useEffect(()=>{ gtmPush({ event: 'lp_view' }) },[])

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Helexia',
          url: 'https://helexia-ms.example',
        }) }}
      />
      <Hero onPrimaryCTAClick={()=>{
        const el = document.getElementById('simulador');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }} />

      <SocialProof />
      <ClientLogos />
      <HowItWorks />

      <Plans onSelect={(p)=> setSelectedPlan(p)} selected={selectedPlan} />
      <LeadForm initialPlan={selectedPlan} />
      <WhoWeAre />
      <Plants />

      <section className="container-pad py-12 bg-bg">
        <h2 className="section-title">Perguntas Frequentes</h2>
        <div className="mt-6 space-y-3">
          <details className="card">
            <summary className="p-4 font-medium">Posso cancelar quando quiser?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>Depende do plano escolhido:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Flex</b>: sem fidelidade, você pode cancelar a qualquer momento.</li>
                <li><b>Econômico 12</b>: fidelidade de 12 meses, pois o desconto é maior.</li>
                <li><b>Premium 24–36</b>: fidelidade maior para o máximo desconto.</li>
              </ul>
              <p>O cancelamento pode ser solicitado por WhatsApp/telefone. Em planos com fidelidade, pode haver multa contratual proporcional ao período restante. O desligamento ocorre a partir do ciclo de faturamento seguinte (regras da distribuidora).</p>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">Preciso investir em placas solares?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>Não. Este é um modelo de <b>geração compartilhada</b> (consórcio/cooperativa): a energia é gerada em <b>usinas da Helexia</b> no MS e a <b>Sion</b> faz a gestão dos participantes. Você não precisa instalar nada no seu imóvel.</p>
              <p>Os <b>créditos de energia</b> são lançados diretamente na sua fatura oficial da distribuidora, reduzindo o valor que você pagaria à tarifa cheia.</p>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">Como funciona a fidelidade e por que existe?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>A fidelidade existe para viabilizar descontos maiores garantindo <b>previsibilidade</b> na alocação da energia gerada.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Flex</b>: 0 mês de fidelidade, desconto menor.</li>
                <li><b>Econômico</b>: 12 meses, desconto intermediário.</li>
                <li><b>Premium</b>: 24–36 meses, <b>maior desconto</b>.</li>
              </ul>
              <p>Em caso de saída antecipada dos planos com fidelidade, pode haver multa contratual proporcional. Os detalhes são apresentados na proposta.</p>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">Minha conta precisa ser maior que R$ 500?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>Sim. Atualmente atendemos contas a partir de <b>R$ 500/mês</b> no MS. Valores abaixo disso tendem a não cobrir custos administrativos e regras de alocação.</p>
              <p>Se sua fatura oscila, não tem problema — a alocação pode ser ajustada conforme o uso e disponibilidade.</p>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">De onde vem a energia e onde aparece o desconto?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>A energia vem de <b>usinas solares no Mato Grosso do Sul</b>. A Helexia gera, a Sion gerencia a alocação e a distribuidora lança os <b>créditos</b> na sua fatura.</p>
              <p>O desconto incide sobre a <b>parte de energia (TE+TUSD)</b>. <b>Impostos</b> como ICMS e PIS/COFINS <b>não sofrem redução</b>. Por isso mostramos a economia sobre a energia, e não sobre a fatura inteira.</p>
              <p>A forma exata de cobrança do plano e a visualização dos créditos são detalhadas na proposta e podem variar conforme distribuidora e modalidade contratada.</p>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">E se minha fatura variar mês a mês?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>É normal a fatura variar. A <b>alocação de energia</b> pode ser ajustada periodicamente, respeitando disponibilidade e regras operacionais.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Se consumir <b>acima</b> da alocação, parte pode ficar sem desconto naquele ciclo.</li>
                <li>Se consumir <b>abaixo</b>, créditos/ajustes seguem as regras vigentes da distribuidora e do contrato.</li>
              </ul>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">Quando começo a economizar?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>Após o cadastro e validação, a economia começa a aparecer <b>no ciclo de faturamento seguinte</b> ou no subsequente, conforme prazos da distribuidora e disponibilidade de alocação.</p>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">Quem pode participar?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>Consumidores <b>residenciais e empresariais</b> no MS, desde que dentro da área de atendimento e com dados compatíveis com a titularidade do ponto de consumo. A adesão está sujeita à análise e disponibilidade.</p>
            </div>
          </details>

          <details className="card">
            <summary className="p-4 font-medium">Meus dados estão protegidos?</summary>
            <div className="card-body pt-0 space-y-2 text-sm text-ink/90">
              <p>Sim. Seguimos a <b>LGPD</b> e utilizamos processos e ferramentas para proteger suas informações. Usamos seus dados exclusivamente para contato e elaboração de proposta, conforme nossa <a className="underline" href="/privacidade">Política de Privacidade</a>. Você pode solicitar a exclusão a qualquer momento.</p>
            </div>
          </details>
        </div>
      </section>

      <section className="container-pad py-12">
        <div className="card"><div className="card-body flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Pronto para economizar na sua conta?</h3>
            <p className="text-muted">Simule agora e descubra seu desconto.</p>
          </div>
          <a href="#leadform" className="btn btn-primary">Simular minha economia</a>
        </div></div>
      </section>

      <Footer />
      <StickyCTA />
    </main>
  )
}
