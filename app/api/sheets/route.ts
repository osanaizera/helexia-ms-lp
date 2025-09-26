import { NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { isAllowedRequest } from '@/lib/origin'
import { clientKeyFromRequest, rateLimit } from '@/lib/rateLimit'

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    if(!isAllowedRequest(req)){
      return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 })
    }
    const key = clientKeyFromRequest(req) + '|sheets';
    const ok = await rateLimit(key, 30, 10*60*1000);
    if(!ok) return NextResponse.json({ error:'rate_limited' }, { status: 429 })
    const url = process.env.SHEETS_WEB_APP_URL
    if(!url){
      return NextResponse.json({ error: 'sheets_web_app_url_not_configured' }, { status: 500 })
    }
    const body = await req.json().catch(()=>null)
    if(!body){
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }
    // Do NOT require recaptcha on /api/sheets: rely on origin check, rate limiting, and shared secret with Apps Script

    // Validate file type/size if present
    if(body.file){
      const allowed = ['image/png','image/jpeg','application/pdf']
      const ct = body.file.contentType as string | undefined
      const b64 = body.file.base64 as string | undefined
      if(!ct || !allowed.includes(ct)){
        return NextResponse.json({ error: 'invalid_file_type' }, { status: 400 })
      }
      if(b64){
        // approximate base64 size in bytes
        const len = b64.length
        const padding = (b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0))
        const bytes = Math.floor(len * 3/4) - padding
        const maxBytes = 5 * 1024 * 1024 // 5 MB
        if(bytes > maxBytes){
          return NextResponse.json({ error: 'file_too_large' }, { status: 400 })
        }
      }
    }

    // Forward document as provided (per request: store full CPF/CNPJ in Sheets)

    // Inject shared secret for Apps Script validation
    const shared = process.env.SHEETS_SHARED_SECRET
    const forwardBody = shared ? { ...body, secret: shared } : body
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forwardBody)
    })
    const text = await res.text()
    if(!res.ok){
      return NextResponse.json({ error: 'sheets_forward_failed', status: res.status, body: text }, { status: 502 })
    }
    try{
      const json = JSON.parse(text)
      return NextResponse.json(json)
    }catch{
      return NextResponse.json({ ok: true, upstream: text })
    }
  }catch(e:any){
    console.error('sheets api error', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
