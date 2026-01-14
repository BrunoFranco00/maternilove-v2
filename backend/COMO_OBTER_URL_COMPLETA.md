# 📋 Como Obter a URL Completa do PostgreSQL no Railway

## ⚠️ URL Incompleta

A URL fornecida parece estar incompleta:
```
postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@:/railway
```

Falta o **hostname** e a **porta** depois do `@`.

## ✅ Como Obter a URL Completa

### Método 1: Via Variables (Recomendado)

1. Acesse: https://railway.app
2. Vá no seu serviço **PostgreSQL**
3. Clique na aba **Variables**
4. Procure por:
   - `DATABASE_PUBLIC_URL` (preferencial)
   - Ou `PUBLIC_DATABASE_URL`
   - Ou `DATABASE_URL_EXTERNAL`

A URL completa deve ter este formato:
```
postgresql://postgres:senha@hostname:porta/railway
```

Exemplos:
```
postgresql://postgres:senha@containers-us-west-xxx.railway.app:5432/railway
postgresql://postgres:senha@trolley.proxy.rlwy.net:xxxxx/railway
```

### Método 2: Via Connect Tab

1. Acesse: https://railway.app
2. Vá no seu serviço **PostgreSQL**
3. Clique na aba **Connect** ou **Data**
4. Procure pela seção **"Connection String"** ou **"Public Network"**
5. Copie a URL completa que aparece lá

### Método 3: Via Railway CLI (se instalado)

```bash
railway variables
```

## 🔍 Formato Esperado

A URL PostgreSQL completa tem esta estrutura:
```
postgresql://[user]:[password]@[hostname]:[port]/[database]
```

Sua URL atual tem:
- ✅ user: `postgres`
- ✅ password: `IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE`
- ❌ hostname: **FALTANDO**
- ❌ porta: **FALTANDO**
- ✅ database: `railway`

## 📝 Após Obter a URL Completa

1. Copie a URL completa
2. Execute:
   ```bash
   export DATABASE_URL="cole-a-url-completa-aqui"
   cd backend
   npm run resolve-migration
   ```

## 💡 Dica

Se você não encontrar a URL pública, pode tentar usar a URL interna via Railway CLI ou executar o comando diretamente no ambiente do Railway (via Railway Shell).
