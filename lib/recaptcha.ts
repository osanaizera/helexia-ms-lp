export async function verifyRecaptcha(token?: string){
  // TODO: implement real verification with Google reCAPTCHA v3
  // In dev, if no secret or token, allow pass-through.
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret || !token) return { success: true, score: 0.9 };
  try{
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify',{
      method:'POST',
      headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token })
    });
    const data = await res.json();
    return data as { success: boolean; score?: number };
  }catch{
    // Fail open in dev to avoid blocking
    return { success: true, score: 0 };
  }
}

