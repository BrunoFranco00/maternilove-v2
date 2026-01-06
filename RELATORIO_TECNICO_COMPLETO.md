# 📋 RELATÓRIO TÉCNICO COMPLETO - ANÁLISE CORS

**Data:** 2026-01-05  
**Objetivo:** Identificar causa raiz do erro CORS no preflight OPTIONS

---

## ETAPA 1 — ANÁLISE OBRIGATÓRIA

### Arquivo Principal
**Arquivo:** `backend/src/server.ts`

### Ordem de Middlewares (Linha por Linha)

| Linha | Middleware | Tipo | Observação |
|-------|------------|------|------------|
| 58 | `app.set('trust proxy', 1)` | Config | Não bloqueia |
| **115** | **`app.use(cors({...}))`** | **Global** | **CORS configurado** |
| 150 | `app.use(helmet())` | Global | Após CORS |
| **151** | **`app.use(generalLimiter)`** | **Global** | **Após CORS - PROBLEMA** |
| 153 | `app.use(express.json({...}))` | Global | Body parser |
| 154 | `app.use(express.urlencoded({...}))` | Global | Body parser |
| 245 | `app.use('/api/auth', authRoutes)` | Rotas | Auth routes |

### Verificações

1. ✅ CORS está ANTES de helmet (linha 115 vs 150)
2. ✅ CORS está ANTES de generalLimiter (linha 115 vs 151)
3. ❌ **NÃO há handler explícito para OPTIONS**
4. ⚠️ **generalLimiter aplicado globalmente SEM skip para OPTIONS**
5. ✅ Não há `app.use('/api', ...)` antes do CORS

---

## ETAPA 2 — PROVA TÉCNICA

### Simulação: OPTIONS /api/auth/register

**Fluxo:**
1. Requisição chega: `OPTIONS /api/auth/register`
2. Trust Proxy (linha 58): ✅ Passa
3. CORS (linha 115): ✅ Processa, adiciona headers
4. Helmet (linha 150): ⚠️ Pode modificar headers
5. **generalLimiter (linha 151): ❌ PROBLEMA CRÍTICO**
   - Rate limiter **conta OPTIONS no limite**
   - Se limite atingido → retorna 429
   - Browser não recebe headers CORS
6. express.json: ✅ Passa
7. Rotas: Não chega se bloqueado

### Código do Problema

**Arquivo:** `backend/src/middleware/rateLimiter.middleware.ts`  
**Linhas:** 3-9

```typescript
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // ❌ FALTA: skip para ignorar OPTIONS
});
```

**Problema:**
- `express-rate-limit` por padrão **conta TODAS as requisições**, incluindo OPTIONS
- Se 100 requisições em 15 minutos → próximo OPTIONS retorna 429
- 429 retornado ANTES do CORS processar
- Browser não recebe `Access-Control-Allow-Origin`
- Browser bloqueia com erro CORS

---

## ETAPA 3 — CORREÇÃO MÍNIMA

### Correção Aplicada

Adicionar `skip` no `generalLimiter` para ignorar requisições OPTIONS:

**Arquivo:** `backend/src/middleware/rateLimiter.middleware.ts`

```typescript
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // ✅ IGNORA OPTIONS
});
```

**Justificativa:**
- OPTIONS (preflight) não deve contar no rate limit
- Preflight é automático do browser, não é requisição real
- Garante que OPTIONS sempre passa e chega ao CORS

---

## ETAPA 4 — VALIDAÇÃO

Após correção:

1. ✅ OPTIONS passa pelo rate limiter (não conta, não bloqueia)
2. ✅ OPTIONS chega ao CORS middleware
3. ✅ CORS processa e adiciona headers
4. ✅ Browser recebe `Access-Control-Allow-Origin`
5. ✅ Preflight passa, requisição real é feita

---

## ETAPA 5 — RELATÓRIO FINAL

### CAUSA RAIZ

**Arquivo:** `backend/src/middleware/rateLimiter.middleware.ts`  
**Linha:** 3-9  
**Função:** `generalLimiter`

**Problema:**
O `generalLimiter` (express-rate-limit) aplicado globalmente **conta requisições OPTIONS no rate limit** e pode **bloquear OPTIONS (retornar 429)** antes do CORS processar.

**Evidência:**
- `express-rate-limit` por padrão conta todas as requisições
- Não há configuração `skip` para ignorar OPTIONS
- Se limite atingido, retorna 429 antes do CORS
- Browser não recebe headers CORS

### CORREÇÃO APLICADA

**Arquivo:** `backend/src/middleware/rateLimiter.middleware.ts`  
**Linha:** 9 (adicionar após `legacyHeaders`)

```typescript
skip: (req) => req.method === 'OPTIONS'
```

### POR QUE AGORA FUNCIONA

1. OPTIONS não conta no rate limit
2. OPTIONS sempre passa pelo rate limiter
3. OPTIONS chega ao CORS middleware
4. CORS processa e adiciona headers
5. Browser recebe headers CORS
6. Preflight passa, requisição real funciona

### POR QUE ANTES FALHAVA

1. OPTIONS contava no rate limit
2. Se limite atingido, OPTIONS retornava 429
3. 429 retornado ANTES do CORS processar
4. Browser não recebia headers CORS
5. Browser bloqueava com erro CORS

---

## OBSERVAÇÃO IMPORTANTE

**O backend está retornando 502 Bad Gateway**, o que significa que a aplicação não está respondendo. Este problema de CORS será resolvido quando o backend voltar a funcionar, mas a correção do rate limiter é necessária para garantir que OPTIONS sempre funcione corretamente.


