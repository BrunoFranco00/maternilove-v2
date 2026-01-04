# 🔧 SOLUÇÃO: EXECUTAR MIGRATIONS NO RAILWAY

## ⚠️ PROBLEMA

As migrations do Prisma podem não ter sido executadas no banco de dados do Railway, causando erros ao tentar fazer login/registro.

---

## ✅ SOLUÇÃO IMEDIATA (EXECUTAR AGORA)

### **Opção 1: Executar via Terminal Local**

```bash
cd ~/Projetos/maternilove-v2/backend

# Configure a DATABASE_URL do Railway
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"

# Executar migrations
npx prisma migrate deploy

# OU usar db push (cria tabelas diretamente)
npx prisma db push --accept-data-loss
```

### **Opção 2: Executar via Railway Dashboard**

1. Acesse: https://railway.app
2. Vá para o serviço **Backend**
3. Clique em **"Deployments"** → Último deployment
4. Clique em **"View Logs"** → **"Shell"**
5. Execute:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

### **Opção 3: Usar Railway CLI**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Executar migrations
railway run --service backend npx prisma migrate deploy
```

---

## 🔄 SOLUÇÃO AUTOMÁTICA (PRÓXIMO DEPLOY)

O código foi atualizado para executar migrations automaticamente antes de iniciar o servidor.

**Após o próximo deploy no Railway:**
- Migrations serão executadas automaticamente
- Tabelas serão criadas se não existirem
- Servidor iniciará normalmente

---

## 🔍 VERIFICAR SE FUNCIONOU

### **1. Verificar Health Check:**

```bash
curl https://maternilove-v2-production.up.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### **2. Verificar via Prisma Studio:**

```bash
cd backend
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"
npx prisma studio
```

Acesse: http://localhost:5555

Você deve ver todas as tabelas listadas.

### **3. Testar Login/Registro:**

1. Acesse: https://maternilove-v2.vercel.app/login
2. Tente criar uma conta ou fazer login
3. Deve funcionar sem erros

---

## 📋 TABELAS QUE SERÃO CRIADAS

Após executar migrations, você terá:

- ✅ **User** - Usuários
- ✅ **SocialPost** - Posts da rede social
- ✅ **SocialLike** - Likes
- ✅ **SocialComment** - Comentários
- ✅ **CommunityCategory** - Categorias da comunidade
- ✅ **CommunityPost** - Posts da comunidade
- ✅ **CommunityComment** - Comentários da comunidade
- ✅ **Product** - Produtos do marketplace
- ✅ **Order** - Pedidos
- ✅ **Review** - Avaliações
- ✅ **Professional** - Profissionais
- ✅ **Company** - Empresas
- ✅ **Notification** - Notificações
- ✅ ... e mais 30+ tabelas

**Total: 45+ tabelas**

---

## 🚀 COMANDO COMPLETO (COPIE E COLE)

```bash
cd ~/Projetos/maternilove-v2/backend && \
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway" && \
npx prisma migrate deploy
```

---

## ✅ APÓS EXECUTAR MIGRATIONS

1. ✅ Tabelas criadas
2. ✅ Seed do admin (já executado anteriormente)
3. ✅ Testar login/registro
4. ✅ Verificar funcionalidades

---

**Execute as migrations agora e depois teste novamente!**

