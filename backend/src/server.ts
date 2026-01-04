import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { prisma } from './config/database.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import authRoutes from './routes/auth.routes.js';
import socialRoutes from './routes/social.routes.js';
import communityRoutes from './routes/community.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// EXECUTAR MIGRATIONS NA INICIALIZAÇÃO
// ============================================================================

async function runMigrations() {
  try {
    logger.info('Executando migrations...');
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    await execAsync('npx prisma migrate deploy', {
      cwd: process.cwd(),
      env: process.env,
    });
    
    logger.info('✅ Migrations executadas com sucesso');
  } catch (error: any) {
    logger.error('❌ Erro ao executar migrations', { error: error.message });
    // Tentar db push como fallback
    try {
      logger.info('Tentando db push como fallback...');
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      await execAsync('npx prisma db push --accept-data-loss', {
        cwd: process.cwd(),
        env: process.env,
      });
      
      logger.info('✅ Schema aplicado com db push');
    } catch (pushError: any) {
      logger.error('❌ Erro ao fazer db push', { error: pushError.message });
      logger.warn('Continuando mesmo assim...');
    }
  }
}

// Executar migrations antes de iniciar o servidor
runMigrations().then(() => {
  startServer();
}).catch((error) => {
  logger.error('Erro fatal ao executar migrations', { error });
  process.exit(1);
});

function startServer() {
  // ============================================================================
  // MIDDLEWARE
  // ============================================================================

  app.use(helmet());
  app.use(generalLimiter);

  // CORS Configuration - Seguro
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    ...(process.env.CORS_ORIGIN?.split(',') || []),
    /^https:\/\/.*\.vercel\.app$/,
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ============================================================================
  // ROTAS
  // ============================================================================

  // Health Check
  app.get('/health', async (req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
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
  // GRACEFUL SHUTDOWN
  // ============================================================================

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

  // ============================================================================
  // START SERVER
  // ============================================================================

  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    console.log('');
    console.log('🚀 Materni Love Backend Server');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log('✨ Ready to receive requests!');
    console.log('');
  });
}

export default app;
