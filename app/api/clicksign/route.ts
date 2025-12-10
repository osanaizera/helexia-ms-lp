import { NextResponse } from 'next/server';
import type { Lead } from '@/lib/validators';

const CLICKSIGN_API_KEY = process.env.CLICKSIGN_API_KEY;
const CLICKSIGN_HOST = process.env.CLICKSIGN_HOST || 'https://app.clicksign.com';
const API_BASE = `${CLICKSIGN_HOST}/api/v1`;

// Map of templates based on Plan + PersonType
const TEMPLATES = {
    Prata: {
        PF: process.env.CLICKSIGN_TEMPLATE_PRATA_CPF_EMAIL,
        PJ: process.env.CLICKSIGN_TEMPLATE_PRATA_CNPJ_EMAIL,
    },
    Ouro: {
        PF: process.env.CLICKSIGN_TEMPLATE_OURO_CPF_EMAIL,
        PJ: process.env.CLICKSIGN_TEMPLATE_OURO_CNPJ_EMAIL,
    },
    Livre: {
        PF: process.env.CLICKSIGN_TEMPLATE_PRATA_CPF_EMAIL,
        PJ: process.env.CLICKSIGN_TEMPLATE_PRATA_CNPJ_EMAIL,
    }
};

export async function POST(request: Request) {
  if (!CLICKSIGN_API_KEY) {
    return NextResponse.json({ error: 'CLICKSIGN_API_KEY is missing.' }, { status: 500 });
  }

  try {
    const lead: Lead = await request.json();

    const plan = (lead.plan || 'Prata') as keyof typeof TEMPLATES;
    const type = (lead.personType || 'PF') as 'PF' | 'PJ';
    
    const planTemplates = TEMPLATES[plan] || TEMPLATES['Prata'];
    const templateId = planTemplates[type];

    if (!templateId) {
        console.error(`Missing Clicksign Template for Plan: ${plan}, Type: ${type}`);
        return NextResponse.json({ error: `Configuration error: No template found for Plan ${plan} and Type ${type}` }, { status: 500 });
    }

    // 1. Create/Find Signer
    const signerName = lead.personType === 'PJ' ? lead.responsavel : lead.fullname;
    const signerResponse = await fetch(`${API_BASE}/signers?access_token=${CLICKSIGN_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signer: {
          email: lead.email,
          name: signerName,
          auths: ['email'],
          has_documentation: false,
          self_declared_credential: true
        }
      })
    });
    
    if (!signerResponse.ok) {
        const errorText = await signerResponse.text();
        console.error('Clicksign Signer Error:', errorText);
        return NextResponse.json({ error: 'Failed to create signer', details: errorText }, { status: signerResponse.status });
    }

    const signerData = await signerResponse.json();
    const signerKey = signerData.signer.key;

    // 2. Create Document from Template
    // Prepare Data - Sanitize and map correctly
    // Removing non-digits helps avoid formatting issues in templates that expect raw numbers
    // But some templates expect formatted. Sending as is (from form) usually works if form has mask.
    // Form currently has placeholders but no strict mask enforcement in state, let's send as received but also clean versions if needed.
    // Actually, based on issues, let's try to be verbose.

    const templateData = {
        // Personal / Company Info
        "Nome Completo": lead.fullname, // Nome do contato/cliente PF
        "Nome Responsável": lead.responsavel || '', // Para PJ
        "Nome": signerName, // Genérico
        
        "Email": lead.email,
        "Telefone": lead.phone,
        
        // Documents - Mapeamento explícito para evitar conflito
        "CPF": lead.personType === 'PF' ? lead.document : '', 
        "CNPJ": lead.personType === 'PJ' ? lead.document : '',
        // Alguns templates podem usar "Documento" genérico
        "Documento": lead.document,

        "Razão Social": lead.razaoSocial || '',
        "Nome Fantasia": lead.nomeFantasia || '',
        
        // Address
        "Endereço": lead.endereco,
        "Logradouro": lead.endereco,
        "Rua": lead.endereco,
        "Número": lead.numero,
        "Bairro": lead.bairro,
        "Cidade": lead.city,
        "Estado": lead.uf,
        "UF": lead.uf,
        "CEP": lead.cep,
        "Complemento": lead.complemento || '',

        // Plan & Energy
        "Plano": lead.plan,
        "Valor Conta": lead.avgBillValue ? lead.avgBillValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '',
        "Unidade Consumidora": lead.unidadeConsumidora,
        "UC": lead.unidadeConsumidora,
        "Distribuidora": lead.distribuidora
    };

    const docResponse = await fetch(`${API_BASE}/templates/${templateId}/documents?access_token=${CLICKSIGN_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document: {
          path: `/contratos/${lead.plan}_${type}_${lead.document.replace(/\D/g,'')}_${Date.now()}.docx`,
          template: {
            data: templateData
          }
        }
      })
    });

    if (!docResponse.ok) {
        const errorText = await docResponse.text();
        console.error('Clicksign Document Error:', errorText);
        return NextResponse.json({ error: 'Failed to create document', details: errorText }, { status: docResponse.status });
    }

    const docData = await docResponse.json();
    const docKey = docData.document.key;

    // 3. Add Signer to Document
    const listResponse = await fetch(`${API_BASE}/lists?access_token=${CLICKSIGN_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            list: {
                document_key: docKey,
                signer_key: signerKey,
                sign_as: 'contractor',
                message: 'Por favor, assine o documento.'
            }
        })
    });

    if (!listResponse.ok) {
        const errorText = await listResponse.text();
        console.error('Clicksign List Error:', errorText);
        return NextResponse.json({ error: 'Failed to add signer to document', details: errorText }, { status: listResponse.status });
    }
    
    const listData = await listResponse.json();
    const requestSignatureKey = listData.list.request_signature_key;

    return NextResponse.json({ 
        success: true, 
        requestSignatureKey,
        documentKey: docKey,
        clicksignHost: CLICKSIGN_HOST
    });

  } catch (error) {
    console.error('Clicksign Integration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}