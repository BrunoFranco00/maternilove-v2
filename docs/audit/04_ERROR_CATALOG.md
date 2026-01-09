# CATÁLOGO DE ERROS - MATERNI LOVE V2

**Data:** 2025-01-03  
**Objetivo:** Documentação do padrão de tratamento de erros

---

## PADRÃO DE RESPOSTA DE ERRO

### Formato Padrão

**Estrutura Base**:
```json
{
  "success": false,
  "error": {
    "message": "Mensagem de erro descritiva"
  }
}
```

**Em Desenvolvimento** (com stack trace):
```json
{
  "success": false,
  "error": {
    "message": "Mensagem de erro descritiva",
    "stack": "Error: Mensagem...\n  at ..."
  }
}
```

---

## ARQUIVOS ENVOLVIDOS

### 1. Error Classes (`src/utils/errors.ts`)

**Arquivo**: `backend/src/utils/errors.ts`

**Classes definidas**:
- `AppError` (classe base)
- `ValidationError` (400)
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)

**Código**:
```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}
```

---

### 2. Error Handler Middleware (`src/middleware/errorHandler.middleware.ts`)

**Arquivo**: `backend/src/middleware/errorHandler.middleware.ts`

**Função**: `errorHandler`

**Comportamento**:
1. Trata erros do Zod (validação)
2. Trata erros AppError (classes customizadas)
3. Trata erros genéricos (500)
4. Loga erros usando Winston logger
5. Retorna resposta JSON padronizada

**Código**:
```typescript
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Tratar erros de validação do Zod
  if (err instanceof ZodError) {
    logger.warn(`Validation error: ${err.message}`, { path: req.path });
    return res.status(400).json({
      success: false,
      error: {
        message: err.errors.map((e) => e.message).join(', '),
      },
    });
  }

  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode, path: req.path });
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  }

  // Erro não esperado
  logger.error('Unexpected error', { error: err, stack: err.stack, path: req.path });
  
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
```

---

## EXEMPLOS REAIS DO CÓDIGO

### Exemplo 1: Validação Zod (400)

**Origem**: `src/services/auth.service.ts` (linha 9)

**Contexto**: Registro de usuário com dados inválidos

**Erro lançado**:
```typescript
const validatedData = registerSchema.parse(data);
// Se falhar, Zod lança ZodError automaticamente
```

**Response HTTP 400**:
```json
{
  "success": false,
  "error": {
    "message": "Invalid email address, Password must be at least 6 characters"
  }
}
```

**Stack trace em dev**:
```json
{
  "success": false,
  "error": {
    "message": "Invalid email address, Password must be at least 6 characters",
    "stack": "ZodError: Invalid email address\n  at registerSchema.parse..."
  }
}
```

---

### Exemplo 2: ValidationError (400)

**Origem**: `src/services/auth.service.ts` (linha 17)

**Contexto**: Tentativa de registro com email já existente

**Código**:
```typescript
if (existingUser) {
  throw new ValidationError('User with this email already exists');
}
```

**Response HTTP 400**:
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists"
  }
}
```

---

### Exemplo 3: AuthenticationError (401)

**Origem**: `src/services/auth.service.ts` (linha 68)

**Contexto**: Login com credenciais inválidas

**Código**:
```typescript
if (!user) {
  throw new AuthenticationError('Invalid email or password');
}
```

**Response HTTP 401**:
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password"
  }
}
```

**Outro exemplo** (linha 74):
```typescript
if (!isPasswordValid) {
  throw new AuthenticationError('Invalid email or password');
}
```

---

### Exemplo 4: AuthenticationError no Middleware (401)

**Origem**: `src/middleware/auth.middleware.ts` (linha 18, 32)

**Contexto**: Requisição sem token ou com token inválido

**Código**:
```typescript
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  throw new AuthenticationError('Token not provided');
}

// Ou na verificação do token:
catch (error) {
  next(new AuthenticationError('Invalid or expired token'));
}
```

**Response HTTP 401**:
```json
{
  "success": false,
  "error": {
    "message": "Token not provided"
  }
}
```

ou

```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token"
  }
}
```

---

### Exemplo 5: Erro Genérico (500)

**Origem**: `src/controllers/community.controller.ts` (linha 27)

**Contexto**: Erro não tratado ao buscar categorias

**Código**:
```typescript
try {
  const categories = await prisma.communityCategory.findMany({...});
  res.json({...});
} catch (error: any) {
  logger.error('Error fetching categories', { error });
  res.status(500).json({
    success: false,
    error: { message: 'Erro ao buscar categorias' },
  });
}
```

**Response HTTP 500**:
```json
{
  "success": false,
  "error": {
    "message": "Erro ao buscar categorias"
  }
}
```

**Em desenvolvimento (se passar pelo errorHandler global)**:
```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "stack": "Error: ..."
  }
}
```

---

### Exemplo 6: NotFoundError (404) - Não Utilizado

**Classe definida mas não encontrada em uso no código auditado**.

**Definição**:
```typescript
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}
```

**Uso esperado**: Retornar 404 quando recurso não é encontrado, mas no código atual os controllers retornam 404 manualmente sem usar a classe.

**Exemplo de uso manual** (`src/controllers/community.controller.ts`, linha 200):
```typescript
if (!post) {
  return res.status(404).json({
    success: false,
    error: { message: 'Post não encontrado' },
  });
}
```

---

## LOGGING DE ERROS

### Logger Utilizado
- **Biblioteca**: Winston (`src/utils/logger.ts`)
- **Níveis**: `warn` para erros operacionais, `error` para erros não esperados

### Exemplos de Logs

**Validation Error**:
```typescript
logger.warn(`Validation error: ${err.message}`, { path: req.path });
```

**AppError**:
```typescript
logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode, path: req.path });
```

**Unexpected Error**:
```typescript
logger.error('Unexpected error', { error: err, stack: err.stack, path: req.path });
```

**Erro em Controller**:
```typescript
logger.error('Error fetching categories', { error });
```

---

## STATUS CODES UTILIZADOS

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação ou dados inválidos
- **401**: Não autenticado
- **403**: Sem permissão (classe definida mas não encontrada em uso)
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor
- **503**: Serviço não disponível (usado no `/health/ready`)

---

## OBSERVAÇÕES

1. **Inconsistência**: Alguns controllers retornam erros manualmente (`res.status(500).json(...)`) ao invés de usar classes de erro e o errorHandler
2. **NotFoundError não utilizado**: Classe existe mas controllers usam retorno manual
3. **AuthorizationError não utilizado**: Classe existe mas não encontrada em uso
4. **Erros genéricos**: Muitos controllers usam `catch (error: any)` e retornam mensagens genéricas em português
5. **Stack trace**: Apenas em desenvolvimento (`NODE_ENV === 'development'`)
