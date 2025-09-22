"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LeadSchema, type Lead } from '@/lib/validators'
import { estimate, type Plan } from './Simulator'
import { gtmPush } from '@/lib/gtm'

type Step = 1|2|3|4

const STORAGE_KEY = 'helexia_lp_lead'

function formatBRL(n:number){ return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) }

function CountUp({ value, format = (v:number)=>String(v), duration=800 }: { value: number; format?: (v:number)=>string; duration?: number }){
  const [display, setDisplay] = useState(0)
  useEffect(()=>{
    let raf = 0
    const start = performance.now()
    const from = display
    const to = value
    const delta = to - from
    const tick = (t:number)=>{
      const p = Math.min((t - start)/duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(from + delta * eased)
      if(p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return ()=> cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value])
  return <span>{format(Math.round(display))}</span>
}

function AnimatedBar({ bill, pct }: { bill: number; pct: number }){
  const icmsShare = 0.17
  const pisShare = 0.05
  const taxes = Math.max(Math.round(bill * (icmsShare + pisShare)),0)
  const energyBase = Math.max(bill - taxes, 0)
  const discountValue = Math.max(Math.round(energyBase * (pct/100)),0)
  const targetTaxes = bill ? (taxes/bill)*100 : 0
  const targetEnergy = bill ? (energyBase/bill)*100 : 0
  const targetDiscount = bill ? (discountValue/bill)*100 : 0
  const [w, setW] = useState({ taxes:0, energy:0, discount:0 })
  useEffect(()=>{
    // animate to targets
    const id = requestAnimationFrame(()=> setW({ taxes: targetTaxes, energy: targetEnergy, discount: targetDiscount }))
    return ()=> cancelAnimationFrame(id)
  },[targetTaxes, targetEnergy, targetDiscount])
  return (
    <div className="mt-6">
      <div className="relative w-full h-5 md:h-6 rounded-full bg-line overflow-hidden" aria-label="Composição da sua fatura">
        {/* Energia base (azul mais claro para contraste) */}
        <div className="absolute inset-y-0 left-0 transition-all duration-700 ease-out" style={{ width: `${Math.max(w.energy,0)}%`, background:'rgba(0,149,217,0.5)' }} title="Energia (TE+TUSD) — parte variável" />
        {/* Impostos (cinza claro) */}
        <div className="absolute inset-y-0 right-0 transition-all duration-700 ease-out" style={{ width: `${Math.max(w.taxes,0)}%`, background:'rgba(226,232,240,1)' }} title="Impostos (ICMS+PIS/COFINS) — parte fixa" />
        {/* Desconto aplicado (verde sólido sobre energia) */}
        <div className="absolute inset-y-0 left-0 transition-all duration-700 ease-out" style={{ width: `${Math.max(w.discount,0)}%`, background:'var(--brand-accent)', boxShadow:'inset -1px 0 0 rgba(255,255,255,0.7)' }} title={`Desconto aplicado (estimativa): ${formatBRL(discountValue)}`} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-xs">
        <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:'var(--brand-accent)'}} /> Desconto sobre energia ({pct}%)</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:'rgba(0,149,217,0.5)'}} /> Energia (TE+TUSD)</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:'rgba(226,232,240,1)'}} /> Impostos</span>
      </div>
    </div>
  )
}

export default function LeadForm({ initialPlan='Economico12' as Plan }:{ initialPlan?: Plan }){
  const [step, setStep] = useState<Step>(1)
  const [partialSent, setPartialSent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [billFileName, setBillFileName] = useState('')
  const [submitted, setSubmitted] = useState<{ id?: string; pct: number; saving: number; newBill: number }|null>(null)
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    mode: 'onBlur',
    defaultValues: {
      fullname: '', email: '', phone: '', documentType:'CPF', document:'',
      avgBillValue: 0, segment:'Residencial', plan: initialPlan,
      estimatedDiscountPct: 0, estimatedSaving: 0,
      cep:'', city:'', acceptLGPD:false, utm: {}, fileUrl:'', gclid:'', outsideScope: false
    }
  })

  const values = form.watch()
  const calc = useMemo(()=> estimate(values.avgBillValue||0, values.plan), [values.avgBillValue, values.plan])

  useEffect(()=>{
    // restore autosave
    const saved = localStorage.getItem(STORAGE_KEY)
    if(saved){
      try{ form.reset(JSON.parse(saved)) }catch{}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    const v = form.getValues()
    // keep estimates in sync
    form.setValue('estimatedDiscountPct', calc.pct, { shouldDirty: true })
    form.setValue('estimatedSaving', calc.saving, { shouldDirty: true })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...v, estimatedDiscountPct: calc.pct, estimatedSaving: calc.saving }))
  },[calc.pct, calc.saving])

  useEffect(()=>{ gtmPush({ event:'form_step_change', step }) },[step])

  async function sendPartialIfNeeded(){
    if(partialSent) return
    const { email, avgBillValue } = form.getValues()
    if(email && avgBillValue>0){
      try{
        const res = await fetch('/api/lead?partial=1',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form.getValues(), acceptLGPD: true }) })
        if(res.ok){ setPartialSent(true); gtmPush({ event:'lead_partial_sent' }) }
      }catch{}
    }
  }

  function next(){
    if(step===1) sendPartialIfNeeded()
    setStep(Math.min(4, (step+1) as Step))
  }
  function prev(){ setStep(Math.max(1, (step-1) as Step)) }

  async function onSubmit(data: Lead){
    try{
      setSubmitting(true)
      const outsideScope = !!(data.city && !/\bMS\b|Mato Grosso do Sul/i.test(data.city))
      const payload = { ...data, outsideScope }
      const res = await fetch('/api/lead',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if(!res.ok) throw new Error(await res.text())
      const json = await res.json().catch(()=>({}))
      gtmPush({ event:'lead_submit_success' })
      // Show persuasive simulation result after submit
      const r = estimate(form.getValues('avgBillValue')||0, form.getValues('plan'))
      const faixa = (form.getValues('avgBillValue')||0) < 1000 ? '<1000' : (form.getValues('avgBillValue')||0) <= 1999 ? '1000-1999' : (form.getValues('avgBillValue')||0) <= 5999 ? '2000-5999' : (form.getValues('avgBillValue')||0) <= 9999 ? '6000-9999' : '>=10000'
      gtmPush({ event:'simulator_calculated', plan: form.getValues('plan'), faixa_fatura: faixa, discountPct: r.pct })
      setSubmitted({ id: json?.id, pct: r.pct, saving: r.saving, newBill: r.newBill })
      localStorage.removeItem(STORAGE_KEY)
    }catch(e){
      console.error(e)
      gtmPush({ event:'lead_submit_error' })
      alert('Não foi possível enviar. Verifique os dados e tente novamente.')
    }
    finally{
      setSubmitting(false)
    }
  }

  function onInvalid(){
    const errs = form.formState.errors
    // Navigate to the first step that has an error
    if (errs.email || errs.avgBillValue) { setStep(1) }
    else if (errs.fullname || errs.phone || errs.document || errs.documentType || errs.cep) { setStep(2) }
    else if (errs.fileUrl) { setStep(3) }
    else if (errs.acceptLGPD) { setStep(4) }
    // Scroll into view to ensure user sees the form
    const el = document.getElementById('leadform'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="container-pad py-12" aria-labelledby="leadform-heading" id="leadform">
      {!submitted && (
        <>
          <h2 id="leadform-heading" className="section-title">Descubra agora quanto pode economizar</h2>
          <p className="section-sub">Preencha em menos de 1 minuto. Retornamos por WhatsApp ou telefone. Seus dados estão protegidos (LGPD).</p>
        </>
      )}

      {/* Result after submit */}
      {submitted ? (
        <div className="mt-6">
          <div className="card">
            <div className="card-body">
              {(() => {
                const name = (form.getValues('fullname')||'').trim()
                const first = name ? name.split(' ')[0].toUpperCase() : ''
                const bill = form.getValues('avgBillValue') || 0
                const pct = submitted.pct
                const icmsShare = 0.17
                const pisShare = 0.05
                const taxes = Math.round(bill * (icmsShare + pisShare))
                const energyBase = Math.max(bill - taxes, 0)
                const discountValue = Math.round(energyBase * (pct/100))
                return (
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold">{first ? `Parabéns, ${first}!` : 'Parabéns!'} Você pode economizar até {formatBRL(discountValue)} por mês.</h3>
                  </div>
                )
              })()}
              {(() => {
                const bill = form.getValues('avgBillValue') || 0
                const pct = submitted.pct
                // Impostos fixos: ICMS 17% e PIS/COFINS 5%
                const icmsShare = 0.17
                const pisShare = 0.05
                const taxShare = icmsShare + pisShare // 22%
                const icms = Math.round(bill * icmsShare)
                const pis = Math.round(bill * pisShare)
                const taxes = icms + pis
                const energyBase = Math.max(bill - taxes, 0)
                const discountValue = Math.round(energyBase * (pct/100))
                const annualSaving = discountValue * 12
                // Larguras relativas para as barras
                const energyWidth = bill ? (energyBase / bill) * 100 : 0
                const icmsWidth = bill ? (icms / bill) * 100 : 0
                const pisWidth = bill ? (pis / bill) * 100 : 0
                const discountWidth = energyWidth * (pct/100)
                return (
                  <>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-center">
                      <div className="relative">
                        <div className="px-5 py-3 rounded-full bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)] text-white text-xl md:text-2xl font-bold shadow-soft">
                          {pct}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted">Economia mensal</div>
                        <div className="text-4xl font-bold text-[color:var(--brand-accent)]"><CountUp value={discountValue} format={formatBRL} /></div>
                      </div>
                      <div>
                        <div className="text-sm text-muted">Economia anual</div>
                        <div className="text-4xl font-bold text-[color:var(--brand-accent)]"><CountUp value={annualSaving} format={formatBRL} /></div>
                      </div>
                    </div>

                    {/* Gráfico circular interativo e comparativo simples */}
                    {/* Comparativo simples: hoje, com desconto e economia estimada */}
                    {/* Removido comparativo Hoje/Depois para reduzir ruído e manter foco na economia mensal */}

                    <AnimatedBar bill={bill} pct={pct} />
                    {/* Removido breakdown numérico detalhado para simplificar a visualização */}
                    <p className="mt-2 text-xs text-muted text-center">O desconto é aplicado apenas sobre a parte de energia (TE+TUSD). Impostos como ICMS e PIS/COFINS não sofrem redução.</p>

                    {/* Removido comparativo Antes/Depois para focar na economia mensal */}
                  </>
                )
              })()}
              {/* Rodapé legal enxuto */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <p className="text-sm text-ink/80">Nossa equipe vai entrar em contato por telefone ou WhatsApp em breve para enviar sua proposta.</p>
                <button className="btn btn-ghost" onClick={()=> setSubmitted(null)}>Revisar informações</button>
              </div>

              {/* Prova social e selos */}
              <div className="mt-10">
                <div className="bg-white border border-line rounded-2xl p-6 flex items-start gap-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[color:var(--brand-accent)]"><path d="M3 11l9-8 9 8v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V13H9v6a2 2 0 0 1-2 2H3z"/></svg>
                  <p className="text-sm text-ink/80">Helexia e Sion já comercializam energia nesse modelo em todo o Brasil, com produção suficiente para atender o equivalente a <b>250 mil casas</b>, ou uma <b>cidade de 750 mil habitantes</b>. São mais de <b>200 MWp</b> de usinas solares já em operação.</p>
                        </div>
                        {/* Removida barra extra para manter foco e simplicidade */}
                
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="mt-6 grid md:grid-cols-3 gap-6 items-start">
        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="md:col-span-3 card">
          <div className="card-body space-y-6">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>{step}/4</span>
                <span>Rápido e seguro</span>
              </div>
              <div className="h-2 bg-line rounded">
                <div className="h-2 bg-[color:var(--brand-accent)] rounded transition-all" style={{ width: `${(step/4)*100}%` }} />
              </div>
            </div>

          {step===1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">E-mail</label>
                <input {...form.register('email')} type="email" className="mt-2 w-full rounded-2xl border border-line px-4 py-3" data-testid="lead-email" placeholder="seunome@email.com" />
                {form.formState.errors.email && <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Valor médio da sua fatura (R$)</label>
                <input inputMode="numeric" className="mt-2 w-full rounded-2xl border border-line px-4 py-3" data-testid="lead-bill" placeholder="Ex: 2.500"
                  value={form.getValues('avgBillValue') ? Number(form.getValues('avgBillValue')).toLocaleString('pt-BR') : ''}
                  onChange={(e)=>{
                    const digits = e.target.value.replace(/\D+/g,'')
                    form.setValue('avgBillValue', Number(digits)||0, { shouldDirty: true })
                  }} />
                <p className="text-xs text-muted mt-1">Mínimo elegível: R$ 1.000/mês. Cálculo considera desconto apenas sobre TE+TUSD (energia).</p>
              </div>
              <div className="md:col-span-2 bg-bg border border-line rounded-2xl p-4">
                <p className="text-sm">Vamos calcular seu <b>desconto real</b> e entrar em contato em poucas horas por <b>telefone ou WhatsApp</b> para finalizar sua adesão.</p>
                </div>
            </div>
          )}

          {step===2 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nome completo</label>
                <input {...form.register('fullname')} className="mt-2 w-full rounded-2xl border border-line px-4 py-3" data-testid="lead-name" />
                {form.formState.errors.fullname && <p className="text-red-600 text-sm mt-1">{form.formState.errors.fullname.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Telefone</label>
                <input {...form.register('phone')} inputMode="tel" className="mt-2 w-full rounded-2xl border border-line px-4 py-3" data-testid="lead-phone" />
                {form.formState.errors.phone && <p className="text-red-600 text-sm mt-1">Telefone inválido</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Documento</label>
                <div className="flex gap-2 mt-2">
                  <select {...form.register('documentType')} className="rounded-2xl border border-line px-4 py-3">
                    <option>CPF</option>
                    <option>CNPJ</option>
                  </select>
                  <input {...form.register('document')} className="flex-1 rounded-2xl border border-line px-4 py-3" placeholder="000.000.000-00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">CEP</label>
                <input {...form.register('cep')} className="mt-2 w-full rounded-2xl border border-line px-4 py-3" placeholder="79000-000" />
              </div>
            </div>
          )}

          {step===3 && (
            <div>
              <label className="block text-sm font-medium">Selecionar fatura (PNG/JPG/PDF) — opcional</label>
              <div className="mt-2 rounded-2xl border-2 border-dashed border-line bg-white p-6">
                <p className="text-sm text-muted">Anexe sua fatura para acelerar a análise (opcional).</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={()=> fileInputRef.current?.click()}
                  >
                    Selecionar fatura
                  </button>
                  {values.fileUrl && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={()=>{
                        const prev = form.getValues('fileUrl')
                        if(prev) try{ URL.revokeObjectURL(prev) }catch{}
                        form.setValue('fileUrl','', { shouldDirty: true })
                        setBillFileName('')
                      }}
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted mt-3">
                  {values.fileUrl ? `Fatura selecionada${billFileName ? `: ${billFileName}`:''}` : 'Nenhuma fatura selecionada'}
                </p>
                <input
                  ref={fileInputRef}
                  id="bill-file"
                  name="bill-file"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  aria-hidden="true"
                  onChange={(e)=>{
                    const file = e.target.files?.[0]
                    if(file){
                      const url = URL.createObjectURL(file)
                      form.setValue('fileUrl', url, { shouldDirty: true })
                      setBillFileName(file.name)
                    } else {
                      form.setValue('fileUrl','', { shouldDirty: true })
                      setBillFileName('')
                    }
                  }}
                />
              </div>
            </div>
          )}

          {step===4 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Plano</label>
                <select {...form.register('plan')} className="mt-2 w-full rounded-2xl border border-line px-4 py-3">
                  <option value="Flex">Flex</option>
                  <option value="Economico12">Econômico 12</option>
                  <option value="Premium36">Premium 36</option>
                </select>
              </div>
              <div className="bg-bg border border-line rounded-2xl p-4">
                <div className="text-sm text-muted">Resumo</div>
                <div className="mt-2 text-sm">Fatura: <b>{formatBRL(values.avgBillValue||0)}</b></div>
                <div className="text-sm">Plano escolhido: <b>{values.plan}</b></div>
                <div className="text-sm">Retorno: <b>telefone/WhatsApp</b> em poucas horas</div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" {...form.register('acceptLGPD')} />
                    <span>Li e concordo com a <a className="underline" href="#" target="_blank" rel="noreferrer">Política de Privacidade</a></span>
                  </label>
                  <span className="text-xs bg-[rgba(32,178,142,0.10)] text-[color:var(--brand-accent)] px-2 py-1 rounded border border-[rgba(32,178,142,0.20)]">LGPD Compliance</span>
                </div>
                {form.formState.errors.acceptLGPD && <p className="text-red-600 text-sm mt-1">{form.formState.errors.acceptLGPD.message as string}</p>}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button type="button" className="btn btn-ghost" disabled={step===1} onClick={prev}>Voltar</button>
            {step<4 ? (
              <button type="button" className="btn btn-primary" onClick={next} data-testid="lead-next">Continuar</button>
            ) : (
              <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={submitting} data-testid="lead-submit">{submitting ? 'Enviando...' : 'Enviar'}</button>
            )}
          </div>

          {/* Consent note */}
          {step===4 && (
            <p className="text-xs text-muted mt-2">Ao enviar, você concorda que entremos em contato por telefone, e-mail e WhatsApp conforme nossa <a className="underline" href="/privacidade">Política de Privacidade</a>.</p>
          )}

          {/* Trust badges */}
          <div className="pt-2 text-xs text-muted flex flex-wrap gap-3">
            <span>Dados protegidos (LGPD)</span>
            <span>Atendimento rápido</span>
            <span>Usinas no Mato Grosso do Sul</span>
          </div>
          </div>
        </form>
      </div>
      )}
    </section>
  )
}
