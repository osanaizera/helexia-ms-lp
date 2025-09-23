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
          <details className="card"><summary className="p-4 font-medium">Posso cancelar quando quiser?</summary><div className="card-body pt-0">Sim, no Plano Flexível você pode cancelar a qualquer momento sem multa. Nos demais planos há fidelidade conforme oferta.</div></details>
          <details className="card"><summary className="p-4 font-medium">Preciso investir em placas solares?</summary><div className="card-body pt-0">Não. Você não precisa instalar nada. A energia vem das nossas usinas e vira desconto na sua fatura.</div></details>
          <details className="card"><summary className="p-4 font-medium">Como funciona a fidelidade?</summary><div className="card-body pt-0">O Plano Econômico tem fidelidade de 12 meses. O Plano Máximo de 24 a 36 meses. O Plano Flexível não tem fidelidade.</div></details>
          <details className="card"><summary className="p-4 font-medium">Minha conta precisa ser maior que R$ 500?</summary><div className="card-body pt-0">Sim, atualmente atendemos contas a partir de R$ 500/mês no MS.</div></details>
          <details className="card"><summary className="p-4 font-medium">De onde vem a energia?</summary><div className="card-body pt-0">De nossas usinas no Mato Grosso do Sul, com geração 100% renovável.</div></details>
          <details className="card"><summary className="p-4 font-medium">Meus dados estão protegidos?</summary><div className="card-body pt-0">Sim. Seguimos a LGPD e utilizamos práticas de segurança para proteger suas informações.</div></details>
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
