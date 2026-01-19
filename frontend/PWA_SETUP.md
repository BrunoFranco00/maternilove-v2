# PWA Setup - Materni_Love V2

## Status: LOCK PWA 1 - IMPLEMENTADO

O frontend foi configurado como Progressive Web App (PWA) completo.

## Arquivos Criados/Modificados

### Criados:
- `public/manifest.json` - Manifest do PWA
- `public/browserconfig.xml` - Configuração para Windows/Edge
- `public/icons/README.md` - Instruções para ícones
- `src/hooks/usePWAInstall.ts` - Hook para prompt de instalação
- `PWA_SETUP.md` - Este arquivo

### Modificados:
- `next.config.js` - Configurado com next-pwa
- `src/app/layout.tsx` - Meta tags mobile e PWA adicionadas
- `package.json` - next-pwa adicionado como dependência

## Ícones Necessários

**IMPORTANTE:** Os ícones PWA precisam ser criados e adicionados em `public/icons/`:

- `icon-192x192.png` (192x192px)
- `icon-256x256.png` (256x256px)
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px)
- `icon-maskable-512x512.png` (512x512px, maskable)

**Ferramentas para gerar:**
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://maskable.app/

## Funcionalidades Implementadas

✅ Manifest.json configurado
✅ Service Worker registrado automaticamente
✅ Cache de assets estáticos (imagens, JS, CSS)
✅ Cache de shell do app
✅ APIs NÃO são cacheadas (NetworkOnly)
✅ Meta tags mobile (iOS e Android)
✅ Hook para prompt de instalação (preparado, não dispara automaticamente)
✅ Modo standalone quando instalado
✅ Orientação portrait fixa

## Estratégias de Cache

- **Assets estáticos (JS, CSS, imagens):** Cache First
- **APIs autenticadas:** Network Only (nunca cacheadas)
- **HTML shell:** Network First com fallback

## Como Usar o Hook de Instalação

```typescript
import { usePWAInstall } from '@/hooks/usePWAInstall';

function MyComponent() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      console.log('PWA instalado!');
    }
  };

  if (isInstalled) {
    return <p>App já está instalado</p>;
  }

  if (isInstallable) {
    return <button onClick={handleInstall}>Instalar App</button>;
  }

  return null;
}
```

## Validação

Para validar o PWA:

1. **Lighthouse (Chrome DevTools):**
   - Abrir DevTools → Lighthouse
   - Selecionar "Progressive Web App"
   - Executar auditoria

2. **Teste de Instalação:**
   - Android: Chrome mostrará prompt de instalação
   - iOS: Safari → Compartilhar → Adicionar à Tela Inicial

3. **Verificar Service Worker:**
   - DevTools → Application → Service Workers
   - Deve mostrar service worker ativo

## Build e Deploy

O PWA está configurado para funcionar em produção (Vercel).

**Nota:** Em desenvolvimento, o PWA está desabilitado (`disable: process.env.NODE_ENV === 'development'`).

## Próximos Passos (Fora do Escopo Atual)

- Criar ícones reais do app
- Implementar botão de instalação após onboarding
- Adicionar splash screen customizado
- Implementar atualizações offline

---

**LOCK PWA 1 - FECHADO**
