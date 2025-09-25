import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    const url = process.env.SHEETS_WEB_APP_URL
    if(!url){
      return NextResponse.json({ error: 'sheets_web_app_url_not_configured' }, { status: 500 })
    }
    const body = await req.json().catch(()=>null)
    if(!body){
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
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

