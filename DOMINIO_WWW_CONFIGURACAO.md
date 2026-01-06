# 🔧 CONFIGURAR DOMÍNIO WWW - VERCEL E RAILWAY

## ⚠️ IMPORTANTE: Vercel e Railway São Serviços Diferentes

**NÃO há conflito** entre adicionar domínios no Vercel e no Railway porque:

- **Vercel** = Frontend (sua aplicação React)
- **Railway** = Backend (sua API Node.js)

Eles são serviços separados e podem usar domínios/subdomínios diferentes!

---

## 🎯 CONFIGURAÇÃO CORRETA

### Estrutura Recomendada:

```
Frontend (Vercel):
  - maternilove.com
  - www.maternilove.com

Backend (Railway):
  - api.maternilove.com (ou usar domínio provisório)
```

### Ou Simplesmente:

```
Frontend (Vercel):
  - maternilove.com
  - www.maternilove.com

Backend (Railway):
  - maternilove-v2-production.up.railway.app (domínio provisório)
```

---

## 1️⃣ VERCEL - Adicionar WWW

### O que você precisa fazer:

1. **Vercel** → Seu Projeto → **Settings** → **Domains**
2. Você já deve ter: `maternilove.com`
3. Clique em **"Add Domain"**
4. Digite: `www.maternilove.com`
5. Configure DNS conforme instruções do Vercel

### DNS para WWW no Vercel:

Você precisa adicionar um registro **CNAME** no seu provedor de DNS:

```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com (ou o que o Vercel indicar)
TTL: 3600 (ou Auto)
```

---

## 2️⃣ RAILWAY - Configurar CORS

### Se você adicionou `www.maternilove.com` no Railway (Backend):

**Isso é opcional!** Você pode:

**OPÇÃO A: Usar domínio provisório do Railway (Recomendado)**
- Backend continua usando: `maternilove-v2-production.up.railway.app`
- Não precisa adicionar domínio customizado no Railway
- Funciona perfeitamente!

**OPÇÃO B: Adicionar domínio customizado no Railway**
- Exemplo: `api.maternilove.com` (não `www.maternilove.com`)
- Mais profissional, mas não é obrigatório

### Configurar CORS no Railway:

Se você quer usar `www.maternilove.com` no frontend, configure:

**Railway → Backend → Variables:**

```
FRONTEND_URL=https://maternilove.com,https://www.maternilove.com
```

Ou:

```
CORS_ORIGIN=https://maternilove.com,https://www.maternilove.com
```

---

## ❓ PROBLEMA: "Não Consigo Adicionar WWW no Vercel"

### Possíveis Causas:

1. **DNS já configurado para outro serviço:**
   - Se você já configurou `www` para apontar para o Railway, precisa mudar para Vercel
   - Um registro DNS só pode apontar para um lugar

2. **Domínio já em uso:**
   - Verifique se `www.maternilove.com` já está configurado em outro serviço

3. **Erro de validação DNS:**
   - Aguarde propagação DNS (pode levar horas)
   - Verifique se o registro CNAME está correto

### Solução:

**Passo 1: Verificar DNS Atual**

1. Acesse seu provedor de DNS (onde você comprou o domínio)
2. Verifique se existe registro para `www`
3. Veja para onde está apontando

**Passo 2: Se www está apontando para Railway:**

Você tem 2 opções:

**OPÇÃO A: Remover do Railway, usar no Vercel (Recomendado)**
- Remover `www.maternilove.com` do Railway (se adicionou)
- Adicionar `www.maternilove.com` no Vercel
- Configurar DNS para apontar para Vercel

**OPÇÃO B: Usar subdomínios diferentes**
- Vercel: `maternilove.com` e `www.maternilove.com` (frontend)
- Railway: `api.maternilove.com` (backend, opcional)

---

## ✅ CONFIGURAÇÃO RECOMENDADA FINAL

### Frontend (Vercel):

**Domínios:**
- ✅ `maternilove.com`
- ✅ `www.maternilove.com`

**DNS:**
- `@` → A record → IP do Vercel
- `www` → CNAME → `cname.vercel-dns.com`

### Backend (Railway):

**Variáveis de Ambiente:**
```
FRONTEND_URL=https://maternilove.com,https://www.maternilove.com
```

**Domínio:**
- ✅ Usar domínio provisório: `maternilove-v2-production.up.railway.app`
- ✅ (Opcional) Adicionar: `api.maternilove.com` (se quiser)

**Vercel (Variável de Ambiente):**
```
VITE_API_URL=https://maternilove-v2-production.up.railway.app
```

---

## 🔍 COMO RESOLVER O PROBLEMA

### Se você não consegue adicionar www no Vercel:

1. **Verificar onde www está configurado:**
   - Railway → Backend → Settings → Networking
   - Veja se `www.maternilove.com` está listado

2. **Se estiver no Railway:**
   - Remover `www.maternilove.com` do Railway (se não for necessário)
   - Ou usar subdomínio diferente no Railway (ex: `api.maternilove.com`)

3. **Configurar DNS corretamente:**
   - `www` → CNAME → Vercel
   - (Não apontar para Railway se quiser usar no Vercel)

4. **Tentar adicionar no Vercel novamente:**
   - Vercel → Settings → Domains → Add Domain
   - Digite: `www.maternilove.com`

---

## 💡 RECOMENDAÇÃO

**Para sua situação:**

1. **Vercel (Frontend):**
   - ✅ `maternilove.com`
   - ✅ `www.maternilove.com` (adicionar)

2. **Railway (Backend):**
   - ✅ Usar domínio provisório (não precisa de customizado)
   - ✅ Variável: `FRONTEND_URL=https://maternilove.com,https://www.maternilove.com`

3. **DNS:**
   - `@` → Vercel
   - `www` → Vercel (CNAME)
   - (Não configurar `www` para Railway)

---

## ❓ QUAL ERRO APARECE NO VERCEL?

Me informe:
1. Qual é a mensagem de erro exata no Vercel?
2. Você adicionou `www.maternilove.com` no Railway? Se sim, onde exatamente?
3. O DNS do `www` está apontando para onde atualmente?

Com essas informações, posso ajudar de forma mais específica!


