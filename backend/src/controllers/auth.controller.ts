import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import logger from '../utils/logger.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    
    logger.info('User registered', { email: result.user.email });
    
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    
    logger.info('User logged in', { email: result.user.email });
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
