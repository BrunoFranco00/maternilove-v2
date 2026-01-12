#!/bin/bash

# Script para resolver migration travada no Railway
# Execute este script após fazer railway link

set -e

echo "🔧 Resolvendo migration travada no Railway..."
echo ""

# Verificar se está logado
if ! railway whoami &>/dev/null; then
    echo "❌ Você precisa estar logado no Railway CLI"
    echo "Execute: railway login"
    exit 1
fi

# Verificar se está linkado
if ! railway status &>/dev/null; then
    echo "❌ Projeto não está linkado"
    echo "Execute primeiro: railway link"
    echo "Selecione seu projeto e o serviço PostgreSQL"
    exit 1
fi

echo "✅ Railway CLI configurado"
echo ""

# Resolver migration
echo "📦 Resolvendo migration: 20250109210000_add_mother_role"
railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role

echo ""
echo "✅ Migration resolvida com sucesso!"
echo "🎉 O próximo deploy do Railway funcionará normalmente"
