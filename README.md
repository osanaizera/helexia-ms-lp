# Sion MS LP — Next.js 14 + TypeScript

Landing page unificada (Sion) para captação de leads de energia com desconto no Mato Grosso do Sul, com simulador baseado na fatura, planos, form multi‑step, GTM e integração RD CRM (mockável em dev).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Playwright (E2E)

## Rodando localmente
1. Copie variáveis de ambiente:
   ```bash
   cp .env.local.example .env.local
   ```
   - Em dev, você pode manter `MOCK_LEAD=1` (a API de lead responde sucesso sem HubSpot).
2. Instale e suba:
   ```bash
   npm i
   npm run dev
   ```
3. Acesse: http://localhost:3000

## Variáveis de ambiente (Vercel/GitHub)
Defina no projeto (Vercel → Settings → Environment Variables):
- `NEXT_PUBLIC_GTM_ID` — ex.: `GTM-XXXXXXX`
- `RECAPTCHA_SECRET` — se for usar validação v3 server-side
- `SENTRY_DSN` — opcional
- `MOCK_LEAD` — `0` em produção; `1` em dev/staging
- `RDCRM_API_TOKEN` — token da API do RD CRM (v1), usado apenas no backend
- `RDCRM_STAGE_ID` — ID da etapa do funil onde criar a Negociação
- `RDCRM_FIELD_*` — mapeamento dos campos customizados do negócio (IDs)

Em dev local, ajuste `.env.local` conforme necessário.

## Fluxo de envio (mock em dev)
- Quando `MOCK_LEAD=1`, `POST /api/lead` retorna `id: mock_<ts>` e segue o fluxo de sucesso.
- Em produção (`MOCK_LEAD=0` + `RDCRM_API_TOKEN` definido), o backend integra com o RD CRM (v1):
- Faz upsert do Contato (por e‑mail)
- Cria uma Negociação na etapa `RDCRM_STAGE_ID`
- Grava UTM, fonte, link da fatura e métricas (desconto/valor) como campos customizados do negócio (via `RDCRM_FIELD_*`)

### Debug do payload de Negócio
- `POST /api/lead/debug` — retorna um preview do payload do Deal (title, value, stage_id, custom_fields) sem chamar a API do RD. Útil para validar o mapeamento antes de ativar em produção.

Observação: `mobile_phone` é normalizado para formato com código do país (ex.: `55<DDD><número>`). Integrações com HubSpot e RD Marketing foram removidas; apenas RD CRM permanece ativo.

## Deploy na Vercel
Duas opções:

1) via GitHub (recomendado)
- Crie o repositório e faça o push (ver abaixo).
- No dashboard da Vercel → "Add New Project" → "Import Git Repository".
- Configure as variáveis de ambiente.
- Deploy.

2) via Vercel CLI (opcional)
- Instale `vercel` globalmente e rode `vercel` no diretório do projeto (necessita rede).

`.vercelignore` já ignora testes/CI no contexto de deploy.

## Publicando no GitHub
```bash
# dentro do diretório do projeto
git init
git add -A
git commit -m "chore: initial import"
# substitua pela sua URL remota
git branch -M main
git remote add origin git@github.com:<usuario>/<repo>.git
git push -u origin main
```

## Estrutura
- `app/` — páginas, layout, APIs (App Router)
- `components/` — UI components (Hero, Plans, LeadForm, etc.)
- `lib/` — helpers (validators, rdcrm, recaptcha, gtm)
- `public/` — imagens
- `styles/` — Tailwind + CSS global
- `tests/e2e/` — Playwright stubs

## Observações
- Política de Privacidade em `/privacidade`.
- GTM é injetado via `NEXT_PUBLIC_GTM_ID`.
- O simulador exibe economia considerando desconto apenas sobre TE+TUSD (impostos fixos ~22%).
- As integrações reais (RD CRM, upload) estão preparadas para produção; em dev funcionam com mock/UI simples.
