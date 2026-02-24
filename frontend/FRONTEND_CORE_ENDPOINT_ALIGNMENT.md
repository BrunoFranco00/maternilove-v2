# Frontend Core Endpoint Alignment

## Resumo

Alinhamento dos endpoints e DTOs do módulo Core Emocional com o backend real implementado em `/api/v1/checkin`.

## Mudança de Endpoints

| Antes | Depois |
|-------|--------|
| `CORE.CHECK_IN`: `/core/check-in` | `CORE.CHECK_IN`: `/checkin` |
| `CORE.RELIEF(id)`: `/core/relief/${id}` | Removido (sem backend equivalente) |
| — | `CORE.CHECKIN_LATEST`: `/checkin/latest` |
| — | `CORE.CHECKIN_HISTORY`: `/checkin` |

## Mudança de DTO

### CheckInRequestDto

**Antes:**
```typescript
{
  emotions: string[];
  notes?: string;
  mood?: string;
}
```

**Depois (compatível com backend):**
```typescript
{
  mood: MoodType;  // 'HAPPY' | 'CALM' | 'TIRED' | 'ANXIOUS' | 'SAD' | 'OVERWHELMED'
  note?: string;
}
```

### CheckInResponseDto

**Antes:**
```typescript
{
  id: string;
  userId: string;
  emotions: string[];
  notes?: string;
  mood?: string;
  createdAt: string;
}
```

**Depois (compatível com backend):**
```typescript
{
  id: string;
  userId: string;
  mood: MoodType;
  note?: string;
  createdAt: string;
}
```

## Compatibilidade com Backend

| Endpoint Backend | Endpoint Frontend | Método Store |
|------------------|------------------|--------------|
| `POST /api/v1/checkin` | `CORE.CHECK_IN` | `checkIn(data)` |
| `GET /api/v1/checkin/latest` | `CORE.CHECKIN_LATEST` | `getLatestCheckIn()` |
| `GET /api/v1/checkin` | `CORE.CHECKIN_HISTORY` | `getCheckInHistory()` |

Body do POST alinhado:
```json
{
  "mood": "HAPPY",
  "note": "opcional"
}
```

## Métodos Adicionados no core.store

- **`getLatestCheckIn()`** — retorna o último checkin do usuário ou `null`
- **`getCheckInHistory()`** — retorna array de checkins (histórico, limitado a 50 no backend)

## Métodos Removidos

- **`getRelief(id)`** — removido (endpoint `/core/relief/:id` sem backend equivalente)
