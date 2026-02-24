# BACKEND STRUCTURE AUDIT

## 1. Estrutura de Pastas

### backend/

```
backend/
  config/           (não existe na raiz - config está em src/config)
  dist/
  logs/
  node_modules/
  prisma/
    migrations/
    schema.prisma
  scripts/
    resolveFailedMigration.js
    resolveMigration.ts
  src/
    config/
    middleware/
    modules/
    repositories/
    routes/
    scripts/
    shared/
    types/
    utils/
    validators/
  tests/
  package.json
  tsconfig.json
  Procfile
  railway.json
```

### src/

```
src/
  config/
    prisma.ts
    jwt.ts
    database.ts
  middleware/
    auth.middleware.ts
    errorHandler.middleware.ts
    rateLimiter.middleware.ts
  modules/
    auth/
    community/
    journey/
    marketplace/
    onboarding/
    social/
  repositories/
    BaseRepository.ts
  routes/
    admin.routes.ts
    auth.routes.ts
    community.routes.ts
    marketplace.routes.ts
    social.routes.ts
  scripts/
    resetAdminPassword.ts
    createAdminUser.ts
  shared/
    errors/
      AppError.ts
      ErrorCatalog.ts
      mapError.ts
    http/
      response.ts
    middleware/
      authorize.middleware.ts
      context.middleware.ts
      validate.middleware.ts
    types/
      request.d.ts
    utils/
      asyncHandler.ts
  types/
  utils/
    jwt.ts
    logger.ts
    errors.ts
  validators/
    auth.validator.ts
  server.ts
```

### src/modules/

```
src/modules/
  auth/
    controllers/
    dto/
    repositories/
    routes.ts
    services/
    validators/
  community/
    controllers/
    dto/
    repositories/
    routes.ts
    services/
    validators/
  journey/
    controllers/
      journey.controller.ts
    dto/
    repositories/
      journey.repository.ts
    routes.ts
    services/
      journey.service.ts
    validators/
      journey.validators.ts
  marketplace/
    controllers/
    dto/
    repositories/
    routes.ts
    services/
    validators/
  onboarding/
    controllers/
      onboarding.controller.ts
    repositories/
      onboarding.repository.ts
    routes.ts
    services/
      onboarding.service.ts
    validators/
      onboarding.validators.ts
  social/
    controllers/
    dto/
    repositories/
    routes.ts
    services/
    validators/
```

---

## 2. Entrypoint

### Arquivo de entrada

O projeto usa **`src/server.ts`** como entrypoint principal.

**Observação sobre script de start:** O `package.json` executa `node dist/src/server.js`. O build (tsc) compila `src/server.ts` para `dist/src/server.js` (ou conforme tsconfig outDir). O campo `main` aponta para `dist/server.js`, mas o script start usa `dist/src/server.js` — verificar consistência do tsconfig e output real.

### Conteúdo completo de src/server.ts

```typescript
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { prisma } from './config/prisma.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import { contextMiddleware } from './shared/middleware/context.middleware.js';
import { AppError } from './shared/errors/AppError.js';
import { ErrorCode } from './shared/errors/ErrorCatalog.js';
import authRoutes from './modules/auth/routes.js';
import onboardingRoutes from './modules/onboarding/routes.js';
import socialRoutes from './modules/social/routes.js';
import communityRoutes from './modules/community/routes.js';
import marketplaceRoutes from './modules/marketplace/routes.js';
import journeyRoutes from './modules/journey/routes.js';
import adminRoutes from './routes/admin.routes.js';
import { authenticate } from './middleware/auth.middleware.js';
import { authorize } from './shared/middleware/authorize.middleware.js';
import { asyncHandler } from './shared/utils/asyncHandler.js';

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

// ============================================================================
// VALIDAÇÃO DE VARIÁVEIS OBRIGATÓRIAS NO BOOT
// ============================================================================

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

// Logs claros no boot
console.log('');
console.log('🔧 Configuração do Servidor:');
console.log(`   PORT: ${PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'não configurado'}`);
console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN || 'não configurado'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ configurado' : '❌ não configurado'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ configurado' : '⚠️ usando fallback'}`);
console.log('');

// ============================================================================
// CONFIGURAR TRUST PROXY (Para Railway/Vercel)
// ============================================================================
app.set('trust proxy', 1); // Confiar no primeiro proxy (Railway)

// ============================================================================
// MIDDLEWARE
// ============================================================================
// Nota: Migrations são executadas automaticamente via "prestart" no package.json

// CORS Configuration - Production Ready
// IMPORTANTE: CORS deve ser aplicado ANTES de helmet e rate limiter
// para que requisições OPTIONS (preflight) sejam tratadas corretamente
// Whitelist explícita de origens permitidas (suporta string ou regex)
const allowedOrigins: (string | RegExp)[] = [];

// 1. Priorizar FRONTEND_URL se configurado
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// 2. Adicionar origens do CORS_ORIGIN (separadas por vírgula)
if (process.env.CORS_ORIGIN) {
  const corsOrigins = process.env.CORS_ORIGIN.split(',').filter(Boolean);
  allowedOrigins.push(...corsOrigins);
}

// 3. Fallback: Adicionar origens padrão de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Outro dev server
  );
} else {
  // 4. Em produção, adicionar padrão Vercel (todos os *.vercel.app)
  // Esta regex permite:
  // - https://maternilove-v2.vercel.app
  // - https://maternilove-v2-git-branch.vercel.app
  // - https://maternilove-v2-abc123.vercel.app
  // - Qualquer subdomínio do Vercel
  allowedOrigins.push(/^https:\/\/.*\.vercel\.app$/);
  
  // 5. Adicionar domínio customizado principal (maternilove.com)
  // Este é o domínio público onde os usuários acessam o frontend
  const customDomain = 'https://maternilove.com';
  if (!allowedOrigins.some(o => typeof o === 'string' && o === customDomain)) {
    allowedOrigins.push(customDomain);
  }
  
  // 6. Se FRONTEND_URL específico foi configurado, adicionar também (fallback Vercel)
  const vercelOrigin = 'https://maternilove-v2.vercel.app';
  if (!allowedOrigins.some(o => typeof o === 'string' && o === vercelOrigin)) {
    allowedOrigins.push(vercelOrigin);
  }
}

// Log das origens permitidas
console.log('🌐 CORS - Origens permitidas:');
allowedOrigins.forEach((origin) => {
  if (origin instanceof RegExp) {
    console.log(`   ✅ ${origin.toString()} (regex)`);
  } else {
    console.log(`   ✅ ${origin}`);
  }
});
console.log('');

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (ex: Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar se origin está na lista permitida (string ou regex)
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // Em desenvolvimento, logar mas permitir
      if (process.env.NODE_ENV === 'development') {
        logger.warn(`CORS: Allowing origin in dev: ${origin}`);
        callback(null, true);
      } else {
        logger.warn(`❌ CORS blocked origin: ${origin}`);
        logger.warn(`   Allowed origins: ${allowedOrigins.map(o => o instanceof RegExp ? o.toString() : o).join(', ')}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Aplicar Helmet e Rate Limiter DEPOIS do CORS
app.use(helmet());
app.use(generalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// CONTEXTO GLOBAL (requestId, locale, timeZone)
// ============================================================================
app.use(contextMiddleware);

// ============================================================================
// ROTAS
// ============================================================================

// ============================================================================
// HEALTHCHECK ENDPOINTS (Railway Compatible)
// ============================================================================

// Liveness Probe - Não toca banco, resposta imediata
app.get('/health/live', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'maternilove-backend'
  });
});

// Readiness Probe - Testa banco com timeout
app.get('/health/ready', async (req: Request, res: Response) => {
  try {
    // Timeout de 1 segundo para não bloquear Railway
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 1000)
    );
    
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      timeoutPromise
    ]);
    
    res.status(200).json({ 
      status: 'ready', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    logger.error('Readiness check failed', { error });
    res.status(503).json({ 
      status: 'not ready', 
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Health Check Legacy (mantido para compatibilidade)
app.get('/health', async (req: Request, res: Response) => {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 1000)
    );
    
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      timeoutPromise
    ]);
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// ============================================================================
// API ROOT
// ============================================================================
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'Materni Love API',
    version: '1.0.0',
    apiVersion: 'v1',
    basePath: '/api/v1',
    deprecated: '/api/* (use /api/v1/*)',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      onboarding: '/api/v1/onboarding',
      social: '/api/v1/social',
      community: '/api/v1/community',
      marketplace: '/api/v1/marketplace',
      journey: '/api/v1/journey',
      users: '/api/v1/users',
    },
    note: 'Rotas em /api/* são mantidas por compatibilidade, mas use /api/v1/*'
  });
});

// ============================================================================
// ROTAS VERSIONADAS (/api/v1/*) - RECOMENDADO
// ============================================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/journey', journeyRoutes);
app.use('/api/v1/admin', adminRoutes);

// Placeholder Route versionada
app.get('/api/v1/users', (req: Request, res: Response) => {
  res.json({ message: 'Users endpoint' });
});

// Rota de exemplo protegida com RBAC (apenas ADMIN)
app.get('/api/v1/admin/example', authenticate, authorize('ADMIN'), asyncHandler(async (req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: 'Acesso autorizado: você é ADMIN',
    user: {
      id: req.user?.id,
      role: req.user?.role,
    },
    requestId: req.context?.requestId,
  });
}));

// ============================================================================
// ROTAS LEGACY (/api/*) - ALIAS TEMPORÁRIO (COMPATIBILIDADE)
// ============================================================================
// Montar as mesmas rotas em /api/* para manter compatibilidade com frontend existente
app.use('/api/auth', authRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/journey', journeyRoutes);

// Placeholder Route legacy
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ message: 'Users endpoint' });
});

// ============================================================================
// 404 HANDLER (deve vir ANTES do errorHandler)
// ============================================================================
// Rotas não encontradas devem lançar AppError para passar pelo errorHandler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(ErrorCode.NOT_FOUND, 'Recurso não encontrado'));
});

// ============================================================================
// ERROR HANDLING (deve ser o ÚLTIMO middleware)
// ============================================================================

app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Backend running on 0.0.0.0:${PORT}`);
  console.log('');
  console.log('🚀 Materni Love Backend Server');
  console.log(`📍 Server running on: 0.0.0.0:${PORT}`);
  console.log('');
  console.log('📡 Endpoints disponíveis:');
  console.log('   GET  /health - Healthcheck');
  console.log('   GET  /health/live - Liveness probe');
  console.log('   GET  /health/ready - Readiness probe');
  console.log('   GET  /api - API info');
  console.log('   POST /api/auth/register - Registrar usuário');
  console.log('   POST /api/auth/login - Login');
  console.log('   GET  /api/social/feed - Feed social');
  console.log('   GET  /api/community - Comunidade');
  console.log('   GET  /api/marketplace/products - Marketplace');
  console.log('');
  console.log('✨ Ready to receive requests!');
  console.log('');
});

// ============================================================================
// HANDLERS PARA ERROS NÃO TRATADOS (CRÍTICO PARA PRODUÇÃO)
// ============================================================================

// Handler para exceções não capturadas
process.on('uncaughtException', (error: Error) => {
  logger.error('❌ UNCAUGHT EXCEPTION - Processo será finalizado', {
    error: error.message,
    stack: error.stack,
  });
  console.error('❌ UNCAUGHT EXCEPTION:', error);
  
  // Tentar desconectar Prisma antes de sair
  prisma.$disconnect()
    .catch((disconnectError) => {
      logger.error('Error disconnecting Prisma on uncaughtException', { error: disconnectError });
    })
    .finally(() => {
      process.exit(1);
    });
});

// Handler para Promises rejeitadas não tratadas
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('❌ UNHANDLED REJECTION - Promise rejeitada não tratada', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  console.error('❌ UNHANDLED REJECTION:', reason);
  
  // Logar mas não finalizar processo imediatamente
  // (alguns erros podem ser recuperáveis)
  // Se for erro crítico do Prisma, o uncaughtException vai capturar
});

// ============================================================================
// GRACEFUL SHUTDOWN (HTTP → DB → EXIT)
// ============================================================================

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown.`);
  
  // 1. Fechar servidor HTTP (não aceita novas conexões)
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // 2. Desconectar Prisma (fecha pool de conexões)
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error disconnecting database', { error });
    }
    
    // 3. Finalizar processo
    process.exit(0);
  });

  // Timeout de segurança: força shutdown após 30s
  setTimeout(() => {
    logger.error('Force shutdown after 30s timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ============================================================================
// VERIFICAÇÃO DE CONEXÃO DO PRISMA NO BOOT
// ============================================================================

// Verificar conexão do Prisma após o servidor iniciar
(async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Prisma Client conectado ao banco de dados');
    console.log('✅ Prisma Client conectado ao banco de dados');
  } catch (error: any) {
    logger.error('❌ ERRO CRÍTICO: Falha ao conectar Prisma ao banco de dados', {
      error: error.message,
      stack: error.stack,
    });
    console.error('❌ ERRO CRÍTICO: Falha ao conectar Prisma ao banco de dados');
    console.error('   Erro:', error.message);
    console.error('   Verifique o DATABASE_URL no Railway');
    
    // Não finalizar processo aqui - deixar o uncaughtException tratar
    // Mas logar claramente o problema
  }
})();

export default app;
```

### Explicação

**Como as rotas são montadas**

- Rotas são importadas de cada módulo (ex: `journeyRoutes` de `./modules/journey/routes.js`).
- Cada router é montado com `app.use(prefixo, router)`.
- O router é um Express Router com rotas definidas internamente.

**Prefixo global**

- **Versionado (recomendado):** `/api/v1/*` — auth, onboarding, social, community, marketplace, journey, admin.
- **Legado:** `/api/*` — mesmas rotas sem `v1` para compatibilidade.
- **Sem prefixo:** `/health`, `/health/live`, `/health/ready`, `/api` (info).

**Onde middlewares globais são aplicados**

- Ordem antes das rotas: `cors` → `helmet` → `generalLimiter` → `express.json` → `express.urlencoded` → `contextMiddleware`.
- Middlewares de rota (`authenticate`, `validateBody`, `authorize`) são aplicados por rota.
- Depois das rotas: handler 404 e `errorHandler` como último middleware.

---

## 3. Padrão de Módulo

### Módulos de referência: journey e onboarding

---

### MÓDULO 1: journey

#### routes.ts (completo)

```typescript
import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { createJourneyBodySchema } from './validators/journey.validators.js';
import { prisma } from '../../config/prisma.js';
import { JourneyRepository } from './repositories/journey.repository.js';
import { JourneyService } from './services/journey.service.js';
import { JourneyController } from './controllers/journey.controller.js';

const router = Router();

// Inicializar dependências
const repository = new JourneyRepository(prisma);
const service = new JourneyService(repository);
const controller = new JourneyController(service);

// Rotas protegidas (requer autenticação)
router.post('/', authenticate, validateBody(createJourneyBodySchema), asyncHandler(controller.createJourney));
router.get('/', authenticate, asyncHandler(controller.getJourneys));

export default router;
```

#### controller.ts (completo)

```typescript
import { Request, Response } from 'express';
import { ok, created } from '../../../shared/http/response.js';
import { JourneyService } from '../services/journey.service.js';
import logger from '../../../utils/logger.js';

export class JourneyController {
  constructor(private service: JourneyService) {}

  /**
   * POST /journey
   * Criar nova jornada
   */
  createJourney = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!; // Já validado pelo middleware authenticate
    const { type, startDate, expectedDate } = req.body as {
      type: string;
      startDate: string | Date;
      expectedDate?: string | Date | null;
    };

    const journey = await this.service.createJourney(userId, { type, startDate, expectedDate });

    logger.info('Journey created', { userId, journeyId: journey.id, type: journey.type });

    created(res, journey);
  };

  /**
   * GET /journey
   * Listar jornadas do usuário autenticado
   */
  getJourneys = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id!; // Já validado pelo middleware authenticate

    const journeys = await this.service.getJourneys(userId);

    ok(res, journeys);
  };
}
```

#### service.ts (completo)

```typescript
import { JourneyRepository } from '../repositories/journey.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ErrorCode } from '../../../shared/errors/ErrorCatalog.js';

export class JourneyService {
  constructor(private repository: JourneyRepository) {}

  /**
   * Criar jornada
   */
  async createJourney(userId: string, data: { type: string; startDate: string | Date; expectedDate?: string | Date | null }) {
    // Verificar se usuário já tem jornada (userId é unique)
    const existingJourney = await this.repository.findByUserId(userId);
    if (existingJourney) {
      throw new AppError(ErrorCode.DUPLICATE_ENTRY, 'Você já possui uma jornada ativa');
    }

    // Converter startDate
    const startDate = typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate;
    
    // Converter expectedDate se fornecido
    const expectedDate = data.expectedDate
      ? typeof data.expectedDate === 'string'
        ? new Date(data.expectedDate)
        : data.expectedDate
      : null;

    // Validar datas
    if (isNaN(startDate.getTime())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Data de início inválida');
    }

    if (expectedDate && isNaN(expectedDate.getTime())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Data esperada inválida');
    }

    if (expectedDate && expectedDate < startDate) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Data esperada não pode ser anterior à data de início');
    }

    // Criar jornada
    const journey = await this.repository.create({
      userId,
      type: data.type,
      startDate,
      expectedDate,
    });

    return journey;
  }

  /**
   * Listar jornadas do usuário
   */
  async getJourneys(userId: string) {
    const journeys = await this.repository.findByUser(userId);
    return journeys;
  }
}
```

#### journey.validators.ts (completo)

```typescript
import { z } from 'zod';

/**
 * POST /journey - Body
 * Criar nova jornada
 */
export const createJourneyBodySchema = z.object({
  type: z.enum(['PREGNANCY', 'POSTPARTUM', 'BABY_0_3M', 'BABY_3_6M', 'BABY_6_12M', 'BABY_1_2Y', 'BABY_2_3Y', 'BABY_3_5Y'], {
    errorMap: () => ({ message: 'Tipo de jornada inválido' }),
  }),
  startDate: z.string().datetime('Data de início inválida. Use formato ISO 8601').or(z.date()),
  expectedDate: z.string().datetime('Data esperada inválida. Use formato ISO 8601').or(z.date()).optional(),
});
```

#### journey.repository.ts (completo)

```typescript
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../repositories/BaseRepository.js';

export class JourneyRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Criar jornada
   */
  async create(data: { userId: string; type: string; startDate: Date; expectedDate?: Date | null }) {
    return this.prisma.journey.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        startDate: data.startDate,
        expectedDate: data.expectedDate,
      },
      select: {
        id: true,
        userId: true,
        type: true,
        startDate: true,
        expectedDate: true,
        currentStage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Buscar jornadas do usuário
   */
  async findByUser(userId: string) {
    return this.prisma.journey.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        type: true,
        startDate: true,
        expectedDate: true,
        currentStage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Buscar jornada do usuário (como userId é unique, retorna no máximo 1)
   */
  async findByUserId(userId: string) {
    return this.prisma.journey.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        type: true,
        startDate: true,
        expectedDate: true,
        currentStage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
```

---

### MÓDULO 2: onboarding

#### routes.ts (completo)

```typescript
import { Router } from 'express';
import { validateBody } from '../../shared/middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { completeOnboardingBodySchema } from './validators/onboarding.validators.js';
import { prisma } from '../../config/prisma.js';
import { OnboardingRepository } from './repositories/onboarding.repository.js';
import { OnboardingService } from './services/onboarding.service.js';
import { OnboardingController } from './controllers/onboarding.controller.js';

const router = Router();

// Inicializar dependências
const repository = new OnboardingRepository(prisma);
const service = new OnboardingService(repository);
const controller = new OnboardingController(service);

// Rota protegida: completar onboarding
router.post(
  '/complete',
  authenticate,
  validateBody(completeOnboardingBodySchema),
  asyncHandler(controller.complete)
);

export default router;
```

#### controller.ts (completo)

```typescript
import { Request, Response } from 'express';
import { OnboardingService } from '../services/onboarding.service.js';
import logger from '../../../utils/logger.js';

export class OnboardingController {
  constructor(private service: OnboardingService) {}

  /**
   * Completar onboarding
   * POST /api/v1/onboarding/complete
   */
  complete = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { role } = req.body as { role: string };

    const result = await this.service.completeOnboarding(userId, role as any);

    logger.info('Onboarding completado', {
      userId,
      role,
      requestId: req.context?.requestId,
    });

    res.status(200).json({
      success: true,
      data: result,
      requestId: req.context?.requestId,
    });
  };
}
```

#### service.ts (completo)

```typescript
import { UserRole } from '@prisma/client';
import { AppError } from '../../../shared/errors/AppError.js';
import { ErrorCode } from '../../../shared/errors/ErrorCatalog.js';
import { OnboardingRepository } from '../repositories/onboarding.repository.js';

export class OnboardingService {
  constructor(private repository: OnboardingRepository) {}

  /**
   * Completar onboarding do usuário
   */
  async completeOnboarding(userId: string, role: UserRole) {
    // Buscar usuário
    const user = await this.repository.findUserById(userId);
    
    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Usuário não encontrado');
    }

    // Verificar se onboarding já foi completado
    if (user.onboardingCompleted) {
      throw new AppError(ErrorCode.CONFLICT, 'Onboarding já foi completado');
    }

    // Validar que role fornecido é válido para onboarding
    const validOnboardingRoles: UserRole[] = ['MOTHER', 'PROFESSIONAL', 'COMPANY'];
    if (!validOnboardingRoles.includes(role)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        'Role deve ser MOTHER, PROFESSIONAL ou COMPANY'
      );
    }

    // Completar onboarding
    const updatedUser = await this.repository.completeOnboarding(userId, role);

    return {
      user: updatedUser,
      message: 'Onboarding completado com sucesso',
    };
  }
}
```

#### onboarding.validators.ts (completo)

```typescript
import { z } from 'zod';

/**
 * Schema de validação para completar onboarding
 */
export const completeOnboardingBodySchema = z.object({
  role: z.enum(['MOTHER', 'PROFESSIONAL', 'COMPANY'], {
    errorMap: () => ({ message: 'Role deve ser MOTHER, PROFESSIONAL ou COMPANY' }),
  }),
});
```

#### onboarding.repository.ts (completo)

```typescript
import { PrismaClient, UserRole } from '@prisma/client';

export class OnboardingRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Buscar usuário por ID
   */
  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingCompleted: true,
        onboardingRole: true,
        onboardingAt: true,
      },
    });
  }

  /**
   * Completar onboarding do usuário
   */
  async completeOnboarding(
    userId: string,
    onboardingRole: UserRole
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingRole,
        onboardingAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingCompleted: true,
        onboardingRole: true,
        onboardingAt: true,
      },
    });
  }
}
```

---

### Explicação do padrão de módulo

**Como o router é exportado**

- `routes.ts` cria um `Router()`, define as rotas e exporta com `export default router`.
- O entrypoint importa `journeyRoutes` / `onboardingRoutes` e monta com `app.use('/api/v1/journey', journeyRoutes)`.

**Como o auth middleware é aplicado**

- Por rota: `authenticate` é passado na cadeia de middlewares (ex: `authenticate, validateBody(...), asyncHandler(controller.createJourney)`).
- Ordem típica: `authenticate` → `validateBody` (quando há body) → `asyncHandler(controller.method)`.
- Para RBAC: `authenticate, authorize('ADMIN')` — `authorize` vem de `shared/middleware/authorize.middleware.js`.

**Como a validação é aplicada**

- `validateBody(schema)`, `validateQuery(schema)`, `validateParams(schema)` de `shared/middleware/validate.middleware.ts`.
- Usa schemas Zod; em falha chama `next(new AppError(ErrorCode.VALIDATION_ERROR, ...))` com `details.issues`.

**Como os erros são tratados**

- Controllers/Services lançam `AppError(ErrorCode.XXX, message, statusCode, details)`.
- `asyncHandler` faz `fn(req, res, next).catch(next)` — erros vão para o error handler.
- `errorHandler` usa `mapError(err)` para transformar em `AppError` e responde com `failFromAppError`.

**Padrão de response JSON**

- Sucesso: `ok(res, data)` → 200: `{ success: true, data, requestId }`.
- Criação: `created(res, data)` → 201: `{ success: true, data, requestId }`.
- Erro: `{ success: false, error: "<code>", message: "<message>", details?: ..., requestId }`.
- Paginação: `ok(res, data, { pagination: { page, limit, total, totalPages } })`.

---

## 4. Auth Middleware

### Arquivo: src/middleware/auth.middleware.ts (completo)

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../shared/errors/AppError.js';
import { ErrorCode } from '../shared/errors/ErrorCatalog.js';

/**
 * Middleware de autenticação JWT
 * 
 * Verifica token Bearer e injeta req.user com dados do token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(ErrorCode.AUTH_TOKEN_MISSING);
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Mapear userId do token para id no req.user
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as 'USER' | 'MOTHER' | 'PROFESSIONAL' | 'COMPANY' | 'ADMIN' | 'SUPER_ADMIN' | 'TESTER',
    };
    next();
  } catch (error) {
    // Se erro é AppError, passa direto
    if (error instanceof AppError) {
      return next(error);
    }
    // Senão, mapeia para token inválido/expirado
    next(new AppError(ErrorCode.AUTH_TOKEN_INVALID));
  }
};

/**
 * Middleware de autorização por role
 * 
 * Verifica se usuário tem uma das roles especificadas
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(ErrorCode.AUTH_UNAUTHORIZED));
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return next(new AppError(ErrorCode.AUTH_FORBIDDEN));
    }

    next();
  };
};
```

### Explicação

**Extração do user do token**

- Header esperado: `Authorization: Bearer <token>`.
- Token é extraído com `authHeader.substring(7)` (após "Bearer ").
- `verifyAccessToken(token)` (de `utils/jwt.js`) decodifica e valida o JWT.
- Se inválido/expirado, a lib lança erro; o catch converte para `AppError(ErrorCode.AUTH_TOKEN_INVALID)`.

**Onde o userId fica disponível**

- Em `req.user.id` — o token expõe `userId`, que é colocado em `req.user.id`.
- Tipo em `shared/types/request.d.ts`: `req.user?: { id: string; email?: string; role: ... }`.

**Como retorna 401**

- `AppError(ErrorCode.AUTH_TOKEN_MISSING)` → `ErrorStatusMap[AUTH_TOKEN_MISSING]` = 401.
- `AppError(ErrorCode.AUTH_TOKEN_INVALID)` → 401.
- `AppError(ErrorCode.AUTH_UNAUTHORIZED)` → 401 (quando `authorize` roda sem `req.user`).
- O `errorHandler` usa `mapError` e `failFromAppError` com `appError.statusCode` para responder.

---

## 5. Prisma Schema

### Conteúdo completo de prisma/schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// AUTENTICAÇÃO E USUÁRIOS
// ============================================================================

model User {
  id                  String     @id @default(cuid())
  email               String     @unique
  password            String
  name                String
  avatar              String?
  bio                 String?
  role                UserRole   @default(USER)
  status              UserStatus @default(ACTIVE)
  emailVerified       Boolean    @default(false)
  onboardingCompleted Boolean    @default(false)
  onboardingRole      UserRole?
  onboardingAt        DateTime?
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  deletedAt           DateTime?

  // Relacionamentos
  journey            Journey?
  moments            Moment[]
  socialPosts        SocialPost[]
  socialLikes        SocialLike[]
  socialComments     SocialComment[]
  achievements       UserAchievement[]
  leaderboardEntries LeaderboardEntry[]
  communityPosts     CommunityPost[]
  communityComments  CommunityComment[]
  directMessages     DirectMessage[]
  professional       Professional?
  company            Company?
  orders             Order[]
  reviews            Review[]
  notifications      Notification[]
  followers          UserFollower[]     @relation("following")
  following          UserFollower[]     @relation("follower")
  authSessions       AuthSession[]

  @@index([email])
  @@index([role])
  @@index([status])
}

enum UserRole {
  USER
  MOTHER
  PROFESSIONAL
  COMPANY
  ADMIN
  SUPER_ADMIN
  TESTER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  DELETED
}

// ============================================================================
// AUTENTICAÇÃO E SESSÕES
// ============================================================================

model AuthSession {
  id        String    @id @default(uuid())
  userId    String
  tokenHash String    @unique
  createdAt DateTime  @default(now())
  expiresAt DateTime
  revokedAt DateTime?
  userAgent String?
  ipAddress String?
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([tokenHash])
  @@index([expiresAt])
  @@index([revokedAt])
}

model UserFollower {
  id          String   @id @default(cuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  follower  User @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  following User @relation("following", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

// ============================================================================
// JORNADA E MOMENTOS
// ============================================================================

model Journey {
  id           String      @id @default(cuid())
  userId       String      @unique
  type         JourneyType
  startDate    DateTime
  expectedDate DateTime?
  currentStage Int         @default(1)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  stages      JourneyStage[]
  moments     Moment[]
  suggestions SmartSuggestion[]

  @@index([userId])
}

enum JourneyType {
  PREGNANCY
  POSTPARTUM
  BABY_0_3M
  BABY_3_6M
  BABY_6_12M
  BABY_1_2Y
  BABY_2_3Y
  BABY_3_5Y
}

model JourneyStage {
  id          String    @id @default(cuid())
  journeyId   String
  stage       Int
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime?
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now())

  journey Journey @relation(fields: [journeyId], references: [id], onDelete: Cascade)

  @@index([journeyId])
}

model Moment {
  id          String   @id @default(cuid())
  userId      String
  journeyId   String
  title       String
  description String?
  images      String[] @default([])
  videos      String[] @default([])
  mood        String?
  weight      Float?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user     User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  journey  Journey         @relation(fields: [journeyId], references: [id], onDelete: Cascade)
  comments MomentComment[]

  @@index([userId])
  @@index([journeyId])
}

model MomentComment {
  id        String   @id @default(cuid())
  momentId  String
  text      String
  createdAt DateTime @default(now())

  moment Moment @relation(fields: [momentId], references: [id], onDelete: Cascade)

  @@index([momentId])
}

// ============================================================================
// SUGESTÕES INTELIGENTES
// ============================================================================

model SmartSuggestion {
  id          String   @id @default(cuid())
  journeyId   String
  title       String
  description String
  category    String
  priority    Int      @default(0)
  createdAt   DateTime @default(now())

  journey Journey @relation(fields: [journeyId], references: [id], onDelete: Cascade)

  @@index([journeyId])
}

// ============================================================================
// REDE SOCIAL
// ============================================================================

model SocialPost {
  id        String   @id @default(cuid())
  userId    String
  content   String
  images    String[] @default([])
  likes     Int      @default(0)
  views     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes_rel SocialLike[]
  comments  SocialComment[]

  @@index([userId])
  @@index([createdAt])
}

model SocialLike {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())

  post SocialPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
  @@index([postId])
  @@index([userId])
}

model SocialComment {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  text      String
  createdAt DateTime @default(now())

  post SocialPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([userId])
}

// ============================================================================
// GAMIFICAÇÃO
// ============================================================================

model Achievement {
  id          String @id @default(cuid())
  name        String
  description String
  icon        String
  points      Int

  users UserAchievement[]

  @@unique([name])
}

model UserAchievement {
  id            String   @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
  @@index([userId])
}

model LeaderboardEntry {
  id        String   @id @default(cuid())
  userId    String   @unique
  points    Int      @default(0)
  rank      Int
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([rank])
  @@index([points])
}

// ============================================================================
// COMUNIDADE
// ============================================================================

model CommunityCategory {
  id          String  @id @default(cuid())
  name        String  @unique
  description String?
  icon        String?

  posts CommunityPost[]
}

model CommunityPost {
  id         String   @id @default(cuid())
  userId     String
  categoryId String
  title      String
  content    String
  views      Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user     User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  category CommunityCategory  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  comments CommunityComment[]

  @@index([userId])
  @@index([categoryId])
  @@index([createdAt])
}

model CommunityComment {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  text      String
  createdAt DateTime @default(now())

  post CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([postId])
  @@index([userId])
}

// ============================================================================
// MENSAGENS DIRETAS
// ============================================================================

model DirectMessage {
  id        String   @id @default(cuid())
  senderId  String
  text      String
  createdAt DateTime @default(now())

  sender User @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@index([senderId])
}

// ============================================================================
// PROFISSIONAIS
// ============================================================================

model Professional {
  id          String   @id @default(cuid())
  userId      String   @unique
  specialties String[]
  bio         String?
  verified    Boolean  @default(false)
  rating      Float    @default(0)
  reviewCount Int      @default(0)

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  appointments Appointment[]
  reviews      Review[]

  @@index([verified])
  @@index([rating])
}

model Appointment {
  id             String   @id @default(cuid())
  professionalId String
  date           DateTime
  duration       Int
  status         String   @default("pending")
  createdAt      DateTime @default(now())

  professional Professional @relation(fields: [professionalId], references: [id], onDelete: Cascade)

  @@index([professionalId])
  @@index([date])
}

// ============================================================================
// EMPRESAS
// ============================================================================

model Company {
  id          String  @id @default(cuid())
  userId      String  @unique
  name        String
  description String?
  logo        String?
  verified    Boolean @default(false)

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  products Product[]

  @@index([verified])
}

// ============================================================================
// MARKETPLACE
// ============================================================================

model Product {
  id          String   @id @default(cuid())
  companyId   String
  name        String
  description String
  price       Float
  image       String?
  stock       Int      @default(0)
  createdAt   DateTime @default(now())

  company    Company     @relation(fields: [companyId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
  reviews    Review[]

  @@index([companyId])
}

model Order {
  id        String   @id @default(cuid())
  userId    String
  total     Float
  status    String   @default("pending")
  createdAt DateTime @default(now())

  user  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items OrderItem[]

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@index([productId])
}

model Review {
  id             String   @id @default(cuid())
  userId         String
  productId      String?
  professionalId String?
  rating         Int
  text           String?
  createdAt      DateTime @default(now())

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  product      Product?      @relation(fields: [productId], references: [id], onDelete: Cascade)
  professional Professional? @relation(fields: [professionalId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([productId])
}

// ============================================================================
// BLOG
// ============================================================================

model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  excerpt   String?
  image     String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([published])
  @@index([createdAt])
}

// ============================================================================
// ASSINATURAS
// ============================================================================

model Subscription {
  id        String   @id @default(cuid())
  name      String
  price     Float
  features  String[]
  createdAt DateTime @default(now())
}

// ============================================================================
// NOTIFICAÇÕES
// ============================================================================

model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([read])
}

// ============================================================================
// ADMIN LOGS
// ============================================================================

model AdminLog {
  id        String   @id @default(cuid())
  action    String
  entity    String
  entityId  String
  changes   String?
  createdAt DateTime @default(now())

  @@index([action])
  @@index([entity])
  @@index([createdAt])
}
```

### Explicação

**Model User**

- `id`: `String` com `@id @default(cuid())`.
- Campos principais: `email`, `password`, `name`, `avatar`, `bio`, `role`, `status`, `emailVerified`, `onboardingCompleted`, `onboardingRole`, `onboardingAt`, `createdAt`, `updatedAt`, `deletedAt`.

**Relações existentes**

- User → Journey (1:1), Moment, SocialPost, AuthSession, etc.
- Journey → Moment, JourneyStage, SmartSuggestion.
- Moment tem `mood String?` opcional.

**Enum parecido com Mood**

- Não existe enum `Mood`. O campo `mood` em `Moment` é `String?`.
- Para Emotional Checkin, pode-se criar um enum `Mood` ou reutilizar `String` com validação via Zod.

**Padrão de naming e índices**

- IDs: `cuid()` ou `uuid()`.
- Naming: camelCase, relação explícita em ambos os lados.
- Índices: `@@index([campo])` em FKs e campos de busca; `@@unique` onde necessário.

---

## 6. Scripts e Deploy

### Conteúdo do package.json

```json
{
  "name": "maternilove-backend",
  "version": "1.0.0",
  "description": "Materni Love Backend - API REST",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "postinstall": "prisma generate",
    "prestart": "node dist/scripts/resolveFailedMigration.js || true && prisma migrate deploy",
    "start": "node dist/src/scripts/resetAdminPassword.js && node dist/src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.{ts,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,json}\"",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts",
    "seed:admin": "tsx prisma/seed.ts",
    "resolve-migration": "tsx scripts/resolveMigration.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "prisma": "^5.7.1",
    "typescript": "^5.3.3",
    "@types/node": "^20.10.6",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "tsx": "^4.7.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}
```

### Explicação

**Script de start**

- `start`: executa `node dist/src/scripts/resetAdminPassword.js` e em seguida `node dist/src/server.js`.
- Depende de build prévio (`npm run build` ou equivalente).

**Script de build**

- `build`: `tsc` — compila TypeScript para `dist/` (estrutura depende do `tsconfig.json`, provavelmente `dist/src/`).

**Script de migrate**

- `prisma:migrate`: `prisma migrate dev` — para desenvolvimento.
- `prisma:migrate:deploy`: `prisma migrate deploy` — para produção.

**Como `prisma migrate deploy` roda no boot**

- `prestart` é executado automaticamente antes de `start` pelo npm.
- `prestart`: `node dist/scripts/resolveFailedMigration.js || true && prisma migrate deploy`.
- Observação: o `|| true` impede que falha do script `resolveFailedMigration` bloqueie o deploy.
- Depois disso, `start` roda `resetAdminPassword` e `server.js`.

---

## Arquivos auxiliares referenciados

### shared/http/response.ts (trechos relevantes)

- `ok(res, data)` → 200
- `created(res, data)` → 201
- `fail(res, error, statusCode)` → resposta de erro
- `failFromAppError(res, appError)` → usa `appError.statusCode`

### shared/middleware/validate.middleware.ts

- `validateBody(schema)`, `validateQuery(schema)`, `validateParams(schema)` — Zod parse + `AppError(VALIDATION_ERROR)` em falha

### shared/utils/asyncHandler.ts

- `asyncHandler(fn)` → wrapper que faz `Promise.resolve(fn(req, res, next)).catch(next)`

### shared/types/request.d.ts

- `req.user?: { id: string; email?: string; role: ... }`
- `req.context: { requestId, locale, timeZone }`
