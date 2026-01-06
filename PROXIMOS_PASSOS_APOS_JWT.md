# ✅ JWT_SECRET CONFIGURADO - PRÓXIMOS PASSOS

## 🎉 PARABÉNS!

✅ **JWT_SECRET configurado no Railway!**

---

## 📋 STATUS ATUAL

### ✅ Já Configurado
- [x] JWT_SECRET = `ndKTosXrXqTrJN/WPXgxp1W3JqVtyxaf/tiIna60XxU=`

### ⏳ Próximos Passos

---

## 🚂 RAILWAY - VERIFICAR OUTRAS VARIÁVEIS

Vá no Railway → Backend → Variables e verifique se tem estas variáveis:

### 1. DATABASE_URL (OBRIGATÓRIO)

**Verifique se está configurado:**
```
Key: DATABASE_URL
Value: postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres.railway.internal:5432/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

**Se NÃO estiver configurado:**
1. Clique em "New Variable"
2. Key: `DATABASE_URL`
3. Value: Cole a URL completa acima
4. Save

---

### 2. FRONTEND_URL (RECOMENDADO)

**Verifique se está configurado:**
```
Key: FRONTEND_URL
Value: https://maternilove-v2.vercel.app
```

**Se NÃO estiver configurado:**
1. Clique em "New Variable"
2. Key: `FRONTEND_URL`
3. Value: `https://maternilove-v2.vercel.app`
4. Save

---

### 3. Obter URL do Backend

1. No serviço Backend, vá em **Settings** → **Networking**
2. Verifique se **"Generate Domain"** está ativo
3. **Anote a URL** (exemplo: `maternilove-v2-production.up.railway.app`)
4. Você vai precisar dessa URL para o Vercel

**URL do Backend:** `https://_____________________________.railway.app`

---

## ✅ VERIFICAR SE O BACKEND ESTÁ FUNCIONANDO

### Teste 1: Ver Logs do Railway

1. No Railway → Backend → **Deployments**
2. Clique no deploy mais recente
3. Veja os logs

**✅ Deve mostrar:**
```
🔧 Configuração do Servidor:
   PORT: 3000
   NODE_ENV: production
   JWT_SECRET: ✅ configurado
   DATABASE_URL: ✅ configurado
   FRONTEND_URL: https://maternilove-v2.vercel.app

🚀 Materni Love Backend Server
📍 Server running on: 0.0.0.0:3000
✨ Ready to receive requests!
```

**Se mostrar isso, está funcionando!** ✅

---

### Teste 2: Healthcheck

1. Pegue a URL do seu backend no Railway
2. Abra no navegador:
   ```
   https://seu-backend.railway.app/health
   ```
3. Deve retornar:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-01-04T...",
     "database": "connected"
   }
   ```

✅ **Se retornar isso, backend está funcionando!**

---

## 🌐 VERCEL - CONFIGURAR FRONTEND

### Passo 1: Acessar Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto `maternilove-v2`

---

### Passo 2: Adicionar Variável VITE_API_URL

1. Vá em **Settings** → **Environment Variables**
2. Clique em **"Add New"**
3. Preencha:

   **Key:**
   ```
   VITE_API_URL
   ```

   **Value:**
   ```
   https://maternilove-v2-production.up.railway.app
   ```
   
   ⚠️ **IMPORTANTE:**
   - Substitua pela **URL REAL** do seu backend no Railway
   - Sem barra `/` no final
   - Marque para: **Production**, **Preview** e **Development**

4. Clique em **"Save"**

---

### Passo 3: Redeploy do Frontend

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** no último deploy
3. Clique em **"Redeploy"**
4. Aguarde terminar (1-2 minutos)

---

### Passo 4: Verificar se Funcionou

1. Acesse: `https://maternilove-v2.vercel.app`
2. Abra **DevTools** (F12) → **Console**
3. Deve mostrar:
   ```
   🔗 API URL: https://maternilove-v2-production.up.railway.app
   ```

✅ **Se mostrar a URL correta, está configurado!**

---

## 🧪 TESTE FINAL COMPLETO

### 1. Backend Funcionando?

- [ ] Healthcheck `/health` retorna `{"status":"ok","database":"connected"}`
- [ ] Logs mostram: `JWT_SECRET: ✅ configurado`

---

### 2. Frontend Configurado?

- [ ] `VITE_API_URL` configurada no Vercel
- [ ] Redeploy realizado
- [ ] Console mostra URL correta do backend

---

### 3. Testar Login/Registro

1. No frontend, tente **criar uma conta**
2. Se funcionar, tente **fazer login** com:
   - Email: `suporte@maternilove.com.br`
   - Senha: `Materni%2026`

**Se funcionar, está tudo OK!** ✅

---

## 📊 CHECKLIST COMPLETO

### Railway (Backend)
- [x] JWT_SECRET configurado
- [ ] DATABASE_URL configurado
- [ ] FRONTEND_URL configurado
- [ ] URL do backend anotada
- [ ] Backend funcionando (healthcheck OK)

### Vercel (Frontend)
- [ ] VITE_API_URL configurada (URL do backend Railway)
- [ ] Redeploy realizado
- [ ] Console mostra URL correta
- [ ] Login/registro funcionando

---

## 🔍 TROUBLESHOOTING

### Backend não está funcionando?

1. Verifique se `DATABASE_URL` está configurado
2. Verifique logs do Railway para erros
3. Teste healthcheck: `/health`

### Frontend não conecta ao backend?

1. Verifique se `VITE_API_URL` está configurado no Vercel
2. Verifique se a URL está correta (sem barra no final)
3. Faça redeploy do frontend
4. Verifique console do browser

### Login/Registro não funciona?

1. Verifique logs do Railway (pode mostrar erro específico)
2. Verifique console do browser (F12)
3. Verifique se tokens são salvos em localStorage

---

## 🎯 RESUMO

**✅ Feito:**
- JWT_SECRET configurado

**⏳ Próximos passos:**
1. Verificar/configurar `DATABASE_URL` no Railway
2. Verificar/configurar `FRONTEND_URL` no Railway
3. Anotar URL do backend
4. Configurar `VITE_API_URL` no Vercel
5. Redeploy do frontend
6. Testar login/registro

---

**✨ Continue configurando as outras variáveis e depois teste tudo!**



