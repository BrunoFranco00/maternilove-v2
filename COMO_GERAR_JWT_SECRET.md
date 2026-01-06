# 🔐 GUIA COMPLETO - GERAR E CONFIGURAR JWT_SECRET

## 📋 O QUE É JWT_SECRET?

O `JWT_SECRET` é uma chave secreta usada para assinar e verificar tokens JWT (JSON Web Tokens) que autenticam usuários no seu backend.

**⚠️ IMPORTANTE:**
- Deve ser uma string aleatória e segura
- Não compartilhe essa chave publicamente
- Use uma chave diferente para cada ambiente (desenvolvimento, produção)
- Em produção, é **OBRIGATÓRIO** configurar essa variável

---

## 🔧 PASSO 1: GERAR JWT_SECRET

### Opção A: Usando Terminal (Mac/Linux)

1. **Abra o Terminal no seu Mac**
   - Pressione `Cmd + Espaço`
   - Digite "Terminal"
   - Pressione Enter

2. **Execute o comando:**
   ```bash
   openssl rand -base64 32
   ```

3. **Copie o resultado**
   - Você verá algo como: `Xk9pL2mN3qR5sT7vW0yZ1aB3cD4eF6gH8iJ0kL1mN2oP3qR4sT5uV6wX7yZ8a`
   - Copie essa string completa (sem espaços)

**Exemplo de comando:**
```bash
$ openssl rand -base64 32
Xk9pL2mN3qR5sT7vW0yZ1aB3cD4eF6gH8iJ0kL1mN2oP3qR4sT5uV6wX7yZ8a
```

✅ **Guarde essa string!** Você vai precisar dela no próximo passo.

---

### Opção B: Usando Node.js (Alternativa)

Se não tiver `openssl` instalado, use Node.js:

1. **Abra o Terminal**
2. **Execute:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **Copie o resultado** (igual à Opção A)

---

### Opção C: Online (NÃO RECOMENDADO PARA PRODUÇÃO)

**⚠️ ATENÇÃO:** Use apenas para testes. Para produção, use Opção A ou B.

Você pode usar geradores online como:
- https://www.lastpass.com/pt/features/password-generator
- Configure para: 64 caracteres, incluir símbolos

---

## 🚂 PASSO 2: CONFIGURAR NO RAILWAY

### Passo 2.1: Acessar Railway

1. **Abra seu navegador**
2. **Acesse:** https://railway.app
3. **Faça login** (se necessário)
4. **Selecione seu projeto** (onde está o backend)

---

### Passo 2.2: Encontrar o Serviço Backend

1. **No dashboard do Railway**, você verá os serviços:
   - PostgreSQL
   - Backend (ou nome similar)
2. **Clique no serviço Backend** (NÃO no PostgreSQL)

---

### Passo 2.3: Adicionar Variável JWT_SECRET

1. **No serviço Backend**, procure por **"Variables"** na barra lateral esquerda
2. **Clique em "Variables"**
3. **Clique em "New Variable"** ou **"Add Variable"**
4. **Preencha:**
   - **Key:** `JWT_SECRET`
   - **Value:** Cole a string que você gerou no Passo 1
   - **Não adicione espaços** antes ou depois
5. **Clique em "Add"** ou **"Save"**

**Exemplo visual:**
```
┌─────────────────────────────────────┐
│ New Variable                        │
├─────────────────────────────────────┤
│ Key: JWT_SECRET                     │
│                                     │
│ Value: Xk9pL2mN3qR5sT7vW0yZ1aB...  │
│                                     │
│         [ Add ]  [ Cancel ]         │
└─────────────────────────────────────┘
```

---

### Passo 2.4: Verificar se Foi Adicionado

Após adicionar, você deve ver na lista de variáveis:

```
✅ JWT_SECRET = Xk9pL2mN3qR5sT7vW0yZ1aB3cD4eF6gH8iJ0kL1mN2oP3qR4sT5uV6wX7yZ8a
```

✅ **Perfeito!** A variável está configurada.

---

## 🔄 PASSO 3: REINICIAR O BACKEND

### Opção A: Deploy Automático

O Railway geralmente detecta mudanças em variáveis e reinicia automaticamente.

**Verificar:**
1. Vá em **"Deployments"** no serviço Backend
2. Veja se há um novo deploy sendo processado
3. Aguarde o deploy terminar (1-2 minutos)

---

### Opção B: Redeploy Manual

Se não reiniciar automaticamente:

1. Vá em **"Deployments"**
2. Clique nos **3 pontinhos** no último deploy
3. Clique em **"Redeploy"**
4. Aguarde o deploy terminar

---

## ✅ PASSO 4: VERIFICAR SE ESTÁ FUNCIONANDO

### Verificar Logs do Railway

1. **No serviço Backend**, vá em **"Deployments"**
2. **Clique no deploy mais recente**
3. **Veja os logs**
4. **Procure por:**

**✅ SUCESSO:**
```
🔧 Configuração do Servidor:
   PORT: 3000
   NODE_ENV: production
   JWT_SECRET: ✅ configurado
```

**❌ ERRO (se não configurado):**
```
❌ ERRO: Variáveis de ambiente obrigatórias não configuradas:
   - JWT_SECRET
```

Se aparecer o erro, verifique se:
- A variável foi adicionada corretamente
- O nome está exatamente: `JWT_SECRET` (maiúsculas)
- Não há espaços extras no valor

---

### Testar Healthcheck

1. **Obtenha a URL do backend:**
   - Settings → Networking → Generate Domain
   - Exemplo: `maternilove-v2-production.up.railway.app`

2. **Teste no navegador:**
   ```
   https://maternilove-v2-production.up.railway.app/health
   ```

3. **Resultado esperado:**
   ```json
   {
     "status": "ok",
     "timestamp": "2026-01-04T...",
     "database": "connected"
   }
   ```

✅ Se retornar isso, o backend está funcionando!

---

## 🧪 PASSO 5: TESTAR LOGIN (OPCIONAL)

### Via Frontend

1. **Acesse o frontend no Vercel**
2. **Tente fazer login ou registrar**
3. **Se funcionar**, o JWT_SECRET está correto!

---

### Via API (curl)

Se quiser testar diretamente na API:

```bash
curl -X POST https://maternilove-v2-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "suporte@maternilove.com.br",
    "password": "Materni%2026"
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "..."
    }
  }
}
```

✅ Se retornar tokens, está funcionando!

---

## 🔍 TROUBLESHOOTING

### Problema: Backend não inicia após adicionar JWT_SECRET

**Solução:**
1. Verifique os logs do Railway
2. Certifique-se que não há espaços antes/depois do valor
3. Certifique-se que o nome está correto: `JWT_SECRET` (exatamente assim)
4. Tente redeploy manual

---

### Problema: Erro "JWT_SECRET é obrigatório em produção"

**Causa:** A variável não foi encontrada ou está com nome errado.

**Solução:**
1. Verifique se a variável está no serviço **Backend** (não PostgreSQL)
2. Verifique o nome: deve ser exatamente `JWT_SECRET` (maiúsculas)
3. Verifique se foi salva corretamente
4. Faça redeploy

---

### Problema: Login retorna erro 500

**Causa:** JWT_SECRET pode estar incorreto ou backend não reiniciou.

**Solução:**
1. Verifique logs do Railway para erro específico
2. Faça redeploy manual do backend
3. Tente novamente

---

## 📊 RESUMO VISUAL DO PROCESSO

```
┌─────────────────────────────────────────────────────────┐
│ 1. GERAR JWT_SECRET                                     │
│    Terminal: openssl rand -base64 32                    │
│    Resultado: Xk9pL2mN3qR5sT7vW0yZ1aB3cD4eF...         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. ACESSAR RAILWAY                                      │
│    https://railway.app → Projeto → Backend → Variables │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. ADICIONAR VARIÁVEL                                   │
│    Key: JWT_SECRET                                      │
│    Value: Xk9pL2mN3qR5sT7vW0yZ1aB3cD4eF...             │
│    [ Save ]                                             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. REINICIAR BACKEND                                    │
│    Deployments → Redeploy (se necessário)               │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. VERIFICAR                                            │
│    Logs: JWT_SECRET: ✅ configurado                     │
│    Healthcheck: /health retorna OK                      │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINAL

- [ ] JWT_SECRET gerado com `openssl rand -base64 32`
- [ ] String copiada (sem espaços)
- [ ] Variável `JWT_SECRET` adicionada no Railway (serviço Backend)
- [ ] Valor colado corretamente (sem espaços extras)
- [ ] Backend reiniciado/redeploy feito
- [ ] Logs mostram: `JWT_SECRET: ✅ configurado`
- [ ] Healthcheck `/health` funciona
- [ ] Login/registro funciona no frontend

---

## 🎯 PRÓXIMOS PASSOS

Após configurar o JWT_SECRET:

1. ✅ Configurar `DATABASE_URL` no Railway
2. ✅ Configurar `FRONTEND_URL` no Railway
3. ✅ Configurar `VITE_API_URL` no Vercel
4. ✅ Testar login/registro

**Veja o guia completo:** `CONFIGURACAO_RAILWAY_VERCEL.md`

---

**✨ Pronto! Seu JWT_SECRET está configurado e seguro!**



