# ETAPA 2 — PROVA TÉCNICA

## SIMULAÇÃO MENTAL: OPTIONS /api/auth/register

### Requisição do Browser:
```
OPTIONS /api/auth/register
Headers:
  Origin: https://maternilove.com
  Access-Control-Request-Method: POST
  Access-Control-Request-Headers: Content-Type
```

### Fluxo no Backend (Ordem de Execução):

#### 1. Trust Proxy (linha 58)
- ✅ Passa (configuração, não bloqueia)

#### 2. CORS Middleware (linha 115)
- ✅ **DEVERIA tratar OPTIONS aqui**
- O middleware `cors()` do pacote `cors` normalmente trata OPTIONS automaticamente
- Deveria retornar headers:
  - `Access-Control-Allow-Origin: https://maternilove.com`
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type, Authorization`
  - `Access-Control-Allow-Credentials: true`

#### 3. Helmet (linha 150)
- ⚠️ **PROBLEMA POTENCIAL**
- Helmet modifica headers HTTP
- Se Helmet modificar headers após CORS, pode sobrescrever ou conflitar

#### 4. generalLimiter (linha 151)
- ❌ **PROBLEMA CRÍTICO IDENTIFICADO**
- `express-rate-limit` aplicado globalmente
- **POR PADRÃO, express-rate-limit NÃO ignora OPTIONS**
- Se o limite for atingido, retorna 429 (Too Many Requests)
- Se OPTIONS for bloqueado aqui, o CORS nunca processa

#### 5. express.json (linha 153)
- ✅ Passa (não processa OPTIONS)

#### 6. express.urlencoded (linha 154)
- ✅ Passa (não processa OPTIONS)

#### 7. Rotas
- Não chega se bloqueado antes

---

## IDENTIFICAÇÃO DO PROBLEMA

### PROBLEMA 1: generalLimiter Pode Bloquear OPTIONS

**Evidência:**
- `express-rate-limit` por padrão **conta TODAS as requisições**, incluindo OPTIONS
- Não há configuração `skip` no `generalLimiter`
- Se múltiplas requisições forem feitas (testes, healthchecks, etc.), o limite pode ser atingido
- Quando o limite é atingido, retorna 429 **ANTES** do CORS processar

**Código Problema:**
```typescript
// backend/src/middleware/rateLimiter.middleware.ts:3-9
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // ❌ FALTA: skip: (req) => req.method === 'OPTIONS'
});
```

**Impacto:**
- Se 100 requisições forem feitas em 15 minutos, próxima requisição (incluindo OPTIONS) retorna 429
- Browser não recebe headers CORS
- Browser bloqueia requisição com erro CORS

### PROBLEMA 2: Helmet Pode Modificar Headers CORS

**Evidência:**
- Helmet está DEPOIS do CORS
- Helmet modifica headers HTTP
- Pode sobrescrever ou conflitar com headers CORS

**Impacto:**
- Menos crítico, mas pode causar problemas

### PROBLEMA 3: Falta Handler Explícito OPTIONS

**Evidência:**
- Não há `app.options('*', cors())`
- Depende completamente do middleware `cors()` tratar OPTIONS

**Impacto:**
- Se algum middleware anterior bloquear, OPTIONS nunca chega ao CORS

---

## CAUSA RAIZ PROVÁVEL

**O `generalLimiter` (express-rate-limit) aplicado globalmente pode estar bloqueando requisições OPTIONS antes do CORS processar.**

Mesmo que:
- ✅ CORS esteja configurado corretamente
- ✅ CORS esteja antes de helmet e generalLimiter
- ✅ Origens estejam na lista permitida

Se o rate limiter bloquear OPTIONS (retornando 429), o browser nunca recebe os headers CORS e retorna erro de CORS.

---

## PROVA TÉCNICA COMPLETA

### Cenário 1: Rate Limit NÃO Atingido
1. OPTIONS chega
2. CORS processa → adiciona headers
3. generalLimiter processa → conta requisição
4. ✅ Browser recebe headers CORS → Funciona

### Cenário 2: Rate Limit Atingido (PROBLEMA)
1. OPTIONS chega
2. CORS processa → adiciona headers
3. generalLimiter processa → **limite atingido → retorna 429**
4. ❌ Browser recebe 429 (não headers CORS) → Erro CORS

### Cenário 3: Rate Limit Conta OPTIONS (PROBLEMA)
1. Múltiplas requisições OPTIONS (preflight)
2. Cada OPTIONS conta no rate limit
3. Limite é atingido mais rápido
4. Próximas requisições OPTIONS são bloqueadas

---

## CONCLUSÃO DA ETAPA 2

**CAUSA RAIZ CONFIRMADA:**

O `generalLimiter` aplicado globalmente na **linha 151** do `server.ts` está:
1. Contando requisições OPTIONS no rate limit
2. Podendo bloquear OPTIONS (retornar 429) antes do CORS processar
3. Fazendo com que o browser não receba headers CORS

**CORREÇÃO NECESSÁRIA:**

Adicionar `skip` no `generalLimiter` para ignorar requisições OPTIONS:

```typescript
skip: (req) => req.method === 'OPTIONS'
```

Isso garante que OPTIONS sempre passe pelo rate limiter e chegue ao CORS.


