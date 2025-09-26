import { NextResponse } from 'next/server'
import { LeadSchema, type Lead } from '@/lib/validators'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { isAllowedRequest } from '@/lib/origin'
import { clientKeyFromRequest, rateLimit } from '@/lib/rateLimit'
import { createOrUpdateContact } from '@/lib/hubspot'
import { sendGA4Event } from '@/lib/ga4'
import { estimate, type Plan as ServerPlan } from '@/lib/estimate'
import { sendFbCapiEvent } from '@/lib/fbCapi'

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

    const parsed = LeadSchema.safeParse(body as Lead)
    if(!parsed.success){
      return NextResponse.json({ error:'validation_error', details: parsed.error.flatten() }, { status: 400 })
    }
    const lead = parsed.data

    const mockEnabled = process.env.MOCK_LEAD === '1' || !process.env.HUBSPOT_PRIVATE_APP_TOKEN
    if (mockEnabled){
      // Dev/unlocked path: do not call HubSpot, return mock id
      console.warn('[lead] MOCK_LEAD enabled or HUBSPOT token missing — returning mocked id')
      return NextResponse.json({ id: `mock_${Date.now()}`, status: partial ? 'partial' : 'complete', mocked: true })
    }

    const result = await createOrUpdateContact(lead, { partial })
    // Fire GA4 server-side events (Measurement Protocol) for reliability
    try{
      const bill = lead.avgBillValue || 0
      const plan = lead.plan as ServerPlan
      const r = estimate(bill, plan)
      const clientId = undefined // could be passed from client; fallback to random in sendGA4Event
      await sendGA4Event('generate_lead', { currency:'BRL', value: r.saving, method:'lead_form', plan, bill_value: bill }, { clientId })
      await sendGA4Event('lead_submit_success', { plan, bill_value: bill }, { clientId })
    }catch{}
    // Fire Meta Conversions API (server-side) for reliability
    try{
      const url = new URL(req.url)
      const cookies = req.headers.get('cookie') || ''
      const fbp = (cookies.match(/_fbp=([^;]+)/)?.[1]) || undefined
      const fbc = (cookies.match(/_fbc=([^;]+)/)?.[1]) || undefined
      const ua = req.headers.get('user-agent') || undefined
      const ip = (req.headers.get('x-forwarded-for')||'').split(',')[0]?.trim() || undefined
      const bill = lead.avgBillValue || 0
      const plan = lead.plan as ServerPlan
      const r = estimate(bill, plan)
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
    }catch{}
    return NextResponse.json({ id: result.id, status: partial ? 'partial' : 'complete' })
  }catch(e:any){
    console.error('lead api error', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
