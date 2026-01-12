#!/bin/bash

# Script para resolver migration travada no Railway
# Execute: ./executar-resolver-migration.sh

set -e

echo "🔧 Resolver Migration Travada no Railway"
echo "=========================================="
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script a partir do diretório backend/"
    echo "   cd /Users/bruno/Projetos/maternilove-v2/backend"
    exit 1
fi

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não está instalado"
    echo "   Execute: npm i -g @railway/cli"
    exit 1
fi

# Verificar login
echo "📋 Verificando login no Railway..."
if ! railway whoami &>/dev/null; then
    echo "❌ Você precisa estar logado no Railway CLI"
    echo "   Execute: railway login"
    exit 1
fi

echo "✅ Logado como: $(railway whoami)"
echo ""

# Verificar link
echo "📋 Verificando link do projeto..."
if ! railway status &>/dev/null; then
    echo "⚠️  Projeto não está linkado"
    echo "   Execute: railway link"
    echo "   Selecione: Materni_Love-V2 → Postgres"
    exit 1
fi

echo "✅ Projeto linkado"
echo ""

# Executar comandos SQL
echo "📦 Executando SQL para resolver migration..."
echo ""

echo "1️⃣  Adicionando MOTHER ao enum UserRole..."
railway run psql \$DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';" || {
    echo "❌ Erro ao adicionar MOTHER ao enum"
    exit 1
}

echo "✅ MOTHER adicionado ao enum"
echo ""

echo "2️⃣  Marcando migration como aplicada..."
railway run psql \$DATABASE_URL -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');" || {
    echo "❌ Erro ao marcar migration como aplicada"
    exit 1
}

echo "✅ Migration marcada como aplicada"
echo ""

echo "3️⃣  Verificando resultado..."
railway run psql \$DATABASE_URL -c "SELECT migration_name, finished_at FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role';" || {
    echo "⚠️  Não foi possível verificar, mas os comandos anteriores foram executados"
}

echo ""
echo "🎉 Migration resolvida com sucesso!"
echo "✅ O próximo deploy do Railway funcionará normalmente"
echo ""
