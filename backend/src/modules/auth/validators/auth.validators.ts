import { z } from 'zod';

// POST /register - Body
export const registerBodySchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').trim(),
});

// POST /login - Body
export const loginBodySchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// POST /refresh - Body
export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

// POST /logout - Body
export const logoutBodySchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});
