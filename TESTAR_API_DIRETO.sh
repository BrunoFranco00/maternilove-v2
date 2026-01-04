#!/bin/bash

echo "🧪 TESTANDO API DIRETAMENTE"
echo "================================"
echo ""

API_URL="https://maternilove-v2-production.up.railway.app"

echo "1️⃣ Testando Health Check..."
echo "URL: $API_URL/health"
curl -s "$API_URL/health" | jq '.' || curl -s "$API_URL/health"
echo ""
echo ""

echo "2️⃣ Testando Registro..."
echo "URL: $API_URL/api/auth/register"
echo "Dados: {\"name\":\"Teste User\",\"email\":\"teste$(date +%s)@exemplo.com\",\"password\":\"senha123\"}"
echo ""
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Teste User\",\"email\":\"teste$(date +%s)@exemplo.com\",\"password\":\"senha123\"}")

echo "$RESPONSE" | jq '.' || echo "$RESPONSE"
echo ""
echo ""

echo "3️⃣ Testando Login Admin..."
echo "URL: $API_URL/api/auth/login"
echo "Dados: {\"email\":\"suporte@maternilove.com.br\",\"password\":\"Materni%2026\"}"
echo ""
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"suporte@maternilove.com.br","password":"Materni%2026"}')

echo "$RESPONSE" | jq '.' || echo "$RESPONSE"
echo ""
echo ""

echo "✅ Teste concluído!"

