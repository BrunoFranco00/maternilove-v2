# ETAPA 1 — ANÁLISE OBRIGATÓRIA (SEM ALTERAR NADA)

## 1. ARQUIVO PRINCIPAL DO SERVIDOR

**Arquivo:** `backend/src/server.ts`

---

## 2. LISTA DE MIDDLEWARES GLOBAIS (EM ORDEM DE EXECUÇÃO)

### Ordem Atual no Código:

| Linha | Middleware | Tipo | Observação |
|-------|------------|------|------------|
| 58 | `app.set('trust proxy', 1)` | Configuração | Não é middleware, mas configuração |
| **115** | **`app.use(cors({...}))`** | **Middleware Global** | **CORS configurado** |
| 150 | `app.use(helmet())` | Middleware Global | Segurança HTTP headers |
| 151 | `app.use(generalLimiter)` | Middleware Global | Rate limiting global |
| 153 | `app.use(express.json({...}))` | Middleware Global | Body parser JSON |
| 154 | `app.use(express.urlencoded({...}))` | Middleware Global | Body parser URL encoded |

### Rotas Registradas:

| Linha | Rota | Observação |
|-------|------|------------|
| 165 | `app.get('/health/live', ...)` | Healthcheck |
| 174 | `app.get('/health/ready', ...)` | Healthcheck |
| 202 | `app.get('/health', ...)` | Healthcheck |
| 229 | `app.get('/api', ...)` | API info |
| **245** | **`app.use('/api/auth', authRoutes)`** | **Rotas de autenticação** |

### Middlewares de Erro:

| Linha | Middleware | Tipo |
|-------|------------|------|
| 260 | `app.use(errorHandler)` | Error handler global |
| 266 | `app.use((req, res) => {...})` | 404 handler |

---

## 3. ANÁLISE DETALHADA DO CORS

### Código do CORS (linhas 115-147):

```typescript
app.use(cors({
  origin: (origin, callback) => {
    // Lógica de verificação de origem
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**Observações:**
- ✅ CORS está configurado com `methods: ['OPTIONS']`
- ✅ `allowedHeaders` inclui 'Content-Type' e 'Authorization'
- ✅ CORS está ANTES de helmet() (linha 115 vs 150)
- ✅ CORS está ANTES de generalLimiter (linha 115 vs 151)

---

## 4. VERIFICAÇÃO DE HANDLERS OPTIONS

**Resultado:** ❌ **NÃO existe handler explícito para OPTIONS**

Não há:
- `app.options('*', ...)`
- `app.options('/api/auth/*', ...)`
- Handler específico para OPTIONS

**Isso pode ser um problema**, pois o middleware `cors()` normalmente trata OPTIONS automaticamente, MAS se algum middleware anterior bloqueia OPTIONS, o CORS nunca recebe a requisição.

---

## 5. ANÁLISE DE RATE LIMITERS

### generalLimiter (linha 151):

**Arquivo:** `backend/src/middleware/rateLimiter.middleware.ts`
**Linhas:** 3-9

```typescript
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Posição:** Aplicado GLOBALMENTE após CORS (linha 151)

**Problema Potencial:** 
- `express-rate-limit` por padrão **pode bloquear requisições OPTIONS**
- Se `skipSuccessfulRequests` ou `skipFailedRequests` não estiver configurado, OPTIONS pode ser contado no rate limit
- Se o limite for atingido, OPTIONS pode ser bloqueado **ANTES** de chegar ao CORS

### authLimiter (nas rotas de auth):

**Arquivo:** `backend/src/routes/auth.routes.ts`
**Linhas:** 7-8

```typescript
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
```

**Posição:** Aplicado nas rotas POST específicas

**Observação:** authLimiter está aplicado apenas em POST, então **NÃO afeta OPTIONS** diretamente, pois OPTIONS é um método diferente.

---

## 6. VERIFICAÇÃO DE app.use('/api', ...) ANTES DO CORS

**Resultado:** ✅ **NÃO há `app.use('/api', ...)` antes do CORS**

---

## 7. ANÁLISE CRÍTICA: FLUXO DE REQUISIÇÃO OPTIONS

### Simulação Mental: OPTIONS /api/auth/register

1. **Requisição chega:** `OPTIONS /api/auth/register`
2. **Trust Proxy (linha 58):** ✅ Passa (configuração, não bloqueia)
3. **CORS (linha 115):** ✅ **DEVERIA tratar OPTIONS aqui**
4. **Helmet (linha 150):** ❌ **PROBLEMA POTENCIAL** - Helmet pode modificar headers CORS
5. **generalLimiter (linha 151):** ❌ **PROBLEMA POTENCIAL** - Rate limiter pode bloquear OPTIONS
6. **express.json (linha 153):** ✅ Passa (não afeta OPTIONS)
7. **express.urlencoded (linha 154):** ✅ Passa (não afeta OPTIONS)
8. **Rotas:** Não chega se bloqueado antes

---

## 8. PROBLEMAS IDENTIFICADOS

### PROBLEMA 1: Helmet Pode Modificar Headers CORS

**Linha:** 150
**Arquivo:** `backend/src/server.ts`

Helmet está aplicado **DEPOIS** do CORS, mas Helmet modifica headers HTTP. Se Helmet modificar headers CORS depois que o CORS já os definiu, pode causar problemas.

**Evidência:** Helmet por padrão configura vários headers de segurança que podem interferir com CORS.

### PROBLEMA 2: generalLimiter Pode Bloquear OPTIONS

**Linha:** 151
**Arquivo:** `backend/src/server.ts`

`express-rate-limit` aplicado globalmente **pode bloquear requisições OPTIONS** se:
- O limite de requisições for atingido
- OPTIONS for contado no rate limit

**Evidência:** `express-rate-limit` por padrão não ignora OPTIONS automaticamente.

### PROBLEMA 3: Falta Handler Explícito para OPTIONS

**Evidência:** Não há `app.options('*', cors())` ou handler específico para OPTIONS.

O middleware `cors()` normalmente trata OPTIONS automaticamente, mas se algum middleware anterior bloqueia, o CORS nunca recebe a requisição.

---

## CONCLUSÃO DA ETAPA 1

**CAUSA RAIZ PROVÁVEL:**

O `generalLimiter` (express-rate-limit) aplicado globalmente na **linha 151** pode estar:
1. Bloqueando requisições OPTIONS antes do CORS processar
2. Contando OPTIONS no rate limit
3. Retornando erro 429 (Too Many Requests) para OPTIONS

Mesmo que o CORS esteja configurado corretamente, se o rate limiter bloqueia OPTIONS, o browser nunca recebe os headers CORS.

**PRÓXIMO PASSO:** Verificar documentação do express-rate-limit sobre OPTIONS e aplicar correção mínima.


