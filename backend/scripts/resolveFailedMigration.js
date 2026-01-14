/**
 * Script para resolver migration travada durante deploy
 * Executa automaticamente se migration 20250109210000_add_mother_role estiver falhada
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function resolveFailedMigration() {
    try {
        console.log('🔧 Verificando e resolvendo migration travada...');
        // Sempre tentar adicionar MOTHER ao enum (idempotente)
        try {
            await prisma.$executeRaw `
        ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER'
      `;
            console.log('✅ MOTHER adicionado ao enum UserRole');
        }
        catch (error) {
            // Se já existe, ignorar erro
            if (error.message?.includes('already exists')) {
                console.log('✅ MOTHER já existe no enum UserRole');
            }
            else {
                console.warn('⚠️  Aviso ao adicionar MOTHER:', error.message);
            }
        }
        // Verificar se migration precisa ser marcada como aplicada
        const existingMigration = await prisma.$queryRaw `
      SELECT migration_name, finished_at
      FROM "_prisma_migrations"
      WHERE migration_name = '20250109210000_add_mother_role'
    `;
        if (existingMigration.length === 0 || existingMigration[0].finished_at === null) {
            console.log('📦 Marcando migration como aplicada...');
            // Se já existe mas não tem finished_at, atualizar
            if (existingMigration.length > 0) {
                await prisma.$executeRaw `
          UPDATE "_prisma_migrations"
          SET finished_at = NOW(), applied_steps_count = 1
          WHERE migration_name = '20250109210000_add_mother_role'
          AND finished_at IS NULL
        `;
            }
            else {
                // Se não existe, inserir
                await prisma.$executeRaw `
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
            }
            console.log('✅ Migration marcada como aplicada');
        }
        else {
            console.log('✅ Migration já está aplicada');
        }
        console.log('🎉 Verificação de migration concluída!');
    }
    catch (error) {
        console.error('❌ Erro ao resolver migration:', error.message);
        // Não lançar erro - deixar Prisma migrate deploy continuar
    }
    finally {
        await prisma.$disconnect();
    }
}
// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}` || require.main === module) {
    resolveFailedMigration()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        // Não falhar - deixar migrate deploy continuar
        process.exit(0);
    });
}
export { resolveFailedMigration };
