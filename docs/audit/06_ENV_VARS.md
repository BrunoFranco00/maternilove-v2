# VARIÁVEIS DE AMBIENTE - MATERNI LOVE V2

**Data:** 2025-01-03  
**Objetivo:** Lista completa de variáveis de ambiente usadas no backend

---

## VARIÁVEIS USADAS NO CÓDIGO

### OBRIGATÓRIAS (Produção)

#### `DATABASE_URL`
- **Uso**: Conexão com PostgreSQL via Prisma
- **Arquivos**: 
  - `src/server.ts` (linha 24, 51)
  - `prisma/schema.prisma` (linha 10)
- **Validação**: Verificada no boot em produção (`server.ts`, linha 29-42)
- **Sem valor**: Processo finaliza com código 1 em produção
- **Formato**: `postgresql://user:password@host:port/database`

#### `JWT_SECRET`
- **Uso**: Assinatura de tokens JWT (access token e fallback para refresh token)
- **Arquivos**: 
  - `src/server.ts` (linha 25, 52)
  - `src/config/jwt.ts` (linha 2, 7)
- **Validação**: Verificada no boot em produção (`server.ts`, linha 29-42)
- **Validação adicional**: `src/config/jwt.ts` lança erro se ausente em produção
- **Sem valor**: Processo finaliza com código 1 em produção
- **Fallback em dev**: `'change-this-in-development-only'`

---

### OPCIONAIS

#### `NODE_ENV`
- **Uso**: Determina ambiente (development/production)
- **Arquivos**: 
  - `src/server.ts` (linha 29, 48, 83, 141)
  - `src/config/prisma.ts` (linha 9, 14)
  - `src/config/jwt.ts` (linha 2)
  - `src/utils/logger.ts` (linha 6)
  - `src/middleware/errorHandler.middleware.ts` (linha 29, 41)
- **Valores**: `development`, `production`
- **Default**: Não configurado (undefined) = tratado como development
- **Comportamento**: Afeta CORS, logging, stack traces, Prisma logs

#### `PORT`
- **Uso**: Porta do servidor Express
- **Arquivos**: `src/server.ts` (linha 17, 47)
- **Default**: `3000`
- **Tipo**: Number

#### `FRONTEND_URL`
- **Uso**: URL do frontend para CORS (primeira prioridade)
- **Arquivos**: `src/server.ts` (linha 49, 72-73)
- **Default**: Não configurado (undefined)
- **Comportamento**: Se configurado, adiciona à whitelist de CORS

#### `CORS_ORIGIN`
- **Uso**: URLs adicionais para CORS (separadas por vírgula)
- **Arquivos**: `src/server.ts` (linha 50, 77-79)
- **Default**: Não configurado (undefined)
- **Formato**: String com múltiplas URLs separadas por vírgula
- **Comportamento**: Se configurado, split por vírgula e adiciona à whitelist

#### `JWT_REFRESH_SECRET`
- **Uso**: Secret para refresh tokens (opcional)
- **Arquivos**: `src/config/jwt.ts` (linha 8)
- **Default**: Fallback para `JWT_SECRET` se não configurado
- **Comportamento**: Se ausente, usa o mesmo secret do access token

#### `LOG_LEVEL`
- **Uso**: Nível de log do Winston
- **Arquivos**: `src/utils/logger.ts` (linha 41)
- **Default**: `'info'`
- **Valores**: `error`, `warn`, `info`, `debug`, etc

---

## ANÁLISE DE USO POR ARQUIVO

### `src/server.ts`

**Variáveis utilizadas**:
- `DATABASE_URL` (linha 24, 51)
- `JWT_SECRET` (linha 25, 52)
- `NODE_ENV` (linha 29, 48, 83, 141)
- `PORT` (linha 17, 47)
- `FRONTEND_URL` (linha 49, 72-73)
- `CORS_ORIGIN` (linha 50, 77-79)

**Validação**:
```typescript
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};

// Em produção, validar variáveis obrigatórias
if (process.env.NODE_ENV === 'production') {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente obrigatórias não configuradas:');
    missingVars.forEach((key) => {
      console.error(`   - ${key}`);
    });
    console.error('\nConfigure essas variáveis no Railway antes de iniciar o servidor.');
    process.exit(1);
  }
}
```

---

### `src/config/jwt.ts`

**Variáveis utilizadas**:
- `NODE_ENV` (linha 2)
- `JWT_SECRET` (linha 2, 7)
- `JWT_REFRESH_SECRET` (linha 8)

**Validação**:
```typescript
// Validar JWT_SECRET no boot (não usar fallback em produção)
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET é obrigatório em produção. Configure no Railway.');
}
```

---

### `src/config/prisma.ts`

**Variáveis utilizadas**:
- `NODE_ENV` (linha 9, 14)

**Comportamento**: Configura logging do Prisma baseado em NODE_ENV

---

### `src/utils/logger.ts`

**Variáveis utilizadas**:
- `NODE_ENV` (linha 6)
- `LOG_LEVEL` (linha 41)

---

### `src/middleware/errorHandler.middleware.ts`

**Variáveis utilizadas**:
- `NODE_ENV` (linha 29, 41)

**Comportamento**: Inclui stack trace em erros apenas em development

---

## ARQUIVO .env.example

**Status**: **NÃO ENCONTRADO** no repositório

### .env.example Recomendado

```env
# OBRIGATÓRIAS (Produção)
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-here-min-32-chars

# OPCIONAIS
NODE_ENV=development
PORT=3000
FRONTEND_URL=https://maternilove-v2.vercel.app
CORS_ORIGIN=https://example.com,https://another.com
JWT_REFRESH_SECRET=your-refresh-secret-here
LOG_LEVEL=info
```

---

## RESUMO

### Variáveis Obrigatórias (Produção)
1. `DATABASE_URL` - Conexão PostgreSQL
2. `JWT_SECRET` - Assinatura de tokens

### Variáveis Opcionais
1. `NODE_ENV` - Ambiente (development/production)
2. `PORT` - Porta do servidor (default: 3000)
3. `FRONTEND_URL` - URL do frontend para CORS
4. `CORS_ORIGIN` - URLs adicionais para CORS
5. `JWT_REFRESH_SECRET` - Secret para refresh tokens (default: JWT_SECRET)
6. `LOG_LEVEL` - Nível de log (default: info)

### Observações

1. **Validação em Produção**: DATABASE_URL e JWT_SECRET são validadas no boot
2. **Fallbacks**: PORT, LOG_LEVEL têm defaults; JWT_SECRET tem fallback em dev
3. **CORS Dinâmico**: CORS whitelist é construída dinamicamente baseado em FRONTEND_URL, CORS_ORIGIN e NODE_ENV
4. **Sem .env.example**: Arquivo não existe no repositório
