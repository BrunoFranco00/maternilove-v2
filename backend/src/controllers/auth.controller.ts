import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import logger from '../utils/logger.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    
    logger.info('User registered', { email: result.user.email });
    console.log('✅ Usuário registrado:', result.user.email);
    
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Erro ao registrar usuário:', error);
    logger.error('User registration failed', { error });
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    
    logger.info('User logged in', { email: result.user.email });
    console.log('✅ Usuário logado:', result.user.email);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
    logger.error('User login failed', { error, email: req.body.email });
    next(error);
  }
};
