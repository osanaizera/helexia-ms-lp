import { Lead, sanitizeDoc, sanitizePhone } from './validators'

type CreateOpts = { partial?: boolean }

const HUBSPOT_BASE = 'https://api.hubapi.com'

async function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)) }

async function fetchHS(path: string, init: RequestInit, attempt = 0): Promise<Response>{
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  if(!token) throw new Error('Missing HUBSPOT_PRIVATE_APP_TOKEN')
  const res = await fetch(`${HUBSPOT_BASE}${path}`,{
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}) as any
    },
    // HubSpot requires HTTPS; Next server runtime handles TLS
  })
  if([429,500,502,503,504].includes(res.status) && attempt < 3){
    const backoff = Math.pow(2, attempt) * 500
    await sleep(backoff)
    return fetchHS(path, init, attempt+1)
  }
  return res
}

async function searchContactByEmail(email: string){
  const res = await fetchHS('/crm/v3/objects/contacts/search',{
    method:'POST',
    body: JSON.stringify({
      filterGroups:[{filters:[{propertyName:'email', operator:'EQ', value: email}]}],
      properties:['email']
    })
  })
  if(!res.ok) return null
  const data = await res.json()
  const id = data?.results?.[0]?.id
  return id as string | null
}

function mapProps(lead: Lead, opts?: CreateOpts){
  const props: Record<string, any> = {
    email: lead.email,
    firstname: lead.fullname?.split(' ')[0] || lead.fullname,
    lastname: lead.fullname?.split(' ').slice(1).join(' ') || '-',
    phone: sanitizePhone(lead.phone),
    helexia_plan: lead.plan,
    avg_bill_value: lead.avgBillValue,
    estimated_discount_pct: lead.estimatedDiscountPct,
    estimated_monthly_saving_brl: lead.estimatedSaving,
    lead_segment: lead.segment,
    city: lead.city,
    state: lead.city?.includes('MS') ? 'MS' : undefined,
    cep: lead.cep,
    lgpd_consent: lead.acceptLGPD ? 'true' : 'false',
    bill_file_url: lead.fileUrl,
    lead_status: lead.outsideScope ? 'fora_escopo' : (opts?.partial ? 'partial' : 'complete'),
    document: sanitizeDoc(lead.document || ''),
    document_type: lead.documentType,
    gclid: lead.gclid,
    ...(lead.utm || {})
  }
  return props
}

export async function createOrUpdateContact(lead: Lead, opts?: CreateOpts){
  const properties = mapProps(lead, opts)
  const existingId = await searchContactByEmail(lead.email)
  if(existingId){
    const res = await fetchHS(`/crm/v3/objects/contacts/${existingId}`,{ method:'PATCH', body: JSON.stringify({ properties }) })
    if(!res.ok){
      const body = await res.text()
      throw new Error(`HubSpot update error ${res.status}: ${body}`)
    }
    const data = await res.json()
    return { id: data.id as string, status: 'updated' as const }
  }
  const res = await fetchHS('/crm/v3/objects/contacts',{ method:'POST', body: JSON.stringify({ properties }) })
  if(!res.ok){
    const body = await res.text()
    throw new Error(`HubSpot create error ${res.status}: ${body}`)
  }
  const data = await res.json()
  return { id: data.id as string, status: 'created' as const }
}

