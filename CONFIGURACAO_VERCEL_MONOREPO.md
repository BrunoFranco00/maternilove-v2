# 📋 Configuração Vercel para Monorepo

## ⚠️ IMPORTANTE

O `rootDirectory` **NÃO** é uma propriedade válida no `vercel.json`.

Para monorepos, você precisa configurar o **Root Directory** no painel do Vercel.

## 🔧 Passos para Configurar no Painel do Vercel

1. Acesse o projeto no Vercel
2. Vá em **Settings** → **General**
3. Na seção **Root Directory**, configure:
   - **Root Directory:** `frontend`
4. Salve as alterações

## 📁 Arquivo vercel.json

O `vercel.json` na raiz deve conter apenas:

```json
{
  "framework": "nextjs"
}
```

## ✅ Após Configurar

- O Vercel detectará automaticamente o Next.js em `frontend/`
- O build será executado no diretório correto
- O output será `.next` (padrão do Next.js)

## 🔍 Verificação

Após configurar, o próximo deploy deve:
- ✅ Executar `npm install` em `frontend/`
- ✅ Executar `npm run build` em `frontend/`
- ✅ Encontrar o output em `frontend/.next/`
- ✅ Não procurar por `dist/`
