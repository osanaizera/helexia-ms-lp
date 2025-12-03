import { test, expect } from '@playwright/test';

// Function to generate a valid CPF (simple algorithm)
function generateCPF(): string {
  const rnd = (n: number) => Math.round(Math.random() * n);
  const mod = (dividend: number, divisor: number) => Math.round(dividend - (Math.floor(dividend / divisor) * divisor));
  
  const n1 = rnd(9);
  const n2 = rnd(9);
  const n3 = rnd(9);
  const n4 = rnd(9);
  const n5 = rnd(9);
  const n6 = rnd(9);
  const n7 = rnd(9);
  const n8 = rnd(9);
  const n9 = rnd(9);
  
  let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
  d1 = 11 - (mod(d1, 11));
  if (d1 >= 10) d1 = 0;
  
  let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
  d2 = 11 - (mod(d2, 11));
  if (d2 >= 10) d2 = 0;
  
  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
}

test.describe('Clicksign API Integration', () => {
  test('should successfully create a signer, document, and signature request', async ({ request }) => {
    // 1. Prepare Data
    // We use a random CPF to avoid potential "signer already exists" or duplicate key issues if the backend doesn't handle them gracefully (though Clicksign usually does).
    const cpf = generateCPF();
    
    const payload = {
      fullname: 'QA Automation Test',
      email: 'qa.automation@example.com', // Use a dedicated testing email if possible
      phone: '11999999999',
      avgBillValue: 1500, // Number as per Zod schema
      plan: 'Prata',
      personType: 'PF',
      documentType: 'CPF',
      document: cpf,
      cep: '01001-000',
      city: 'São Paulo',
      endereco: 'Praça da Sé',
      numero: '1',
      bairro: 'Sé',
      distribuidora: 'Energisa MS',
      unidadeConsumidora: '123456789',
      estimatedDiscountPct: 10,
      estimatedSaving: 150,
      // Add other required fields if strictly validated
    };

    console.log('--- Starting Clicksign API Test ---');
    console.log(`Target Payload: ${JSON.stringify(payload, null, 2)}`);

    // 2. Send Request
    // Assuming the test runs against the local server or the baseURL configured
    // If baseURL is not set in playwright.config, we might need to specify the full URL or ensure it's set.
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const response = await request.post(`${baseURL}/api/clicksign`, {
      data: payload,
    });

    // 3. Log & Validate Response
    const status = response.status();
    let responseBody;
    
    try {
      responseBody = await response.json();
      console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);
    } catch (e) {
      const text = await response.text();
      console.log('Response is not JSON. Raw Text:');
      console.log(text);
      // Create a dummy body so assertions fail gracefully if needed, or just let them fail on undefined
      responseBody = { error: 'Non-JSON response', details: text };
    }

    console.log(`Response Status: ${status}`);

    if (status !== 200) {
        console.error('Test Failed: Server returned non-200 status.');
        if (responseBody.details) {
            console.error('Error Details from Clicksign:', responseBody.details);
        }
    }

    expect(status).toBe(200);
    expect(responseBody).toHaveProperty('success', true);
    expect(responseBody).toHaveProperty('requestSignatureKey');
    expect(responseBody).toHaveProperty('documentKey');
    expect(responseBody).toHaveProperty('clicksignHost');
    
    console.log(`Clicksign Host Used: ${responseBody.clicksignHost}`);
    
    console.log('--- Test Passed Successfully ---');
  });
});
