import { z } from 'zod'

const BaseLeadSchema = z.object({
  // Step 1
  fullname: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido").max(16),
  avgBillValue: z.number().min(1, "Informe o valor da fatura"),
  plan: z.enum(['Livre', 'Prata', 'Ouro']),

  // Step 2
  personType: z.enum(['PF', 'PJ']).default('PF'),
  documentType: z.enum(['CPF', 'CNPJ']),
  document: z.string().min(11, "Documento inválido"),

  // PJ Specific
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  responsavel: z.string().optional(), // Nome do responsável

  // PF Specific
  apelido: z.string().optional(),

  // Address & Energy
  cep: z.string().min(8, "CEP inválido"),
  city: z.string().min(2, "Cidade obrigatória"),
  uf: z.string().length(2, "UF inválida"),
  endereco: z.string().min(3, "Endereço obrigatório"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro obrigatório"),
  distribuidora: z.string().default('Energisa MS'),
  unidadeConsumidora: z.string().min(3, "UC obrigatória"),

  // System/Calculated
  segment: z.enum(['Residencial', 'Comercial', 'Industrial', 'Serviços', 'Outros']).optional(),
  estimatedDiscountPct: z.number().min(0).max(100),
  estimatedSaving: z.number().min(0),
  acceptLGPD: z.boolean().optional(),
  utm: z.record(z.string()).optional(),
  fileUrl: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  msclkid: z.string().optional(),
  referrer: z.string().optional(),
  landingUrl: z.string().optional(),
  leadSource: z.string().optional(),
  outsideScope: z.boolean().optional(),
});

export const LeadSchema = BaseLeadSchema.superRefine((data, ctx) => {
  if (data.personType === 'PJ') {
    if (!data.razaoSocial || data.razaoSocial.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Razão Social é obrigatória",
        path: ["razaoSocial"],
      });
    }
    if (!data.responsavel || data.responsavel.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nome do responsável é obrigatório",
        path: ["responsavel"],
      });
    }
    // Also validate document for PJ specifically if needed, but the main regex/length is usually enough
  }
});

export type Lead = z.infer<typeof LeadSchema>;

export const Step1Schema = BaseLeadSchema.pick({
  fullname: true,
  email: true,
  phone: true,
  avgBillValue: true,
  plan: true
});

export const Step2Schema = BaseLeadSchema.pick({
  personType: true,
  documentType: true,
  document: true,
  razaoSocial: true,
  nomeFantasia: true,
  responsavel: true,
  apelido: true,
  cep: true,
  city: true,
  uf: true,
  endereco: true,
  numero: true,
  complemento: true,
  bairro: true,
  distribuidora: true,
  unidadeConsumidora: true,
});

export function sanitizePhone(v: string) {
  return (v || '').replace(/\D+/g, '');
}

export function sanitizeDoc(v: string) {
  return (v || '').replace(/\D+/g, '');
}
