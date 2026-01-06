import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { prisma } from './config/prisma.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import authRoutes from './routes/auth.routes.js';
import socialRoutes from './routes/social.routes.js';
import communityRoutes from './routes/community.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';

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

// API Root
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'Materni Love API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      social: '/api/social',
      community: '/api/community',
      marketplace: '/api/marketplace',
      users: '/api/users',
    }
  });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de rede social
app.use('/api/social', socialRoutes);

// Rotas de comunidade
app.use('/api/community', communityRoutes);

// Rotas de marketplace
app.use('/api/marketplace', marketplaceRoutes);

// Placeholder Routes
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ message: 'Users endpoint' });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(errorHandler);

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    error: { message: 'Not Found' } 
  });
});

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
