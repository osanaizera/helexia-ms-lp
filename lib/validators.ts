import { z } from 'zod'

export const LeadSchema = z.object({
  fullname: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10).max(16),
  documentType: z.enum(['CPF','CNPJ']),
  document: z.string().optional(),
  // Permitir < 500 para leads fora de escopo; regra de bloqueio é feita no front
  avgBillValue: z.number().min(0),
  segment: z.enum(['Residencial','Comercial','Industrial','Serviços','Outros']).optional(),
  plan: z.enum(['Livre','Prata','Ouro']),
  estimatedDiscountPct: z.number().min(0).max(100),
  estimatedSaving: z.number().min(0),
  cep: z.string().optional(),
  city: z.string().optional(),
  acceptLGPD: z.boolean().optional(),
  utm: z.record(z.string()).optional(),
  // Permitir ausência ou qualquer string; evitamos travar envio quando vazio
  fileUrl: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  msclkid: z.string().optional(),
  referrer: z.string().optional(),
  landingUrl: z.string().optional(),
  leadSource: z.string().optional(),
  outsideScope: z.boolean().optional(), // para fora de MS
});

export type Lead = z.infer<typeof LeadSchema>;

export const PartialLeadStep1Schema = z.object({
  email: z.string().email(),
  avgBillValue: z.number().min(0),
});

export type PartialLeadStep1 = z.infer<typeof PartialLeadStep1Schema>;

export function sanitizePhone(v: string){
  return (v||'').replace(/\D+/g,'');
}

export function sanitizeDoc(v: string){
  return (v||'').replace(/\D+/g,'');
}
