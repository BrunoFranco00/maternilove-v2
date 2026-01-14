#!/bin/bash

echo "👤 Criando usuário administrador..."
echo ""

cd ~/Projetos/maternilove-v2/backend

# DATABASE_URL do Railway PostgreSQL
export DATABASE_URL="postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway"

echo "🌱 Executando seed para criar admin..."
echo ""

npm run seed:admin

echo ""
echo "✅ Processo concluído!"
echo ""
echo "📧 Credenciais do Admin:"
echo "   Email: suporte@maternilove.com.br"
echo "   Senha: Materni%2026"
echo ""
echo "🎯 Agora teste:"
echo "   1. Login: https://maternilove-v2.vercel.app/login"
echo "   2. Criar conta: https://maternilove-v2.vercel.app/register"



