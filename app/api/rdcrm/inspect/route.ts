import { NextResponse } from 'next/server'

async function sleep(ms:number){ return new Promise(r=>setTimeout(r,ms)) }

const RDCRM_BASE = process.env.RDCRM_BASE || 'https://crm.rdstation.com/api/v1'

async function rd(path: string, init: RequestInit = {}){
  const token = process.env.RDCRM_API_TOKEN || process.env.RDSTATION_CRM_API_TOKEN
  if(!token) throw new Error('Missing RDCRM_API_TOKEN')
  const url = `${RDCRM_BASE}${path}${path.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
  const res = await fetch(url as any, { ...init, headers: { 'Accept':'application/json','Content-Type':'application/json', ...(init.headers||{}) } })
  return res
}

export const runtime = 'nodejs'

export async function GET(req: Request){
  try{
    const url = new URL(req.url)
    const email = url.searchParams.get('email') || ''
    const secret = url.searchParams.get('secret') || ''
    if(!email) return NextResponse.json({ error:'missing_email' }, { status: 400 })
    const expected = process.env.RDCRM_INSPECT_SECRET || process.env.SHEETS_SHARED_SECRET || ''
    if(!expected || secret !== expected) return NextResponse.json({ error:'forbidden' }, { status: 403 })

    const c = await rd(`/contacts?email=${encodeURIComponent(email)}`)
    const contacts = await c.json().catch(()=> ({})) as any
    const contact = contacts?.contacts?.[0]
    if(!contact) return NextResponse.json({ contact: null, deals: [] })
    const stageId = process.env.RDCRM_STAGE_ID || ''
    const d = await rd(`/deals?contact_id=${encodeURIComponent(contact.id)}${stageId ? `&deal_stage_id=${encodeURIComponent(stageId)}`:''}&status=open`)
    const deals = await d.json().catch(()=> []) as any
    const last = Array.isArray(deals) ? deals[0] : null
    let full: any = null
    if(last?.id){
      const one = await rd(`/deals/${encodeURIComponent(last.id)}`)
      full = await one.json().catch(()=> null)
    }
    return NextResponse.json({ contact, deals, last: full })
  }catch(e){
    return NextResponse.json({ error:'internal_error' }, { status: 500 })
  }
}

