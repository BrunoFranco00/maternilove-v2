#!/bin/bash

# Script para criar todas as tabelas usando db push

echo "🔧 Criando todas as tabelas no PostgreSQL Railway..."
echo ""

cd ~/Projetos/maternilove-v2/backend

# DATABASE_URL do Railway PostgreSQL
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"

echo "📦 Gerando Prisma Client..."
npx prisma generate

echo ""
echo "🗄️ Criando todas as tabelas (db push)..."
echo "   Isso vai criar todas as 45+ tabelas no banco de dados"
echo ""

npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ TABELAS CRIADAS COM SUCESSO!"
    echo ""
    echo "🎯 Próximos passos:"
    echo "   1. Teste criar uma conta: https://maternilove-v2.vercel.app/register"
    echo "   2. Teste fazer login: https://maternilove-v2.vercel.app/login"
    echo ""
else
    echo ""
    echo "❌ Erro ao criar tabelas. Verifique a conexão."
fi

