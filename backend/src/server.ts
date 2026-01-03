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
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
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
    message: 'MaternLove API v1',
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
  console.log('🚀 MaternLove Backend Server');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log('✨ Ready to receive requests!');
  console.log('');
});

export default app;
