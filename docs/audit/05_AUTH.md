# AUTENTICAÇÃO - MATERNI LOVE V2

**Data:** 2025-01-03  
**Objetivo:** Documentação completa do sistema de autenticação

---

## TIPO DE AUTENTICAÇÃO

**Método**: **JWT (JSON Web Tokens)**

**Não utilizado**: Session-based auth, OAuth, API Keys

---

## IMPLEMENTAÇÃO

### 1. Geração e Verificação de Tokens

**Arquivo**: `backend/src/utils/jwt.ts`

**Funções**:
- `generateAccessToken(payload: TokenPayload): string`
- `generateRefreshToken(payload: TokenPayload): string`
- `verifyAccessToken(token: string): TokenPayload`
- `verifyRefreshToken(token: string): TokenPayload`

**Payload do Token**:
```typescript
interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}
```

**Código**:
```typescript
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiry,
  } as SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiry,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.accessTokenSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.refreshTokenSecret) as TokenPayload;
};
```

---

### 2. Configuração JWT

**Arquivo**: `backend/src/config/jwt.ts`

**Configurações**:
- **Access Token Secret**: `process.env.JWT_SECRET` (obrigatório em produção)
- **Refresh Token Secret**: `process.env.JWT_REFRESH_SECRET` ou fallback para `JWT_SECRET`
- **Access Token Expiry**: `15m` (15 minutos)
- **Refresh Token Expiry**: `7d` (7 dias)

**Código**:
```typescript
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
```

---

### 3. Middleware de Autenticação

**Arquivo**: `backend/src/middleware/auth.middleware.ts`

**Funções**:
- `authenticate`: Verifica token JWT e anexa `user` ao request
- `authorize(...roles: string[])`: Middleware de autorização por role (não encontrado em uso)

**Interface AuthRequest**:
```typescript
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}
```

**Código do authenticate**:
```typescript
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token not provided');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Mapear userId do token para id no req.user
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
};
```

**Código do authorize** (definido mas não encontrado em uso):
```typescript
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return next(new Error('Insufficient permissions'));
    }

    next();
  };
};
```

---

### 4. Service de Autenticação

**Arquivo**: `backend/src/services/auth.service.ts`

**Funções**:
- `register(data: { email, password, name })`: Cria usuário e retorna tokens
- `login(data: { email, password })`: Valida credenciais e retorna tokens

**Fluxo de Registro**:
1. Valida dados com Zod (`registerSchema`)
2. Verifica se usuário já existe
3. Hash da senha com bcryptjs (salt rounds: 10)
4. Cria usuário no banco
5. Gera access token e refresh token
6. Retorna usuário (sem senha) e tokens

**Fluxo de Login**:
1. Valida dados com Zod (`loginSchema`)
2. Busca usuário por email
3. Compara senha com bcryptjs
4. Gera access token e refresh token
5. Retorna usuário (sem senha) e tokens

**Código de exemplo (register)**:
```typescript
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
```

---

## ESTRUTURA DO TOKEN

### Claims (Payload)

```typescript
{
  userId: string,    // ID do usuário (CUID)
  email: string,     // Email do usuário
  role: string       // Role do usuário (USER, ADMIN, etc)
}
```

### Header

Padrão JWT:
```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Exemplo de Token (decodificado)

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "userId": "clxxxxx...",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1704326400,
  "exp": 1704327300
}
```

**Assinatura**: HMAC SHA256 usando `JWT_SECRET`

---

## ROTAS PROTEGIDAS

### Rotas que requerem autenticação (middleware `authenticate`):

**Social**:
- `POST /api/social/posts`
- `POST /api/social/posts/:id/like`
- `POST /api/social/posts/:id/comments`

**Community**:
- `POST /api/community/posts`
- `POST /api/community/posts/:id/comments`

**Marketplace**:
- `POST /api/marketplace/products/:id/reviews`
- `GET /api/marketplace/orders`
- `POST /api/marketplace/orders`

### Rotas públicas (não requerem autenticação):

**Social**:
- `GET /api/social/feed` (pode usar userId se presente no token)
- `GET /api/social/posts/:id/comments`

**Community**:
- `GET /api/community/categories`
- `GET /api/community/posts`
- `GET /api/community/posts/:id`

**Marketplace**:
- `GET /api/marketplace/products`
- `GET /api/marketplace/products/:id`

**Auth**:
- `POST /api/auth/register`
- `POST /api/auth/login`

---

## REGRAS E COMPORTAMENTOS

### 1. Validação de Token

- Token deve estar no header: `Authorization: Bearer <token>`
- Token deve ser válido (assinatura correta, não expirado)
- Token expirado retorna 401: "Invalid or expired token"
- Token ausente retorna 401: "Token not provided"

### 2. Rate Limiting em Auth

- Endpoints `/api/auth/*` usam `authLimiter`:
  - 5 requisições por IP em 15 minutos
  - Ajuda a prevenir brute force

### 3. Hash de Senha

- **Biblioteca**: bcryptjs
- **Salt rounds**: 10
- **Nunca retornado**: Senha nunca é retornada nas respostas (campo excluído via `select`)

### 4. Refresh Token

- **Gerado**: Sim, em register e login
- **Endpoint de refresh**: **NÃO ENCONTRADO** (não há rota para renovar token)
- **Uso**: Não há implementação para usar refresh token

### 5. Logout

- **Endpoint de logout**: **NÃO ENCONTRADO**
- **Comportamento**: Logout é client-side (remove token do localStorage)
- **Blacklist de tokens**: **NÃO IMPLEMENTADO**

---

## RISCOS E INCONSISTÊNCIAS

### ⚠️ RISCOS IDENTIFICADOS

1. **Refresh Token não utilizado**
   - Refresh token é gerado mas não há endpoint para renovar access token
   - Cliente precisará fazer login novamente após 15 minutos

2. **Logout não invalidado**
   - Não há blacklist de tokens
   - Tokens continuam válidos mesmo após "logout"
   - Risco de segurança se token for comprometido

3. **Autorização por Role não implementada**
   - Middleware `authorize` existe mas não é usado
   - Todas as rotas protegidas aceitam qualquer usuário autenticado
   - Não há diferenciação entre roles (USER, ADMIN, etc)

4. **JWT_SECRET fallback em dev**
   - Em desenvolvimento, usa secret padrão se não configurado
   - Pode levar a uso acidental em produção se NODE_ENV não estiver correto

5. **Token no localStorage (frontend)**
   - Frontend armazena tokens no localStorage (assumido pelo AuthContext)
   - Vulnerável a XSS attacks

### ✅ PONTOS POSITIVOS

1. **Validação de dados**: Usa Zod para validação de entrada
2. **Hash de senha**: Senhas são hasheadas com bcryptjs
3. **Rate limiting**: Proteção contra brute force
4. **Tokens com expiração**: Access token expira em 15 minutos
5. **Senha nunca retornada**: Campo password nunca é incluído nas respostas

---

## OBSERVAÇÕES

1. **Refresh token endpoint ausente**: Precisa ser implementado para melhor UX
2. **Blacklist de tokens**: Considerar implementar para logout seguro
3. **Autorização**: Implementar uso do middleware `authorize` para rotas administrativas
4. **Token storage**: Considerar httpOnly cookies ao invés de localStorage para maior segurança
