import { NextResponse } from 'next/server'
import { LeadSchema, type Lead } from '@/lib/validators'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { createOrUpdateContact } from '@/lib/hubspot'

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const partial = searchParams.get('partial') === '1'
    const body = await req.json()

    // Optional reCAPTCHA v3 token
    if(body?.recaptchaToken){
      const verify = await verifyRecaptcha(body.recaptchaToken)
      if(!verify.success){
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
    return NextResponse.json({ id: result.id, status: partial ? 'partial' : 'complete' })
  }catch(e:any){
    console.error('lead api error', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
