export const jwtConfig = {
  accessTokenSecret: process.env.JWT_SECRET || 'change-this-in-production',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'change-this-in-production',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
};
