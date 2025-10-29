"use client"
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function formatBRL(n:number){ return n.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' }) }

function NaoElegivelContent(){
  const sp = useSearchParams()
  const bill = Number(sp.get('bill')||0)

  useEffect(()=>{
    try{
      const dbg = process.env.NEXT_PUBLIC_GA_DEBUG === '1'
      ;(window as any)?.gtag?.('event','page_view', { page_title: 'Não Elegível', page_location: window.location.href, ...(dbg ? { debug_mode: true } : {}) })
    }catch{}
  },[])

  return (
    <main className="container-pad py-12">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-line bg-white">
          <div className="px-6 py-5 bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)] text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Ainda não podemos atender este valor de fatura</h1>
            <p className="text-white/90 mt-1">No momento, nosso produto atende contas a partir de R$ 500/mês.</p>
          </div>
          <div className="p-6 text-ink/90 space-y-4">
            {bill>0 && (
              <p>Você informou uma fatura média de <b>{formatBRL(bill)}</b>. Para garantir viabilidade operacional e financeira, nossa oferta é elegível para contas a partir de <b>R$ 500/mês</b>.</p>
            )}
            <p>Estamos expandindo continuamente nossa capacidade. Se desejar, você pode voltar à página inicial para conhecer mais detalhes ou deixar seus dados quando sua fatura estiver dentro do critério.</p>
            <div className="flex items-center gap-3 pt-2">
              <a href="/" className="btn btn-primary">Voltar à página inicial</a>
              <a href="/#leadform" className="btn btn-ghost">Fazer nova simulação</a>
            </div>
            <p className="text-xs text-muted">Observação: Faturas inferiores a R$ 500 tendem a não cobrir custos administrativos e requisitos regulatórios para a alocação de energia no modelo ofertado.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function NaoElegivelPage(){
  return (
    <Suspense fallback={<div className="container-pad py-12"><div className="max-w-md mx-auto rounded-2xl bg-white p-6 text-center">Carregando…</div></div>}>
      <NaoElegivelContent />
    </Suspense>
  )
}
