# 🔍 DIAGNÓSTICO DETALHADO - Frontend

## ✅ VARIÁVEL JÁ CONFIGURADA

A variável `VITE_API_URL` já existe no Vercel há 3 horas.

**Isso significa que o problema NÃO é a variável de ambiente.**

---

## 🧪 DIAGNÓSTICO PASSO A PASSO

### **1. Verificar no Console do Navegador**

1. Acesse: https://maternilove-v2.vercel.app/login
2. Abra o **Console do Navegador** (F12 → Console)
3. Procure por:
   - `🔗 API URL: ...` - Deve mostrar a URL do Railway
   - Erros em vermelho
   - Mensagens de erro de rede (CORS, 404, 500, etc.)

**Me envie:**
- Qual URL aparece no log `🔗 API URL`?
- Quais erros aparecem no console?

---

### **2. Verificar Requisições de Rede**

1. Ainda com o Console aberto (F12)
2. Vá na aba **Network** (Rede)
3. Tente fazer login:
   - Email: `suporte@maternilove.com.br`
   - Senha: `Materni%2026`
4. Procure pela requisição `/api/auth/login`
5. Clique nela e veja:
   - **Status Code** (200, 400, 500, etc.)
   - **Response** (o que o servidor retornou)
   - **Request URL** (qual URL foi chamada)

**Me envie:**
- Qual é o Status Code?
- Qual é a Request URL?
- O que aparece na Response?

---

### **3. Verificar CORS**

Se o erro for sobre CORS:

- Erro no console: `CORS policy` ou `Access-Control-Allow-Origin`
- Significa que o backend não está permitindo requisições do Vercel

**Verificar:**
```bash
curl -X OPTIONS https://maternilove-v2-production.up.railway.app/api/auth/login \
  -H "Origin: https://maternilove-v2.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

---

### **4. Verificar Se a Variável Está Sendo Usada**

No console do navegador, após o deploy, você deve ver:
```
🔗 API URL: https://maternilove-v2-production.up.railway.app
```

Se aparecer:
```
🔗 API URL: http://localhost:3000
```

**Problema:** O build não pegou a variável de ambiente.

**Solução:** Fazer novo deploy no Vercel após adicionar a variável.

---

### **5. Testar Diretamente no Console do Navegador**

Abra o console (F12) e execute:

```javascript
fetch('https://maternilove-v2-production.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'suporte@maternilove.com.br',
    password: 'Materni%2026'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Me envie o resultado!**

---

## 🎯 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### **Problema 1: Variável não foi usada no build**

**Sintomas:**
- No console aparece: `🔗 API URL: http://localhost:3000`
- Requisições vão para `localhost:3000`

**Solução:**
1. Fazer novo deploy no Vercel
2. Aguardar build completar
3. Testar novamente

---

### **Problema 2: Erro de CORS**

**Sintomas:**
- Erro no console: `Access-Control-Allow-Origin`
- Status 0 ou CORS error

**Solução:**
- Verificar se `CORS_ORIGIN` inclui `*.vercel.app`
- Verificar se `trust proxy` está configurado

---

### **Problema 3: Erro 500 no Backend**

**Sintomas:**
- Status 500 na requisição
- Erro no response

**Solução:**
- Verificar logs do Railway
- Ver se o banco está conectado

---

### **Problema 4: Erro de Validação**

**Sintomas:**
- Status 400
- Mensagem de validação no response

**Solução:**
- Verificar se os dados estão corretos
- Ver mensagem de erro específica

---

## 📝 ME ENVIE:

1. **Screenshot do Console** (F12) mostrando:
   - O log `🔗 API URL`
   - Qualquer erro em vermelho

2. **Screenshot da aba Network** mostrando:
   - A requisição `/api/auth/login` ou `/api/auth/register`
   - O Status Code
   - A Response

3. **Resultado do teste direto no console** (código JavaScript acima)

---

Com essas informações, vou conseguir identificar exatamente o problema! 🔍



