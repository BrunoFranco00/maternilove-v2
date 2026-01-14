# 🔧 Correção: Output Directory no Vercel

## ⚠️ Problema Identificado

O Vercel está procurando por `frontend/dist/routes-manifest.json` quando deveria procurar por `frontend/.next/routes-manifest.json`.

## ✅ Solução

Como o **Root Directory** já está configurado como `frontend` no painel do Vercel, você precisa verificar/remover a configuração de **Output Directory** no painel.

### Passos no Painel do Vercel:

1. Acesse o projeto no Vercel
2. Vá em **Settings** → **General**
3. Na seção **Build & Development Settings**, verifique:
   - **Output Directory:** Deve estar **VAZIO** ou **removido**
   - ❌ **NÃO** deve estar configurado como `dist`
   - ✅ Deve estar vazio para Next.js detectar automaticamente `.next`

4. Se houver `dist` configurado, **remova** ou deixe vazio
5. Salve as alterações

## 📁 Arquivo vercel.json

O `vercel.json` na raiz deve conter apenas:

```json
{
  "framework": "nextjs"
}
```

## 🔍 Por que isso acontece?

- Next.js App Router usa `.next` como output directory (padrão)
- Se o Vercel tiver `dist` configurado no painel, ele procura por `dist/` ao invés de `.next/`
- Removendo a configuração de Output Directory, o Vercel detecta automaticamente `.next`

## ✅ Após Corrigir

O próximo deploy deve:
- ✅ Executar build em `frontend/` (já configurado)
- ✅ Usar `.next` como output (detecção automática)
- ✅ Encontrar `routes-manifest.json` em `.next/`
- ✅ Deploy concluído com sucesso
