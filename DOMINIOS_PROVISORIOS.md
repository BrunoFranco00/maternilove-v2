# 🔍 DOMÍNIOS PROVISÓRIOS - MANTER OU REMOVER?

## 📋 RESPOSTA RÁPIDA

**NÃO, você NÃO precisa excluir os domínios provisórios!**

Eles podem coexistir com o domínio customizado e são úteis.

---

## 1️⃣ VERCEL - Domínios Provisórios

### Domínios Provisórios do Vercel:
- `maternilove-v2.vercel.app` (produção)
- `maternilove-v2-git-branch-xxx.vercel.app` (preview deployments)

### Devo Excluir?

**❌ NÃO, NÃO EXCLUA!**

**Por quê:**
1. ✅ **Preview Deployments:** Cada branch/PR cria um domínio provisório
2. ✅ **Desenvolvimento:** Útil para testar antes de fazer merge
3. ✅ **Backup:** Se houver problema com domínio customizado, os provisórios continuam funcionando
4. ✅ **Não causa conflito:** Domínio customizado e provisórios funcionam simultaneamente
5. ✅ **Regex CORS:** Com a correção aplicada, regex `*.vercel.app` já cobre todos os provisórios automaticamente

### Como Funciona:

- **Domínio Customizado:** `maternilove.com` → aponta para produção
- **Domínio Provisório:** `maternilove-v2.vercel.app` → continua funcionando
- **Ambos funcionam ao mesmo tempo!** ✅

---

## 2️⃣ RAILWAY - Domínio Provisório

### Domínio Provisório do Railway:
- `maternilove-v2-production.up.railway.app` (ou similar)

### Devo Excluir?

**❌ NÃO, NÃO EXCLUA!**

**Por quê:**
1. ✅ **Necessário:** O backend PRECISA de uma URL para funcionar
2. ✅ **Variável VITE_API_URL:** O frontend usa esta URL para chamar a API
3. ✅ **Não há opção de desativar:** Railway sempre gera um domínio provisório
4. ✅ **Útil para desenvolvimento:** Você pode testar a API diretamente
5. ✅ **Não causa conflito:** Domínio provisório e customizado podem coexistir

### Se Quiser Usar Domínio Customizado no Backend:

Você **pode** adicionar um domínio customizado no Railway também:

1. Railway → Backend Service → Settings → Networking
2. Em "Custom Domain", você pode adicionar (ex: `api.maternilove.com`)
3. Mas o domínio provisório continuará funcionando também

**⚠️ IMPORTANTE:**
- O frontend usa `VITE_API_URL` que aponta para o backend
- Se você não configurar domínio customizado no backend, continue usando o provisório
- O provisório funciona perfeitamente!

---

## ✅ RESUMO

| Serviço | Domínio Provisório | Devo Excluir? | Por quê? |
|---------|-------------------|---------------|----------|
| **Vercel** | `maternilove-v2.vercel.app` | ❌ **NÃO** | Útil para preview deployments, backup, desenvolvimento |
| **Railway** | `maternilove-v2-production.up.railway.app` | ❌ **NÃO** | Necessário para backend funcionar, usado pelo frontend |

---

## 🎯 CONFIGURAÇÃO RECOMENDADA

### Cenário 1: Apenas Domínio Customizado no Frontend (Mais Comum)

**Frontend (Vercel):**
- ✅ Domínio customizado: `maternilove.com` (usuários acessam aqui)
- ✅ Domínio provisório: `maternilove-v2.vercel.app` (mantém ativo, útil para testes)

**Backend (Railway):**
- ✅ Domínio provisório: `maternilove-v2-production.up.railway.app` (mantém ativo)
- ✅ `VITE_API_URL` no Vercel: `https://maternilove-v2-production.up.railway.app`
- ✅ `FRONTEND_URL` no Railway: `https://maternilove.com`

**Resultado:**
- Usuários acessam: `https://maternilove.com`
- Frontend chama backend: `https://maternilove-v2-production.up.railway.app`
- CORS permite: `maternilove.com` (via `FRONTEND_URL`)
- Tudo funciona! ✅

---

### Cenário 2: Domínios Customizados em Ambos (Opcional)

**Frontend (Vercel):**
- ✅ Domínio customizado: `maternilove.com`

**Backend (Railway):**
- ✅ Domínio customizado: `api.maternilove.com` (opcional)
- ✅ Atualizar `VITE_API_URL` no Vercel: `https://api.maternilove.com`
- ✅ Atualizar `FRONTEND_URL` no Railway: `https://maternilove.com`

**Resultado:**
- Usuários acessam: `https://maternilove.com`
- Frontend chama backend: `https://api.maternilove.com`
- Mais profissional, mas não é obrigatório

---

## 💡 RECOMENDAÇÃO FINAL

### Para Você (Situação Atual):

**MANTER TUDO:**

1. **Vercel:**
   - ✅ Domínio customizado: `maternilove.com` (adicionar)
   - ✅ Domínio provisório: `maternilove-v2.vercel.app` (manter)

2. **Railway:**
   - ✅ Domínio provisório: `maternilove-v2-production.up.railway.app` (manter)
   - ✅ Variável: `FRONTEND_URL=https://maternilove.com`

3. **Vercel (Variável de Ambiente):**
   - ✅ `VITE_API_URL=https://maternilove-v2-production.up.railway.app` (usar provisório do Railway)

**Por quê manter provisórios:**
- ✅ Não causam conflito
- ✅ Úteis para desenvolvimento e testes
- ✅ Backup se houver problema com domínio customizado
- ✅ Funcionam automaticamente

---

## ❓ PERGUNTAS FREQUENTES

### Posso usar apenas o domínio customizado e desabilitar os provisórios?

**Vercel:** Não é possível desabilitar provisórios, mas você pode não compartilhar o link.

**Railway:** Não é possível desabilitar provisório, é necessário para o serviço funcionar.

### Os provisórios causam problemas de segurança?

**Não.** Eles só funcionam se você compartilhar o link. Não são descobertos automaticamente.

### Preciso atualizar algo se mantiver os provisórios?

**Não.** Eles funcionam automaticamente e não interferem no domínio customizado.

---

**✅ CONCLUSÃO: MANTER TODOS OS DOMÍNIOS PROVISÓRIOS!**

Eles são úteis e não causam problemas. O domínio customizado é para os usuários, os provisórios são para desenvolvimento/backup.


