import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
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
