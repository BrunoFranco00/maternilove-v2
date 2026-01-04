# RELATÓRIO TÉCNICO - DIAGNÓSTICO RAILWAY + POSTGRESQL
## Materni Love Platform - Backend Analysis

**Data:** 2026-01-04  
**Analista:** Staff Engineer / Platform Engineer  
**Objetivo:** Diagnosticar problemas de instabilidade, connection reset e unique constraint violations

---

## 1️⃣ RESUMO EXECUTIVO

### Top 10 Problemas Identificados

| # | Problema | Classificação | Impacto Prático | Relacionado a |
|---|----------|---------------|-----------------|---------------|
| 1 | **Prisma Client criado múltiplas vezes sem singleton pattern** | **P0** | Pool de conexões duplicado causa exaustão de conexões | Connection reset |
| 2 | **Graceful shutdown incompleto - não aguarda requisições finalizarem** | **P0** | Conexões ativas são cortadas abruptamente | Connection reset, database interrupted |
| 3 | **`prestart` usa `db push --accept-data-loss` em produção** | **P0** | Perda de dados, schema inconsistente, race conditions | Unique constraint, database interrupted |
| 4 | **Seed não é idempotente - pode executar múltiplas vezes sem proteção** | **P1** | Duplicação de dados admin em restart/multi-instância | Unique constraint (email) |
| 5 | **Health check executa query SQL a cada requisição sem cache** | **P1** | Sobrecarga desnecessária no banco, exaustão de pool | Connection reset (indireto) |
| 6 | **Servidor escuta em `localhost` em vez de `0.0.0.0`** | **P1** | Railway não consegue rotear tráfego para o container | Service unavailable (não relacionado diretamente) |
| 7 | **Sem timeout configurado no Prisma Client** | **P1** | Conexões podem ficar pendentes indefinidamente | Connection reset, database timeout |
| 8 | **Sem retry logic em operações críticas de DB** | **P2** | Falhas transitórias não são recuperadas automaticamente | Connection reset |
| 9 | **Logger tenta escrever em `logs/` que não existe no Railway** | **P2** | Falhas silenciosas de logging, perda de observabilidade | Observabilidade comprometida |
| 10 | **Sem lock para migrations em ambiente multi-instância** | **P2** | Migrations podem executar em paralelo causando deadlocks | Database interrupted, unique constraint |

### Causas Diretas dos Problemas Reportados

#### **Connection Reset (`could not receive data from client: Connection reset by peer`)**
- **Causa #1:** Graceful shutdown não aguarda requisições HTTP finalizarem (linha 142-152 `server.ts`)
- **Causa #2:** Múltiplos Prisma Clients criados (linha 3 `database.ts`, linha 4 `seed.ts`) podem exaurir pool
- **Causa #3:** Health check agressivo sem rate limiting próprio pode causar exaustão de pool

#### **Database Interrupted (`database system was interrupted / not properly shut down`)**
- **Causa #1:** Shutdown não aguarda transações finalizarem (linha 144, 150 `server.ts`)
- **Causa #2:** `db push --accept-data-loss` pode corromper estado do banco em restart (linha 11 `package.json`)
- **Causa #3:** Railway reinicia container com restart policy "ON_FAILURE" sem garantir shutdown gracioso

#### **Unique Constraint Violation (`duplicate key value violates unique constraint`)**
- **Causa #1:** Seed executa em cada restart sem verificação de lock (linha 14-16 `seed.ts` - verifica existência mas não é atômico)
- **Causa #2:** `db push` pode recriar constraints e causar race conditions entre instâncias
- **Causa #3:** Multiple Achievement inserts podem ocorrer simultaneamente (linha 247 `schema.prisma` - `@@unique([name])`)

---

## 2️⃣ INVENTÁRIO TÉCNICO DO PROJETO

| Componente | Tecnologia | Versão | Arquivo de Evidência |
|------------|------------|--------|---------------------|
| Linguagem | TypeScript | 5.3.3 | `backend/package.json:47` |
| Runtime | Node.js | (não especificado, assume 18+) | `backend/package.json:10` (tsx requer Node 18+) |
| Framework Backend | Express | 4.18.2 | `backend/package.json:29` |
| ORM | Prisma Client | 5.7.1 | `backend/package.json:28` |
| Prisma CLI | Prisma | 5.7.1 | `backend/package.json:49` |
| Database | PostgreSQL | (Railway managed) | `backend/prisma/schema.prisma:9` |
| Build Tool | TypeScript Compiler (tsc) | 5.3.3 | `backend/package.json:9` |
| Migration Tool | Prisma Migrate | 5.7.1 | `backend/package.json:22` |
| Seed Tool | Prisma Seed (tsx) | 4.7.0 | `backend/package.json:24-25` |
| Deploy Method | Nixpacks (Railway auto-detect) | (Railway managed) | `backend/railway.json:4` |
| Container Orchestration | Railway | (Plataforma) | `backend/railway.json:2` |

---

## 3️⃣ COMO O RAILWAY EXECUTA ESSE PROJETO

### Arquivos de Deploy

**Arquivo:** `backend/railway.json`  
**Conteúdo:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Análise:**
- Railway usa Nixpacks para auto-detecção do build
- Restart policy "ON_FAILURE" com até 10 tentativas
- Sem Dockerfile explícito
- Sem `nixpacks.toml` customizado (arquivo deletado segundo histórico)

### Comandos de Execução

**Build:**
- Railway executa: `npm install` (linha 10 `package.json` - `postinstall: prisma generate`)
- Gera Prisma Client durante `postinstall`
- Compila TypeScript: `npm run build` → `tsc` (linha 9 `package.json`)

**Start:**
1. `prestart`: `prisma db push --accept-data-loss || true` (linha 11 `package.json`)
2. `start`: `node dist/server.js` (linha 12 `package.json`)

**Problema Crítico Identificado:**
- `prestart` executa `db push --accept-data-loss` que **não é adequado para produção**
- `db push` não usa migrations, pode causar perda de dados
- Flag `|| true` esconde erros silenciosamente

### Porta e Binding

**Código:** `backend/src/server.ts:158-165`
```typescript
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  // ...
});
```

**Problema:**
- `app.listen(PORT)` sem especificar host → **escuta apenas em `localhost`**
- Railway precisa que o servidor escute em `0.0.0.0` para rotear tráfego externo
- **Evidência:** Log mostra `http://localhost:${PORT}`, não `0.0.0.0:${PORT}`

**Variável de Ambiente Exigida:**
- `PORT`: Usado na linha 17 (`process.env.PORT || 3000`)
- Railway injeta `PORT` automaticamente, mas servidor não escuta no host correto

### Tabela de Variáveis de Ambiente

| Variável | Encontrado | Evidência | Risco |
|----------|------------|-----------|-------|
| `DATABASE_URL` | ✅ Obrigatório | `backend/prisma/schema.prisma:10` | P0 - App não inicia sem isso |
| `PORT` | ✅ Obrigatório | `backend/src/server.ts:17` | P1 - Default 3000 pode conflitar |
| `JWT_SECRET` | ⚠️ Usado mas não validado | `backend/src/config/jwt.ts:2` (referência) | P2 - Usa fallback inseguro |
| `NODE_ENV` | ⚠️ Usado mas não obrigatório | `backend/src/config/database.ts:4` | P2 - Logs podem não funcionar |
| `CORS_ORIGIN` | ⚠️ Opcional | `backend/src/server.ts:36` | P1 - Pode bloquear frontend se não configurado |
| `FRONTEND_URL` | ⚠️ Opcional | `backend/src/server.ts:38` | P2 - CORS pode falhar |

---

## 4️⃣ CONEXÃO COM POSTGRESQL (FOCO CRÍTICO)

### Onde o Client/Pool é Criado

**Arquivo 1:** `backend/src/config/database.ts` (linhas 1-7)
```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
```

**Arquivo 2:** `backend/src/prisma/seed.ts` (linha 4)
```typescript
const prisma = new PrismaClient();
```

**Problema Crítico:**
- Dois Prisma Clients diferentes são criados:
  1. Singleton exportado de `database.ts` (usado pelo servidor)
  2. Nova instância em `seed.ts` (usado durante seed)
- Cada Prisma Client cria seu próprio pool de conexões PostgreSQL
- Prisma default pool size: **10 conexões por instância** (não configurado explicitamente)

### Configuração do Pool

**Análise:**
- **Nenhuma configuração explícita de pool** encontrada no código
- Prisma usa defaults:
  - `connection_limit`: 10 (para serverless: 1)
  - `pool_timeout`: 10 segundos
  - Sem `query_timeout` configurado
  - Sem `connect_timeout` configurado

**Evidência:** `backend/src/config/database.ts:3-5` não passa configurações de datasource URL

**Problema:**
- Se seed executa enquanto servidor está rodando, **2 pools × 10 conexões = 20 conexões abertas**
- PostgreSQL no Railway pode ter limite de conexões (comum: 100 para planos básicos)
- Multi-instância pode exaurir conexões rapidamente

### Timeouts e Retries

**Análise:**
- **Sem timeout configurado** no Prisma Client
- **Sem retry logic** em nenhum serviço
- Health check (linha 72 `server.ts`) executa `$queryRaw` sem timeout ou retry

**Evidência:**
- `backend/src/services/auth.service.ts:12` - `prisma.user.findUnique()` sem retry
- `backend/src/server.ts:72` - `prisma.$queryRaw` sem timeout explícito

### Uso de DATABASE_URL

**Evidência:** `backend/prisma/schema.prisma:10`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Análise:**
- DATABASE_URL é lida diretamente do ambiente
- Não há parsing ou validação de DATABASE_URL
- Não há fallback ou erro amigável se DATABASE_URL não estiver configurada

### Tabela de Análise de Conexões

| Arquivo | Função | Tipo de Conexão | Pool Config | Problema Identificado |
|---------|--------|-----------------|-------------|----------------------|
| `config/database.ts:3` | `new PrismaClient()` | Singleton (export) | Default (10) | Sem timeout, sem connection limit explícito |
| `prisma/seed.ts:4` | `new PrismaClient()` | Nova instância | Default (10) | Cria pool separado, não reusa singleton |
| `server.ts:72` | Health check `$queryRaw` | Usa singleton | - | Sem retry, sem timeout, executa a cada requisição |
| `services/auth.service.ts:12` | `findUnique()` | Usa singleton | - | Sem retry em falhas de conexão |

### Respostas Explícitas

**A aplicação pode abrir múltiplos pools?**
✅ **SIM** - Evidência: `seed.ts:4` cria novo PrismaClient. Se seed for executado enquanto servidor roda (via `prestart` ou manualmente), múltiplos pools existem simultaneamente.

**Existe fechamento correto do pool?**
⚠️ **PARCIAL** - Evidência: `server.ts:144,150` chama `prisma.$disconnect()` em SIGTERM/SIGINT, mas:
- Não aguarda requisições HTTP finalizarem
- Seed (`seed.ts:69`) desconecta apenas após conclusão, mas seed não é executado pelo servidor normalmente

**Existe handler de SIGTERM / SIGINT?**
✅ **SIM** - Evidência: `server.ts:142-152`, mas **incompleto** (não aguarda HTTP finalizar)

---

## 5️⃣ SHUTDOWN, RESTART E LIFECYCLE

### Tratamento de Sinais do Processo

**Arquivo:** `backend/src/server.ts:142-152`
```typescript
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
```

**Problemas Identificados:**
1. **Não fecha servidor HTTP** - `app.listen()` retorna um `Server` que não é armazenado nem fechado
2. **Não aguarda requisições finalizarem** - Conexões ativas são cortadas imediatamente
3. **`process.exit(0)` forçado** - Mata processo sem dar tempo para cleanup completo

**Evidência:** Linha 158 cria servidor mas não armazena: `app.listen(PORT, ...)` → retorna `Server` que não é capturado

### Fechamento Gracioso de DB

**Análise:**
- Prisma Client é desconectado (`prisma.$disconnect()`)
- Mas conexões podem estar em uso por requisições HTTP ativas
- Sem await em requisições pendentes, conexões são cortadas abruptamente

### O Que Acontece Quando App é Reiniciado

**Cenário no Railway:**
1. Railway envia `SIGTERM` para container
2. Handler executa `prisma.$disconnect()` imediatamente
3. Requisições HTTP em progresso perdem conexão DB
4. PostgreSQL recebe `connection reset by peer`
5. Railway aguarda 30s (default) ou mata processo
6. Container reinicia, executa `prestart` → `db push --accept-data-loss`
7. `db push` pode corromper estado se migrations não estiverem sincronizadas

**Problema com Restart Policy:**
- `restartPolicyType: "ON_FAILURE"` com `restartPolicyMaxRetries: 10`
- Se shutdown falhar ou demorar, Railway pode matar processo antes de cleanup
- Loop de restart pode ocorrer se `db push` falhar continuamente

### Possibilidade de Crash Loop

**Risco:** ⚠️ **MÉDIO**

**Cenários que podem causar loop:**
1. `db push` falha continuamente → `prestart` retorna erro → Railway reinicia
2. DATABASE_URL inválida → Prisma falha ao conectar → servidor não inicia → Railway reinicia
3. Pool exaurido → Health check falha → Railway marca como unhealthy → reinicia

**Evidência:** `package.json:11` - `prestart` usa `|| true` que esconde erros, então crash loop é menos provável, mas problemas podem passar despercebidos

### O Que Acontece com Conexões Quando Container Morre

**Análise:**
1. Railway mata container abruptamente (timeout ou SIGKILL)
2. Conexões TCP para PostgreSQL não são fechadas graciosamente
3. PostgreSQL mantém conexões em estado "idle in transaction" ou "active"
4. Logs mostram: `could not receive data from client: Connection reset by peer`
5. PostgreSQL eventualmente limpa conexões após `idle_in_transaction_session_timeout` (default: 60s)
6. Mas durante esse período, pool pode estar exaurido para outras instâncias

**Evidência nos logs do usuário:**
```
2026-01-04 02:28:53.659 UTC [73] LOG:  could not receive data from client: Connection reset by peer
```

---

## 6️⃣ MIGRATIONS E SEED (ORIGEM DO UNIQUE ERROR)

### Onde Migrations São Definidas

**Arquivo:** `backend/prisma/migrations/20260103225947_init/migration.sql`
- Migration inicial criada em 2026-01-03
- Contém criação de todas as 45+ tabelas
- Inclui constraints UNIQUE (linhas com `CONSTRAINT ... UNIQUE`)

### Quando Migrations Rodam

**Build:** NÃO - Apenas `prisma generate` roda (linha 10 `package.json` - `postinstall`)

**Start:** SIM - `prestart` executa `prisma db push --accept-data-loss || true` (linha 11 `package.json`)

**Problema Crítico:**
- `db push` **NÃO usa migrations**
- `db push` sincroniza schema diretamente, ignorando histórico de migrations
- Se schema mudar, `db push` pode tentar recriar constraints que já existem
- Flag `--accept-data-loss` permite perda de dados

**Migrations normais:**
- `prisma migrate deploy` existe (linha 22 `package.json`) mas **NÃO é chamado automaticamente**
- Migration existe mas pode não estar sendo aplicada

### Se Seeds Rodam Automaticamente

**Análise:**
- Seed **NÃO roda automaticamente** em start
- Seed só roda manualmente via `npm run seed:admin` (linha 25 `package.json`)
- **MAS** `prestart` poderia executar seed se configurado (não está)

**Problema Potencial:**
- Se seed for adicionado ao `prestart` no futuro sem proteção, pode executar múltiplas vezes em multi-instância

### Se Seeds São Idempotentes

**Arquivo:** `backend/prisma/seed.ts:13-16`
```typescript
const existingAdmin = await prisma.user.findUnique({
  where: { email: adminEmail },
});

if (existingAdmin) {
  // Atualiza em vez de criar
}
```

**Análise:**
- Seed **tenta ser idempotente** verificando existência antes de criar
- **MAS não é atômico**: Race condition possível
  - Instância A verifica: não existe
  - Instância B verifica: não existe (antes de A criar)
  - Ambos tentam criar → unique constraint violation

**Problema:** Linha 42 `seed.ts` - `prisma.user.create()` pode falhar se executado em paralelo

### Onde Achievement é Inserido

**Análise:**
- Achievement **não é inserido em nenhum seed atual**
- Seed apenas cria usuário admin (linha 42 `seed.ts`)
- Achievement só seria criado via código da aplicação ou seed futuro

**Mas há constraint unique:**
- `backend/prisma/schema.prisma:247` - `@@unique([name])`
- Se Achievement for criado via código sem verificação, pode violar constraint

### Por Que Name Pode Ficar Vazio ou Duplicado

**Schema:** `backend/prisma/schema.prisma:238-248`
```prisma
model Achievement {
  id          String @id @default(cuid())
  name        String
  description String
  icon        String
  points      Int

  users       UserAchievement[]

  @@unique([name])
}
```

**Análise:**
- `name` é `String` (não `String?`), então **não pode ser NULL**
- Mas **não há validação de unicidade no código** antes de criar
- Se múltiplas instâncias tentarem criar Achievement com mesmo nome simultaneamente:
  - Instância A: `INSERT INTO Achievement (name, ...) VALUES ('First Post', ...)`
  - Instância B: `INSERT INTO Achievement (name, ...) VALUES ('First Post', ...)`
  - PostgreSQL detecta violação de `@@unique([name])` → Erro

### Se Existe Corrida Entre Instâncias

✅ **SIM - RISCO ALTO**

**Cenários de race condition:**
1. **Seed admin em multi-instância:**
   - Duas instâncias sobem simultaneamente
   - Ambas executam seed (se configurado)
   - Race condition no `findUnique` → `create` pode causar unique violation no email

2. **Achievement creation (se implementado):**
   - Múltiplas requisições simultâneas criam Achievement
   - Sem lock ou transação, pode violar `@@unique([name])`

3. **db push em multi-instância:**
   - Railway pode ter múltiplas instâncias rodando
   - Cada uma executa `prestart` → `db push`
   - `db push` pode tentar alterar schema simultaneamente → deadlock ou corrupção

### Caminho Exato e Trecho do Código

**Seed:** `backend/prisma/seed.ts:14-42`
```typescript
const existingAdmin = await prisma.user.findUnique({
  where: { email: adminEmail },
});

if (existingAdmin) {
  // update
} else {
  // create - RACE CONDITION AQUI
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      // ...
    },
  });
}
```

**Problema:** Entre `findUnique` (linha 14) e `create` (linha 42), outra instância pode ter criado o usuário.

---

## 7️⃣ HEALTHCHECKS E ROTAS

### Rotas Disponíveis para Healthcheck

**Rota 1:** `GET /health` (linha 70 `server.ts`)
```typescript
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});
```

**Rota 2:** `GET /api` (linha 89 `server.ts`) - Não toca banco, apenas retorna JSON estático

### Se Alguma Rota Toca o Banco

**Health check:**
- ✅ **SIM** - Executa `prisma.$queryRaw` (linha 72 `server.ts`)
- Sem cache, sem rate limiting próprio (apenas global limiter)
- Cada requisição de health check abre/usa conexão do pool

**Rotas de API:**
- Auth routes (`/api/auth/*`): Usam `prisma.user.findUnique/create` via `auth.service.ts`
- Social/Community/Marketplace: Placeholders, provavelmente usam Prisma (não analisados em detalhe)

### Se Alguma Rota Pode Causar Reset de Conexão

**Health check:**
- ⚠️ **RISCO MÉDIO** - Se pool estiver exaurido, `$queryRaw` pode falhar
- Sem retry, erro é retornado imediatamente
- Railway pode marcar como unhealthy e reiniciar

**Rotas de autenticação:**
- ⚠️ **RISCO BAIXO** - Usam singleton Prisma, mas sem retry em falhas de conexão
- Se conexão for resetada durante query, erro é retornado

### Se Healthcheck Agressivo Poderia Matar o App

✅ **SIM - RISCO MÉDIO**

**Cenário:**
1. Railway executa health check a cada 5-10 segundos
2. Cada health check usa 1 conexão do pool (mesmo que brevemente)
3. Se pool tiver 10 conexões e outras rotas estiverem usando, pode exaurir
4. Health check começa a falhar
5. Railway marca como unhealthy → reinicia → loop

**Evidência:** Health check não tem cache, não tem rate limiting próprio (apenas `generalLimiter` que limita por IP, mas Railway health check vem de IPs diferentes)

---

## 8️⃣ CONCORRÊNCIA E MULTI-INSTÂNCIA

### Se o App é Seguro com Mais de Uma Instância

❌ **NÃO**

**Problemas identificados:**
1. **Seed não é thread-safe** - Race condition no `findUnique` → `create`
2. **`db push` não é seguro em paralelo** - Múltiplas instâncias podem executar simultaneamente
3. **Sem lock para migrations** - Não há mecanismo de exclusão mútua
4. **Pool de conexões pode exaurir** - 2 instâncias × 10 conexões = 20 conexões (pode exceder limite Railway)

### Se Existe Lock para Migrations/Seed

❌ **NÃO**

**Evidência:**
- `prestart` executa `db push` sem verificação de lock
- Seed não usa transação com lock (SELECT FOR UPDATE) ou semáforo distribuído
- Não há uso de `pg_advisory_lock` ou similar

### Se Existe Risco de Execução Paralela

✅ **SIM - RISCO ALTO**

**Cenários:**
1. **Deploy simultâneo:**
   - Railway pode iniciar nova instância antes de parar antiga (blue-green)
   - Ambas executam `prestart` → `db push` simultaneamente
   - Race condition no schema update

2. **Seed paralelo:**
   - Se seed for executado manualmente em múltiplas instâncias
   - Race condition no admin user creation

3. **Health check paralelo:**
   - Múltiplas instâncias recebendo health checks simultaneamente
   - Pool compartilhado no PostgreSQL pode ser pressionado

### Cenários de Falha Real

**Cenário 1: Deploy com Zero Downtime**
- Railway inicia instância B
- Instância B executa `prestart` → `db push`
- `db push` tenta alterar schema
- Instância A ainda está rodando com schema antigo
- Queries da instância A podem falhar → connection errors

**Cenário 2: Multi-Instância Scale-Up**
- Railway escala para 2 instâncias automaticamente
- Ambas sobem simultaneamente
- Ambas executam `prestart` → `db push`
- Race condition → deadlock ou erro de schema

**Cenário 3: Restart em Cascata**
- Instância A reinicia (crash ou deploy)
- Instância B ainda está rodando
- Instância A executa `db push` durante restart
- Conexões da instância B podem ser resetadas se `db push` fizer ALTER TABLE

---

## 9️⃣ OBSERVABILIDADE ATUAL

### Logs Existentes

**Winston Logger:** `backend/src/utils/logger.ts:3-28`
- Nível: `info` (default) ou `LOG_LEVEL` env var
- Formato: JSON em produção, colorido em dev
- Transports:
  - Arquivo: `logs/error.log` (apenas errors)
  - Arquivo: `logs/combined.log` (todos os logs)
  - Console: Apenas em desenvolvimento

**Problemas:**
1. **Diretório `logs/` não existe no Railway** - Winston tentará criar, mas pode falhar silenciosamente
2. **Sem logs estruturados para Railway** - Railway precisa de stdout/stderr para logs
3. **Console log apenas em dev** - Em produção, logs podem não aparecer no Railway dashboard

**Evidência:** `backend/src/utils/logger.ts:12-13` - Tenta escrever em `logs/error.log` e `logs/combined.log`, mas Railway filesystem é efêmero

**Logs no Código:**
- `server.ts:143,149` - Log de shutdown
- `server.ts:159` - Log de start (mas usa logger, pode não funcionar)
- `server.ts:79` - Log de health check failure
- `auth.service.ts` - Não tem logs explícitos (apenas via error handler)

### Métricas Inexistentes

❌ **Nenhuma métrica implementada**

**Faltando:**
- Métricas de conexões DB (pool size, active, idle)
- Métricas de requisições HTTP (latency, rate, errors)
- Métricas de health check (success rate, latency)
- Métricas de Prisma queries (duration, errors)

### Pontos Cegos

1. **Pool de conexões:**
   - Sem visibilidade de quantas conexões estão ativas
   - Sem alerta quando pool está quase exaurido

2. **Graceful shutdown:**
   - Sem logs de quantas requisições foram interrompidas
   - Sem métricas de tempo de shutdown

3. **Race conditions:**
   - Sem logs de tentativas de criação duplicada
   - Sem alerta de unique constraint violations

4. **Health check:**
   - Sem métricas de taxa de sucesso
   - Sem alerta quando health check falha repetidamente

---

## 🔟 CONCLUSÃO TÉCNICA

### As 3 Causas Mais Prováveis dos Connection Resets

1. **Graceful shutdown incompleto (P0)**
   - **Evidência:** `server.ts:142-152` não fecha servidor HTTP nem aguarda requisições
   - **Impacto:** Conexões DB são cortadas enquanto requisições HTTP ainda estão ativas
   - **Frequência:** A cada restart/deploy do Railway

2. **Múltiplos Prisma Clients (P0)**
   - **Evidência:** `database.ts:3` e `seed.ts:4` criam pools separados
   - **Impacto:** Exaustão de pool (2 × 10 = 20 conexões podem exceder limite)
   - **Frequência:** Se seed for executado enquanto servidor roda

3. **Health check sem rate limiting/cache (P1)**
   - **Evidência:** `server.ts:72` executa query a cada requisição
   - **Impacto:** Sobrecarga no pool, especialmente em multi-instância
   - **Frequência:** Contínuo (a cada health check do Railway)

### A Causa Raiz Mais Perigosa

**CAUSA RAIZ:** **Graceful shutdown incompleto + `db push` em produção**

**Por quê:**
- Shutdown incompleto causa connection resets imediatos
- `db push` em `prestart` pode corromper estado do banco durante restarts frequentes
- Combinação cria ciclo vicioso: restart → `db push` → problemas → restart

**Evidência:**
- `server.ts:158` não armazena `Server` retornado por `app.listen()`
- `package.json:11` usa `db push --accept-data-loss` em vez de `migrate deploy`
- Railway restart policy pode causar restarts frequentes se health check falhar

### Se o Projeto Está Adequado para Railway

**❌ INADEQUADO para Railway sem correções**

**Justificativa:**

1. **Shutdown incompleto:**
   - Railway precisa de shutdown gracioso para zero-downtime deployments
   - Código atual não implementa isso corretamente
   - **Resultado:** Connection resets e "database interrupted" a cada deploy

2. **`db push` em produção:**
   - Não é adequado para produção (documentação Prisma desencoraja)
   - Pode causar perda de dados e inconsistências
   - **Resultado:** Unique constraint violations e corrupção de schema

3. **Multi-instância não seguro:**
   - Race conditions em seed e `db push`
   - Sem locks ou mecanismos de exclusão mútua
   - **Resultado:** Erros intermitentes em scale-up ou deploys paralelos

4. **Observabilidade insuficiente:**
   - Logs podem não funcionar no Railway (tenta escrever em `logs/`)
   - Sem métricas para diagnosticar problemas
   - **Resultado:** Difícil identificar causas de falhas

**Recomendação:**
O projeto precisa de correções **P0** antes de ser considerado adequado para produção no Railway.

---

**FIM DO RELATÓRIO**

