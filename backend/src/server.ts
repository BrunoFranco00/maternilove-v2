import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(helmet());

// CORS Configuration - Aceita Vercel e outros domínios
const allowedOrigins = [
  'http://localhost:5173', // Frontend local
  'http://localhost:3000', // Backend local (para testes)
  ...(process.env.CORS_ORIGIN?.split(',') || []),
  // Aceita qualquer domínio do Vercel (*.vercel.app)
  /^https:\/\/.*\.vercel\.app$/,
  // Aceita domínio customizado do Vercel (se configurado)
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    // Verifica se o origin está na lista de permitidos
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Permite por padrão (ajuste se quiser mais restritivo)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// ROTAS
// ============================================================================

// Health Check
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Testa conexão com banco
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
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
      users: '/api/users',
      journey: '/api/journey',
      moments: '/api/moments',
      community: '/api/community',
      marketplace: '/api/marketplace',
      admin: '/api/admin',
    }
  });
});

// Placeholder Routes
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ message: 'Users endpoint' });
});

app.get('/api/journey', (req: Request, res: Response) => {
  res.json({ message: 'Journey endpoint' });
});

app.get('/api/moments', (req: Request, res: Response) => {
  res.json({ message: 'Moments endpoint' });
});

app.get('/api/community', (req: Request, res: Response) => {
  res.json({ message: 'Community endpoint' });
});

app.get('/api/marketplace', (req: Request, res: Response) => {
  res.json({ message: 'Marketplace endpoint' });
});

app.get('/api/admin', (req: Request, res: Response) => {
  res.json({ message: 'Admin endpoint' });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Materni Love Backend Server');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log('✨ Ready to receive requests!');
  console.log('');
});

export default app;
