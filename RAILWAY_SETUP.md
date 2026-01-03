# 🚂 SETUP RAILWAY - BACKEND MATERNILOVE V2

Guia completo para fazer deploy do backend no Railway.

## 📋 PRÉ-REQUISITOS

- ✅ Conta no Railway: https://railway.app
- ✅ PostgreSQL já configurado no Railway
- ✅ Código no GitHub: `BrunoFranco00/maternilove-v2`

---

## 🚀 PASSO A PASSO

### 1. Criar Novo Projeto no Railway

1. Acesse: https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório: `BrunoFranco00/maternilove-v2`
5. Clique em **"Deploy Now"**

### 2. Configurar Serviço Backend

O Railway vai detectar automaticamente, mas você precisa configurar:

1. **Settings → Root Directory**
   - Defina como: `backend`

2. **Settings → Build Command**
   - Deixe vazio (vai usar o padrão do package.json)

3. **Settings → Start Command**
   - Defina como: `npm start`

### 3. Conectar ao PostgreSQL

1. No projeto Railway, você já tem o PostgreSQL rodando
2. Clique no serviço **PostgreSQL**
3. Vá em **"Variables"**
4. Copie a **`DATABASE_URL`** completa

### 4. Configurar Variáveis de Ambiente

No serviço **Backend** (não no PostgreSQL), vá em **"Variables"** e adicione:

```env
# Database (do serviço PostgreSQL)
DATABASE_URL=postgresql://postgres:senha@host:porta/railway

# Server
PORT=3000
NODE_ENV=production

# CORS (domínio do Vercel - ajuste depois)
CORS_ORIGIN=https://maternilove-v2.vercel.app,https://*.vercel.app

# Frontend URL (opcional, para logs)
FRONTEND_URL=https://maternilove-v2.vercel.app

# JWT Secret (gere um novo para produção!)
JWT_SECRET=sua-chave-super-secreta-aqui-$(openssl rand -hex 32)
```

**⚠️ IMPORTANTE:**
- A `DATABASE_URL` deve ser a do serviço PostgreSQL do Railway
- Use a variável **`DATABASE_URL`** (privada), não `DATABASE_PUBLIC_URL`
- Gere um `JWT_SECRET` novo e seguro para produção

### 5. Deploy

1. O Railway vai fazer o deploy automaticamente quando você fizer push no GitHub
2. Ou clique em **"Deploy"** manualmente
3. Aguarde o build terminar (pode levar 3-5 minutos na primeira vez)

### 6. Obter URL do Backend

1. Após o deploy, vá em **"Settings"** do serviço Backend
2. Em **"Networking"**, ative **"Generate Domain"**
3. Copie a URL gerada (ex: `maternilove-backend.up.railway.app`)
4. **Esta é a URL que você vai usar no Vercel!**

---

## 🔧 CONFIGURAÇÃO DETALHADA

### Variáveis de Ambiente no Railway

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_URL` | `postgresql://...` | URL do PostgreSQL (do serviço PostgreSQL no Railway) |
| `PORT` | `3000` | Porta do servidor (Railway define automaticamente) |
| `NODE_ENV` | `production` | Ambiente de produção |
| `CORS_ORIGIN` | `https://*.vercel.app` | Domínios permitidos para CORS |
| `FRONTEND_URL` | `https://maternilove-v2.vercel.app` | URL do frontend (opcional) |
| `JWT_SECRET` | `string-aleatoria` | Chave secreta para JWT (gere uma nova!) |

### Root Directory no Railway

No serviço Backend:
- **Root Directory:** `backend`

Isso faz com que o Railway execute os comandos a partir da pasta `backend/`.

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

### 1. Health Check

Abra no navegador a URL do backend + `/health`:
```
https://seu-backend.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-01-03T...",
  "database": "connected"
}
```

### 2. API Info

```
https://seu-backend.railway.app/api
```

Deve retornar informações sobre a API.

---

## 🔗 CONECTAR COM VERCEL

Depois que o backend estiver rodando no Railway:

1. **No Vercel**, adicione a variável de ambiente:
   - Key: `VITE_API_URL`
   - Value: `https://seu-backend.railway.app`

2. **Refaça o deploy do frontend** no Vercel

3. **Teste** se o frontend consegue se conectar ao backend!

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot connect to database"

**Solução:**
- Verifique se a `DATABASE_URL` está correta
- Use a `DATABASE_URL` do serviço PostgreSQL (não `DATABASE_PUBLIC_URL`)
- No Railway, ambos os serviços (Backend e PostgreSQL) devem estar no mesmo projeto

### Erro: "CORS blocked"

**Solução:**
- Adicione o domínio do Vercel em `CORS_ORIGIN`
- O backend aceita `*.vercel.app` automaticamente
- Verifique os logs do backend no Railway

### Erro: "Build failed"

**Solução:**
- Verifique se o Root Directory está como `backend`
- Verifique os logs de build no Railway
- Certifique-se de que `package.json` tem o script `build` e `start`

### Backend não inicia

**Solução:**
- Verifique o Start Command: deve ser `npm start`
- Verifique os logs no Railway
- Certifique-se de que o build gerou a pasta `dist/`

---

## 📝 NOTAS IMPORTANTES

1. **Primeiro Deploy:**
   - Pode levar 5-10 minutos
   - Railway precisa baixar dependências e fazer build

2. **Deploys Subsequentes:**
   - Automático quando você fizer push no GitHub
   - Geralmente leva 2-3 minutos

3. **Custos:**
   - Plano Hobby: $5/mês (500 horas grátis)
   - PostgreSQL + Backend: geralmente cabe no plano grátis para começar

4. **Logs:**
   - Acesse **"Logs"** no serviço Backend para ver erros
   - Muito útil para debug!

---

## 🎯 CHECKLIST FINAL

- [ ] Projeto criado no Railway
- [ ] Serviço Backend configurado
- [ ] Root Directory = `backend`
- [ ] Start Command = `npm start`
- [ ] `DATABASE_URL` configurada (do PostgreSQL)
- [ ] `CORS_ORIGIN` configurado com domínio do Vercel
- [ ] `JWT_SECRET` gerado e configurado
- [ ] Deploy realizado com sucesso
- [ ] Health check funcionando (`/health`)
- [ ] URL do backend obtida
- [ ] Frontend no Vercel configurado com `VITE_API_URL`

---

**🎉 Pronto! Seu backend está rodando no Railway!**

