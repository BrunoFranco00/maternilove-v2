# BACKEND OVERVIEW - MATERNI LOVE V2

**Data:** 2025-01-03  
**Objetivo:** Visão geral técnica do backend

---

## STACK DETECTADA

### Runtime e Linguagem
- **Node.js**: (versão não especificada no package.json, mas requer Node 18+ conforme documentação)
- **TypeScript**: `^5.3.3`
- **ES Modules**: `"type": "module"` no package.json

### Framework e Bibliotecas Core
- **Express**: `^4.18.2` (framework web)
- **CORS**: `^2.8.5` (middleware CORS)
- **Helmet**: `^7.1.0` (security headers)
- **dotenv**: `^16.3.1` (variáveis de ambiente)

### ORM e Banco de Dados
- **Prisma**: `^5.7.1` (ORM)
- **@prisma/client**: `^5.7.1` (cliente Prisma)
- **PostgreSQL**: (provider configurado no schema.prisma)

### Autenticação e Segurança
- **jsonwebtoken**: `^9.0.2` (JWT)
- **bcryptjs**: `^2.4.3` (hash de senhas)
- **express-rate-limit**: `^7.1.5` (rate limiting)

### Validação
- **Zod**: `^3.22.4` (validação de schemas)
- **express-validator**: `^7.0.1` (validação Express - instalado mas não utilizado diretamente no código auditado)

### Logging
- **winston**: `^3.11.0` (logger estruturado)

### Dev Dependencies
- **tsx**: `^4.7.0` (TypeScript executor)
- **jest**: `^29.7.0` (testes)
- **ts-jest**: `^29.1.1` (Jest com TypeScript)
- **eslint**: `^8.56.0` (linting)
- **prettier**: `^3.2.4` (formatação)

---

## SCRIPTS (package.json)

### Desenvolvimento
- `dev`: `tsx watch src/server.ts` - Inicia servidor em modo watch
- `prisma:studio`: `prisma studio` - Interface visual do Prisma

### Build e Deploy
- `build`: `tsc` - Compila TypeScript para JavaScript (saída em `dist/`)
- `start`: `node dist/server.js` - Executa versão compilada
- `prestart`: `prisma migrate deploy` - Executa migrations antes do start (produção)

### Prisma
- `prisma:generate`: `prisma generate` - Gera Prisma Client
- `postinstall`: `prisma generate` - Gera Prisma Client após npm install
- `prisma:migrate`: `prisma migrate dev` - Cria nova migration (desenvolvimento)
- `prisma:migrate:deploy`: `prisma migrate deploy` - Aplica migrations (produção)
- `prisma:seed`: `tsx prisma/seed.ts` - Executa seed do banco
- `seed:admin`: `tsx prisma/seed.ts` - Alias para seed

### Testes
- `test`: `jest` - Executa testes
- `test:watch`: `jest --watch` - Modo watch
- `test:coverage`: `jest --coverage` - Cobertura de testes

### Code Quality
- `lint`: `eslint src --ext .ts` - Verifica linting
- `lint:fix`: `eslint src --ext .ts --fix` - Corrige problemas de linting
- `format`: `prettier --write "src/**/*.{ts,json}"` - Formata código
- `format:check`: `prettier --check "src/**/*.{ts,json}"` - Verifica formatação

---

## PORTA PADRÃO E BASE PATH

### Porta
- **Variável**: `process.env.PORT`
- **Padrão**: `3000` (se não configurado)
- **Binding**: `0.0.0.0` (aceita conexões de qualquer interface)

### Base Path da API
- **Base**: `/api`
- **Versionamento**: Não há versionamento explícito (`/api/v1`). O endpoint `/api` retorna informação de versão `1.0.0`, mas as rotas não usam `/api/v1`

### Estrutura de Rotas
```
/api/auth/*          - Autenticação
/api/social/*        - Feed social
/api/community/*     - Comunidade
/api/marketplace/*   - Marketplace
/api/users           - Placeholder (retorna apenas mensagem)
/health              - Healthcheck legacy
/health/live         - Liveness probe (Railway)
/health/ready        - Readiness probe (Railway)
```

---

## MIDDLEWARE GLOBAIS

### Ordem de Aplicação (server.ts)

1. **CORS** (`cors`)
   - Configuração dinâmica baseada em variáveis de ambiente
   - Whitelist de origens (FRONTEND_URL, CORS_ORIGIN, ou padrões dev/prod)
   - Credentials: `true`
   - Methods: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
   - Headers: `Content-Type, Authorization`

2. **Helmet** (`helmet()`)
   - Security headers automáticos

3. **Rate Limiting** (`generalLimiter`)
   - 100 requests por IP em 15 minutos
   - Ignora requisições OPTIONS (preflight)

4. **Body Parsing**
   - `express.json({ limit: '10mb' })`
   - `express.urlencoded({ extended: true, limit: '10mb' })`

5. **Trust Proxy**
   - `app.set('trust proxy', 1)` - Para funcionar com Railway/Vercel

### Middleware de Rotas Específicas

- **authLimiter**: Rate limit específico para `/api/auth/*` (5 tentativas em 15 minutos)
- **authenticate**: Middleware de autenticação JWT (aplicado em rotas protegidas)

### Error Handling

- **errorHandler**: Middleware global de tratamento de erros (aplicado por último, antes do 404)

---

## PONTO DE ENTRADA E FLUXO DE BOOTSTRAP

### Ponto de Entrada
- **Arquivo**: `src/server.ts`
- **Entry point compilado**: `dist/server.js` (gerado por `tsc`)

### Fluxo de Bootstrap (em texto)

1. **Carregamento de Variáveis de Ambiente**
   - `dotenv.config()` é chamado no topo
   - Valida variáveis obrigatórias em produção (DATABASE_URL, JWT_SECRET)

2. **Configuração do Express App**
   - Cria instância do Express
   - Define porta (PORT ou 3000)

3. **Logs de Configuração**
   - Exibe configuração no console (PORT, NODE_ENV, variáveis de ambiente)

4. **Configuração de Trust Proxy**
   - Define `trust proxy: 1` para Railway

5. **Aplicação de Middleware Global**
   - CORS (com whitelist dinâmica)
   - Helmet
   - Rate Limiter geral
   - Body parsers

6. **Definição de Rotas**
   - Healthcheck endpoints (`/health`, `/health/live`, `/health/ready`)
   - API root (`/api`)
   - Rotas de autenticação (`/api/auth`)
   - Rotas de social (`/api/social`)
   - Rotas de comunidade (`/api/community`)
   - Rotas de marketplace (`/api/marketplace`)
   - Placeholder `/api/users`

7. **Error Handling Global**
   - Middleware de tratamento de erros
   - Handler 404

8. **Inicialização do Servidor**
   - `app.listen()` na porta configurada
   - Binding em `0.0.0.0`

9. **Verificação de Conexão Prisma** (assíncrono após server iniciar)
   - Tenta conectar ao banco via `prisma.$connect()`
   - Loga sucesso ou erro

10. **Handlers de Processo**
    - `uncaughtException`: Finaliza processo após desconectar Prisma
    - `unhandledRejection`: Loga erro mas não finaliza (alguns erros podem ser recuperáveis)
    - `SIGTERM/SIGINT`: Graceful shutdown (fecha servidor HTTP → desconecta Prisma → exit)

### Comportamento em Produção

- **Migrations**: Executadas automaticamente via `prestart` hook antes de `start`
- **Prisma Generate**: Executado automaticamente via `postinstall` após `npm install`
- **Validação de ENV**: Em produção, falta de DATABASE_URL ou JWT_SECRET faz o processo sair com código 1
