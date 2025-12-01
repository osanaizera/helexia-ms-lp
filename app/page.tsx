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
import Benefits from '@/components/Benefits'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import { useEffect, useState } from 'react'
import { gtmPush } from '@/lib/gtm'

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState<'Livre' | 'Prata' | 'Ouro'>('Prata')

  useEffect(() => { gtmPush({ event: 'lp_view' }) }, [])

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Sion',
            url: 'https://suacontamenor.com.br',
          })
        }}
      />
      <Hero onPrimaryCTAClick={() => {
        const el = document.getElementById('simulador');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }} />

      <SocialProof />
      <ClientLogos />
      <HowItWorks />
      <Benefits />

      <Plans onSelect={(p) => setSelectedPlan(p)} selected={selectedPlan} />
      <LeadForm initialPlan={selectedPlan} />
      <WhoWeAre />
      <Plants />

      <Testimonials />
      <FAQ />

      <section className="container-pad py-16">
        <div className="rounded-3xl bg-[color:var(--brand)] text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comece a economizar agora!</h2>
            <p className="text-lg text-white/90 mb-8">
              Operação em expansão no MS. Processo digital, leva menos de 10 minutos.
              Economia de até 40% ainda no mês.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a href="#leadform" className="btn btn-primary px-10 py-4 text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                Garantir minha economia agora
              </a>
              <p className="text-sm text-white/60">Sem obras. Sem investimento. Sem complicação.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </main>
  )
}
