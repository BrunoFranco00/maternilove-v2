import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { generateAccessToken, generateRefreshToken, type TokenPayload } from '../utils/jwt.js';
import { AuthenticationError, ValidationError } from '../utils/errors.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

export const register = async (data: { email: string; password: string; name: string }) => {
  // Validar dados (Zod já lança erro de validação automaticamente)
  const validatedData = registerSchema.parse(data);

  // Verificar se usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new ValidationError('User with this email already exists');
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  // Gerar tokens
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const login = async (data: { email: string; password: string }) => {
  // Validar dados
  const validatedData = loginSchema.parse(data);

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verificar senha
  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Gerar tokens
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};
