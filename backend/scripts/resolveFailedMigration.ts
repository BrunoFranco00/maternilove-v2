/**
 * Script para resolver migration travada durante deploy
 * Executa automaticamente se migration 20250109210000_add_mother_role estiver falhada
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resolveFailedMigration() {
  try {
    console.log('🔧 Verificando migration travada...');

    // Verificar se migration está marcada como falhada
    const failedMigration = await prisma.$queryRaw<Array<{ migration_name: string; finished_at: Date | null }>>`
      SELECT migration_name, finished_at
      FROM "_prisma_migrations"
      WHERE migration_name = '20250109210000_add_mother_role'
      AND finished_at IS NULL
    `;

    if (failedMigration.length === 0) {
      console.log('✅ Migration já está resolvida ou não existe');
      return;
    }

    console.log('📦 Resolvendo migration travada...');

    // Adicionar MOTHER ao enum (se ainda não foi adicionado)
    await prisma.$executeRaw`
      ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER'
    `;

    console.log('✅ MOTHER adicionado ao enum UserRole');

    // Marcar migration como aplicada
    await prisma.$executeRaw`
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
      )
    `;

    console.log('✅ Migration marcada como aplicada');
    console.log('🎉 Migration resolvida com sucesso!');

  } catch (error: any) {
    console.error('❌ Erro ao resolver migration:', error.message);
    // Não lançar erro - deixar Prisma migrate deploy continuar
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  resolveFailedMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { resolveFailedMigration };
