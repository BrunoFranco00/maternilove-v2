import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { AuthRepository } from '../repositories/auth.repository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type TokenPayload, type RefreshTokenPayload } from '../../../utils/jwt.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ErrorCode } from '../../../shared/errors/ErrorCatalog.js';

export class AuthService {
  constructor(private repository: AuthRepository) {}

  /**
   * Registrar novo usuário
   */
  async register(data: { email: string; password: string; name: string }, userAgent?: string, ipAddress?: string) {
    // Verificar se usuário já existe
    const userExists = await this.repository.userExists(data.email);
    if (userExists) {
      throw new AppError(ErrorCode.DUPLICATE_ENTRY, 'Usuário com este email já existe');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await this.repository.createUser(data.email, hashedPassword, data.name);

    // Gerar tokens e criar sessão
    return this.createSessionForUser(user, userAgent, ipAddress);
  }

  /**
   * Login de usuário
   */
  async login(data: { email: string; password: string }, userAgent?: string, ipAddress?: string) {
    // Buscar usuário
    const user = await this.repository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError(ErrorCode.AUTH_UNAUTHORIZED, 'Email ou senha inválidos');
    }

    // Verificar status do usuário (enum UserStatus retorna como string)
    if (String(user.status) !== 'ACTIVE') {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, 'Conta inativa ou suspensa');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(ErrorCode.AUTH_UNAUTHORIZED, 'Email ou senha inválidos');
    }

    // Gerar tokens e criar sessão
    return this.createSessionForUser(user, userAgent, ipAddress);
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string) {
    // Verificar token JWT
    let decoded: RefreshTokenPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AppError(ErrorCode.AUTH_TOKEN_INVALID, 'Refresh token inválido ou expirado');
    }

    // Buscar sessão no banco pelo hash do token
    const tokenHash = this.repository.hashToken(refreshToken);
    const session = await this.repository.findSessionByTokenHash(tokenHash);

    if (!session) {
      throw new AppError(ErrorCode.AUTH_SESSION_REVOKED, 'Sessão não encontrada ou revogada');
    }

    // Verificar se sessionId do token corresponde à sessão encontrada (verificação de segurança)
    if (session.id !== decoded.sessionId) {
      throw new AppError(ErrorCode.AUTH_TOKEN_INVALID, 'SessionId do token não corresponde à sessão');
    }

    // Verificar se sessão foi revogada
    if (session.revokedAt) {
      throw new AppError(ErrorCode.AUTH_SESSION_REVOKED, 'Sessão foi revogada');
    }

    // Verificar se sessão expirou
    if (new Date() > session.expiresAt) {
      throw new AppError(ErrorCode.AUTH_SESSION_EXPIRED, 'Sessão expirada');
    }

    // Verificar se usuário ainda está ativo (enum UserStatus retorna como string)
    if (String(session.user.status) !== 'ACTIVE') {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, 'Conta inativa ou suspensa');
    }

    // Gerar novos tokens com nova sessão (token rotation)
    const newAccessTokenPayload: TokenPayload = {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
    };

    // Criar nova sessão
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    // Criar sessão temporária para obter ID
    const tempHash = 'temp-' + randomUUID();
    const newSession = await this.repository.createSession(
      session.user.id,
      tempHash,
      expiresAt,
      session.userAgent || undefined,
      session.ipAddress || undefined
    );

    // Gerar refresh token com novo sessionId
    const newRefreshTokenPayload: RefreshTokenPayload = {
      ...newAccessTokenPayload,
      sessionId: newSession.id,
    };

    const newAccessToken = generateAccessToken(newAccessTokenPayload);
    const newRefreshToken = generateRefreshToken(newRefreshTokenPayload);

    // Atualizar nova sessão com hash correto
    const newTokenHash = this.repository.hashToken(newRefreshToken);
    await this.repository.updateSessionTokenHash(newSession.id, newTokenHash);

    // Revogar sessão antiga
    await this.repository.revokeSession(session.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout
   */
  async logout(refreshToken: string) {
    // Verificar token JWT (se inválido, já foi revogado ou nunca existiu - idempotente)
    let decoded: RefreshTokenPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      // Token inválido/expirado - já não pode ser usado, então logout já está efetivo
      return;
    }

    // Buscar sessão no banco pelo hash do token
    const tokenHash = this.repository.hashToken(refreshToken);
    const session = await this.repository.findSessionByTokenHash(tokenHash);

    // Verificar se sessionId corresponde (segurança adicional)
    if (session && session.id !== decoded.sessionId) {
      // SessionId não corresponde - possível token comprometido
      return;
    }

    // Revogar sessão se ainda estiver ativa
    if (session && !session.revokedAt) {
      await this.repository.revokeSession(session.id);
    }
  }

  /**
   * Criar sessão para usuário (helper interno)
   */
  private async createSessionForUser(user: { id: string; email: string; name: string; role: string }, userAgent?: string, ipAddress?: string) {
    // Criar sessão temporária primeiro para obter o ID
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    // Criar sessão com hash temporário
    const tempHash = 'temp-' + randomUUID();
    const session = await this.repository.createSession(
      user.id,
      tempHash,
      expiresAt,
      userAgent,
      ipAddress
    );

    // Agora que temos o sessionId, gerar tokens
    const accessTokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      ...accessTokenPayload,
      sessionId: session.id,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken(refreshTokenPayload);
    const tokenHash = this.repository.hashToken(refreshToken);

    // Atualizar sessão com hash correto
    await this.repository.updateSessionTokenHash(session.id, tokenHash);

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
  }
}
