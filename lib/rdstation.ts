import { Lead, sanitizePhone } from './validators'

const RD_BASE = 'https://api.rd.services'

async function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)) }

function normalizeMobilePhone(raw: string){
  const digits = sanitizePhone(raw || '')
  // If already starts with country code 55, keep. Otherwise, best-effort add 55 for BR numbers with 10-11 digits
  if(digits.startsWith('55')) return digits
  if(digits.length === 10 || digits.length === 11) return `55${digits}`
  return digits
}

async function fetchRD(path: string, init: RequestInit, attempt = 0): Promise<Response>{
  const token = process.env.RDSTATION_ACCESS_TOKEN
  if(!token) throw new Error('Missing RDSTATION_ACCESS_TOKEN')
  const res = await fetch(`${RD_BASE}${path}` as any, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}) as any
    }
  })
  if([429,500,502,503,504].includes(res.status) && attempt < 3){
    const backoff = Math.pow(2, attempt) * 500
    await sleep(backoff)
    return fetchRD(path, init, attempt+1)
  }
  return res
}

export async function sendRDStationConversion(lead: Lead){
  const identifier = process.env.RDSTATION_CONVERSION_IDENTIFIER || 'Lead LP'
  const payload: Record<string, any> = {
    conversion_identifier: identifier,
    email: lead.email,
    name: lead.fullname,
    mobile_phone: normalizeMobilePhone(lead.phone),
    // Traffic/UTM
    traffic_source: lead.leadSource || undefined,
    utm_source: lead.utm?.utm_source || undefined,
    utm_medium: lead.utm?.utm_medium || undefined,
    utm_campaign: lead.utm?.utm_campaign || undefined,
    utm_term: lead.utm?.utm_term || undefined,
    utm_content: lead.utm?.utm_content || undefined,
    // Tags úteis para segmentação
    tags: [
      'lp_helexia',
      `plan:${lead.plan}`,
      lead.segment ? `segment:${lead.segment}` : undefined,
      lead.city?.includes('MS') ? 'state:MS' : undefined,
    ].filter(Boolean),
  }

  // Enviar evento de conversão (API de Eventos)
  const body = {
    event_type: 'CONVERSION',
    event_family: 'CDP',
    payload
  }
  const res = await fetchRD('/platform/events', { method:'POST', body: JSON.stringify(body) })
  if(!res.ok){
    const text = await res.text().catch(()=> '')
    throw new Error(`RD Station error ${res.status}: ${text}`)
  }
  return await res.json().catch(()=> ({ ok:true }))
}

