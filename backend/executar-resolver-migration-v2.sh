#!/bin/bash

# Script para resolver migration travada no Railway
# Usa railway shell para executar comandos SQL
# Execute: ./executar-resolver-migration-v2.sh

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

# Criar arquivo SQL temporário
SQL_FILE=$(mktemp)
cat > "$SQL_FILE" <<'EOF'
-- Adicionar MOTHER ao enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';

-- Marcar migration como aplicada
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

-- Verificar resultado
SELECT migration_name, finished_at 
FROM "_prisma_migrations" 
WHERE migration_name = '20250109210000_add_mother_role';
EOF

echo "📦 Executando SQL via Railway Shell..."
echo ""
echo "⚠️  IMPORTANTE: O Railway Shell abrirá em modo interativo."
echo "    Execute os comandos SQL manualmente ou use um cliente de banco."
echo ""
echo "📝 Comandos SQL preparados em: $SQL_FILE"
echo ""
echo "Opção 1: Abrir Railway Shell e executar manualmente"
echo "  railway shell"
echo "  psql \$DATABASE_URL < $SQL_FILE"
echo ""
echo "Opção 2: Usar cliente de banco externo (DBeaver/Postico)"
echo "  Host: postgres-production-4b5e.up.railway.app"
echo "  Port: 5432"
echo "  Database: railway"
echo "  User: postgres"
echo "  Password: IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE"
echo ""
echo "📄 Conteúdo do arquivo SQL:"
echo "----------------------------------------"
cat "$SQL_FILE"
echo "----------------------------------------"
echo ""

# Tentar executar via railway shell (pode não funcionar em modo não-interativo)
echo "🔄 Tentando executar via Railway Shell..."
echo ""

# Usar expect ou criar script que o usuário executa manualmente
cat > /tmp/railway-sql-commands.sh <<RAILWAY_SCRIPT
#!/bin/bash
railway shell <<RAILWAY_EOF
psql \$DATABASE_URL <<PSQL_EOF
$(cat "$SQL_FILE")
PSQL_EOF
RAILWAY_EOF
RAILWAY_SCRIPT

chmod +x /tmp/railway-sql-commands.sh

echo "✅ Script criado em: /tmp/railway-sql-commands.sh"
echo ""
echo "💡 RECOMENDAÇÃO: Use um cliente de banco externo (DBeaver) para executar o SQL."
echo "   É mais simples e confiável!"
echo ""

# Limpar arquivo temporário
rm -f "$SQL_FILE"
