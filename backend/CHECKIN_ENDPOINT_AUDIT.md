# Auditoria - Endpoint de Check-in Emocional

**Data:** 2025  
**Objetivo:** Identificar se existe endpoint para salvar check-in emocional  

---

## 1. Arquivos de Rotas no Backend

| Arquivo | Módulo | Montagem no Server |
|---------|--------|--------------------|
| `src/modules/auth/routes.ts` | Auth | `/api/v1/auth`, `/api/auth` |
| `src/modules/onboarding/routes.ts` | Onboarding | `/api/v1/onboarding` |
| `src/modules/social/routes.ts` | Social | `/api/v1/social`, `/api/social` |
| `src/modules/community/routes.ts` | Community | `/api/v1/community`, `/api/community` |
| `src/modules/marketplace/routes.ts` | Marketplace | `/api/v1/marketplace`, `/api/marketplace` |
| `src/modules/journey/routes.ts` | Journey | `/api/v1/journey`, `/api/journey` |
| `src/routes/admin.routes.ts` | Admin | `/api/v1/admin` |

**Nota:** Os arquivos em `src/routes/` (auth.routes.ts, marketplace.routes.ts, etc.) existem mas **não são utilizados** pelo server.ts. O server monta rotas dos **modules** em `src/modules/*/routes.ts`.

---

## 2. Rotas Completas por Módulo

### Auth (`/api/v1/auth` ou `/api/auth`)

| Método | Path Completo | Controller |
|--------|---------------|------------|
| POST | `/api/v1/auth/register` | AuthController.register |
| POST | `/api/v1/auth/login` | AuthController.login |
| POST | `/api/v1/auth/refresh` | AuthController.refreshToken |
| POST | `/api/v1/auth/logout` | AuthController.logout |

### Onboarding (`/api/v1/onboarding`)

| Método | Path Completo | Controller |
|--------|---------------|------------|
| POST | `/api/v1/onboarding/complete` | OnboardingController.complete |

### Social (`/api/v1/social` ou `/api/social`)

| Método | Path Completo | Controller |
|--------|---------------|------------|
| GET | `/api/v1/social/feed` | SocialController.getFeed |
| GET | `/api/v1/social/posts/:id/comments` | SocialController.getComments |
| POST | `/api/v1/social/posts` | SocialController.createPost |
| POST | `/api/v1/social/posts/:id/like` | SocialController.toggleLike |
| POST | `/api/v1/social/posts/:id/comments` | SocialController.createComment |

### Community (`/api/v1/community` ou `/api/community`)

| Método | Path Completo | Controller |
|--------|---------------|------------|
| GET | `/api/v1/community/categories` | CommunityController.getCategories |
| GET | `/api/v1/community/posts` | CommunityController.getPosts |
| GET | `/api/v1/community/posts/:id` | CommunityController.getPost |
| POST | `/api/v1/community/posts` | CommunityController.createPost |
| POST | `/api/v1/community/posts/:id/comments` | CommunityController.createComment |

### Marketplace (`/api/v1/marketplace` ou `/api/marketplace`)

| Método | Path Completo | Controller |
|--------|---------------|------------|
| GET | `/api/v1/marketplace/products` | MarketplaceController.getProducts |
| GET | `/api/v1/marketplace/products/:id` | MarketplaceController.getProduct |
| POST | `/api/v1/marketplace/products/:id/reviews` | MarketplaceController.createReview |
| GET | `/api/v1/marketplace/orders` | MarketplaceController.getOrders |
| POST | `/api/v1/marketplace/orders` | MarketplaceController.createOrder |

### Journey (`/api/v1/journey` ou `/api/journey`)

| Método | Path Completo | Controller |
|--------|---------------|------------|
| POST | `/api/v1/journey` | JourneyController.createJourney |
| GET | `/api/v1/journey` | JourneyController.getJourneys |

### Admin (`/api/v1/admin`)

| Método | Path Completo | Controller |
|--------|---------------|------------|
| GET | `/api/v1/admin/users` | adminController.listUsers |
| PATCH | `/api/v1/admin/users/:id/role` | adminController.updateUserRole |

### Health (root)

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/health/live` | Liveness probe |
| GET | `/health/ready` | Readiness probe |
| GET | `/health` | Health legacy |
| GET | `/api` | API info |
| GET | `/api/v1/users` | Placeholder |
| GET | `/api/v1/admin/example` | Exemplo RBAC |

---

## 3. Verificação Específica: Check-in / Mood / Emotional / Diary

| Tipo | POST existe? | Path | Controller |
|------|--------------|------|------------|
| **checkin** | **NÃO** | - | - |
| **check-in** | **NÃO** | - | - |
| **mood** | **NÃO** | - | - |
| **emotional** | **NÃO** | - | - |
| **diary** | **NÃO** | - | - |
| **feeling** | **NÃO** | - | - |

**Busca realizada:** Grep por `checkin`, `check-in`, `mood`, `emotional`, `diary`, `feeling` em todo o backend. Nenhuma rota ou controller encontrado.

---

## 4. Modelos Prisma Relacionados

O schema Prisma possui o model **Moment** (prisma/schema.prisma L159-180):

```prisma
model Moment {
  id          String   @id @default(cuid())
  userId      String
  journeyId   String
  title       String
  description String?
  images      String[] @default([])
  videos      String[] @default([])
  mood        String?   // <-- campo mood existe
  weight      Float?
  notes       String?
  ...
}
```

**Observação:** O model `Moment` tem campo `mood`, mas **não existe nenhum controller, service ou rota** que crie ou atualize Moment. A tabela existe no banco, porém sem API exposta.

---

## 5. Controllers que Salvam Dados

| Controller | Dados Salvos | Relação com check-in |
|------------|-------------|----------------------|
| AuthController | User, tokens | Não |
| OnboardingController | onboardingCompleted | Não |
| SocialController | SocialPost, likes, comments | Não |
| CommunityController | CommunityPost, comments | Não |
| MarketplaceController | Order, Review | Não |
| JourneyController | Journey (type, startDate, expectedDate) | **Não** – Journey é "jornada" (gravidez, pós-parto), não check-in emocional |
| adminController | User.role | Não |

**Nenhum controller** salva dados de mood, check-in, feeling ou emotional state.

---

## 6. Conclusão

### Endpoint de check-in existe: **NÃO**

- Não existe POST para `/checkin`, `/check-in`, `/mood`, `/emotional`, `/diary` ou `/feeling`.
- O model `Moment` no Prisma tem campo `mood`, mas **não há API** para criar ou atualizar Moment.
- O módulo Journey trata de "jornada" (gravidez, pós-parto, etapas do bebê), não de registro emocional diário.

### Recomendação

Para suportar o check-in emocional do frontend (`/check-in`), será necessário criar:

1. Rotas em um novo módulo (ex: `checkin` ou `mood`) ou estender o módulo existente.
2. Controller e Service para persistir o registro emocional.
3. Validador para o body da requisição.
4. Opcional: modelo Prisma dedicado (ex: `EmotionalCheckin`) ou uso do model `Moment` existente com endpoints adequados.

---

*Relatório gerado por auditoria. Nenhum código foi modificado.*
