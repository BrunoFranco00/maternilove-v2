#!/bin/bash

# Script para executar migrations no Railway PostgreSQL

echo "🔧 Executando migrations no PostgreSQL Railway..."
echo ""

# DATABASE_URL do Railway PostgreSQL
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"

cd backend

echo "📦 Gerando Prisma Client..."
npx prisma generate

echo ""
echo "🗄️ Executando migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migrations executadas com sucesso!"
    echo ""
    echo "🎯 Próximos passos:"
    echo "   1. Verificar se tabelas foram criadas"
    echo "   2. Testar login/registro na plataforma"
    echo ""
else
    echo ""
    echo "⚠️ Erro ao executar migrate deploy. Tentando db push..."
    npx prisma db push --accept-data-loss
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Schema aplicado com db push!"
    else
        echo ""
        echo "❌ Erro ao aplicar schema. Verifique a conexão."
    fi
fi



