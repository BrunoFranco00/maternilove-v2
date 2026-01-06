# 🔧 CONFIGURAÇÃO COMPLETA - RAILWAY E VERCEL

## 📋 DATABASE_URL NOVA

```
postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres.railway.internal:5432/railway
```

**⚠️ IMPORTANTE:** Adicionar parâmetros de pool:

```
postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres.railway.internal:5432/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

---

## 🚂 CONFIGURAÇÃO NO RAILWAY

### Passo 1: Acessar Railway

1. Acesse: https://railway.app
2. Selecione o projeto com o backend
3. Vá no serviço **Backend** (não PostgreSQL)

### Passo 2: Configurar Variáveis de Ambiente

No serviço **Backend**, vá em **Variables** → **New Variable**

Adicione **EXATAMENTE** estas variáveis:

#### 1. DATABASE_URL (OBRIGATÓRIO)

```
Key: DATABASE_URL
Value: postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres.railway.internal:5432/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

**⚠️ IMPORTANTE:** 
- Copie a URL **COMPLETA** incluindo os parâmetros `?connection_limit=5&pool_timeout=30&connect_timeout=10`
- **Não** adicione espaços ou quebras de linha

---

#### 2. JWT_SECRET (OBRIGATÓRIO EM PRODUÇÃO)

```
Key: JWT_SECRET
Value: <GERAR_UMA_CHAVE_SEGURA>
```

**Como gerar uma chave segura:**

No terminal do seu Mac:
```bash
openssl rand -base64 32
```

Exemplo de valor gerado:
```
Xk9pL2mN3qR5sT7vW0yZ1aB3cD4eF6gH8iJ0kL1mN2oP3qR4sT5uV6wX7yZ8a
```

Cole o valor gerado na variável `JWT_SECRET`.

---

#### 3. FRONTEND_URL (RECOMENDADO)

```
Key: FRONTEND_URL
Value: https://maternilove-v2.vercel.app
```

**Ou se você usar outro domínio:**
- Se usar domínio customizado, use o domínio customizado
- Se usar preview deployments, pode adicionar múltiplas URLs separadas por vírgula (mas isso requer ajuste no código)

---

#### 4. NODE_ENV (OPCIONAL - Railway define automaticamente)

```
Key: NODE_ENV
Value: production
```

**Nota:** Railway geralmente define isso automaticamente, mas pode definir manualmente para garantir.

---

#### 5. PORT (OPCIONAL - Railway define automaticamente)

```
Key: PORT
Value: (deixe vazio ou não configure - Railway define automaticamente)
```

**Nota:** Railway define automaticamente a porta, não precisa configurar.

---

### Passo 3: Verificar Configuração

Após adicionar todas as variáveis, sua lista deve ficar assim:

```
✅ DATABASE_URL = postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres.railway.internal:5432/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
✅ JWT_SECRET = Xk9pL2mN3qR5sT7vW0yZ1aB3cD4eF6gH8iJ0kL1mN2oP3qR4sT5uV6wX7yZ8a
✅ FRONTEND_URL = https://maternilove-v2.vercel.app
✅ NODE_ENV = production
```

---

### Passo 4: Obter URL do Backend

1. No serviço Backend, vá em **Settings** → **Networking**
2. Ative **"Generate Domain"** (se ainda não estiver ativo)
3. Copie a URL gerada (exemplo: `maternilove-v2-production.up.railway.app`)
4. **Anote essa URL** - você vai precisar no Vercel

**URL do Backend (exemplo):**
```
https://maternilove-v2-production.up.railway.app
```

---

## 🌐 CONFIGURAÇÃO NO VERCEL

### Passo 1: Acessar Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `maternilove-v2`

### Passo 2: Configurar Variável de Ambiente

1. Vá em **Settings** → **Environment Variables**
2. Clique em **Add New**

Adicione **EXATAMENTE** esta variável:

#### VITE_API_URL (OBRIGATÓRIO)

```
Key: VITE_API_URL
Value: https://maternilove-v2-production.up.railway.app
```

**⚠️ IMPORTANTE:**
- **Substitua** `maternilove-v2-production.up.railway.app` pela **URL real** do seu backend no Railway
- **NÃO** adicione barra `/` no final
- **NÃO** adicione `http://` ou `https://` duas vezes
- Marque para: **Production**, **Preview** e **Development**

**Exemplo correto:**
```
✅ https://maternilove-v2-production.up.railway.app
❌ https://maternilove-v2-production.up.railway.app/
❌ http://https://maternilove-v2-production.up.railway.app
```

---

### Passo 3: Redeploy do Frontend

Após adicionar a variável:

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** no último deploy
3. Clique em **Redeploy**
4. Aguarde o deploy terminar (1-2 minutos)

---

## ✅ VERIFICAÇÃO FINAL

### 1. Testar Backend (Railway)

Abra no navegador:
```
https://maternilove-v2-production.up.railway.app/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-04T...",
  "database": "connected"
}
```

Se retornar `"database": "connected"`, está funcionando! ✅

---

### 2. Testar Frontend (Vercel)

1. Acesse: `https://maternilove-v2.vercel.app`
2. Abra **DevTools** (F12) → **Console**
3. Deve mostrar: `🔗 API URL: https://maternilove-v2-production.up.railway.app`

Se mostrar a URL correta, está configurado! ✅

---

### 3. Testar Login/Registro

1. No frontend, tente **criar uma conta**
2. Se funcionar, tente **fazer login**
3. Verifique se o token é salvo em `localStorage`

**Para verificar localStorage:**
- DevTools → **Application** → **Local Storage**
- Deve ter: `accessToken` e `refreshToken`

---

## 🔍 TROUBLESHOOTING

### Problema: Backend não inicia

**Verificar:**
- ✅ `DATABASE_URL` está configurado corretamente?
- ✅ `JWT_SECRET` está configurado?
- ✅ Logs do Railway mostram erro?

**Solução:**
- Verifique os logs do Railway para erro específico
- Certifique-se que `DATABASE_URL` tem os parâmetros de pool

---

### Problema: CORS bloqueado no frontend

**Verificar:**
- ✅ `FRONTEND_URL` está configurado no Railway?
- ✅ URL no `FRONTEND_URL` é exatamente a mesma do Vercel?

**Solução:**
- Certifique-se que `FRONTEND_URL` no Railway é: `https://maternilove-v2.vercel.app`
- Verifique logs do Railway para ver origem bloqueada

---

### Problema: Frontend não encontra API

**Verificar:**
- ✅ `VITE_API_URL` está configurado no Vercel?
- ✅ URL está correta (sem barra no final)?
- ✅ Fez redeploy após adicionar variável?

**Solução:**
- Verifique console do browser: `🔗 API URL: ...`
- Se mostrar `http://localhost:3000`, a variável não foi aplicada
- Faça redeploy do frontend no Vercel

---

### Problema: Erro 404 nas rotas

**Verificar:**
- ✅ Backend está rodando?
- ✅ Healthcheck `/health` funciona?
- ✅ URL da API está correta?

**Solução:**
- Teste: `https://seu-backend.railway.app/api`
- Deve retornar informações da API
- Se não funcionar, verifique logs do Railway

---

## 📊 RESUMO RÁPIDO

### Railway - Variáveis Obrigatórias

```env
DATABASE_URL=postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres.railway.internal:5432/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
JWT_SECRET=<gerar com openssl rand -base64 32>
FRONTEND_URL=https://maternilove-v2.vercel.app
```

### Vercel - Variável Obrigatória

```env
VITE_API_URL=https://maternilove-v2-production.up.railway.app
```

**⚠️ Substitua pela URL real do seu backend no Railway!**

---

## 🎯 CHECKLIST FINAL

### Railway
- [ ] DATABASE_URL configurada (com parâmetros de pool)
- [ ] JWT_SECRET configurado (chave gerada)
- [ ] FRONTEND_URL configurado
- [ ] URL do backend anotada
- [ ] Healthcheck `/health` funciona

### Vercel
- [ ] VITE_API_URL configurada (URL do backend Railway)
- [ ] Redeploy realizado
- [ ] Console mostra URL correta
- [ ] Login/registro funcionando

---

**✨ Tudo configurado! Agora é só testar!**



