-- AlterEnum
-- Migration A: Adiciona o valor MOTHER ao enum UserRole
-- IMPORTANTE: Esta migration APENAS adiciona o valor ao enum.
-- NÃO pode conter ALTER TABLE, UPDATE, ou qualquer uso do novo valor.
-- PostgreSQL requer que novos valores de enum sejam commitados antes de serem usados.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';
