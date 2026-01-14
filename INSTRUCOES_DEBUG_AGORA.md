# 🔍 INSTRUÇÕES PARA DEBUG - AGORA MESMO

## ✅ VARIÁVEL JÁ EXISTE

A variável `VITE_API_URL` já está configurada no Vercel há 3 horas.

**O problema não é a variável, mas precisamos verificar o que está acontecendo.**

---

## 🎯 PASSO A PASSO PARA DIAGNOSTICAR

### **1. Aguardar Deploy (2-3 minutos)**

Fiz alterações no código que adicionam logs de debug. O Vercel vai fazer deploy automático.

**Aguarde 2-3 minutos** e depois continue.

---

### **2. Abrir o Console do Navegador**

1. Acesse: **https://maternilove-v2.vercel.app/login**
2. Pressione **F12** (ou clique com botão direito → Inspecionar)
3. Vá na aba **Console**

---

### **3. Verificar a URL da API**

No console, procure por:
```
🔗 API URL: ...
```

**Me diga qual URL aparece:**
- ✅ Se aparecer: `https://maternilove-v2-production.up.railway.app` → **Correto!**
- ❌ Se aparecer: `http://localhost:3000` → **Problema! Variável não foi usada no build**

---

### **4. Tentar Fazer Login**

1. Digite:
   - Email: `suporte@maternilove.com.br`
   - Senha: `Materni%2026`
2. Clique em **"Entrar"**
3. **Observe o Console** - você vai ver logs como:
   - `🔐 Tentando fazer login...`
   - `📥 Resposta do login: ...`
   - `✅ Login realizado com sucesso!` ou `❌ Erro no login: ...`

---

### **5. Verificar Aba Network**

1. Com o Console aberto (F12)
2. Vá na aba **Network** (Rede)
3. Tente fazer login novamente
4. Procure pela requisição `/api/auth/login`
5. Clique nela
6. Veja:
   - **Status:** Qual é? (200, 400, 500, etc.)
   - **Request URL:** Qual URL está sendo chamada?
   - **Response:** O que o servidor retornou?

---

### **6. Testar Diretamente no Console**

Cole este código no Console (F12 → Console) e pressione Enter:

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
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('✅ Resposta:', data);
})
.catch(err => {
  console.error('❌ Erro:', err);
});
```

**Me diga o resultado!**

---

## 📸 ME ENVIE:

1. **Screenshot do Console** mostrando:
   - O log `🔗 API URL: ...`
   - Os logs `🔐 Tentando fazer login...`
   - Qualquer erro em vermelho

2. **Screenshot da aba Network** mostrando:
   - A requisição `/api/auth/login`
   - O Status Code
   - A Response (se houver)

3. **Resultado do teste direto no console** (código JavaScript acima)

---

## 🔍 O QUE PROCURAR:

### **Se o erro for CORS:**
- Mensagem: `Access-Control-Allow-Origin`
- **Solução:** Verificar CORS no backend

### **Se o erro for 404:**
- Status: 404
- **Solução:** URL da API incorreta

### **Se o erro for 500:**
- Status: 500
- **Solução:** Problema no backend (ver logs do Railway)

### **Se não aparecer requisição:**
- **Solução:** Frontend não está chamando a API (erro no código)

---

**Aguarde o deploy (2-3 min), depois execute os passos acima e me envie as informações! 🔍**



