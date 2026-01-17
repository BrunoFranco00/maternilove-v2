# DEPLOY_GUIDE.md
## Documentação de Deploy (Leitura e Educativa)

**Versão:** 1.0  
**Data:** 2025-01-09  
**Status:** AUTORITATIVO

---

## ⚠️ AVISO CRÍTICO

**Este é um guia de LEITURA e EDUCAÇÃO. Ele explica COMO o deploy funciona, não instrui a fazer deploy manualmente.**

**NÃO use este guia para:**
- ❌ Fazer deploy manual sem aprovação
- ❌ Alterar configurações de produção
- ❌ Modificar pipelines de CI/CD
- ❌ Quebrar processo de deploy automático

**Use este guia para:**
- ✅ Entender como o deploy funciona
- ✅ Entender o processo automático
- ✅ Compreender onde não mexer
- ✅ Educar-se sobre infraestrutura

---

## VISÃO GERAL

O projeto Materni_Love – V2 usa **deploy automático via GitHub** para:

- **Backend:** Railway (infraestrutura e banco de dados)
- **Frontend:** Vercel (hosting e CDN)

**Deploy é AUTOMÁTICO** quando código é enviado para branch `master` (ou `main`).

---

## BACKEND: RAILWAY

### Como Railway Funciona no Projeto

**Railway** é a plataforma de infraestrutura que hospeda:
- Servidor backend (Node.js/Express)
- Banco de dados PostgreSQL
- Variáveis de ambiente de produção

### Processo de Deploy

**1. Trigger Automático:**
```
Push para branch master → Railway detecta → Inicia build
```

**2. Build Process:**
```bash
# Railway executa automaticamente:
npm install                    # Instala dependências
npm run build                  # Compila TypeScript
prisma generate                # Gera Prisma Client
```

**3. Prestart (CRÍTICO):**
```bash
# Railway executa ANTES de iniciar servidor:
npm run prestart
# Que executa:
# - node dist/scripts/resolveFailedMigration.js || true
# - prisma migrate deploy
```

**IMPORTANTE:** Migrations são aplicadas **automaticamente** via `prestart`.

**4. Start:**
```bash
# Railway inicia servidor:
npm start
# Que executa:
# node dist/src/server.js
```

### Onde Ficam Variáveis de Ambiente

**No Railway Dashboard:**
1. Acessar projeto no Railway
2. Abrir serviço do backend
3. Abrir aba "Variables"
4. Variáveis configuradas lá são injetadas no ambiente

**Variáveis Obrigatórias em Produção:**
- `DATABASE_URL` - URL do PostgreSQL (Railway fornece automaticamente)
- `JWT_SECRET` - Secret para JWT (deve ser gerado e configurado manualmente)
- `JWT_REFRESH_SECRET` - Secret para Refresh Token (opcional, usa JWT_SECRET se não fornecido)
- `NODE_ENV` - Deve ser "production"
- `PORT` - Porta (Railway fornece automaticamente via $PORT)
- `CORS_ORIGIN` - Domínio do frontend (Vercel)

### Onde NÃO Mexer

**NÃO altere:**
- ❌ Configuração de build (Railway detecta automaticamente)
- ❌ Script `prestart` sem aprovação (migrations automáticas dependem dele)
- ❌ Script `start` sem aprovação (iniciação do servidor depende dele)
- ❌ Variáveis de ambiente sem aprovação
- ❌ Configuração do banco de dados (Railway gerencia)

### Como Migrations São Aplicadas

**Automaticamente via `prestart`:**

```json
{
  "scripts": {
    "prestart": "node dist/scripts/resolveFailedMigration.js || true && prisma migrate deploy"
  }
}
```

**Processo:**
1. Railway executa `prestart` antes de `start`
2. `resolveFailedMigration.js` tenta resolver migrations falhas (se houver)
3. `prisma migrate deploy` aplica migrations pendentes
4. Se migrations falharem, deploy falha (servidor não inicia)

**IMPORTANTE:**
- Migrations são aplicadas **toda vez** que servidor inicia
- Isso garante que banco está sempre sincronizado
- **NÃO** rode migrations manualmente (automático via prestart)

### Como Rollback Funciona

**Opção 1: Reverter Commit (Recomendado)**

```bash
# Reverter último commit
git revert HEAD
git push origin master

# Railway detecta push e faz novo deploy
```

**Opção 2: Rollback via Railway Dashboard**

1. Acessar Railway Dashboard
2. Abrir serviço do backend
3. Abrir aba "Deployments"
4. Encontrar deployment anterior estável
5. Clicar em "Redeploy"

**Opção 3: Rollback de Migration (CRÍTICO)**

**AVISO:** Rollback de migration requer cuidados especiais.

```bash
# NUNCA fazer em produção sem backup e aprovação
# Processo requer:
# 1. Backup do banco de dados
# 2. Aprovação do chat responsável
# 3. Execução controlada
```

---

## FRONTEND: VERCEL

### Como Vercel Funciona no Projeto

**Vercel** é a plataforma de hosting que hospeda:
- Frontend Next.js
- CDN global
- Deploy automático
- PWA (Progressive Web App)

### Processo de Deploy

**1. Trigger Automático:**
```
Push para branch master → Vercel detecta → Inicia build
```

**2. Build Process:**
```bash
# Vercel executa automaticamente:
npm install                    # Instala dependências
npm run build                  # Build Next.js (otimizado para produção)
```

**3. Build Otimizado:**
- Next.js otimiza automaticamente
- Gera páginas estáticas quando possível
- Gera Service Worker (PWA)
- Minifica assets (JS, CSS)
- Otimiza imagens

**4. Deploy:**
```bash
# Vercel faz deploy automaticamente:
# - Upload para CDN global
# - Configura domínio
# - Ativa SSL automático
```

### Build Process Detalhado

**Next.js 14 (App Router):**
- Compila TypeScript
- Otimiza React components
- Gera páginas estáticas e dinâmicas
- Gera Service Worker (next-pwa)
- Minifica e otimiza assets

**PWA:**
- Gera `manifest.json` (já existe em `public/`)
- Gera Service Worker (`public/sw.js`)
- Gera Workbox cache strategies

### Onde Ficam Variáveis de Ambiente

**No Vercel Dashboard:**
1. Acessar projeto no Vercel
2. Abrir configurações do projeto
3. Abrir aba "Environment Variables"
4. Variáveis configuradas lá são injetadas no build

**Variáveis Públicas (expostas ao cliente):**
- `NEXT_PUBLIC_API_URL` - URL do backend (deve começar com `NEXT_PUBLIC_`)

**AVISO:** Variáveis `NEXT_PUBLIC_*` são expostas no bundle do cliente. **NÃO** coloque secrets aqui.

### Onde NÃO Mexer

**NÃO altere:**
- ❌ Configuração de build (Vercel detecta Next.js automaticamente)
- ❌ `next.config.js` sem aprovação (PWA depende dele)
- ❌ `package.json` scripts sem aprovação
- ❌ Variáveis de ambiente sem aprovação
- ❌ Domínio sem aprovação

### Como PWA Deploy Funciona

**PWA é gerado automaticamente durante build:**

1. Next.js compila código
2. `next-pwa` gera Service Worker
3. Service Worker é registrado automaticamente
4. Manifest.json é servido (já existe em `public/`)
5. Ícones PWA são servidos (se existirem em `public/icons/`)

**IMPORTANTE:**
- PWA funciona automaticamente após deploy
- Service Worker é atualizado automaticamente
- Cache strategies são aplicadas conforme `next.config.js`

### Como Rollback Funciona

**Opção 1: Reverter Commit (Recomendado)**

```bash
# Reverter último commit
git revert HEAD
git push origin master

# Vercel detecta push e faz novo deploy
```

**Opção 2: Rollback via Vercel Dashboard**

1. Acessar Vercel Dashboard
2. Abrir projeto
3. Abrir aba "Deployments"
4. Encontrar deployment anterior estável
5. Clicar em "..." → "Promote to Production"

**Opção 3: Rollback Manual**

1. Acessar deployment anterior no Vercel
2. Copiar URL do deployment
3. Usar temporariamente enquanto corrige produção

---

## INTEGRAÇÃO BACKEND-FRONTEND

### Como Funciona

**Backend (Railway):**
- URL: `https://maternilove-v2-production.up.railway.app`
- Expõe APIs em `/api/v1/*`
- CORS configurado para aceitar Vercel

**Frontend (Vercel):**
- URL: `https://maternilove-v2.vercel.app`
- Consome APIs do backend via `NEXT_PUBLIC_API_URL`
- Requisições vão para backend via fetch/axios

**CORS:**
- Backend valida origem (CORS_ORIGIN)
- Apenas domínio do Vercel é permitido (configurado em Railway)

---

## PROCESSO DE DEPLOY COMPLETO

### Deploy Automático (Padrão)

**1. Desenvolvedor faz commit e push:**
```bash
git add .
git commit -m "feat: nova feature"
git push origin master
```

**2. GitHub recebe push:**
- Atualiza branch master
- Dispara webhooks (se configurados)

**3. Railway detecta push:**
- Inicia build do backend
- Aplica migrations via `prestart`
- Inicia servidor

**4. Vercel detecta push:**
- Inicia build do frontend
- Gera bundle otimizado
- Faz deploy para CDN

**5. Deploy completo:**
- Backend disponível em Railway
- Frontend disponível em Vercel
- Integração funcionando

### Tempo de Deploy

**Backend (Railway):**
- Build: ~2-5 minutos
- Migrations: ~10-30 segundos (se houver novas)
- Total: ~3-6 minutos

**Frontend (Vercel):**
- Build: ~1-3 minutos
- Deploy: ~30 segundos
- Total: ~2-4 minutos

**Total:** ~5-10 minutos para deploy completo

---

## MONITORAMENTO

### Railway

**Disponível em:**
- Railway Dashboard → Serviço → Logs
- Logs em tempo real
- Métricas de performance

### Vercel

**Disponível em:**
- Vercel Dashboard → Projeto → Analytics
- Métricas de performance
- Analytics de uso

---

## TROUBLESHOOTING

### Backend Não Inicia

**Verificar:**
1. Logs no Railway Dashboard
2. Variáveis de ambiente estão configuradas
3. Migrations aplicadas com sucesso
4. Banco de dados está acessível

### Frontend Não Conecta ao Backend

**Verificar:**
1. `NEXT_PUBLIC_API_URL` está correto no Vercel
2. Backend está rodando no Railway
3. CORS está configurado corretamente
4. URLs estão corretas

### Migrations Falham

**Verificar:**
1. Logs no Railway Dashboard (prestart)
2. Banco de dados está acessível
3. Migration SQL está correto
4. Conflitos de schema

**Solução:**
- Verificar migration específica
- Resolver conflito manualmente (com aprovação)
- Reexecutar deploy

---

## CONCLUSÃO

Este guia explica **COMO** o deploy funciona. Ele é **educativo** e **preventivo**.

**Lembre-se:**
- Deploy é automático via GitHub
- Não faça deploy manual sem aprovação
- Não altere configurações de produção sem aprovação
- Sempre valide mudanças em desenvolvimento primeiro

---

**FIM DO GUIA DE DEPLOY**
