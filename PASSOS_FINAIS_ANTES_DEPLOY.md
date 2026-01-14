# 🚀 PASSOS FINAIS ANTES DO DEPLOY - GUIA COMPLETO

## 📋 CHECKLIST PRÉ-COMMIT

Antes de fazer commit e push, verifique:

- ✅ Build compila sem erros (`npm run build`)
- ✅ Todas as correções foram aplicadas
- ✅ Imports atualizados para usar `prisma.ts`

---

## 1️⃣ COMMIT E PUSH

Execute no terminal:

```bash
cd ~/Projetos/maternilove-v2

# Verificar o que será commitado
git status

# Adicionar todas as mudanças
git add -A

# Fazer commit
git commit -m "🔧 Correções production-grade completas

- Prisma singleton (elimina múltiplos pools)
- Shutdown gracioso real (HTTP → DB → EXIT)
- Healthcheck correto (/health/live e /health/ready)
- Seeds idempotentes com upsert
- Removido db push, usando migrate deploy
- Servidor escuta em 0.0.0.0
- CORS corrigido para Vercel
- Logs compatíveis com Railway"

# Push para GitHub
git push origin master
```

**Aguarde o deploy no Railway iniciar automaticamente.**

---

## 2️⃣ CONFIGURAR DATABASE_URL NO RAILWAY

### Passo 1: Acessar Variáveis do PostgreSQL

1. Acesse: https://railway.app
2. Clique no seu projeto
3. Clique no serviço **PostgreSQL**
4. Vá na aba **Variables** (ou **Variables & Secrets**)

### Passo 2: Localizar DATABASE_URL

Procure por:
- `DATABASE_URL`
- `DATABASE_PUBLIC_URL`
- `PGDATABASE_URL`

**Anote qual variável você vai configurar.**

### Passo 3: Adicionar Parâmetros de Pool

**URL Original:**
```
postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway
```

**URL Corrigida (com pool):**
```
postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

**Ação:**
1. Clique em **Edit** ou **Update** na variável `DATABASE_URL`
2. Cole a URL corrigida acima
3. Clique em **Save**

---

## 3️⃣ CONFIGURAR VARIÁVEIS NO BACKEND SERVICE

### Passo 1: Acessar Variáveis do Backend

1. No Railway, clique no serviço **Backend** (não PostgreSQL)
2. Vá na aba **Variables** (ou **Variables & Secrets**)

### Passo 2: Adicionar/Atualizar Variáveis

Adicione ou atualize as seguintes variáveis:

| Variável | Valor | Obrigatório |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway?connection_limit=5&pool_timeout=30&connect_timeout=10` | ✅ SIM |
| `FRONTEND_URL` | `https://maternilove-v2.vercel.app` | ✅ SIM |
| `NODE_ENV` | `production` | ✅ SIM |
| `JWT_SECRET` | (sua chave secreta) | ✅ SIM |
| `JWT_REFRESH_SECRET` | (sua chave de refresh) | ✅ SIM |
| `PORT` | (Railway injeta automaticamente) | ⚠️ Não precisa configurar |
| `LOG_LEVEL` | `info` (opcional) | ❌ Opcional |

**Como adicionar:**
1. Clique em **+ New Variable** ou **Add Variable**
2. Digite o **Name** (ex: `FRONTEND_URL`)
3. Digite o **Value** (ex: `https://maternilove-v2.vercel.app`)
4. Clique em **Add** ou **Save**
5. Repita para cada variável

**⚠️ IMPORTANTE:**
- A `DATABASE_URL` no backend **DEVE** ter os parâmetros de pool (igual ao PostgreSQL)
- A `FRONTEND_URL` **DEVE** ser exatamente o domínio do Vercel (sem barra no final)

---

## 4️⃣ CONFIGURAR BUILD E START COMMANDS NO RAILWAY

### Build Command: **DEIXE VAZIO OU NÃO CONFIGURE**

**Por quê:**
- O `package.json` já tem `postinstall` que executa `prisma generate`
- O `package.json` já tem `prestart` que executa `prisma migrate deploy`
- Railway detecta automaticamente Node.js e executa `npm install` e `npm run build` (se existir)

**Se precisar configurar explicitamente:**
1. No Railway → Backend Service → Settings → Build
2. **Build Command:** `npm run build` (opcional, Railway detecta automaticamente)
3. **Start Command:** `npm start` ✅ (já está correto)

**Recomendação:** Deixe Railway detectar automaticamente (não configure build command).

### Start Command: **JÁ ESTÁ CORRETO**

✅ `npm start`

Isso executa:
1. `prestart`: `prisma migrate deploy` (aplica migrations)
2. `start`: `node dist/server.js` (inicia servidor)

---

## 5️⃣ CONFIGURAR HEALTHCHECK NO RAILWAY (OPCIONAL MAS RECOMENDADO)

### Passo 1: Acessar Healthcheck

1. Railway → Backend Service → Settings
2. Procure por **Healthcheck** ou **Health Check**

### Passo 2: Configurar

**Path:** `/health/live`

**Port:** Deixe Railway detectar automaticamente (ou use a porta que Railway injeta via `PORT`)

**Por quê:**
- `/health/live` não toca o banco (resposta instantânea)
- Railway usa isso para verificar se o container está rodando
- Não sobrecarrega o banco com queries desnecessárias

---

## 6️⃣ VERIFICAR DEPLOY

Após configurar tudo:

### 1. Aguardar Build/Deploy

Railway vai fazer deploy automaticamente após o push.

**Verifique:**
- Railway → Backend Service → Deployments
- Veja o log do build
- Aguarde o deploy terminar (2-3 minutos)

### 2. Verificar Logs

Railway → Backend Service → Logs

**Você deve ver:**
```
Backend running on 0.0.0.0:XXXX
🚀 Materni Love Backend Server
📍 Server running on: 0.0.0.0:XXXX
✨ Ready to receive requests!
```

**Se ver erro:**
- Verifique se `DATABASE_URL` está configurada corretamente
- Verifique se `FRONTEND_URL` está configurada
- Veja os logs completos para identificar o problema

### 3. Testar Health Check

```bash
curl https://maternilove-v2-production.up.railway.app/health/live
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-04T...",
  "service": "maternilove-backend"
}
```

### 4. Testar Readiness

```bash
curl https://maternilove-v2-production.up.railway.app/health/ready
```

**Resposta esperada (se DB conectado):**
```json
{
  "status": "ready",
  "timestamp": "2026-01-04T...",
  "database": "connected"
}
```

### 5. Testar API

```bash
curl https://maternilove-v2-production.up.railway.app/api
```

**Resposta esperada:**
```json
{
  "message": "Materni Love API v1",
  "version": "1.0.0",
  "endpoints": {...}
}
```

---

## 7️⃣ TESTAR LOGIN E REGISTRO

### Teste 1: Criar Nova Conta

1. Acesse: **https://maternilove-v2.vercel.app/register**
2. Preencha:
   - Nome: Maria Silva
   - Email: maria@teste.com
   - Senha: senha123
   - Confirmar: senha123
3. Clique em **"Criar Conta"**

**✅ SUCESSO:** Redireciona para `/dashboard`

### Teste 2: Login Admin

1. Acesse: **https://maternilove-v2.vercel.app/login**
2. Digite:
   - Email: `suporte@maternilove.com.br`
   - Senha: `Materni%2026`
3. Clique em **"Entrar"**

**✅ SUCESSO:** Redireciona para `/dashboard` como SUPER_ADMIN

### Teste 3: Login com Conta Nova

1. Faça logout
2. Faça login com: `maria@teste.com` / `senha123`

**✅ SUCESSO:** Login funciona

---

## 8️⃣ VERIFICAR LOGS DO RAILWAY

Após testar, verifique os logs:

Railway → Backend Service → Logs

**Procure por:**
- ✅ Sem erros de "connection reset"
- ✅ Sem erros de "database interrupted"
- ✅ Sem erros de unique constraint
- ✅ Logs aparecem corretamente (não há erros de escrita em arquivo)

**Se ver problemas:**
- Verifique se `DATABASE_URL` tem os parâmetros de pool
- Verifique se `FRONTEND_URL` está configurada
- Verifique se migrations foram aplicadas (`prisma migrate deploy`)

---

## ✅ RESUMO EXECUTIVO

**1. Commit e Push:**
```bash
git add -A
git commit -m "🔧 Correções production-grade completas"
git push origin master
```

**2. Configurar DATABASE_URL no PostgreSQL Service:**
```
postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

**3. Configurar no Backend Service:**
- `DATABASE_URL`: (mesmo valor acima)
- `FRONTEND_URL`: `https://maternilove-v2.vercel.app`
- `NODE_ENV`: `production`
- `JWT_SECRET`: (sua chave)
- `JWT_REFRESH_SECRET`: (sua chave)

**4. Build Command:** Não precisa configurar (deixe vazio)

**5. Start Command:** Já está correto (`npm start`)

**6. Aguardar deploy e testar**

---

**🎉 Depois de fazer isso, a plataforma deve funcionar perfeitamente!**



