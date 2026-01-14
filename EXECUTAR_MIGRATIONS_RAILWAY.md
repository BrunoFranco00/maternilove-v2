# 🗄️ EXECUTAR MIGRATIONS NO RAILWAY - GUIA RÁPIDO

## ⚠️ PROBLEMA IDENTIFICADO

As migrations do Prisma podem não ter sido executadas automaticamente no Railway, o que significa que **as tabelas podem não existir no banco de dados**.

---

## ✅ SOLUÇÃO 1: EXECUTAR MIGRATIONS MANUALMENTE (RECOMENDADO)

### **Opção A: Via Railway CLI**

```bash
# Instalar Railway CLI (se ainda não tiver)
npm i -g @railway/cli

# Login no Railway
railway login

# Linkar ao projeto
railway link

# Executar migrations
railway run npx prisma migrate deploy
```

### **Opção B: Via Terminal SSH no Railway**

1. Acesse: https://railway.app
2. Vá para seu serviço Backend
3. Clique em "Deployments" → Último deployment
4. Abra o terminal
5. Execute:
```bash
cd backend
npx prisma migrate deploy
```

### **Opção C: Via Script Local (com DATABASE_URL)**

```bash
cd backend

# Configure a DATABASE_URL do Railway
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"

# Executar migrations
npx prisma migrate deploy

# OU usar db push (cria tabelas sem migration)
npx prisma db push
```

---

## ✅ SOLUÇÃO 2: AUTOMATIZAR NO DEPLOY

O código foi atualizado para executar migrations automaticamente na inicialização do servidor. Após o próximo deploy, as migrations serão executadas automaticamente.

---

## 🔍 VERIFICAR SE TABELAS EXISTEM

### **Via Prisma Studio:**

```bash
cd backend
export DATABASE_URL="sua-database-url-do-railway"
npx prisma studio
```

Acesse: http://localhost:5555

### **Via SQL Direto:**

```bash
psql "postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"

# No psql, execute:
\dt

# Deve mostrar todas as tabelas criadas
```

---

## 📋 TABELAS QUE DEVEM EXISTIR

Após executar as migrations, você deve ter pelo menos estas tabelas:

- ✅ `User`
- ✅ `SocialPost`
- ✅ `SocialLike`
- ✅ `SocialComment`
- ✅ `CommunityCategory`
- ✅ `CommunityPost`
- ✅ `CommunityComment`
- ✅ `Product`
- ✅ `Order`
- ✅ `Review`
- ✅ `Professional`
- ✅ `Company`
- ✅ `Notification`
- ✅ ... e mais 30+ tabelas

---

## 🚀 COMANDO RÁPIDO (COPIE E COLE)

```bash
# No diretório backend
cd ~/Projetos/maternilove-v2/backend

# Executar migrations
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"
npx prisma migrate deploy
```

---

## ✅ APÓS EXECUTAR MIGRATIONS

1. Verificar se as tabelas foram criadas
2. Executar seed do admin (se ainda não foi):
   ```bash
   npm run prisma:seed
   ```
3. Testar login/registro novamente

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Executar migrations no Railway
2. ✅ Verificar se tabelas foram criadas
3. ✅ Testar login/registro
4. ✅ Verificar se funcionalidades estão funcionando



