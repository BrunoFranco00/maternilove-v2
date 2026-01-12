#!/bin/bash

# Script interativo para resolver migration
# Execute este script no seu terminal (não via Cursor)

set -e

echo "🔧 Resolver Migration Travada no Railway"
echo "=========================================="
echo ""

# Verificar se está logado
if ! railway whoami &>/dev/null; then
    echo "❌ Você precisa estar logado no Railway CLI"
    echo "Execute: railway login"
    exit 1
fi

echo "✅ Logado como: $(railway whoami)"
echo ""

# Fazer link (interativo)
echo "📌 Agora vamos fazer o link do projeto..."
echo "Quando pedir, selecione:"
echo "  1. Workspace: brunofranco00's Projects"
echo "  2. Projeto: Materni_Love-V2"
echo "  3. Serviço: PostgreSQL (não o backend)"
echo ""

railway link

# Verificar se link funcionou
if ! railway status &>/dev/null; then
    echo "❌ Link falhou. Tente novamente."
    exit 1
fi

echo ""
echo "✅ Projeto linkado com sucesso!"
echo ""

# Resolver migration
echo "📦 Resolvendo migration: 20250109210000_add_mother_role"
railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role

echo ""
echo "✅ Migration resolvida com sucesso!"
echo "🎉 O próximo deploy do Railway funcionará normalmente"
