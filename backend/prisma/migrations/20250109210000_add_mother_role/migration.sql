-- AlterEnum
-- Adiciona o valor MOTHER ao enum UserRole
-- NOTA: Alterar default precisa ser feito em migration separada
-- pois PostgreSQL não permite usar novo valor de enum na mesma transação
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';
