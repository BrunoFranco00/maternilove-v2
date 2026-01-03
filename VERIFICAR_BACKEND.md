# ✅ VERIFICAR BACKEND RAILWAY

## 🎯 URL do Backend

**URL:** `https://maternilove-v2-production.up.railway.app`

## ✅ Como Verificar se Está Funcionando

### 1. Health Check

Abra no navegador:
```
https://maternilove-v2-production.up.railway.app/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-03T...",
  "database": "connected"
}
```

### 2. API Info

```
https://maternilove-v2-production.up.railway.app/api
```

**Resultado esperado:**
```json
{
  "message": "MaternLove API v1",
  "version": "1.0.0",
  "endpoints": {
    ...
  }
}
```

## 🔧 Configuração no Vercel

### Variável de Ambiente

1. Vercel → Seu Projeto → **Settings** → **Environment Variables**
2. Adicione/Edite:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://maternilove-v2-production.up.railway.app`
   - **Environments:** Production, Preview, Development

3. **IMPORTANTE:** Após adicionar, faça **Redeploy** do frontend!

## ✅ Verificar no Frontend

Depois do redeploy, abra o frontend e:
1. Abra o Console do navegador (F12)
2. Deve mostrar: `🔗 API URL: https://maternilove-v2-production.up.railway.app`
3. Status na tela deve mostrar: `✅ Conectado`

---

**✨ Tudo configurado!**

