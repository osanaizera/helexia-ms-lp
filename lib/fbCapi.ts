import crypto from 'crypto'

function sha256(input: string){
  return crypto.createHash('sha256').update(input).digest('hex')
}

function normEmail(email?: string){
  const v = (email||'').trim().toLowerCase()
  return v ? sha256(v) : undefined
}
function normPhone(phone?: string){
  const digits = (phone||'').replace(/\D+/g,'')
  return digits ? sha256(digits) : undefined
}

export type FbCapiParams = {
  eventName: string
  eventTime?: number
  eventSourceUrl?: string
  eventId?: string
  value?: number
  currency?: string
  email?: string
  phone?: string
  clientIpAddress?: string
  clientUserAgent?: string
  fbp?: string
  fbc?: string
}

export async function sendFbCapiEvent(p: FbCapiParams){
  const pixelId = process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID
  const accessToken = process.env.FB_CAPI_ACCESS_TOKEN
  const testCode = process.env.FB_TEST_EVENT_CODE
  if(!pixelId || !accessToken) return
  const endpoint = `https://graph.facebook.com/v17.0/${pixelId}/events`
  const event_time = Math.floor((p.eventTime || Date.now())/1000)
  const user_data: Record<string, any> = {
    em: normEmail(p.email),
    ph: normPhone(p.phone),
    client_ip_address: p.clientIpAddress,
    client_user_agent: p.clientUserAgent,
    fbp: p.fbp,
    fbc: p.fbc,
  }
  // Remove empty fields
  Object.keys(user_data).forEach((k)=>{ if(user_data[k] == null || user_data[k] === '') delete user_data[k] })
  const payload: any = {
    data: [
      {
        event_name: p.eventName,
        event_time,
        action_source: 'website',
        event_source_url: p.eventSourceUrl,
        event_id: p.eventId,
        user_data,
        custom_data: {
          value: p.value,
          currency: p.currency || 'BRL'
        }
      }
    ],
    access_token: accessToken,
  }
  if(testCode){ payload.test_event_code = testCode }
  try{
    await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
  }catch{}
}

