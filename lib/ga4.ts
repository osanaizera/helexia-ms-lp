export async function sendGA4Event(eventName: string, params: Record<string, any>, opts?: { clientId?: string; userId?: string }){
  const measurementId = process.env.GA4_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET
  if(!measurementId || !apiSecret) return
  const client_id = opts?.clientId || `${Date.now()}.${Math.floor(Math.random()*1e10)}`
  const body = {
    client_id,
    non_personalized_ads: false,
    events: [ { name: eventName, params } ]
  }
  try{
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,{
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body)
    })
  }catch{}
}

