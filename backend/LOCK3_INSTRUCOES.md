# 🔐 LOCK 3 - Instruções de Implementação

## Status Atual

✅ Modelo AuthSession adicionado ao schema Prisma  
✅ Estrutura modular auth criada  
✅ Validators, Repository, Service e Controller implementados  
✅ Endpoints refresh e logout criados  
✅ Códigos de erro adicionados  

## ⚠️ PRÓXIMOS PASSOS OBRIGATÓRIOS

### 1. Gerar Prisma Client
```bash
cd backend
npx prisma generate
```

### 2. Criar Migration
```bash
cd backend
npx prisma migrate dev --name add_auth_session
```

### 3. Verificar Build
```bash
cd backend
npm run build
```

### 4. Aplicar Migration em Produção (Railway)
A migration será aplicada automaticamente via `prisma migrate deploy` no prestart do Railway.

---

## 📋 Resumo das Mudanças

### Schema Prisma
- ✅ Modelo `AuthSession` adicionado
- ✅ Relação com `User` configurada
- ✅ Índices criados para performance

### Estrutura Modular Auth
```
src/modules/auth/
├── validators/auth.validators.ts
├── repositories/auth.repository.ts
├── services/auth.service.ts
├── controllers/auth.controller.ts
└── routes.ts
```

### Novos Endpoints
- `POST /api/v1/auth/refresh` - Refresh token com rotação
- `POST /api/v1/auth/logout` - Logout com revogação de sessão

### Funcionalidades
- ✅ Refresh token com rotação (nova sessão criada, antiga revogada)
- ✅ Logout revoga sessão no banco
- ✅ Login/Register criam sessões
- ✅ Sessões armazenam userAgent e ipAddress
- ✅ Validação de sessão expirada/revogada

---

## 🔄 Fluxo de Autenticação

### Login/Register
1. Usuário faz login/register
2. Sistema cria sessão no banco
3. Gera access token (15min) e refresh token (30 dias) com sessionId
4. Retorna tokens ao cliente

### Refresh Token
1. Cliente envia refresh token
2. Sistema valida token JWT
3. Busca sessão no banco pelo hash do token
4. Verifica se sessão está ativa (não revogada, não expirada)
5. Cria nova sessão (rotação)
6. Gera novos tokens (access + refresh)
7. Revoga sessão antiga
8. Retorna novos tokens

### Logout
1. Cliente envia refresh token
2. Sistema valida token JWT
3. Busca sessão no banco
4. Marca sessão como revogada (revokedAt = now)

---

## ⚙️ Configurações

### JWT Config
- Access Token: 15 minutos
- Refresh Token: 30 dias
- Refresh Token inclui `sessionId` no payload

### Session Storage
- Hash SHA256 do refresh token armazenado
- Expiração: 30 dias
- Campos: userAgent, ipAddress (opcional)

---

## 🚀 Deploy

Após executar os passos acima, fazer commit e push:

```bash
git add backend/prisma/schema.prisma backend/src/modules/auth/ backend/src/config/jwt.ts backend/src/utils/jwt.ts backend/src/shared/errors/ErrorCatalog.ts backend/src/server.ts
git commit -m "feat(auth): implementar LOCK 3 - refresh token, logout e gerenciamento de sessão"
git push origin master
```

O Railway irá:
1. Detectar push
2. Rodar `npm install` (gera Prisma Client)
3. Rodar `npm run build`
4. Rodar `prisma migrate deploy` (aplica migration)
5. Iniciar servidor
