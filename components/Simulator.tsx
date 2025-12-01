"use client"
import { useEffect, useMemo, useState } from 'react'
import { gtmPush } from '@/lib/gtm'

export type Plan = 'Livre'|'Prata'|'Ouro'

export function getDiscountPct(plan: Plan, value:number){
  if(value < 500) return 0;
  
  // Tiers based on bill value:
  // 0: 500 - 1999
  // 1: 2000 - 5999
  // 2: 6000 - 9999
  // 3: >= 10000
  
  let tier = 0;
  if(value >= 10000) tier = 3;
  else if(value >= 6000) tier = 2;
  else if(value >= 2000) tier = 1;
  else tier = 0;

  if(plan === 'Livre') {
    const tiers = [25, 27, 30, 35];
    return tiers[tier];
  }
  if(plan === 'Prata') {
    const tiers = [28, 30, 33, 37];
    return tiers[tier];
  }
  // Ouro
  const tiers = [30, 32, 35, 40];
  return tiers[tier];
}

export function estimate(value:number, plan: Plan){
  const pct = getDiscountPct(plan, value);
  const saving = Math.round(value * (pct/100));
  const newBill = Math.max(value - saving, 0);
  return { pct, saving, newBill };
}

function formatBRL(n: number){
  return n.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' })
}

export default function Simulator({ initialPlan='Prata', onPlanChange, onCalculated }:{ initialPlan?: Plan, onPlanChange?: (p:Plan)=>void, onCalculated?: (v: { value:number; plan:Plan; pct:number })=>void }){
  const [bill, setBill] = useState<string>('')
  const [plan, setPlan] = useState<Plan>(initialPlan)
  const numericBill = useMemo(()=> Number((bill||'').replace(/\D+/g,'')||0),[bill])
  const value = useMemo(()=> Math.round(numericBill), [numericBill])
  const result = useMemo(()=> estimate(value, plan), [value, plan])

  useEffect(()=>{ gtmPush({ event:'simulator_view' }) },[])
  useEffect(()=>{ onPlanChange?.(plan) },[plan, onPlanChange])
  useEffect(()=>{
    if(value>0){
      const faixa = value < 500 ? '<500' : value <= 999 ? '500-999' : value <= 1999 ? '1000-1999' : value <= 5999 ? '2000-5999' : value <= 9999 ? '6000-9999' : '>=10000'
      gtmPush({ event:'simulator_calculated', plan, faixa_fatura: faixa, discountPct: result.pct })
      onCalculated?.({ value, plan, pct: result.pct })
    }
  },[value, plan, result.pct, onCalculated])

  return (
    <section id="simulador" className="container-pad py-12" aria-labelledby="sim-heading">
      <h2 id="sim-heading" className="section-title">Simulador</h2>
      <p className="section-sub">Informe sua fatura média e escolha um plano</p>
      <div className="mt-6 grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 card"><div className="card-body">
          <label className="block text-sm font-medium" htmlFor="bill">Valor da fatura (R$)</label>
          <input id="bill" data-testid="sim-input-bill" value={bill}
            onChange={(e)=>{
              const raw = e.target.value
              const digits = raw.replace(/\D+/g,'')
              const num = Number(digits)
              setBill(num.toLocaleString('pt-BR'))
            }}
            inputMode="numeric" className="mt-2 w-full rounded-2xl border border-line px-4 py-3" placeholder="500" aria-describedby="bill-help" />
          <p id="bill-help" className="text-xs text-muted mt-1">Mínimo elegível: R$ 500/mês</p>

          <label className="block text-sm font-medium mt-4" htmlFor="plan">Plano</label>
          <select id="plan" data-testid="sim-select-plan" value={plan} onChange={(e)=> setPlan(e.target.value as Plan)} className="mt-2 w-full rounded-2xl border border-line px-4 py-3">
            <option value="Livre">Plano Livre</option>
            <option value="Prata">Plano Prata</option>
            <option value="Ouro">Plano Ouro</option>
          </select>
        </div></div>
        <div className="md:col-span-2 card"><div className="card-body">
          {value < 500 ? (
            <p className="text-ink">Atualmente atendemos contas a partir de <b>R$ 500/mês</b>. Deixe seu contato e avisaremos quando houver oferta para você.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted">Desconto estimado</div>
                <div className="text-3xl font-bold">{result.pct}%</div>
              </div>
              <div>
                <div className="text-sm text-muted">Economia estimada</div>
                <div className="text-3xl font-bold">{formatBRL(result.saving)}</div>
              </div>
              <div>
                <div className="text-sm text-muted">Nova fatura</div>
                <div className="text-3xl font-bold">{formatBRL(result.newBill)}</div>
              </div>
            </div>
          )}
        </div></div>
      </div>
    </section>
  )
}
