# 🔧 SOLUÇÃO: Migration Falha no Railway

## Problema
A migration `20250109210000_add_mother_role` falhou porque tentava adicionar valor ao enum e alterar default na mesma transação (PostgreSQL não permite).

## ✅ Correção Aplicada
- Migration corrigida (removido ALTER DEFAULT)
- Apenas adiciona `MOTHER` ao enum
- Commit e push realizados

## ⚠️ Ação Necessária no Railway

A migration ainda está marcada como "failed" no banco. Precisamos resolvê-la.

### Opção 1: Resolver via Prisma CLI (Recomendado)

Se você tem acesso ao banco de dados do Railway:

```bash
# 1. Obter DATABASE_URL do Railway
# Railway → PostgreSQL → Variables → DATABASE_URL

# 2. Configurar localmente
export DATABASE_URL="postgresql://..."

# 3. Marcar migration como resolvida
cd backend
npx prisma migrate resolve --applied 20250109210000_add_mother_role

# 4. Aplicar migrations novamente
npx prisma migrate deploy
```

### Opção 2: Via SQL Direto no Railway

1. Acesse Railway → PostgreSQL → Query
2. Execute:
```sql
-- Marcar migration como aplicada manualmente
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count)
VALUES (
  gen_random_uuid(),
  '',
  NOW(),
  '20250109210000_add_mother_role',
  NULL,
  NOW(),
  1
)
ON CONFLICT DO NOTHING;

-- Adicionar MOTHER ao enum (se ainda não foi adicionado)
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';
```

### Opção 3: Renomear Migration (Último Recurso)

Se as opções acima não funcionarem:

1. Remover a migration falha do código
2. Criar nova migration com nome diferente
3. Aplicar no Railway

## 📝 Status Atual

- ✅ Migration SQL corrigida
- ✅ Commit e push realizados
- ⚠️ Migration ainda marcada como "failed" no banco
- 🔄 Próximo deploy tentará aplicar novamente (mas pode falhar se não resolver)

## 🎯 Recomendação

Use a **Opção 1** (Prisma CLI) se possível. É a forma mais segura e limpa.
