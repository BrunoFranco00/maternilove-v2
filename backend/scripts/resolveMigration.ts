import { execSync } from 'child_process';

/**
 * Script para resolver migration travada no Prisma
 * 
 * Uso:
 * 1. Obter DATABASE_URL do Railway (PostgreSQL → Variables → DATABASE_URL)
 * 2. Exportar no terminal: export DATABASE_URL="postgresql://..."
 * 3. Executar: npm run resolve-migration
 */

const migrationName = '20250109210000_add_mother_role';

// Verificar se DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: DATABASE_URL não está configurada no ambiente.');
  console.error('');
  console.error('Para configurar:');
  console.error('  1. Obtenha a DATABASE_URL no Railway:');
  console.error('     Railway → PostgreSQL → Variables → DATABASE_URL');
  console.error('  2. Exporte no terminal:');
  console.error('     export DATABASE_URL="postgresql://..."');
  console.error('  3. Execute novamente:');
  console.error('     npm run resolve-migration');
  process.exit(1);
}

try {
  console.log(`🔧 Resolvendo migration ${migrationName}...`);
  console.log('');
  
  execSync(`npx prisma migrate resolve --applied ${migrationName}`, {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  });
  
  console.log('');
  console.log('✅ Migration marcada como aplicada com sucesso!');
  console.log('');
  console.log('Agora você pode fazer deploy normalmente no Railway.');
} catch (err) {
  console.error('');
  console.error('❌ Falha ao resolver migration:', err);
  console.error('');
  console.error('Verifique:');
  console.error('  - DATABASE_URL está correta?');
  console.error('  - Conexão com o banco está funcionando?');
  console.error('  - A migration existe no diretório prisma/migrations/?');
  process.exit(1);
}
