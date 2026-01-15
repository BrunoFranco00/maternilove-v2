-- AlterTable: Adicionar campos de onboarding ao model User
-- Migration segura: usa IF NOT EXISTS e valores padrão

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "onboardingRole" "UserRole",
ADD COLUMN IF NOT EXISTS "onboardingAt" TIMESTAMP(3);

-- Criar índice para consultas frequentes
CREATE INDEX IF NOT EXISTS "User_onboardingCompleted_idx" ON "User"("onboardingCompleted");
