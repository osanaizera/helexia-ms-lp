import { NextResponse } from 'next/server'
import { LeadSchema, type Lead } from '@/lib/validators'
import { sanitizePhone } from '@/lib/validators'

function buildDealPreview(lead: Lead){
  const seg = lead.segment || '-'
  const bill = lead.avgBillValue || 0
  const pct = lead.estimatedDiscountPct || 0
  const value = Math.round((lead.estimatedSaving ?? (bill * (pct/100))) || 0)
  const title = `LP – ${seg} | ${lead.plan} | ${bill} | ${pct}%`
  const entries: Record<string, any> = {}
  const add = (keyEnv: string, value: any) => {
    const fieldKey = process.env[keyEnv]
    if(fieldKey && value !== undefined && value !== null && value !== ''){
      entries[fieldKey] = value
    }
  }
  // Mapear os mesmos campos do cliente RDCRM
  add('RDCRM_FIELD_UTM_SOURCE', lead.utm?.utm_source)
  add('RDCRM_FIELD_UTM_MEDIUM', lead.utm?.utm_medium)
  add('RDCRM_FIELD_UTM_CAMPAIGN', lead.utm?.utm_campaign)
  add('RDCRM_FIELD_UTM_TERM', lead.utm?.utm_term)
  add('RDCRM_FIELD_UTM_CONTENT', lead.utm?.utm_content)
  add('RDCRM_FIELD_TRAFFIC_SOURCE', lead.leadSource)
  add('RDCRM_FIELD_LANDING_URL', lead.landingUrl)
  add('RDCRM_FIELD_BILL_URL', lead.fileUrl)
  add('RDCRM_FIELD_ESTIMATED_DISCOUNT', lead.estimatedDiscountPct)
  add('RDCRM_FIELD_BILL_VALUE', lead.avgBillValue)
  add('RDCRM_FIELD_PLAN', lead.plan)
  add('RDCRM_FIELD_EMAIL', lead.email)
  if(lead.documentType === 'CNPJ' && lead.document){
    add('RDCRM_FIELD_CNPJ', lead.document)
  }
  const phone = sanitizePhone(lead.phone)
  add('RDCRM_FIELD_PHONE1', phone)
  add('RDCRM_FIELD_CEP', (lead as any).cep)
  if(lead.city){
    const m = lead.city.match(/^(.*?)(?:\s*-\s*([A-Z]{2}))?$/)
    if(m){
      const city = m[1]?.trim()
      const uf = m[2]?.trim()
      add('RDCRM_FIELD_CITY', city)
      add('RDCRM_FIELD_STATE', uf)
    } else {
      add('RDCRM_FIELD_CITY', lead.city)
    }
  }
  add('RDCRM_FIELD_CLUSTER', lead.segment)
  const range =
    bill < 500 ? 'ate_r$500,00' :
    bill < 1000 ? 'entre_r$500,00_e_r$_1.000,00' :
    bill < 3000 ? 'entre_r$_1.000,00_e_r$_3.000,00' :
    bill < 10000 ? 'entre_r$_3.000,00_e_r$_10.000,00' :
    'acima_de_r$_10.000,00'
  add('RDCRM_FIELD_CONSUMPTION_RANGE', range)

  const stage_id = process.env.RDCRM_STAGE_ID
  return {
    title,
    value,
    stage_id,
    contacts: [{ id: '<contact_id_here>' }],
    custom_fields: entries,
  }
}

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    const body = await req.json().catch(()=> ({}))
    const parsed = LeadSchema.safeParse(body as Lead)
    if(!parsed.success){
      return NextResponse.json({ error:'validation_error', details: parsed.error.flatten() }, { status: 400 })
    }
    const lead = parsed.data
    const deal = buildDealPreview(lead)
    return NextResponse.json({ preview: deal })
  }catch(e){
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

