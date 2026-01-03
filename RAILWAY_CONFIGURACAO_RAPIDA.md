# ⚡ CONFIGURAÇÃO RÁPIDA - RAILWAY BACKEND

## 🎯 O QUE VOCÊ PRECISA FAZER NO RAILWAY

Atualmente você só tem o **PostgreSQL** no Railway. Precisa criar o **Backend API**.

---

## 📋 PASSOS RÁPIDOS

### 1. Criar Serviço Backend

1. Acesse: https://railway.app
2. No seu projeto (onde está o PostgreSQL):
   - Clique no **"+"** (Add Service)
   - Escolha **"GitHub Repo"**
   - Selecione: `BrunoFranco00/maternilove-v2`
   - Clique em **"Deploy"**

### 2. Configurar Root Directory

1. No serviço Backend recém-criado:
   - Vá em **"Settings"**
   - Encontre **"Root Directory"**
   - Digite: `backend`
   - Salve

### 3. Configurar Start Command

1. Ainda em **"Settings"**:
   - Encontre **"Start Command"**
   - Digite: `npm start`
   - Salve

### 4. Configurar Variáveis de Ambiente

1. No serviço Backend, vá em **"Variables"**
2. Clique em **"New Variable"**
3. Adicione estas variáveis:

```env
# Database - URL do PostgreSQL (do serviço PostgreSQL no Railway)
DATABASE_URL=postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@postgres.railway.internal:5432/railway

# Server
PORT=3000
NODE_ENV=production

# CORS - Aceita Vercel
CORS_ORIGIN=https://*.vercel.app

# JWT Secret (gere uma nova!)
JWT_SECRET=sua-chave-secreta-aqui-$(openssl rand -hex 32)
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL`: No Railway, você pode usar a variável já configurada
  - Vá no serviço **PostgreSQL** → **Variables**
  - Copie o valor de `DATABASE_URL` (a privada, não a pública)
  - Cole no serviço Backend

### 5. Obter URL do Backend

1. No serviço Backend:
   - Vá em **"Settings"** → **"Networking"**
   - Ative **"Generate Domain"**
   - Copie a URL gerada (ex: `maternilove-backend.up.railway.app`)

### 6. Atualizar Vercel

1. No Vercel:
   - Vá em **"Settings"** → **"Environment Variables"**
   - Adicione:
     - Key: `VITE_API_URL`
     - Value: `https://sua-url-backend.railway.app`
   - Faça **redeploy**

---

## ✅ VERIFICAR SE FUNCIONOU

Abra no navegador:
```
https://sua-url-backend.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

---

## 🎯 RESUMO

1. ✅ Criar serviço Backend no Railway (GitHub Repo)
2. ✅ Root Directory = `backend`
3. ✅ Start Command = `npm start`
4. ✅ Variáveis de ambiente configuradas
5. ✅ Obter URL do backend
6. ✅ Configurar `VITE_API_URL` no Vercel

**Pronto! 🚀**

