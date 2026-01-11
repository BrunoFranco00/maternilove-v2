-- AlterEnum
-- Adiciona o valor MOTHER ao enum UserRole
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';

-- AlterTable
-- Altera o default de role para MOTHER
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MOTHER';
