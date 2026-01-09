# ÁRVORE DO REPOSITÓRIO - MATERNI LOVE V2

**Data:** 2025-01-03  
**Objetivo:** Snapshot completo da estrutura do repositório para auditoria

---

## ÁRVORE COMPLETA DO REPOSITÓRIO (Nível 4)

```
maternilove-v2/
├── backend/
│   ├── dist/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.js
│   ├── logs/
│   ├── node_modules/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   └── 20260103225947_init/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   └── prisma.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── community.controller.ts
│   │   │   ├── marketplace.controller.ts
│   │   │   └── social.controller.ts
│   │   ├── errors/
│   │   ├── middleware/
│   │   │   ├── auth/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error/
│   │   │   ├── errorHandler.middleware.ts
│   │   │   ├── rateLimit/
│   │   │   ├── rateLimiter.middleware.ts
│   │   │   └── validator/
│   │   ├── repositories/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── community.routes.ts
│   │   │   ├── marketplace.routes.ts
│   │   │   └── social.routes.ts
│   │   ├── server.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── types/
│   │   ├── utils/
│   │   │   ├── errors.ts
│   │   │   ├── jwt.ts
│   │   │   └── logger.ts
│   │   └── validators/
│   │       └── auth.validator.ts
│   ├── tests/
│   │   ├── e2e/
│   │   ├── integration/
│   │   └── unit/
│   ├── jest.config.js
│   ├── package.json
│   ├── package.json.backup
│   ├── Procfile
│   ├── railway.json
│   └── tsconfig.json
├── docs/
│   └── audit/
├── frontend/
│   ├── dist/
│   │   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── index.html
│   ├── node_modules/
│   ├── public/
│   │   ├── icons/
│   │   └── images/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   └── images/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   │   └── PWAInstallButton.tsx
│   │   │   ├── community/
│   │   │   ├── error/
│   │   │   ├── forms/
│   │   │   ├── Layout/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Header.tsx
│   │   │   ├── marketplace/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ui/
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── errors/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Community.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Feed.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   └── Register.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── package.json.backup
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── test.txt
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   └── vite.config.ts
└── [vários arquivos .md na raiz]
```

---

## ÁRVORE DETALHADA DO BACKEND (Nível 6)

```
backend/
├── dist/
│   └── [arquivos compilados .js e .d.ts]
├── logs/
│   └── [arquivos de log se existirem]
├── prisma/
│   ├── migrations/
│   │   ├── 20260103225947_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── database.ts (DEPRECATED - redireciona para prisma.ts)
│   │   ├── jwt.ts (configuração JWT)
│   │   └── prisma.ts (PrismaClient singleton)
│   ├── controllers/
│   │   ├── auth.controller.ts (register, login)
│   │   ├── community.controller.ts (categories, posts, comments)
│   │   ├── marketplace.controller.ts (products, orders, reviews)
│   │   └── social.controller.ts (feed, posts, likes, comments)
│   ├── errors/
│   │   └── [vazio ou não explorado]
│   ├── middleware/
│   │   ├── auth/
│   │   │   └── [vazio ou não explorado]
│   │   ├── auth.middleware.ts (authenticate, authorize)
│   │   ├── error/
│   │   │   └── [vazio ou não explorado]
│   │   ├── errorHandler.middleware.ts (error handler global)
│   │   ├── rateLimit/
│   │   │   └── [vazio ou não explorado]
│   │   ├── rateLimiter.middleware.ts (generalLimiter, authLimiter)
│   │   └── validator/
│   │       └── [vazio ou não explorado]
│   ├── repositories/
│   │   └── [vazio ou não explorado]
│   ├── routes/
│   │   ├── auth.routes.ts (POST /register, POST /login)
│   │   ├── community.routes.ts (GET /categories, GET /posts, POST /posts, etc)
│   │   ├── marketplace.routes.ts (GET /products, POST /orders, etc)
│   │   └── social.routes.ts (GET /feed, POST /posts, POST /like, etc)
│   ├── server.ts (ponto de entrada - Express app)
│   ├── services/
│   │   └── auth.service.ts (lógica de registro/login)
│   ├── types/
│   │   └── [vazio ou não explorado]
│   ├── utils/
│   │   ├── errors.ts (AppError, ValidationError, AuthenticationError, etc)
│   │   ├── jwt.ts (generateAccessToken, verifyAccessToken, etc)
│   │   └── logger.ts (Winston logger config)
│   └── validators/
│       └── auth.validator.ts (Zod schemas: registerSchema, loginSchema)
├── tests/
│   ├── e2e/
│   │   └── [vazio ou não explorado]
│   ├── integration/
│   │   └── [vazio ou não explorado]
│   └── unit/
│       └── [vazio ou não explorado]
├── jest.config.js
├── package.json
├── package.json.backup
├── Procfile
├── railway.json
└── tsconfig.json
```

---

## ÁRVORE DETALHADA DO FRONTEND (Nível 4)

```
frontend/
├── dist/
│   ├── assets/
│   │   ├── index-BBJookNv.js
│   │   └── index-kwR9DVTD.css
│   ├── icons/
│   ├── images/
│   └── index.html
├── public/
│   ├── icons/
│   └── images/
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── admin/
│   │   │   └── [vazio ou não explorado]
│   │   ├── common/
│   │   │   └── PWAInstallButton.tsx
│   │   ├── community/
│   │   │   └── [vazio ou não explorado]
│   │   ├── error/
│   │   │   └── [vazio ou não explorado]
│   │   ├── forms/
│   │   │   └── [vazio ou não explorado]
│   │   ├── Layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   ├── marketplace/
│   │   │   └── [vazio ou não explorado]
│   │   ├── ProtectedRoute.tsx
│   │   └── ui/
│   │       └── [vazio ou não explorado]
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── errors/
│   │   └── [vazio ou não explorado]
│   ├── hooks/
│   │   └── [vazio ou não explorado]
│   ├── pages/
│   │   ├── Community.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Feed.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Marketplace.tsx
│   │   └── Register.tsx
│   ├── services/
│   │   └── api.ts (cliente HTTP)
│   ├── stores/
│   │   └── [vazio ou não explorado]
│   ├── styles/
│   │   └── [vazio ou não explorado]
│   ├── types/
│   │   └── [vazio ou não explorado]
│   ├── utils/
│   │   └── [vazio ou não explorado]
│   ├── validators/
│   │   └── [vazio ou não explorado]
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── package.json.backup
├── postcss.config.js
├── tailwind.config.js
├── test.txt
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

---

## OBSERVAÇÕES

- **Backend**: Estrutura MVC clara com controllers, services, routes e middleware separados
- **Frontend**: Estrutura React com páginas, componentes e contextos
- **Pastas vazias**: Várias pastas existem mas estão vazias (errors/, hooks/, stores/, etc) - provavelmente preparadas para futuras implementações
- **Arquivos de configuração**: TypeScript, Jest, Tailwind, Vite, Prisma configurados
