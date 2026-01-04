import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: jwtConfig.accessTokenExpiry,
  };
  return jwt.sign(payload, jwtConfig.accessTokenSecret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: jwtConfig.refreshTokenExpiry,
  };
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.accessTokenSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.refreshTokenSecret) as TokenPayload;
};
