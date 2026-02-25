# MaterniLove — Snapshot V2 Mobile Foundation

**Data:** Janeiro 2026  
**Versão:** v2-mobile-foundation  
**Objetivo:** Documentar o estado estável da plataforma após implementação do layout mobile-first premium.

---

## 1. Estado da Arquitetura Atual

- **Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Estrutura:** Frontend monolítico com roteamento baseado em pastas
- **Autenticação:** ProtectedRoute + RoleGuard (não alterados)
- **Backend:** API externa, sem alterações
- **Middleware:** Sem alterações
- **Providers:** Sem alterações

---

## 2. Estrutura Mobile-First Implementada

### Layout Principal (`src/app/app/layout.tsx`)

```
<MobileLayout>
  {children}
</MobileLayout>
```

### MobileLayout

- **MobileTopBar** (56px): Logo à esquerda, ícone perfil à direita, background blur
- **main**: `flex-1 overflow-y-auto pb-20` para acomodar bottom nav
- **MobileBottomNav** (72px fixa): Navegação inferior com 5 itens

### Características

- `min-h-screen flex flex-col` no container raiz
- Background radial gradient suave (#FFF5F8 → #FFE6EC → #FFF8F9 → #FFF)
- Overlay de noise leve (opacity 0.03)
- Padding lateral 20px (`px-5`)
- Padding inferior do main para não sobrepor bottom nav

---

## 3. Componentes Premium Criados

### Layout

| Componente | Descrição |
|------------|-----------|
| `MobileLayout` | Container principal mobile-first |
| `MobileTopBar` | Barra superior 56px com blur, LogoPremiumV3, ícone perfil |
| `MobileBottomNav` | Navegação inferior fixa 72px com 5 itens |
| `PremiumLayout` | Layout alternativo (sidebar desktop) — disponível para premium-preview |
| `PremiumSidebar` | Sidebar com 8 itens de navegação |
| `PremiumTopbar` | Topbar alternativa (desktop) |

### UI

| Componente | Descrição |
|------------|-----------|
| `GlassCardV2` | Card glassmorphism, backdrop-blur-lg, depthMedium shadow |
| `PremiumButtonV3` | Botão com gradiente primary/ghost, press effect, 250ms transition |
| `LogoPremiumV3` | Logo 48x48 com gradiente radial, coração estilizado |

### Utilitários

| Componente | Descrição |
|------------|-----------|
| `TypingMessage` | Efeito de digitação com fadeInSmooth |
| `generateDeepEmotionalMessage` | Mensagens emocionais por semana/mood/diário |

### Foundation (`src/premium/foundation/`)

| Arquivo | Conteúdo |
|---------|----------|
| `colors.ts` | primaryRose, primaryRoseDark, primaryRoseLight, glassBorder, glassBackground |
| `shadows.ts` | depthSoft, depthMedium, depthDeep |
| `gradients.ts` | backgroundGradient, primaryGradient, primaryRadial |
| `motion.ts` | fadeInSmooth, elevateHover, pressEffect, transitions |
| `typography.ts` | fontTitle, fontBody, sizes, lineHeights |

---

## 4. Sistema de Cores Aplicado

### Paleta Oficial

| Token | Valor | Uso |
|-------|-------|-----|
| `primaryRose` | #C2185B | Botões primary, destaque, estados ativos |
| `primaryRoseDark` | #8E0E3A | Gradiente, sombras profundas |
| `primaryRoseLight` | #F8BBD0 | Focus ring, highlights |
| `glassBorder` | rgba(255,255,255,0.55) | Bordas glass |
| `glassBackground` | rgba(255,255,255,0.65) | Fundo glass |
| `textPrimary` | #1C1C1C | Texto principal |
| `textSecondary` | #5F5F5F | Texto secundário |

### Background Global

- Radial gradient: `ellipse 120% 80% at 50% 0%`
- Stops: #FFF5F8 → #FFE6EC (40%) → #FFF8F9 (70%) → #FFF (100%)
- Noise overlay: SVG fractal, 3% opacity, mix-blend-overlay

---

## 5. Estrutura de Navegação Atual

### Mobile Bottom Nav (5 itens)

1. **Início** — `/app/inicio`
2. **Jornada** — `/app/jornada`
3. **Progresso** — `/app/progresso`
4. **Comunidade** — `/app/comunidade`
5. **Perfil** — `/app/perfil`

### Estado Ativo

- Cor: `#C2185B` (primaryRose)
- Ícones inline SVG, 24px

### TopBar

- Logo + "MaterniLove" → link para `/app/inicio`
- Ícone perfil → link para `/app/perfil`

---

## 6. O Que Ainda Está Pendente

### Funcionalidades

- [ ] Integração completa com API real para artigos e dados gestacionais
- [ ] Gráfico de progresso 3D (placeholder atual)
- [ ] Upload de memórias funcional
- [ ] Filtros de comunidade por trimestre funcionais
- [ ] Salvamento de perfil em backend

### UX/UI

- [ ] Animações de página (transitions entre rotas)
- [ ] Pull-to-refresh no feed
- [ ] Skeleton loaders para carregamento
- [ ] Offline/PWA completo

### Técnico

- [ ] Testes unitários e E2E
- [ ] Otimização de imagens Unsplash (domínio no next.config)
- [ ] Lazy loading de rotas admin

---

## Rollback

Para retornar a este estado:

```bash
git checkout v2-mobile-foundation
```
