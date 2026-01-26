import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role: 'USER' | 'MOTHER' | 'PROFESSIONAL' | 'COMPANY' | 'ADMIN' | 'SUPER_ADMIN' | 'TESTER';
      };
      context: {
        requestId: string;
        locale: string;
        timeZone: string;
      };
    }
  }
}

export {};
