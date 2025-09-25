"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LeadSchema, type Lead } from '@/lib/validators'
import { estimate, type Plan } from './Simulator'
import { gtmPush } from '@/lib/gtm'

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

export default function LeadForm(props: { initialPlan?: Plan }){
  const initialPlan: Plan = props.initialPlan ?? 'Economico12'
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
      cep:'', city:'', acceptLGPD:false, utm: {}, fileUrl:'', gclid:'', fbclid:'', msclkid:'', referrer:'', landingUrl:'', leadSource:'', outsideScope: false
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

  // Capture UTM and source on first load
  useEffect(()=>{
    try{
      const url = new URL(window.location.href)
      const sp = url.searchParams
      const utm: Record<string,string> = {}
      const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'] as const
      utmKeys.forEach(k=>{ const v = sp.get(k); if(v) utm[k] = v })
      const gclid = sp.get('gclid') || ''
      const fbclid = sp.get('fbclid') || ''
      const msclkid = sp.get('msclkid') || ''
      const ref = sp.get('ref') || ''
      const referrer = document.referrer || ''
      const landingUrl = url.toString()

      function inferSource(){
        if(utm.utm_source) return utm.utm_source
        if(gclid) return 'google_ads'
        if(fbclid) return 'facebook_ads'
        if(msclkid) return 'microsoft_ads'
        if(ref) return ref
        if(/facebook|instagram\.com/i.test(referrer)) return 'meta_organic'
        if(/google\./i.test(referrer)) return 'google_organic'
        if(/bing\./i.test(referrer)) return 'bing_organic'
        if(referrer) return 'referral'
        return 'direct'
      }

      const alreadySource = form.getValues('leadSource')
      if(!alreadySource){
        form.setValue('utm', Object.keys(utm).length ? utm : {}, { shouldDirty: true })
        if(gclid) form.setValue('gclid', gclid, { shouldDirty: true })
        if(fbclid) form.setValue('fbclid', fbclid, { shouldDirty: true })
        if(msclkid) form.setValue('msclkid', msclkid, { shouldDirty: true })
        if(referrer) form.setValue('referrer', referrer, { shouldDirty: true })
        form.setValue('landingUrl', landingUrl, { shouldDirty: true })
        form.setValue('leadSource', inferSource(), { shouldDirty: true })
      }
    }catch{}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    const v = form.getValues()
    // keep estimates in sync
    form.setValue('estimatedDiscountPct', calc.pct, { shouldDirty: true })
    form.setValue('estimatedSaving', calc.saving, { shouldDirty: true })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...v, estimatedDiscountPct: calc.pct, estimatedSaving: calc.saving }))
  },[calc.pct, calc.saving])

  // single-step: no partial send or step navigation

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
      const v = form.getValues('avgBillValue')||0
      const faixa = v < 500 ? '<500' : v <= 999 ? '500-999' : v <= 1999 ? '1000-1999' : v <= 5999 ? '2000-5999' : v <= 9999 ? '6000-9999' : '>=10000'
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
    const el = document.getElementById('leadform'); el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="py-12 bg-bg" aria-labelledby="leadform-heading" id="leadform">
      <div className="container-pad">
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-accent)]">
          <div className="relative z-10 p-6 md:p-8">
            <div className="grid md:grid-cols-5 gap-6 md:gap-8 items-start">
          {/* Persuasive message */}
          <aside className="md:col-span-2 text-white flex flex-col justify-center md:min-h-[360px]">
            <h2 id="leadform-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">Quero obter desconto na minha conta de energia</h2>
            <ul className="mt-4 space-y-2 text-white/90 text-sm list-disc pl-5">
              <li>Sem investimento inicial</li>
              <li>Energia renovável</li>
              <li>Energia gerada no MS</li>
            </ul>
          </aside>
          <div className="md:col-span-3 relative rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">

      {/* Result after submit */}
      {submitted ? (
        <div className="mt-6">
          <div className="glass rounded-2xl p-6 bg-white/10 border border-white/20">
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
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="mt-6 glass rounded-2xl p-4 sm:p-6 bg-white/10 border border-white/20">
        <div className="space-y-6 text-ink">
          <div className="grid md:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-7">
            <div>
              <label className="block text-sm font-medium">Telefone (WhatsApp) *</label>
              <input {...form.register('phone', { required: true })} inputMode="tel" className="mt-2 w-full rounded-2xl border border-line px-4 py-3 bg-white" data-testid="lead-phone" placeholder="(67) 9 9999-9999" />
            </div>
            <div>
              <label className="block text-sm font-medium">Nome completo *</label>
              <input {...form.register('fullname', { required: true })} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 bg-white" data-testid="lead-name" placeholder="Seu nome completo" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">CPF/CNPJ *</label>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <select {...form.register('documentType', { required: true })} className="w-full sm:w-auto rounded-2xl border border-line px-4 py-3 bg-white">
                  <option>CPF</option>
                  <option>CNPJ</option>
                </select>
                <input {...form.register('document', { required: true })} className="w-full sm:flex-1 rounded-2xl border border-line px-4 py-3 bg-white" placeholder="000.000.000-00" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Plano (opcional)</label>
              <select {...form.register('plan')} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 bg-white">
                <option value="Flex">Flex</option>
                <option value="Economico12">Econômico 12</option>
                <option value="Premium36">Premium 36</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Valor médio da sua fatura (R$) *</label>
              <input inputMode="numeric" className="mt-2 w-full sm:w-48 md:w-56 rounded-2xl border border-line px-4 py-3 bg-white" data-testid="lead-bill" placeholder="Ex: 2.500"
                value={form.getValues('avgBillValue') ? Number(form.getValues('avgBillValue')).toLocaleString('pt-BR') : ''}
                onChange={(e)=>{
                  const digits = e.target.value.replace(/\D+/g,'')
                  form.setValue('avgBillValue', Number(digits)||0, { shouldDirty: true })
                }} />
              {/* Nota removida conforme solicitação */}
            </div>
            <div>
              <label className="block text-sm font-medium">E-mail</label>
              <input {...form.register('email')} type="email" className="mt-2 w-full rounded-2xl border border-line px-4 py-3 bg-white" data-testid="lead-email" placeholder="seunome@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium">CEP</label>
              <input {...form.register('cep')} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 bg-white" placeholder="79000-000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Selecionar fatura (PNG/JPG/PDF) — opcional</label>
            <div className="mt-2 rounded-2xl border-2 border-dashed border-line bg-white p-6">
              <div className="mt-1 flex items-center gap-3">
                <button type="button" className="btn btn-primary" onClick={()=> fileInputRef.current?.click()}>Selecionar fatura</button>
                {values.fileUrl && (
                  <button type="button" className="btn btn-ghost" onClick={()=>{ const prev=form.getValues('fileUrl'); if(prev) try{ URL.revokeObjectURL(prev) }catch{}; form.setValue('fileUrl','',{shouldDirty:true}); setBillFileName('') }}>Remover</button>
                )}
              </div>
              <p className="text-sm text-muted mt-3">{values.fileUrl ? `Fatura selecionada${billFileName ? `: ${billFileName}`:''}` : 'Nenhuma fatura selecionada'}</p>
              <input ref={fileInputRef} id="bill-file" name="bill-file" type="file" accept="image/*,.pdf" className="hidden" aria-hidden="true"
                onChange={(e)=>{ const file=e.target.files?.[0]; if(file){ const url=URL.createObjectURL(file); form.setValue('fileUrl',url,{shouldDirty:true}); setBillFileName(file.name) } else { form.setValue('fileUrl','',{shouldDirty:true}); setBillFileName('') } }} />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-6 py-4 rounded-2xl text-white font-semibold shadow-xl disabled:opacity-60 bg-gradient-to-r from-[color:var(--blue-strong)] to-[color:var(--accent-strong)] transition-[shadow,transform,opacity] hover:opacity-100 hover:shadow-[0_0_28px_rgba(32,178,142,0.75)] hover:scale-[1.01] focus:shadow-[0_0_32px_rgba(32,178,142,0.85)] shine-sweep"
              disabled={submitting}
              data-testid="lead-submit"
            >
              {submitting ? 'Enviando...' : 'Enviar dados e descobrir meu desconto simulado'}
            </button>
          </div>
          <p className="text-xs text-muted">Ao enviar, você concorda que entremos em contato por telefone, e-mail e WhatsApp conforme nossa <a className="underline" href="/privacidade">Política de Privacidade</a>.</p>
        </div>
      </form>
      )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
