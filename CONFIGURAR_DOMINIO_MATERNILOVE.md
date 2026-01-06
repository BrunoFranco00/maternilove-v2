# 🔧 CONFIGURAR DOMÍNIO MATERNILOVE.COM

## 📋 VISÃO GERAL

Para usar o domínio customizado `maternilove.com`, você precisa configurar em **2 lugares**:

1. ✅ **Vercel** - Configurar domínio customizado
2. ✅ **Railway (Backend)** - Configurar CORS para aceitar o domínio

---

## 1️⃣ CONFIGURAR NO VERCEL

### Passo 1: Adicionar Domínio no Vercel

1. Acesse: https://vercel.com
2. Selecione seu projeto: `maternilove-v2`
3. Vá em **Settings** → **Domains**
4. Clique em **"Add Domain"**
5. Digite: `maternilove.com`
6. Clique em **"Add"**

### Passo 2: Configurar DNS

O Vercel vai mostrar instruções de DNS. Você precisa adicionar os registros no seu provedor de DNS (onde você comprou o domínio):

**Registros DNS necessários:**

1. **Registro A** (para domínio principal):
   ```
   Tipo: A
   Nome: @ (ou vazio, depende do provedor)
   Valor: 76.76.21.21 (IP do Vercel - pode variar)
   TTL: 3600 (ou Auto)
   ```

2. **Registro CNAME** (para www):
   ```
   Tipo: CNAME
   Nome: www
   Valor: cname.vercel-dns.com
   TTL: 3600 (ou Auto)
   ```

**⚠️ IMPORTANTE:**
- O Vercel mostra os valores exatos quando você adiciona o domínio
- Pode levar até 24-48 horas para propagar (geralmente é mais rápido)
- Você pode verificar o status no painel do Vercel

### Passo 3: Aguardar Verificação

1. No Vercel, o domínio aparecerá como "Pending" ou "Validating"
2. Aguarde a propagação DNS (pode levar alguns minutos a horas)
3. Quando estiver "Valid", o domínio está funcionando!

---

## 2️⃣ CONFIGURAR NO RAILWAY (BACKEND)

Você tem **2 opções** para configurar no Railway:

### OPÇÃO A: Usar FRONTEND_URL (Recomendado) ⭐

1. Acesse: https://railway.app
2. Selecione seu projeto
3. Vá no serviço **Backend** (não PostgreSQL)
4. Clique em **Variables**
5. Adicione/Edite a variável:

```
Key: FRONTEND_URL
Value: https://maternilove.com
```

**Vantagens:**
- Com a correção com regex já aplicada, funciona automaticamente
- Mais semântico e claro
- Se você também configurar `www.maternilove.com`, pode adicionar ambos:

```
FRONTEND_URL=https://maternilove.com,https://www.maternilove.com
```

### OPÇÃO B: Usar CORS_ORIGIN

Se preferir usar `CORS_ORIGIN`:

1. Acesse: Railway → Backend → Variables
2. Adicione/Edite:

```
Key: CORS_ORIGIN
Value: https://maternilove.com
```

**Se também usar www:**
```
CORS_ORIGIN=https://maternilove.com,https://www.maternilove.com
```

### OPÇÃO C: Remover CORS_ORIGIN (Regex Funciona)

Como a correção com regex já está aplicada, você pode:

1. **Remover** a variável `CORS_ORIGIN` do Railway (se existir)
2. **Adicionar apenas** `FRONTEND_URL=https://maternilove.com`
3. A regex `*.vercel.app` continua funcionando para preview deployments
4. O `maternilove.com` é adicionado via `FRONTEND_URL`

**Esta é a opção mais flexível!**

---

## ✅ RESUMO DAS CONFIGURAÇÕES

### Vercel:
- ✅ Adicionar domínio: `maternilove.com`
- ✅ Configurar DNS (A e CNAME)
- ✅ Aguardar verificação

### Railway (Backend):
- ✅ Adicionar variável: `FRONTEND_URL=https://maternilove.com`
- ✅ Ou: `CORS_ORIGIN=https://maternilove.com`
- ✅ (Opcional) Remover `CORS_ORIGIN` antigo se existir

---

## 🎯 RECOMENDAÇÃO FINAL

**Configuração ideal:**

1. **Vercel:**
   - Domínio: `maternilove.com`
   - DNS configurado e verificado

2. **Railway:**
   ```
   FRONTEND_URL=https://maternilove.com
   ```
   (Remover `CORS_ORIGIN` se existir, ou deixar vazio)

**Por quê?**
- ✅ `FRONTEND_URL` é mais semântico
- ✅ Regex `*.vercel.app` continua funcionando (preview deployments)
- ✅ Domínio customizado funciona via `FRONTEND_URL`
- ✅ Máxima flexibilidade

---

## 🔍 VERIFICAÇÃO

### Após configurar tudo:

1. **Aguardar propagação DNS** (pode levar horas)

2. **Testar domínio:**
   - Acesse: `https://maternilove.com`
   - Deve carregar o frontend

3. **Testar login/registro:**
   - Tentar fazer login
   - Verificar console do browser (não deve ter erro CORS)

4. **Verificar logs Railway:**
   ```
   🌐 CORS - Origens permitidas:
      ✅ https://maternilove.com
      ✅ /^https:\/\/.*\.vercel\.app$/ (regex)
   ```

---

## ❓ PERGUNTAS FREQUENTES

### Preciso configurar ambos (Vercel e Railway)?

**SIM!** Porque:
- **Vercel:** Faz o domínio apontar para o frontend
- **Railway:** Permite que o frontend (domínio customizado) faça requisições ao backend

### Posso usar apenas um?

**NÃO.** Você precisa dos dois:
- Sem Vercel: Domínio não aponta para lugar nenhum
- Sem Railway: CORS bloqueia requisições do domínio customizado

### E se também quiser www.maternilove.com?

Adicione ambos no Railway:
```
FRONTEND_URL=https://maternilove.com,https://www.maternilove.com
```

E configure DNS no Vercel para ambos.

---

**✨ Configuração completa!**


