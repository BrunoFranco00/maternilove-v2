# MaterniLove — Árvore de Arquitetura V2

**Versão:** v2-mobile-foundation  
**Layout atual:** Mobile-first (MobileLayout)

---

## src/app/app/*

```
src/app/app/
├── layout.tsx              # MobileLayout wrapper
├── inicio/page.tsx         # Feed mobile, hero article, cards
├── jornada/page.tsx        # Diário, EmotionalConnection, sugestões
├── progresso/page.tsx      # Semana atual, placeholder gráfico
├── comunidade/page.tsx     # Posts, filtros por trimestre
├── perfil/page.tsx         # Avatar, tabs, formulário gestacional
├── memorias/page.tsx       # Grid placeholder upload
├── profissionais/page.tsx  # Cards de especialistas
├── mercado/page.tsx        # Grid de produtos
├── dashboard/page.tsx       # Redirect → inicio
├── premium-preview/page.tsx # Preview editorial completo (3 artigos)
├── conteudo/[slug]/page.tsx # Página de artigo
├── social/page.tsx
├── community/page.tsx
├── marketplace/page.tsx
├── experiments/page.tsx
├── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── audit/page.tsx
│   ├── flags/page.tsx
│   ├── users/page.tsx
│   └── overview/page.tsx
└── (core-emotional)/
    ├── layout.tsx
    ├── relief/page.tsx
    ├── check-in/page.tsx
    └── core.store.ts
```

---

## src/premium/*

```
src/premium/
├── MobileLayout.tsx        # Layout principal atual
├── MobileTopBar.tsx       # TopBar 56px, logo + perfil
├── MobileBottomNav.tsx    # Bottom nav 72px, 5 itens
├── PremiumLayout.tsx      # Layout alternativo (sidebar)
├── PremiumSidebar.tsx     # Sidebar 8 itens
├── PremiumTopbar.tsx      # Topbar + BottomNav legado
├── GlassCardV2.tsx        # Card glass
├── PremiumButtonV3.tsx    # Botão gradiente
├── LogoPremiumV3.tsx      # Logo 48x48
├── TypingMessage.tsx       # Efeito digitação
├── generateDeepEmotionalMessage.ts
├── premium.css            # Keyframes fadeInSmooth
└── foundation/
    ├── index.ts
    ├── colors.ts
    ├── shadows.ts
    ├── gradients.ts
    ├── motion.ts
    └── typography.ts
```

---

## Principais Componentes

### Premium (src/premium/)

- **MobileLayout** — Container: TopBar + main + BottomNav
- **MobileTopBar** — 56px, blur, LogoPremiumV3 (32px), ícone perfil
- **MobileBottomNav** — 72px fixa, 5 ícones (Início, Jornada, Progresso, Comunidade, Perfil)
- **GlassCardV2** — Card com glassBackground, depthMedium, elevateHover
- **PremiumButtonV3** — Primary (gradiente) / Ghost
- **LogoPremiumV3** — Coração + gradiente radial

### Layout (src/components/layout/)

- **AppNavigation** — Legado (sidebar + bottom nav) — não usado no layout atual
- **Header**, **PrivateLayoutClient**, **AdminLayoutClient**

### UI (src/components/ui/)

- **Section**, **AvatarPremium**, **CardPremium**, **ButtonPremium**
- **PremiumCard**, **PremiumButton** — variantes legadas

### Auth & Guards

- **ProtectedRoute**, **RoleGuard**, **ErrorBoundary**, **FeatureFlagGuard**

### Emotional

- **EmotionalConnection** — Narrativa semanal, modal responder

---

## Layout Atual

```
AppLayout (src/app/app/layout.tsx)
└── MobileLayout
    ├── [background] radial gradient + noise overlay
    ├── MobileTopBar (56px)
    ├── main
    │   └── div.px-5.py-6
    │       └── {children}
    └── MobileBottomNav (72px, fixed bottom)
```

### Navegação

- **TopBar:** Logo → /app/inicio | Perfil → /app/perfil
- **BottomNav:** Início, Jornada, Progresso, Comunidade, Perfil
