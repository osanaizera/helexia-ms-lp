import { NextResponse } from 'next/server'
import { LeadSchema, Step1Schema, type Lead } from '@/lib/validators'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { isAllowedRequest } from '@/lib/origin'
import { clientKeyFromRequest, rateLimit } from '@/lib/rateLimit'
import { sendGA4Event } from '@/lib/ga4'
import { estimate, type Plan as ServerPlan } from '@/lib/estimate'
import { sendFbCapiEvent } from '@/lib/fbCapi'
// RD Marketing desativado — somente CRM
import { sendToRdCrm } from '@/lib/rdcrm'

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    if(!isAllowedRequest(req)){
      return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 })
    }
    const key = clientKeyFromRequest(req) + '|lead';
    const ok = await rateLimit(key, 30, 10*60*1000);
    if(!ok) return NextResponse.json({ error:'rate_limited' }, { status: 429 })
    const { searchParams } = new URL(req.url)
    const partial = searchParams.get('partial') === '1'
    const body = await req.json()

    // Require reCAPTCHA v3 token only in production and when secret is configured
    const recaptchaRequired = !!process.env.RECAPTCHA_SECRET && process.env.NODE_ENV === 'production' && process.env.RECAPTCHA_ENFORCE !== '0'
    if(recaptchaRequired){
      const token = body?.recaptchaToken
      const verify = await verifyRecaptcha(token)
      if(!verify.success){
        console.warn('[recaptcha] verification failed on /api/lead', { score: (verify as any)?.score, errorCodes: (verify as any)?.['error-codes'] })
        return NextResponse.json({ error: 'recaptcha_failed' }, { status: 400 })
      }
    }

    let lead: Lead | Partial<Lead>
    if(partial){
      const parsed = Step1Schema.safeParse(body)
      if(!parsed.success){
        return NextResponse.json({ error:'validation_error', details: parsed.error.flatten() }, { status: 400 })
      }
      lead = parsed.data
    } else {
      const parsed = LeadSchema.safeParse(body as Lead)
      if(!parsed.success){
        return NextResponse.json({ error:'validation_error', details: parsed.error.flatten() }, { status: 400 })
      }
      lead = parsed.data
    }
    
    const eligible = (lead.avgBillValue || 0) >= 500

    // Enrich lead with server-side estimates and defaults for integrations
    const bill = lead.avgBillValue || 0
    const plan = lead.plan as ServerPlan
    const r = estimate(bill, plan)
    
    // Create an enriched lead object for integrations
    const enrichedLead = {
        ...lead,
        estimatedSaving: r.saving,
        estimatedDiscountPct: r.pct,
        segment: lead.segment || 'Residencial'
    }

    const mockEnabled = process.env.MOCK_LEAD === '1'
    if (mockEnabled){
      // Dev/unlocked path: do not call HubSpot, but optionally fire non-blocking integrations
      console.warn('[lead] MOCK_LEAD enabled or HUBSPOT token missing — skipping HubSpot, firing non-blocking events')
      // Fire GA4 server-side events (best-effort)
      try{
        if(eligible){
          const clientId = undefined
          await sendGA4Event('generate_lead', { currency:'BRL', value: r.saving, method:'lead_form', plan, bill_value: bill }, { clientId })
          await sendGA4Event('lead_submit_success', { plan, bill_value: bill }, { clientId })
        }
      }catch{}
      // Fire Meta CAPI (best-effort) — sem contexto de req específico; omite fbp/fbc
      try{
        if(eligible){
          await sendFbCapiEvent({
            eventName: 'Lead',
            eventSourceUrl: lead.landingUrl,
            value: r.saving,
            currency: 'BRL',
            email: lead.email,
            phone: lead.phone,
          })
        }
      }catch{}
      // RD Marketing desativado
      // RD CRM (allow in mock when flag is set)
      try{
        if((process.env.ALLOW_RDCRM_IN_MOCK === '1') && (process.env.RDCRM_API_TOKEN || process.env.RDSTATION_CRM_API_TOKEN)){
          await sendToRdCrm(enrichedLead as Lead)
        }
      }catch(e){ console.warn('[rdcrm] crm error (mock path)', e) }
      
      // Google Sheets Integration (Mock Path)
      try {
        const sheetsUrl = process.env.SHEETS_WEB_APP_URL
        if (sheetsUrl) {
          const secret = process.env.SHEETS_SHARED_SECRET
          // Wrap lead data in 'lead' property to match Apps Script expectation
          const sheetBody = { lead: enrichedLead, secret, partial }
          await fetch(sheetsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sheetBody)
          }).catch(e => console.error('[sheets] error', e))
        }
      } catch (e) {
        console.error('[sheets] integration error', e)
      }

      return NextResponse.json({ id: `mock_${Date.now()}`, status: eligible ? (partial ? 'partial' : 'complete') : 'unqualified', mocked: true })
    }

    // Sem HubSpot: seguimos direto para integrações não-bloqueantes e respondemos sucesso
    // Fire GA4 server-side events (Measurement Protocol) for reliability
    try{
      if(eligible){
        const clientId = undefined // could be passed from client; fallback to random in sendGA4Event
        await sendGA4Event('generate_lead', { currency:'BRL', value: r.saving, method:'lead_form', plan, bill_value: bill }, { clientId })
        await sendGA4Event('lead_submit_success', { plan, bill_value: bill }, { clientId })
      }
    }catch{}
    // Fire Meta Conversions API (server-side) for reliability
    try{
      if(eligible){
        const url = new URL(req.url)
        const cookies = req.headers.get('cookie') || ''
        const fbp = (cookies.match(/_fbp=([^;]+)/)?.[1]) || undefined
        const fbc = (cookies.match(/_fbc=([^;]+)/)?.[1]) || undefined
        const ua = req.headers.get('user-agent') || undefined
        const ip = (req.headers.get('x-forwarded-for')||'').split(',')[0]?.trim() || undefined
        await sendFbCapiEvent({
          eventName: 'Lead',
          eventSourceUrl: lead.landingUrl || url.origin,
          value: r.saving,
          currency: 'BRL',
          email: lead.email,
          phone: lead.phone,
          clientIpAddress: ip,
          clientUserAgent: ua,
          fbp, fbc,
        })
      }
    }catch{}
    // RD Marketing desativado
    // RD CRM (contato + negócio) — não bloqueante e sempre após Step 1
    try{
      if(process.env.RDCRM_API_TOKEN || process.env.RDSTATION_CRM_API_TOKEN){
        await sendToRdCrm(enrichedLead as Lead)
      } else {
        console.warn('[rdcrm] RDCRM_API_TOKEN not set — skipping')
      }
    }catch(e){
      console.warn('[rdcrm] crm error', e)
    }

    // Google Sheets Integration
    try {
      const sheetsUrl = process.env.SHEETS_WEB_APP_URL
      if (sheetsUrl) {
        const secret = process.env.SHEETS_SHARED_SECRET
        // Wrap lead data in 'lead' property to match Apps Script expectation
        const sheetBody = { lead: enrichedLead, secret, partial }
        // Fire and forget (or await if critical)
        await fetch(sheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetBody)
        }).catch(e => console.error('[sheets] error', e))
      }
    } catch (e) {
      console.error('[sheets] integration error', e)
    }

    return NextResponse.json({ id: `ok_${Date.now()}`, status: eligible ? (partial ? 'partial' : 'complete') : 'unqualified' })
  }catch(e:any){
    console.error('lead api error', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
