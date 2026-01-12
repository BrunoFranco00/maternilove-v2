#!/bin/bash

# Script para resolver migration usando URL pública do PostgreSQL
# Execute: ./executar-com-url-publica.sh

set -e

echo "🔧 Resolver Migration usando URL Pública"
echo "=========================================="
echo ""

# URL pública do PostgreSQL
DATABASE_PUBLIC_URL="postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres-production-4b5e.up.railway.app:5432/railway"

echo "📦 Executando SQL para resolver migration..."
echo ""

echo "1️⃣  Adicionando MOTHER ao enum UserRole..."
psql "$DATABASE_PUBLIC_URL" -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';" || {
    echo "❌ Erro ao adicionar MOTHER ao enum"
    echo "💡 Verifique se a conexão pública está ativa no Railway"
    exit 1
}

echo "✅ MOTHER adicionado ao enum"
echo ""

echo "2️⃣  Marcando migration como aplicada..."
psql "$DATABASE_PUBLIC_URL" -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');" || {
    echo "❌ Erro ao marcar migration como aplicada"
    exit 1
}

echo "✅ Migration marcada como aplicada"
echo ""

echo "3️⃣  Verificando resultado..."
psql "$DATABASE_PUBLIC_URL" -c "SELECT migration_name, finished_at FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role';" || {
    echo "⚠️  Não foi possível verificar, mas os comandos anteriores foram executados"
}

echo ""
echo "🎉 Migration resolvida com sucesso!"
echo "✅ O próximo deploy do Railway funcionará normalmente"
echo ""
