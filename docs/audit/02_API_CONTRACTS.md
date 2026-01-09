# CONTRATOS DE API - MATERNI LOVE V2

**Data:** 2025-01-03  
**Objetivo:** Documentação completa de todos os endpoints existentes

---

## VERSIONAMENTO

**Status**: **INCONSISTENTE**

- Endpoint `/api` retorna `version: '1.0.0'` mas as rotas **NÃO** usam prefixo `/api/v1`
- Todas as rotas usam apenas `/api/{resource}` sem versionamento
- **Risco**: Dificulta evolução futura da API sem breaking changes

---

## PADRÃO DE VALIDAÇÃO

### Bibliotecas Utilizadas
- **Zod**: Usado em `auth.validator.ts` para schemas de registro e login
- **express-validator**: Instalado mas **NÃO utilizado** no código auditado

### Validação Atual
- **Autenticação**: Usa Zod (`registerSchema`, `loginSchema`) no service `auth.service.ts`
- **Outras rotas**: Validação manual inline nos controllers (verificações `if (!field) return res.status(400)`)
- **NÃO há**: DTOs, class-validator, ou schemas Zod para outras rotas

### Padrão de Response

**Sucesso**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro**:
```json
{
  "success": false,
  "error": {
    "message": "Mensagem de erro"
  }
}
```

**Erro com stack (dev)**:
```json
{
  "success": false,
  "error": {
    "message": "Mensagem de erro",
    "stack": "..."
  }
}
```

---

## LISTA DE ENDPOINTS

### HEALTHCHECK

#### GET `/health`
- **Arquivo**: `src/server.ts` (linha 209)
- **Controller**: Handler inline
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Descrição**: Healthcheck legacy (testa conexão com banco)

**Response 200**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-03T...",
  "database": "connected"
}
```

**Response 500**:
```json
{
  "status": "error",
  "timestamp": "2025-01-03T...",
  "database": "disconnected"
}
```

---

#### GET `/health/live`
- **Arquivo**: `src/server.ts` (linha 172)
- **Controller**: Handler inline
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Descrição**: Liveness probe (Railway) - não toca banco

**Response 200**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-03T...",
  "service": "maternilove-backend"
}
```

---

#### GET `/health/ready`
- **Arquivo**: `src/server.ts` (linha 181)
- **Controller**: Handler inline
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Descrição**: Readiness probe (Railway) - testa banco com timeout de 1s

**Response 200**:
```json
{
  "status": "ready",
  "timestamp": "2025-01-03T...",
  "database": "connected"
}
```

**Response 503**:
```json
{
  "status": "not ready",
  "timestamp": "2025-01-03T...",
  "database": "disconnected"
}
```

---

#### GET `/api`
- **Arquivo**: `src/server.ts` (linha 236)
- **Controller**: Handler inline
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Descrição**: Informações da API

**Response 200**:
```json
{
  "message": "Materni Love API v1",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "social": "/api/social",
    "community": "/api/community",
    "marketplace": "/api/marketplace",
    "users": "/api/users"
  }
}
```

---

### AUTENTICAÇÃO (`/api/auth`)

**Arquivo de rotas**: `src/routes/auth.routes.ts`

#### POST `/api/auth/register`
- **Arquivo rota**: `src/routes/auth.routes.ts` (linha 7)
- **Controller**: `auth.controller.register` (`src/controllers/auth.controller.ts`, linha 5)
- **Service**: `auth.service.register` (`src/services/auth.service.ts`, linha 7)
- **Middleware**: `authLimiter` (rate limit: 5 req/15min)
- **Validação**: Zod schema `registerSchema` (email, password min 6, name min 2)
- **Autenticação**: Não requerida

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "Nome do Usuário",
      "role": "USER",
      "createdAt": "..."
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

**Errors**: 
- 400: Validação Zod falhou
- 400: Usuário já existe (ValidationError)
- 500: Erro interno

---

#### POST `/api/auth/login`
- **Arquivo rota**: `src/routes/auth.routes.ts` (linha 8)
- **Controller**: `auth.controller.login` (`src/controllers/auth.controller.ts`, linha 23)
- **Service**: `auth.service.login` (`src/services/auth.service.ts`, linha 58)
- **Middleware**: `authLimiter` (rate limit: 5 req/15min)
- **Validação**: Zod schema `loginSchema` (email, password)
- **Autenticação**: Não requerida

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "Nome do Usuário",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

**Errors**: 
- 400: Validação Zod falhou
- 401: Email ou senha inválidos (AuthenticationError)
- 500: Erro interno

---

### SOCIAL (`/api/social`)

**Arquivo de rotas**: `src/routes/social.routes.ts`

#### GET `/api/social/feed`
- **Arquivo rota**: `src/routes/social.routes.ts` (linha 8)
- **Controller**: `social.controller.getFeed` (`src/controllers/social.controller.ts`, linha 7)
- **Service**: Nenhum (acesso direto ao Prisma)
- **Autenticação**: Não requerida (mas usa `userId` se presente no token)
- **Query Params**: `page` (default: 1), `limit` (default: 10)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "...",
        "content": "...",
        "images": [],
        "likes": 0,
        "views": 0,
        "createdAt": "...",
        "user": { "id": "...", "name": "...", "avatar": null },
        "isLiked": false,
        "likesCount": 0,
        "commentsCount": 0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

#### POST `/api/social/posts`
- **Arquivo rota**: `src/routes/social.routes.ts` (linha 12)
- **Controller**: `social.controller.createPost` (`src/controllers/social.controller.ts`, linha 75)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)
- **Validação**: Manual (verifica se `content` existe e não está vazio)

**Request Body**:
```json
{
  "content": "Conteúdo do post",
  "images": ["url1", "url2"]
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "userId": "...",
    "content": "Conteúdo do post",
    "images": ["url1", "url2"],
    "likes": 0,
    "views": 0,
    "createdAt": "...",
    "user": { "id": "...", "name": "...", "avatar": null }
  }
}
```

**Errors**: 
- 400: Conteúdo obrigatório
- 401: Não autenticado
- 500: Erro interno

---

#### POST `/api/social/posts/:id/like`
- **Arquivo rota**: `src/routes/social.routes.ts` (linha 13)
- **Controller**: `social.controller.toggleLike` (`src/controllers/social.controller.ts`, linha 126)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```

ou

```json
{
  "success": true,
  "data": {
    "liked": false
  }
}
```

**Errors**: 
- 401: Não autenticado
- 500: Erro interno

---

#### POST `/api/social/posts/:id/comments`
- **Arquivo rota**: `src/routes/social.routes.ts` (linha 14)
- **Controller**: `social.controller.createComment` (`src/controllers/social.controller.ts`, linha 195)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)
- **Validação**: Manual (verifica se `text` existe e não está vazio)

**Request Body**:
```json
{
  "text": "Comentário"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "postId": "...",
    "userId": "...",
    "text": "Comentário",
    "createdAt": "...",
    "user": { "id": "...", "name": "...", "avatar": null }
  }
}
```

**Errors**: 
- 400: Texto obrigatório
- 401: Não autenticado
- 500: Erro interno

---

#### GET `/api/social/posts/:id/comments`
- **Arquivo rota**: `src/routes/social.routes.ts` (linha 9)
- **Controller**: `social.controller.getComments` (`src/controllers/social.controller.ts`, linha 246)
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Query Params**: `page` (default: 1), `limit` (default: 20)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "comments": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### COMUNIDADE (`/api/community`)

**Arquivo de rotas**: `src/routes/community.routes.ts`

#### GET `/api/community/categories`
- **Arquivo rota**: `src/routes/community.routes.ts` (linha 8)
- **Controller**: `community.controller.getCategories` (`src/controllers/community.controller.ts`, linha 7)
- **Service**: Nenhum
- **Autenticação**: Não requerida

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "...",
      "description": "...",
      "icon": "...",
      "postsCount": 10
    }
  ]
}
```

---

#### GET `/api/community/posts`
- **Arquivo rota**: `src/routes/community.routes.ts` (linha 9)
- **Controller**: `community.controller.getPosts` (`src/controllers/community.controller.ts`, linha 37)
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Query Params**: `categoryId` (opcional), `page` (default: 1), `limit` (default: 10)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "...",
        "title": "...",
        "content": "...",
        "views": 0,
        "createdAt": "...",
        "user": { "id": "...", "name": "...", "avatar": null },
        "category": { "id": "...", "name": "...", "icon": "..." },
        "commentsCount": 5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

#### GET `/api/community/posts/:id`
- **Arquivo rota**: `src/routes/community.routes.ts` (linha 10)
- **Controller**: `community.controller.getPost` (`src/controllers/community.controller.ts`, linha 162)
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Side Effect**: Incrementa `views` do post

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "content": "...",
    "views": 11,
    "createdAt": "...",
    "user": { "id": "...", "name": "...", "avatar": null, "bio": "..." },
    "category": { "id": "...", "name": "...", "icon": "..." },
    "comments": [...],
    "commentsCount": 5
  }
}
```

**Errors**: 
- 404: Post não encontrado
- 500: Erro interno

---

#### POST `/api/community/posts`
- **Arquivo rota**: `src/routes/community.routes.ts` (linha 13)
- **Controller**: `community.controller.createPost` (`src/controllers/community.controller.ts`, linha 104)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)
- **Validação**: Manual (verifica `categoryId`, `title`, `content`)

**Request Body**:
```json
{
  "categoryId": "...",
  "title": "Título do post",
  "content": "Conteúdo do post"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "userId": "...",
    "categoryId": "...",
    "title": "Título do post",
    "content": "Conteúdo do post",
    "views": 0,
    "createdAt": "...",
    "user": { "id": "...", "name": "...", "avatar": null },
    "category": { "id": "...", "name": "...", "icon": "..." }
  }
}
```

**Errors**: 
- 400: Categoria, título e conteúdo são obrigatórios
- 401: Não autenticado
- 500: Erro interno

---

#### POST `/api/community/posts/:id/comments`
- **Arquivo rota**: `src/routes/community.routes.ts` (linha 14)
- **Controller**: `community.controller.createComment` (`src/controllers/community.controller.ts`, linha 230)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)
- **Validação**: Manual (verifica se `text` existe e não está vazio)

**Request Body**:
```json
{
  "text": "Comentário"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "postId": "...",
    "userId": "...",
    "text": "Comentário",
    "createdAt": "...",
    "user": { "id": "...", "name": "...", "avatar": null }
  }
}
```

**Errors**: 
- 400: Texto do comentário é obrigatório
- 401: Não autenticado
- 500: Erro interno

---

### MARKETPLACE (`/api/marketplace`)

**Arquivo de rotas**: `src/routes/marketplace.routes.ts`

#### GET `/api/marketplace/products`
- **Arquivo rota**: `src/routes/marketplace.routes.ts` (linha 8)
- **Controller**: `marketplace.controller.getProducts` (`src/controllers/marketplace.controller.ts`, linha 7)
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Query Params**: `search` (opcional), `page` (default: 1), `limit` (default: 12)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "...",
        "name": "...",
        "description": "...",
        "price": 99.99,
        "image": null,
        "stock": 10,
        "createdAt": "...",
        "company": { "id": "...", "name": "...", "logo": null, "verified": false },
        "rating": 4.5,
        "reviewsCount": 20
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "totalPages": 9
    }
  }
}
```

---

#### GET `/api/marketplace/products/:id`
- **Arquivo rota**: `src/routes/marketplace.routes.ts` (linha 9)
- **Controller**: `marketplace.controller.getProduct` (`src/controllers/marketplace.controller.ts`, linha 89)
- **Service**: Nenhum
- **Autenticação**: Não requerida

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "description": "...",
    "price": 99.99,
    "image": null,
    "stock": 10,
    "createdAt": "...",
    "company": { "id": "...", "name": "...", "logo": null, "verified": false, "description": "..." },
    "reviews": [...],
    "rating": 4.5,
    "reviewsCount": 10
  }
}
```

**Errors**: 
- 404: Produto não encontrado
- 500: Erro interno

---

#### POST `/api/marketplace/products/:id/reviews`
- **Arquivo rota**: `src/routes/marketplace.routes.ts` (linha 12)
- **Controller**: `marketplace.controller.createReview` (`src/controllers/marketplace.controller.ts`, linha 151)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)
- **Validação**: Manual (verifica `rating` entre 1 e 5)

**Request Body**:
```json
{
  "rating": 5,
  "text": "Ótimo produto!"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "userId": "...",
    "productId": "...",
    "rating": 5,
    "text": "Ótimo produto!",
    "createdAt": "...",
    "user": { "id": "...", "name": "...", "avatar": null }
  }
}
```

**Errors**: 
- 400: Rating deve ser entre 1 e 5
- 401: Não autenticado
- 500: Erro interno

---

#### GET `/api/marketplace/orders`
- **Arquivo rota**: `src/routes/marketplace.routes.ts` (linha 13)
- **Controller**: `marketplace.controller.getOrders` (`src/controllers/marketplace.controller.ts`, linha 203)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "userId": "...",
      "total": 199.98,
      "status": "pending",
      "createdAt": "...",
      "items": [
        {
          "id": "...",
          "productId": "...",
          "quantity": 2,
          "price": 99.99,
          "product": { "id": "...", "name": "...", "image": null, "price": 99.99 }
        }
      ]
    }
  ]
}
```

**Errors**: 
- 401: Não autenticado
- 500: Erro interno

---

#### POST `/api/marketplace/orders`
- **Arquivo rota**: `src/routes/marketplace.routes.ts` (linha 14)
- **Controller**: `marketplace.controller.createOrder` (`src/controllers/marketplace.controller.ts`, linha 246)
- **Service**: Nenhum
- **Middleware**: `authenticate` (JWT obrigatório)
- **Validação**: Manual (verifica se `items` é array não vazio, valida produtos e estoque)

**Request Body**:
```json
{
  "items": [
    {
      "productId": "...",
      "quantity": 2
    }
  ]
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "userId": "...",
    "total": 199.98,
    "status": "pending",
    "createdAt": "...",
    "items": [...]
  }
}
```

**Errors**: 
- 400: Items são obrigatórios
- 400: Produto não encontrado
- 400: Estoque insuficiente
- 401: Não autenticado
- 500: Erro interno

---

### PLACEHOLDER

#### GET `/api/users`
- **Arquivo**: `src/server.ts` (linha 264)
- **Controller**: Handler inline
- **Service**: Nenhum
- **Autenticação**: Não requerida
- **Status**: Placeholder (retorna apenas mensagem)

**Response 200**:
```json
{
  "message": "Users endpoint"
}
```

---

## RESUMO

### Estatísticas
- **Total de endpoints**: 20
- **Endpoints públicos**: 12
- **Endpoints protegidos**: 8
- **Rotas com validação Zod**: 2 (register, login)
- **Rotas com validação manual**: Restantes

### Observações Críticas
1. **Versionamento ausente**: Rotas não usam `/api/v1` apesar do endpoint `/api` retornar `version: '1.0.0'`
2. **Validação inconsistente**: Apenas auth usa Zod; outras rotas fazem validação manual
3. **Sem DTOs**: Não há classes/interfaces dedicadas para request/response
4. **Placeholder ativo**: `/api/users` existe mas não tem implementação real
