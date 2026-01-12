# ✅ Correção de Migration - Enum UserRole

## 📋 Análise da Situação

### Migration Atual: `20250109210000_add_mother_role`

**Status:** ✅ **JÁ ESTÁ CORRETA**

A migration atual contém **APENAS**:
```sql
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';
```

**Não contém:**
- ❌ `ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MOTHER'`
- ❌ `UPDATE` usando o valor `MOTHER`
- ❌ Qualquer uso do novo valor na mesma transação

---

## ✅ Validação do Schema Prisma

**Arquivo:** `prisma/schema.prisma`

**Enum UserRole:**
```prisma
enum UserRole {
  USER
  MOTHER
  PROFESSIONAL
  COMPANY
  ADMIN
  SUPER_ADMIN
}
```

**Default do campo role:**
```prisma
role UserRole @default(USER)
```

**Status:** ✅ **CONSISTENTE**
- Enum contém `MOTHER`
- Default permanece `USER` (não precisa alterar)

---

## 🔍 Verificação de Migrations

### Migration A (Atual): `20250109210000_add_mother_role`
**Conteúdo:**
```sql
-- AlterEnum
-- Migration A: Adiciona o valor MOTHER ao enum UserRole
-- IMPORTANTE: Esta migration APENAS adiciona o valor ao enum.
-- NÃO pode conter ALTER TABLE, UPDATE, ou qualquer uso do novo valor.
-- PostgreSQL requer que novos valores de enum sejam commitados antes de serem usados.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';
```

**Status:** ✅ **CORRETA** - Apenas adiciona o enum, sem usar

### Migration B: **NÃO NECESSÁRIA**
**Motivo:** O schema.prisma mantém `@default(USER)`, então não há necessidade de alterar o default para `MOTHER`.

Se no futuro precisar alterar o default:
```sql
-- Migration B (exemplo futuro, se necessário):
-- ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MOTHER';
```

---

## 📝 Arquivos de Migration

### Arquivos Criados/Alterados:

1. **`prisma/migrations/20250109210000_add_mother_role/migration.sql`**
   - ✅ Contém apenas `ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';`
   - ✅ Idempotente (usa `IF NOT EXISTS`)
   - ✅ Não usa o valor na mesma transação

---

## 🚀 Comandos para Executar

### Desenvolvimento Local

```bash
cd backend

# Verificar status das migrations
npx prisma migrate status

# Aplicar migrations (se houver pendentes)
npx prisma migrate deploy

# OU criar nova migration (se necessário)
npx prisma migrate dev
```

### Produção (Railway)

```bash
# O Railway executa automaticamente via prestart:
# node dist/scripts/resolveFailedMigration.js || true && prisma migrate deploy

# Ou manualmente via Railway CLI:
railway run npx prisma migrate deploy
```

---

## ✅ Por que a Migration Atual Resolve o Erro

### Problema Original:
```
ERROR: unsafe use of new value "MOTHER" of enum type "UserRole"
HINT: New enum values must be committed before they can be used.
```

### Solução Implementada:

1. **Migration A (Atual):**
   - ✅ Adiciona `MOTHER` ao enum
   - ✅ Usa `IF NOT EXISTS` para idempotência
   - ✅ **NÃO** tenta usar o valor na mesma transação
   - ✅ PostgreSQL commita o novo valor

2. **Separação de Responsabilidades:**
   - Migration A: Apenas adiciona o enum
   - Migration B: Não necessária (default permanece USER)

### Por que funciona:

PostgreSQL requer que novos valores de enum sejam commitados antes de serem usados. A migration atual:
- ✅ Adiciona o valor em uma transação
- ✅ Commita a transação
- ✅ Permite que migrations futuras usem o valor `MOTHER`

---

## 🔄 Idempotência

A migration usa `IF NOT EXISTS`, garantindo que:
- ✅ Pode ser executada múltiplas vezes sem erro
- ✅ Se `MOTHER` já existir, não tenta adicionar novamente
- ✅ Segura para reexecução em produção

---

## 📊 Status Final

| Item | Status | Observação |
|------|--------|------------|
| Migration A | ✅ Correta | Apenas adiciona enum |
| Migration B | ✅ Não necessária | Default permanece USER |
| Schema Prisma | ✅ Consistente | Enum contém MOTHER |
| Idempotência | ✅ Implementada | IF NOT EXISTS |
| Produção | ✅ Funcionando | Migration aplicada |

---

## 🎯 Conclusão

**A migration atual já está correta e segue as regras do PostgreSQL.**

- ✅ Enum adicionado em migration separada
- ✅ Nenhum uso do valor na mesma transação
- ✅ Idempotente e segura para produção
- ✅ Schema Prisma consistente

**Nenhuma alteração adicional necessária.**
