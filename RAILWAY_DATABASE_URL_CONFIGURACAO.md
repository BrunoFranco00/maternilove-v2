# ⚠️ CONFIGURAÇÃO OBRIGATÓRIA - DATABASE_URL NO RAILWAY

## 🚨 PARÂMETROS INVÁLIDOS REMOVIDOS

**NÃO USE:**
- ❌ `timeout` (não existe no PostgreSQL)
- ❌ `limit` (não existe no PostgreSQL)

**USE SOMENTE:**
- ✅ `connection_limit` (número de conexões no pool)
- ✅ `pool_timeout` (timeout para obter conexão do pool, em segundos)
- ✅ `connect_timeout` (timeout para estabelecer nova conexão, em segundos)

---

## ✅ URL CORRETA PARA CONFIGURAR NO RAILWAY

### **No PostgreSQL Service:**

**DATABASE_URL** (ou **DATABASE_PUBLIC_URL**):
```
postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

### **No Backend Service:**

**DATABASE_URL** (mesmo valor acima):
```
postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

---

## 📋 PASSO A PASSO

### 1. Railway → PostgreSQL Service → Variables

1. Clique em **Edit** na variável `DATABASE_URL` ou `DATABASE_PUBLIC_URL`
2. Substitua completamente por:
   ```
   postgresql://postgres:DTcRyFBkLMlSaZCmlRnYKqynipajDKCE@trolley.proxy.rlwy.net:55732/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
   ```
3. Clique em **Save**

### 2. Railway → Backend Service → Variables

1. Clique em **Edit** na variável `DATABASE_URL`
2. Cole **exatamente** a mesma URL acima
3. Clique em **Save**

---

## ⚠️ IMPORTANTE

- **NÃO use `timeout` ou `limit`** - esses parâmetros não existem no PostgreSQL
- Use **apenas** os 3 parâmetros listados acima
- A URL deve ter `?` antes dos parâmetros e `&` entre eles
- Sem espaços na URL

---

## ✅ VERIFICAÇÃO

Após configurar, aguarde o deploy e verifique os logs:

**Não deve aparecer:**
- ❌ `unrecognized configuration parameter "timeout"`
- ❌ `unrecognized configuration parameter "limit"`

**Deve aparecer:**
- ✅ `Backend running on 0.0.0.0:XXXX`
- ✅ `Ready to receive requests!`

