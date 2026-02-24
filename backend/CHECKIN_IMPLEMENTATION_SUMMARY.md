# Emotional Checkin - Resumo da Implementação

## Arquivos Criados

```
src/modules/checkin/
  controllers/
    checkin.controller.ts
  services/
    checkin.service.ts
  repositories/
    checkin.repository.ts
  validators/
    checkin.validators.ts
  routes.ts
```

## Estrutura do Módulo

O módulo segue o padrão modular existente (journey/onboarding):

| Camada | Responsabilidade |
|--------|-------------------|
| **routes.ts** | Monta o router Express, aplica middlewares (authenticate, validateBody), inicializa repository → service → controller |
| **controller** | Extrai userId de req.user, chama service, retorna ok()/created() |
| **service** | Regras de negócio, delega persistência ao repository |
| **repository** | Acesso ao banco via Prisma, select explícito |
| **validators** | Schemas Zod para validação de body |

## Endpoints

Base path: `/api/v1/checkin` (ou `/api/checkin` para legacy)

| Método | Path | Middlewares | Descrição |
|--------|------|--------------|-----------|
| POST | `/` | authenticate, validateBody | Criar novo emotional checkin |
| GET | `/latest` | authenticate | Retornar último checkin (ou null) |
| GET | `/` | authenticate | Retornar histórico (últimos 50) |

**Importante:** A rota GET `/latest` deve vir antes de GET `/` para que "latest" não seja interpretado como parâmetro.

## Exemplos cURL com JWT

Assumindo que você obteve um token via login (`POST /api/v1/auth/login`):

```bash
# Variável com o token (substituir pelo token real)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Criar checkin
curl -X POST http://localhost:3000/api/v1/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"mood":"HAPPY","note":"Dia ótimo!"}'

# Buscar último checkin
curl -X GET http://localhost:3000/api/v1/checkin/latest \
  -H "Authorization: Bearer $TOKEN"

# Buscar histórico
curl -X GET http://localhost:3000/api/v1/checkin \
  -H "Authorization: Bearer $TOKEN"
```

### Exemplo de resposta criada (201)

```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "userId": "cly...",
    "mood": "HAPPY",
    "note": "Dia ótimo!",
    "createdAt": "2026-01-26T12:00:00.000Z"
  },
  "requestId": "uuid-..."
}
```

### Exemplo de resposta GET /latest (200) - sem checkin

```json
{
  "success": true,
  "data": null,
  "requestId": "uuid-..."
}
```

### Exemplo de resposta GET / (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "userId": "cly...",
      "mood": "HAPPY",
      "note": "Dia ótimo!",
      "createdAt": "2026-01-26T12:00:00.000Z"
    }
  ],
  "requestId": "uuid-..."
}
```

## Migration Criada

- **Nome:** `add_emotional_checkin_module`
- **Caminho:** `prisma/migrations/20260126120000_add_emotional_checkin_module/migration.sql`
- **Alterações:**
  - Criação do enum `MoodType`
  - Criação da tabela `EmotionalCheckin`
  - Índices em `userId` e `createdAt`
  - FK para `User` com `onDelete: Cascade`

## Validação Zod

**createCheckinBodySchema:**
- `mood`: enum obrigatório (`HAPPY`, `CALM`, `TIRED`, `ANXIOUS`, `SAD`, `OVERWHELMED`)
- `note`: string opcional, máx. 500 caracteres

## Configuração no server.ts

Rotas registradas em:
- `app.use('/api/v1/checkin', checkinRoutes);`
- `app.use('/api/checkin', checkinRoutes);` (legacy)
