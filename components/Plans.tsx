"use client"
import { useState, useRef } from 'react'

type PlanKey = 'Livre' | 'Prata' | 'Ouro'

const PLANS = [
  {
    key: 'Livre',
    title: 'Plano Livre',
    maxDiscount: '35%',
    fidelity: 'Sem fidelidade',
    popular: true,
    tiers: [
      { color: 'text-green-600', val: '25% de desconto' },
      { color: 'text-yellow-500', val: '27% de desconto' },
      { color: 'text-orange-500', val: '30% de desconto' },
      { color: 'text-red-600', val: '35% de desconto' },
    ],
    // Using Sion Brand (Dark) for the "Free" plan as it's the standard/base
    headerColor: 'text-[color:var(--brand)]',
    btnColor: 'bg-[color:var(--brand)] text-white hover:bg-black',
    badgeColor: 'bg-[color:var(--brand)]'
  },
  {
    key: 'Prata',
    title: 'Plano Prata',
    maxDiscount: '37%',
    fidelity: 'Fidelidade de 12 meses',
    popular: false,
    tiers: [
      { color: 'text-green-600', val: '28% de desconto' },
      { color: 'text-yellow-500', val: '30% de desconto' },
      { color: 'text-orange-500', val: '33% de desconto' },
      { color: 'text-red-600', val: '37% de desconto' },
    ],
    // Using Grey for Silver
    headerColor: 'text-[#7a7a7a]',
    btnColor: 'bg-[#999999] text-white hover:bg-[#7a7a7a]',
    badgeColor: 'bg-[#999999]'
  },
  {
    key: 'Ouro',
    title: 'Plano Ouro',
    maxDiscount: '40%',
    fidelity: 'Fidelidade de 24 meses',
    popular: false,
    tiers: [
      { color: 'text-green-600', val: '30% de desconto' },
      { color: 'text-yellow-500', val: '32% de desconto' },
      { color: 'text-orange-500', val: '35% de desconto' },
      { color: 'text-red-600', val: '40% de desconto' },
    ],
    // Using Gold
    headerColor: 'text-[#C5A02F]',
    btnColor: 'bg-[#C5A02F] text-white hover:bg-[#b08d26]',
    badgeColor: 'bg-[#C5A02F]'
  },
]

export default function Plans({ onSelect, selected }: { onSelect?: (p: PlanKey) => void, selected?: string }) {
  const handleSelect = (key: string) => {
    if (onSelect) onSelect(key as PlanKey)
    const el = document.getElementById('leadform')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-bg" id="plans">
      <div className="container-pad">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Escolha o plano ideal para sua empresa</h2>
          <p className="section-sub text-lg text-muted mt-4">
            Quanto maior o tempo de parceria, maior o desconto garantido na sua fatura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {PLANS.map((p) => {
            const isSelected = selected === p.key
            return (
              <div
                key={p.key}
                onClick={() => handleSelect(p.key)}
                className={`relative flex flex-col rounded-3xl bg-white transition-all duration-300 cursor-pointer group
                  ${p.popular ? 'shadow-2xl scale-105 z-10 border-2 border-[color:var(--brand)]' : 'shadow-lg hover:shadow-xl border border-line hover:border-[color:var(--brand-accent)]'}
                  ${isSelected ? 'ring-4 ring-[color:var(--brand-accent)] ring-opacity-50' : ''}
                `}
              >
                {p.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[color:var(--brand)] text-white py-2 px-6 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg">
                    Mais Popular
                  </div>
                )}

                <div className={`p-8 flex flex-col h-full items-center text-center ${p.popular ? 'pt-10' : ''}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${p.headerColor}`}>
                    {p.title}
                  </h3>

                  <div className="my-6 w-16 h-1 bg-line rounded-full" />

                  <div className="flex items-baseline justify-center gap-1 mb-8">
                    <span className="text-sm text-muted font-medium">Até</span>
                    <span className={`text-5xl font-extrabold ${p.headerColor}`}>
                      {p.maxDiscount}
                    </span>
                    <span className="text-sm text-muted font-medium">OFF</span>
                  </div>

                  <ul className="space-y-4 w-full mb-8 text-left pl-4">
                    {p.tiers.map((t, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-ink/80">
                        <svg className={`w-5 h-5 shrink-0 ${t.color}`} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 21h2v-8h14l-2-5 2-5H5v18z" />
                        </svg>
                        {t.val}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-xl font-bold transition-all transform group-hover:scale-[1.02] active:scale-95 shadow-md ${p.btnColor}`}
                  >
                    {isSelected ? 'Plano Selecionado' : p.fidelity}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
