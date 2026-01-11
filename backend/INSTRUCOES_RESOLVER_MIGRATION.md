# 🔧 Como Resolver a Migration Travada

## ❌ Problema

A DATABASE_URL fornecida (`postgres.railway.internal`) é uma URL **interna** do Railway que só funciona dentro da rede do Railway, não localmente.

## ✅ Solução

Você precisa usar a **DATABASE_PUBLIC_URL** ao invés da DATABASE_URL interna.

### Passo a Passo:

1. **Acesse o Railway:**
   - https://railway.app
   - Vá no seu serviço **PostgreSQL**

2. **Obtenha a URL Pública:**
   - Vá em **Variables**
   - Procure por **DATABASE_PUBLIC_URL** (não DATABASE_URL!)
   - Copie o valor completo

   A URL pública geralmente tem este formato:
   ```
   postgresql://postgres:senha@containers-us-west-xxx.railway.app:5432/railway
   ```
   Ou:
   ```
   postgresql://postgres:senha@trolley.proxy.rlwy.net:xxxxx/railway
   ```

3. **Exporte no Terminal:**
   ```bash
   export DATABASE_URL="cole-a-url-publica-aqui"
   ```

4. **Execute o Script:**
   ```bash
   cd backend
   npm run resolve-migration
   ```

## 🔍 Diferença entre as URLs:

- **DATABASE_URL** (interna): `postgres.railway.internal:5432`
  - ✅ Funciona apenas dentro do Railway
  - ❌ Não funciona localmente

- **DATABASE_PUBLIC_URL** (pública): `containers-us-west-xxx.railway.app` ou `trolley.proxy.rlwy.net`
  - ✅ Funciona localmente e no Railway
  - ✅ Use esta para executar o script!

## 📝 Nota

Se você não encontrar DATABASE_PUBLIC_URL, pode ser que o Railway tenha mudado o nome. Procure por:
- `DATABASE_PUBLIC_URL`
- `PUBLIC_DATABASE_URL`
- `DATABASE_URL_EXTERNAL`
- Ou verifique na aba **Connect** do PostgreSQL no Railway
