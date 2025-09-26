"use client"
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage(){
  const sp = useSearchParams()
  const plan = (sp.get('plan')||'').toString() as 'Flex'|'Economico12'|'Premium36'
  const bill = Number(sp.get('bill')||0)
  const pct = Number(sp.get('pct')||0)

  const planLabel = plan === 'Flex' ? 'Sem fidelidade' : plan === 'Economico12' ? '12 meses' : plan === 'Premium36' ? '24 meses' : ''

  useEffect(()=>{
    try{
      const dbg = process.env.NEXT_PUBLIC_GA_DEBUG === '1'
      ;(window as any)?.gtag?.('event','page_view', { page_title: 'Formulário Enviado', page_location: window.location.href, ...(dbg ? { debug_mode: true } : {}) })
    }catch{}
  },[])

  return (
    <main>
      <section className="container-pad py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Obrigado! Recebemos seus dados.</h1>
          <p className="mt-3 text-ink/80">Nossa equipe entrará em contato em breve para enviar sua proposta.</p>

          {(bill>0 || pct>0 || planLabel) && (
            <div className="mt-8 card"><div className="card-body">
              <h2 className="text-xl font-semibold">Resumo</h2>
              <ul className="mt-3 text-ink/80 space-y-1">
                {planLabel && (<li><b>Plano:</b> {planLabel}</li>)}
                {bill>0 && (<li><b>Fatura informada:</b> {bill.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</li>)}
                {pct>0 && (<li><b>Desconto estimado:</b> {pct}%</li>)}
              </ul>
            </div></div>
          )}

          <div className="mt-10 flex items-center justify-center gap-3">
            <a className="btn btn-primary" href="/">Voltar para a página inicial</a>
            <a className="btn btn-ghost" href="#leadform">Fazer nova simulação</a>
          </div>
        </div>
      </section>
    </main>
  )
}

