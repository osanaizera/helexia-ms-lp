import { Lead, sanitizePhone } from './validators'

const RDCRM_BASE = process.env.RDCRM_BASE || 'https://crm.rdstation.com/api/v1'

async function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)) }

function normalizeMobilePhone(raw: string){
  const digits = sanitizePhone(raw || '')
  if(digits.startsWith('55')) return digits
  if(digits.length === 10 || digits.length === 11) return `55${digits}`
  return digits
}

const RDCRM_DEBUG = process.env.RDCRM_DEBUG === '1'

function safePreviewBody(body: any): string | undefined{
  try{
    if(!body) return undefined
    if(typeof body === 'string') return body.slice(0, 800)
    return JSON.stringify(body).slice(0, 800)
  }catch{ return undefined }
}

async function fetchRDCRM(path: string, init: RequestInit = {}, attempt = 0): Promise<Response>{
  const token = process.env.RDCRM_API_TOKEN || process.env.RDSTATION_CRM_API_TOKEN
  if(!token) throw new Error('Missing RDCRM_API_TOKEN')
  const url = `${RDCRM_BASE}${path}${path.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
  const method = (init.method || 'GET').toUpperCase()
  const bodyPreview = safePreviewBody((init as any)?.body)
  const res = await fetch(url as any, {
    ...init,
    headers: {
      // v1 aceita token via query param; mantemos header vazio para evitar 401 em alguns tenants
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers || {}) as any,
    }
  })
  const reqId = res.headers.get('x-request-id') || res.headers.get('X-Request-Id') || undefined
  if(RDCRM_DEBUG){
    const info = { method, url: path, status: res.status, reqId, attempt }
    if(res.status >= 400){
      const text = await res.clone().text().catch(()=> '')
      console.warn('[rdcrm][http]', info, { error: text.slice(0, 1000), bodyPreview })
    } else {
      console.log('[rdcrm][http]', info)
    }
  }
  if([429,500,502,503,504].includes(res.status) && attempt < 3){
    const backoff = Math.pow(2, attempt) * 500
    await sleep(backoff)
    return fetchRDCRM(path, init, attempt+1)
  }
  return res
}

type Contact = { id: string, name?: string, emails?: string[], phones?: string[] }

async function findContactByEmail(email: string): Promise<Contact | null>{
  // Tentativa padrão por query param ?email=
  const res = await fetchRDCRM(`/contacts?email=${encodeURIComponent(email)}`, { method: 'GET' })
  if(res.status === 404) return null
  if(!res.ok){
    // Se pesquisa não suportar por email, trate como não encontrado
    return null
  }
  try{
    const data = await res.json()
    if(Array.isArray(data) && data.length > 0) return data[0]
    if(data && data.id) return data
  }catch{}
  return null
}

async function createContact(input: { name?: string, email: string, phone?: string }): Promise<Contact>{
  const body: any = {
    name: input.name,
    // RD CRM v1 aceita nested arrays de objetos
    emails: input.email ? [{ email: input.email }] : [],
    phones: input.phone ? [{ phone: normalizeMobilePhone(input.phone) }] : [],
  }
  const res = await fetchRDCRM('/contacts', { method:'POST', body: JSON.stringify(body) })
  if(!res.ok){
    const text = await res.text().catch(()=> '')
    throw new Error(`RD CRM create contact error ${res.status}: ${text}`)
  }
  return await res.json()
}

async function updateContact(id: string, input: { name?: string, phone?: string }): Promise<Contact>{
  const body: any = {
    name: input.name,
    phones: input.phone ? [{ phone: normalizeMobilePhone(input.phone) }] : undefined,
  }
  const res = await fetchRDCRM(`/contacts/${encodeURIComponent(id)}`, { method:'PUT', body: JSON.stringify(body) })
  if(!res.ok){
    const text = await res.text().catch(()=> '')
    throw new Error(`RD CRM update contact error ${res.status}: ${text}`)
  }
  return await res.json()
}

async function upsertContactByEmail({ name, email, phone }: { name?: string, email: string, phone?: string }): Promise<Contact>{
  const existing = await findContactByEmail(email).catch(()=> null)
  if(existing && existing.id){
    try{ return await updateContact(existing.id, { name, phone }) }catch{ return existing }
  }
  return await createContact({ name, email, phone })
}

function buildDealCustomFields(lead: Lead){
  const entries: Record<string, any> = {}
  const add = (keyEnv: string, value: any) => {
    const fieldKey = process.env[keyEnv]
    if(fieldKey && value !== undefined && value !== null && value !== ''){
      entries[fieldKey] = value
    }
  }
  // UTMs e origem
  add('RDCRM_FIELD_UTM_SOURCE', lead.utm?.utm_source)
  add('RDCRM_FIELD_UTM_MEDIUM', lead.utm?.utm_medium)
  add('RDCRM_FIELD_UTM_CAMPAIGN', lead.utm?.utm_campaign)
  add('RDCRM_FIELD_UTM_TERM', lead.utm?.utm_term)
  add('RDCRM_FIELD_UTM_CONTENT', lead.utm?.utm_content)
  add('RDCRM_FIELD_TRAFFIC_SOURCE', lead.leadSource)
  // URLs
  add('RDCRM_FIELD_LANDING_URL', lead.landingUrl)
  add('RDCRM_FIELD_BILL_URL', lead.fileUrl)
  // Métricas da fatura
  add('RDCRM_FIELD_ESTIMATED_DISCOUNT', lead.estimatedDiscountPct)
  add('RDCRM_FIELD_BILL_VALUE', lead.avgBillValue)
  add('RDCRM_FIELD_PLAN', lead.plan)
  // Contatos/identificação
  add('RDCRM_FIELD_EMAIL', lead.email)
  if(lead.documentType === 'CNPJ' && lead.document){
    add('RDCRM_FIELD_CNPJ', lead.document)
  }
  // Telefones (repete phone em PHONE1 se configurado)
  const phone = normalizeMobilePhone(lead.phone)
  add('RDCRM_FIELD_PHONE1', phone)
  // Endereço básico
  add('RDCRM_FIELD_CEP', (lead as any).cep)
  // Cidade/Estado: tentar separar "Cidade - UF" se vier nesse formato
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
  // Segmento → Cluster
  add('RDCRM_FIELD_CLUSTER', lead.segment)
  // Faixa de consumo por fatura média
  const bill = lead.avgBillValue || 0
  const range =
    bill < 500 ? 'ate_r$500,00' :
    bill < 1000 ? 'entre_r$500,00_e_r$_1.000,00' :
    bill < 3000 ? 'entre_r$_1.000,00_e_r$_3.000,00' :
    bill < 10000 ? 'entre_r$_3.000,00_e_r$_10.000,00' :
    'acima_de_r$_10.000,00'
  add('RDCRM_FIELD_CONSUMPTION_RANGE', range)
  return entries
}

async function findRecentDealByContactStage(contactId: string, stageId: string, windowMs = 2*60*60*1000){
  try{
    const res = await fetchRDCRM(`/deals?contact_id=${encodeURIComponent(contactId)}&deal_stage_id=${encodeURIComponent(stageId)}&status=open`, { method:'GET' })
    if(!res.ok) return null
    const list = await res.json().catch(()=> [])
    if(!Array.isArray(list)) return null
    const now = Date.now()
    const recent = list.find((d:any)=>{
      const created = new Date(d.created_at || d.createdAt || 0).getTime()
      return created && (now - created) <= windowMs
    })
    return recent || null
  }catch{ return null }
}

export async function createDealForLead(contactId: string, lead: Lead){
  const stageId = process.env.RDCRM_STAGE_ID || process.env.RDSTATION_STAGE_ID
  if(!stageId) throw new Error('Missing RDCRM_STAGE_ID')
  const seg = lead.segment || '-'
  const bill = lead.avgBillValue || 0
  const pct = lead.estimatedDiscountPct || 0
  const value = Math.round((lead.estimatedSaving ?? (bill * (pct/100))) || 0)
  // Nome do negócio deve ser o nome do lead
  const title = lead.fullname || lead.email
  // Campos customizados do Deal (v1 aceita array com custom_field_id/value)
  const cfMap = buildDealCustomFields(lead)
  const deal_custom_fields = Object.entries(cfMap).map(([custom_field_id, value])=>({ custom_field_id, value }))
  // Idempotência: evita duplicar negócio aberto nas últimas 2h
  const existing = await findRecentDealByContactStage(contactId, stageId)
  if(existing) return existing
  // 1) Cria o Deal (alguns tenants ignoram custom fields na criação)
  const createBody: any = {
    name: title,
    deal_stage_id: stageId,
    contact_ids: [contactId],
  }
  const res = await fetchRDCRM('/deals', { method:'POST', body: JSON.stringify(createBody) })
  if(!res.ok){
    const text = await res.text().catch(()=> '')
    throw new Error(`RD CRM create deal error ${res.status}: ${text}`)
  }
  const created = await res.json()
  const dealId = created?.id || created?._id
  if(dealId){
    // 2) Atualiza valores e campos customizados com wrapper deal{...}
    const updateBody = {
      deal: {
        amount_total: value,
        amount_unique: value,
        deal_custom_fields_attributes: deal_custom_fields,
        contact_ids: [contactId],
      }
    }
    const upd = await fetchRDCRM(`/deals/${encodeURIComponent(dealId)}`, { method:'PUT', body: JSON.stringify(updateBody) })
    // mesmo se falhar a atualização, retornamos o created para não bloquear o fluxo
    try{ await upd.json().catch(()=> ({})) }catch{}
  }
  return created
}

export async function sendToRdCrm(lead: Lead){
  const contact = await upsertContactByEmail({ name: lead.fullname, email: lead.email, phone: lead.phone })
  const deal = await createDealForLead(contact.id, lead)
  return { contact, deal }
}
