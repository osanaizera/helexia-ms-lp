"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LeadSchema, type Lead } from '@/lib/validators'
import { estimate, type Plan } from './Simulator'
import { gtmPush } from '@/lib/gtm'

// --- Helpers ---
function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// --- Components ---

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1
        const isActive = step === current
        const isCompleted = step < current
        return (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden relative">
            <div
              className={`absolute inset-0 bg-white transition-all duration-500 ease-out ${isActive || isCompleted ? 'w-full' : 'w-0'}`}
              style={{ opacity: isActive ? 1 : isCompleted ? 0.6 : 0 }}
            />
          </div>
        )
      })}
    </div>
  )
}

function InputField({
  label, name, register, error, placeholder, type = "text", disabled = false, prefix, onChangeCustom
}: {
  label: string, name: any, register: any, error?: any, placeholder?: string, type?: string, disabled?: boolean, prefix?: string, onChangeCustom?: (e: any) => void
}) {
  return (
    <div className="group">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1 transition-colors group-focus-within:text-[color:var(--brand)]">
        {label}
      </label>
      <div className={`relative flex items-center bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 ease-in-out ${error ? 'border-red-300 bg-red-50' : 'hover:border-gray-300 focus-within:border-[color:var(--brand)] focus-within:bg-white focus-within:shadow-md'}`}>
        {prefix && <span className="pl-3 text-gray-400 font-medium text-sm">{prefix}</span>}
        <input
          {...register(name)}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full bg-transparent px-3 py-2.5 outline-none text-sm text-ink font-medium placeholder:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ${prefix ? 'pl-1' : ''}`}
          onChange={(e) => {
            register(name).onChange(e)
            if (onChangeCustom) onChangeCustom(e)
          }}
        />
        {error && (
          <div className="pr-3 text-red-500 animate-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        )}
      </div>
      {error && <p className="mt-1 ml-1 text-[10px] text-red-500 font-medium animate-fadeIn">{error.message}</p>}
    </div>
  )
}

function SelectField({ label, name, register, options }: { label: string, name: any, register: any, options: { val: string, label: string }[] }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
        {label}
      </label>
      <div className="relative">
        <select {...register(name)} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-ink font-medium outline-none transition-all hover:border-gray-300 focus:border-[color:var(--brand)] focus:bg-white focus:shadow-md cursor-pointer">
          {options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  )
}

// --- Main Component ---

export default function LeadForm(props: { initialPlan?: Plan }) {
  const router = useRouter()
  const initialPlan: Plan = props.initialPlan ?? 'Prata'
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  
  // Clicksign States
  const [signatureKey, setSignatureKey] = useState<string | null>(null)
  const [clicksignHost, setClicksignHost] = useState<string>('https://app.clicksign.com')
  const [loadingSigner, setLoadingSigner] = useState(false)
  const widgetTargetRef = useRef<HTMLDivElement>(null)

  const form = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    mode: 'onChange',
    defaultValues: {
      fullname: '', email: '', phone: '',
      personType: 'PF', documentType: 'CPF', document: '',
      avgBillValue: 0, segment: 'Residencial', plan: initialPlan,
      cep: '', city: '', endereco: '', numero: '', complemento: '', bairro: '',
      distribuidora: 'Energisa MS', unidadeConsumidora: '',
      razaoSocial: '', nomeFantasia: '', responsavel: '', apelido: '',
      acceptLGPD: false
    }
  })

  const values = form.watch()
  const { errors } = form.formState
  const calc = useMemo(() => estimate(values.avgBillValue || 0, values.plan), [values.avgBillValue, values.plan])

  useEffect(() => {
    const el = document.getElementById('leadform')
    if (el && step > 1) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [step])

  // Clicksign Integration Logic
  const initClicksign = async () => {
    setLoadingSigner(true)
    try {
        const response = await fetch('/api/clicksign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        })
        
        if (!response.ok) {
            const errData = await response.json()
            console.error(errData)
            throw new Error(errData.error || errData.details || 'Falha ao iniciar assinatura')
        }
        
        const data = await response.json()
        if (data.requestSignatureKey) {
            setSignatureKey(data.requestSignatureKey)
            if (data.clicksignHost) {
                setClicksignHost(data.clicksignHost)
            }
        } else {
            throw new Error('Chave de assinatura não retornada')
        }
    } catch (err: any) {
        console.error(err)
        alert(`Erro: ${err.message || 'Erro ao carregar documento.'}`)
    } finally {
        setLoadingSigner(false)
    }
  }

  // Effect to mount widget when key is available
  useEffect(() => {
    if (signatureKey && widgetTargetRef.current && (window as any).Clicksign) {
        console.log('Mounting Clicksign widget with key:', signatureKey);
        const widget = new (window as any).Clicksign(signatureKey)
        
        // Dynamically set endpoint based on API response
        widget.endpoint = clicksignHost
        // widget.origin = window.location.origin // Commenting out to check if it fixes 404
        
        widget.mount(widgetTargetRef.current.id)
        widget.on('signed', (signature: any) => {
            console.log('Document signed:', signature);
            router.push('/sucesso')
        })
        
        // Debug listener for loaded
        widget.on('loaded', () => console.log('Clicksign Widget Loaded'))
    }
  }, [signatureKey, clicksignHost])

  const handleNext = async () => {
    let valid = false
    if (step === 1) {
      valid = await form.trigger(['fullname', 'email', 'phone', 'avgBillValue', 'plan'])
    } else if (step === 2) {
      const common = ['document', 'cep', 'city', 'endereco', 'numero', 'bairro', 'unidadeConsumidora'] as const
      const pj = ['razaoSocial', 'nomeFantasia', 'responsavel'] as const
      const fields = values.personType === 'PJ' ? [...common, ...pj] : [...common]
      valid = await form.trigger(fields as any)
    }

    if (valid) {
      setStep(s => s + 1)
      if (step === 2) {
          // Transitioning to Step 3: Trigger Clicksign
          initClicksign()
      }
    }
  }

  const handleBack = () => setStep(s => s - 1)

  // Fallback submit (only if needed or for manual bypass)
  async function onSubmit(data: Lead) {
     if (signatureKey) return // Already handled by widget
     alert("Aguarde o carregamento do documento.")
  }

  return (
    <section className="py-12 bg-bg" id="leadform">
      <Script src="https://cdn-public-library.clicksign.com/embedded/embedded.min-2.1.0.js" strategy="lazyOnload" />

      <div className="container-pad">
        <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-white/20 ring-1 ring-black/5">
          <div className="grid lg:grid-cols-12 min-h-[500px]">

            {/* Sidebar / Context Area */}
            <aside className="lg:col-span-4 bg-[color:var(--brand)] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Abstract Background Shapes */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[color:var(--brand-accent)]/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

              <div className="relative z-10">
                <StepIndicator current={step} total={3} />

                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                    {step === 1 && "Simule sua economia"}
                    {step === 2 && "Cadastro rápido"}
                    {step === 3 && "Assinatura digital"}
                  </h2>

                  <p className="text-white/80 text-sm leading-relaxed">
                    {step === 1 && "Veja o quanto você vai economizar sem investir nada."}
                    {step === 2 && "Dados seguros para validar sua unidade na Energisa."}
                    {step === 3 && "Processo com validade jurídica, 100% online."}
                  </p>
                </div>
              </div>

              {/* Dynamic Trust Badge */}
              <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    {step === 1 && <span className="text-lg">⚡</span>}
                    {step === 2 && <span className="text-lg">🔒</span>}
                    {step === 3 && <span className="text-lg">✍️</span>}
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-wide opacity-90">
                    {step === 1 ? "Energia Garantida" : step === 2 ? "Dados Protegidos" : "Validade Jurídica"}
                  </h3>
                </div>
                <p className="text-[10px] text-white/70 leading-relaxed">
                  {step === 1 ? "Sem obras e sem fidelidade abusiva." :
                    step === 2 ? "Criptografia de ponta a ponta." :
                      "Assinatura certificada digitalmente."}
                </p>
              </div>
            </aside>

            {/* Form Area */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 relative">
              <form onSubmit={(e) => e.preventDefault()} className="h-full flex flex-col justify-center">

                {/* STEP 1: SIMULATION */}
                {step === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <InputField label="Nome Completo" name="fullname" register={form.register} error={errors.fullname} placeholder="Como está na sua conta de luz" />
                      </div>
                      <InputField label="WhatsApp" name="phone" register={form.register} error={errors.phone} placeholder="(00) 00000-0000" type="tel" />
                      <InputField label="E-mail Corporativo" name="email" register={form.register} error={errors.email} placeholder="seu@empresa.com" type="email" />

                      <div className="md:col-span-2">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                          <label className="text-xs font-bold text-gray-700 whitespace-nowrap">Valor médio da fatura:</label>
                          <div className="relative w-full max-w-[180px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                            <input
                              className="w-full text-right text-lg font-bold bg-white border border-gray-200 rounded-lg py-2 px-4 outline-none focus:border-[color:var(--brand)] focus:shadow-sm transition-all text-[color:var(--brand)]"
                              placeholder="0,00"
                              value={values.avgBillValue ? values.avgBillValue.toLocaleString('pt-BR') : ''}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D+/g, '')
                                form.setValue('avgBillValue', Number(digits) || 0, { shouldValidate: true })
                              }}
                            />
                          </div>
                        </div>
                        {errors.avgBillValue && <p className="text-right text-red-500 text-[10px] mt-1">{errors.avgBillValue.message}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <SelectField
                          label="Plano Desejado"
                          name="plan"
                          register={form.register}
                          options={[
                            { val: 'Livre', label: 'Plano Livre (Sem fidelidade) - Popular' },
                            { val: 'Prata', label: 'Plano Prata (12 meses) - Maior desconto' },
                            { val: 'Ouro', label: 'Plano Ouro (24 meses) - Desconto máximo' }
                          ]}
                        />
                      </div>
                    </div>

                    {/* Live Calc Preview */}
                    {calc.pct > 0 && (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center justify-between shadow-sm">
                        <div>
                          <p className="text-[10px] font-bold text-green-800 uppercase tracking-wider mb-0.5">Economia Estimada</p>
                          <p className="text-2xl font-bold text-green-700 tracking-tight">{formatBRL(calc.saving)}<span className="text-xs font-medium text-green-600">/mês</span></p>
                        </div>
                        <div className="text-right">
                          <div className="inline-block bg-green-200 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-0.5">Até</div>
                          <p className="text-2xl font-bold text-green-700">{calc.pct}% OFF</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full py-3.5 rounded-full text-white font-bold bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-accent)] shadow-lg shadow-brand/20 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm"
                    >
                      <span className="group-hover:mr-1 transition-all">Verificar Disponibilidade</span>
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                  </div>
                )}

                {/* STEP 2: REGISTRATION */}
                {step === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    {/* Person Type Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-lg w-full max-w-xs mx-auto">
                      {(['PF', 'PJ'] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => form.setValue('personType', t)}
                          className={`flex-1 py-2 rounded-md text-xs font-bold transition-all duration-300 ${values.personType === t ? 'bg-white shadow-sm text-[color:var(--brand)]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {t === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </button>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {values.personType === 'PJ' ? (
                        <>
                          <div className="md:col-span-2">
                            <InputField label="Razão Social" name="razaoSocial" register={form.register} error={errors.razaoSocial} />
                          </div>
                          <div className="md:col-span-2">
                            <InputField label="Nome Fantasia" name="nomeFantasia" register={form.register} />
                          </div>
                          <InputField label="CNPJ" name="document" register={form.register} error={errors.document} placeholder="00.000.000/0000-00" />
                          <InputField label="Responsável Legal" name="responsavel" register={form.register} error={errors.responsavel} />
                        </>
                      ) : (
                        <>
                          <div className="md:col-span-2">
                            <InputField label="Nome Completo" name="fullname" register={form.register} disabled />
                          </div>
                          <InputField label="CPF" name="document" register={form.register} error={errors.document} placeholder="000.000.000-00" />
                          <InputField label="Apelido" name="apelido" register={form.register} placeholder="Opcional" />
                        </>
                      )}

                      {/* Address Divider */}
                      <div className="md:col-span-2 pt-2 pb-1">
                        <div className="flex items-center gap-3">
                          <div className="h-px bg-gray-200 flex-1" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Endereço da Instalação</span>
                          <div className="h-px bg-gray-200 flex-1" />
                        </div>
                      </div>

                      <InputField label="CEP" name="cep" register={form.register} error={errors.cep} placeholder="00000-000" />
                      <InputField label="Cidade" name="city" register={form.register} error={errors.city} />
                      <div className="md:col-span-2">
                        <InputField label="Endereço (Rua/Av)" name="endereco" register={form.register} error={errors.endereco} />
                      </div>
                      <InputField label="Número" name="numero" register={form.register} error={errors.numero} />
                      <InputField label="Bairro" name="bairro" register={form.register} error={errors.bairro} />
                      <div className="md:col-span-2">
                        <InputField label="Complemento" name="complemento" register={form.register} />
                      </div>

                      <div className="md:col-span-2">
                        <InputField label="Unidade Consumidora (UC)" name="unidadeConsumidora" register={form.register} error={errors.unidadeConsumidora} placeholder="Número da UC na conta" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={handleBack} className="w-1/3 py-3.5 rounded-full text-sm text-ink font-bold hover:bg-gray-100 transition-colors">Voltar</button>
                      <button type="button" onClick={handleNext} className="w-2/3 py-3.5 rounded-full text-sm text-white font-bold bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-accent)] shadow-lg shadow-brand/20 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">Revisar e Assinar</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SIGNATURE */}
                {step === 3 && (
                  <div className="space-y-6 animate-fadeIn h-full flex flex-col">
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100/50">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Resumo da Adesão
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-blue-800/60 text-[10px] uppercase font-bold">Titular</p>
                          <p className="font-medium text-blue-900">{values.personType === 'PJ' ? values.razaoSocial : values.fullname}</p>
                        </div>
                        <div>
                          <p className="text-blue-800/60 text-[10px] uppercase font-bold">Documento</p>
                          <p className="font-medium text-blue-900">{values.document}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-blue-800/60 text-[10px] uppercase font-bold">Endereço</p>
                          <p className="font-medium text-blue-900">{values.endereco}, {values.numero} - {values.city}</p>
                        </div>
                        <div className="sm:col-span-2 pt-2 border-t border-blue-100">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-blue-900">Plano {values.plan}</span>
                            <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded text-[10px]">Economia de {calc.pct}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div className="relative flex items-center mt-0.5">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="w-4 h-4 border border-gray-300 rounded peer-checked:bg-[color:var(--brand)] peer-checked:border-[color:var(--brand)] transition-all" />
                          <svg className="w-2.5 h-2.5 text-white absolute left-0.5 top-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Li e concordo com os Termos de Adesão e Política de Privacidade da Sion Energia.</span>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div className="relative flex items-center mt-0.5">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="w-4 h-4 border border-gray-300 rounded peer-checked:bg-[color:var(--brand)] peer-checked:border-[color:var(--brand)] transition-all" />
                          <svg className="w-2.5 h-2.5 text-white absolute left-0.5 top-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">Autorizo o uso de assinatura eletrônica para formalização deste contrato de adesão.</span>
                      </label>
                    </div>

                    {/* Clicksign Embed Area */}
                    <div 
                      id="clicksign-widget-container"
                      ref={widgetTargetRef}
                      className="flex-1 min-h-[400px] bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group hover:border-gray-300 transition-colors"
                    >
                      {!signatureKey && !loadingSigner && (
                           <div className="relative z-10 text-center p-6">
                              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </div>
                              <h5 className="font-bold text-gray-600 mb-1 text-sm">Carregando Contrato...</h5>
                              <p className="text-xs max-w-xs mx-auto mb-3">Estamos preparando seu contrato digital.</p>
                              <button onClick={initClicksign} className="text-xs text-[color:var(--brand)] underline hover:text-[color:var(--brand-accent)]">Tentar novamente</button>
                           </div>
                      )}
                      
                      {loadingSigner && (
                           <div className="flex flex-col items-center gap-3">
                               <svg className="animate-spin h-8 w-8 text-[color:var(--brand)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                               <span className="text-sm font-medium text-gray-500">Preparando documento seguro...</span>
                           </div>
                      )}
                    </div>

                    {!signatureKey && !loadingSigner && (
                        <div className="flex gap-4 pt-4 mt-auto">
                        <button type="button" onClick={handleBack} className="w-1/3 py-3.5 rounded-full text-sm text-ink font-bold hover:bg-gray-100 transition-colors">Voltar</button>
                        <button
                            type="button"
                            onClick={initClicksign}
                            className="w-2/3 py-3.5 rounded-full text-sm text-white font-bold bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-accent)] shadow-lg shadow-brand/20 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                        >
                            Assinar Digitalmente
                        </button>
                        </div>
                    )}
                    
                    {/* When widget is active, we can show just a back button or nothing */}
                    {signatureKey && (
                        <div className="flex justify-start pt-2">
                             <button type="button" onClick={handleBack} className="text-xs text-gray-400 hover:text-gray-600 underline">Voltar para edição</button>
                        </div>
                    )}
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  )
}