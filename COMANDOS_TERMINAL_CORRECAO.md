# 🚀 COMANDOS PARA EXECUTAR NO TERMINAL - CORREÇÃO COMPLETA

## ✅ O QUE FOI CORRIGIDO

1. **Erro de Rate Limiting**: Adicionado `trust proxy` no Express
2. **Migrations não encontradas**: Mudado para usar `db push` que cria tabelas diretamente
3. **Código atualizado e commitado**: Já foi para o GitHub, Railway vai fazer deploy automático

---

## 📋 PASSO A PASSO - EXECUTE NO TERMINAL DO MACBOOK

### **OPÇÃO 1: Usar o script automático (MAIS FÁCIL)**

```bash
cd ~/Projetos/maternilove-v2
./EXECUTAR_DB_PUSH_LOCAL.sh
```

**Pronto!** Isso vai criar todas as tabelas automaticamente.

---

### **OPÇÃO 2: Executar comandos manualmente**

Copie e cole TODOS os comandos abaixo, um de cada vez:

#### **Passo 1: Ir para o backend**
```bash
cd ~/Projetos/maternilove-v2/backend
```

#### **Passo 2: Configurar DATABASE_URL**
```bash
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"
```

#### **Passo 3: Gerar Prisma Client**
```bash
npx prisma generate
```
⏳ Aguarde terminar (30-60 segundos)

#### **Passo 4: Criar TODAS as tabelas**
```bash
npx prisma db push --accept-data-loss
```
⏳ Aguarde terminar (1-2 minutos)

**Você verá mensagens como:**
- `✓ Created table User`
- `✓ Created table SocialPost`
- `✓ Created table CommunityPost`
- etc.

---

## ⏱️ AGUARDAR DEPLOY NO RAILWAY

Após executar os comandos acima, aguarde 2-3 minutos para o Railway:

1. **Detectar as mudanças** no GitHub
2. **Fazer build** da nova versão (com `trust proxy` corrigido)
3. **Executar `db push`** automaticamente na inicialização

**Verifique no Railway:**
- Vá para: https://railway.app/project/seu-projeto
- Veja os logs de deploy
- Procure por: `✓ Database push successful` ou similar

---

## ✅ TESTAR FUNCIONALIDADES

Depois que o Railway terminar o deploy:

### **1. Testar Health Check**
```bash
curl https://maternilove-v2-production.up.railway.app/health
```

**Deve retornar:**
```json
{"status":"ok","timestamp":"...","database":"connected"}
```

### **2. Testar Criação de Conta**
1. Acesse: **https://maternilove-v2.vercel.app/register**
2. Preencha:
   - Nome: Seu Nome
   - Email: teste@exemplo.com
   - Senha: senha123
   - Confirmar: senha123
3. Clique em **"Criar Conta"**

**✅ SUCESSO:** Redireciona para `/dashboard`

### **3. Testar Login**
1. Acesse: **https://maternilove-v2.vercel.app/login**
2. Use as credenciais que criou
3. Clique em **"Entrar"**

**✅ SUCESSO:** Redireciona para `/dashboard`

### **4. Testar Login Admin**
1. Acesse: **https://maternilove-v2.vercel.app/login**
2. Email: `suporte@maternilove.com.br`
3. Senha: `Materni%2026`
4. Clique em **"Entrar"**

**✅ SUCESSO:** Login como administrador

---

## 🔍 VERIFICAR TABELAS CRIADAS (OPCIONAL)

Se quiser ver todas as tabelas criadas:

```bash
cd ~/Projetos/maternilove-v2/backend
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"
npx prisma studio
```

- Abre no navegador: http://localhost:5555
- Você verá **45+ tabelas** listadas
- Pressione `Ctrl+C` para sair

---

## ❌ SE AINDA NÃO FUNCIONAR

### **Problema: Ainda não consigo criar conta/login**

**Solução:**
1. Verifique se o Railway terminou o deploy (veja os logs)
2. Execute novamente o `db push`:
   ```bash
   cd ~/Projetos/maternilove-v2/backend
   export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"
   npx prisma db push --accept-data-loss
   ```
3. Aguarde 1 minuto e tente novamente

### **Problema: Erro 500 no backend**

**Solução:**
1. Veja os logs do Railway
2. Procure por erros
3. Verifique se `DATABASE_URL` está configurada no Railway

---

## 📝 RESUMO EXECUTIVO

**Execute agora:**
```bash
cd ~/Projetos/maternilove-v2 && ./EXECUTAR_DB_PUSH_LOCAL.sh
```

**Aguarde:** 2-3 minutos para Railway fazer deploy

**Teste:** https://maternilove-v2.vercel.app/register

---

## 🎯 O QUE SERÁ CRIADO

Após executar, serão criadas **45+ tabelas**:

- ✅ `User` - Usuários
- ✅ `SocialPost`, `SocialLike`, `SocialComment` - Rede Social
- ✅ `CommunityCategory`, `CommunityPost` - Comunidade
- ✅ `Product`, `Order`, `Review` - Marketplace
- ✅ `Professional`, `Company` - Profissionais
- ✅ `Notification` - Notificações
- ✅ E mais 30+ tabelas...

---

**Execute os comandos e me avise o resultado! 🚀**



