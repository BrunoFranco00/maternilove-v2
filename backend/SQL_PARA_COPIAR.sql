-- ============================================
-- SQL para Resolver Migration Travada
-- Execute este SQL no DBeaver ou Postico
-- ============================================

-- 1. Adicionar MOTHER ao enum UserRole
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';

-- 2. Marcar migration como aplicada
INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count)
SELECT 
  gen_random_uuid(),
  '',
  NOW(),
  '20250109210000_add_mother_role',
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" 
  WHERE migration_name = '20250109210000_add_mother_role'
);

-- 3. Verificar resultado
SELECT migration_name, finished_at, applied_steps_count
FROM "_prisma_migrations" 
WHERE migration_name = '20250109210000_add_mother_role';

-- 4. Verificar se MOTHER está no enum
SELECT unnest(enum_range(NULL::"UserRole")) AS role_value;
