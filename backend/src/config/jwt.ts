// Validar JWT_SECRET no boot (não usar fallback em produção)
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET é obrigatório em produção. Configure no Railway.');
}

export const jwtConfig = {
  accessTokenSecret: process.env.JWT_SECRET || 'change-this-in-development-only',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'change-this-in-development-only',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
};
