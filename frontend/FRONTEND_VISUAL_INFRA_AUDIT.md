# FRONTEND VISUAL INFRA AUDIT

## 1. Tailwind Config

### Arquivo localizado

- `tailwind.config.js` (existe)
- `tailwind.config.ts` (NÃO existe)

### Conteúdo completo de tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FBE7F3',
          100: '#F8D5EA',
          200: '#F472B6',
          500: '#D946A6',
          600: '#BE185D',
          700: '#9D174D',
          900: '#500724',
        },
        secondary: {
          50: '#E9D5FF',
          500: '#A855F7',
          600: '#9333EA',
        },
        success: {
          500: '#10B981',
        },
        info: {
          500: '#3B82F6',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

### Análise

| Item | Resposta |
|------|----------|
| **Existe theme extend?** | Sim. `theme.extend` com `colors`, `animation`, `keyframes`. |
| **Existem cores customizadas?** | Sim. `primary` (50, 100, 200, 500, 600, 700, 900), `secondary` (50, 500, 600), `success` (500), `info` (500). |
| **Existe fontFamily custom?** | Não. Nenhuma `fontFamily` no `extend`. |
| **Existe container config?** | Não. Nenhuma configuração de `container`. |
| **Existe darkMode?** | Não. Nenhuma propriedade `darkMode` definida (comportamento padrão Tailwind: `media`). |

---

## 2. Global CSS

### Arquivos localizados

- `src/styles/globals.css` — **importado no layout** (arquivo principal)
- `src/index.css` — importado apenas em `src/legacy/main.tsx`
- `src/App.css` — importado apenas em `src/legacy/App.tsx`

O layout raiz (`src/app/layout.tsx`) importa: `../styles/globals.css`.

### Conteúdo completo de src/styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Reset e estilos base */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}

a {
  color: inherit;
  text-decoration: none;
}

/* Variáveis CSS (se necessário no futuro) */
:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 0, 0, 0;
  }
}
```

### Conteúdo completo de src/index.css (legacy)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Conteúdo completo de src/App.css (legacy)

```css
/* Animações customizadas */
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Análise (globals.css — usado pelo App Router)

| Item | Resposta |
|------|----------|
| **Existem CSS variables?** | Sim. `--foreground-rgb`, `--background-rgb` em `:root`. |
| **Existe :root?** | Sim. Define variáveis para claro e escuro via `prefers-color-scheme`. |
| **Existe reset custom?** | Sim. Reset em `*` (box-sizing, padding, margin). |
| **Existe configuração de font global?** | Não. O `globals.css` do layout não define `font-family`. O `index.css` (legacy) usa Inter. |

---

## 3. Layout Global

### Conteúdo completo de src/app/layout.tsx

```tsx
import type { Metadata, Viewport } from 'next';
import { Providers } from '@/providers/Providers';
import { ErrorBoundary } from '@/components/guards/ErrorBoundary';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'MaterniLove',
  description: 'Sua jornada de maternidade começa aqui',
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ec4899',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body suppressHydrationWarning className="focus-visible:outline-none">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Análise

| Item | Resposta |
|------|----------|
| **Existe container padrão?** | Não. O layout não envolve `children` em um container. |
| **Existe classe base aplicada no &lt;body&gt;?** | Sim. `className="focus-visible:outline-none"`. |
| **Existe background definido?** | Não no layout. O background vem do `globals.css` via `body { background: rgb(var(--background-rgb)); }`. |
| **Existe font aplicada globalmente?** | Não no layout. O `globals.css` não define `font-family` em `body`. |

---

## 4. Design Tokens

### Arquivos procurados

- `variables.css` — **NÃO existe**
- `theme.ts` — **NÃO existe**
- `tokens.ts` — **NÃO existe**
- `colors.ts` — **NÃO existe**
- `design-system.ts` — **NÃO existe**
- Arquivos com `export` de cores — **NÃO encontrado** (exceto cores no Tailwind config)

### Análise

**Não existe arquivo de design tokens dedicado.** As cores e animações estão apenas no `tailwind.config.js` e nas variáveis `--foreground-rgb` e `--background-rgb` no CSS.

---

## 5. Component Base System

### Estrutura encontrada

- **`src/design-system/`** — existe
  - `Button.tsx` — componente Button com variantes (primary, secondary, outline) e sizes (sm, md, lg)
  - `Card.tsx` — componente Card básico
  - `index.ts` — exporta Button e Card

- **`src/components/ui/`** — **NÃO existe** (pasta inexistente ou vazia)

### Conteúdo completo de design-system/Button.tsx

```tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Conteúdo completo de design-system/Card.tsx

```tsx
import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Análise

| Pergunta | Resposta |
|----------|----------|
| **Botões são repetidos manualmente?** | Sim. As páginas do app usam `button` com classes inline (ex.: check-in, login, register) em vez do `Button` do design-system. |
| **Existe padrão reutilizável?** | Sim. `design-system/Button` e `design-system/Card` existem e são reutilizáveis, mas **não são usados** nas páginas do App Router. |
| **Existe pasta components/ui?** | Não. Não existe `components/ui`. |

---

## 6. Estrutura de Estilização

### Dependências do package.json (relevantes a UI)

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.3",
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.2",
    "typescript": "^5.3.3",
    "zod": "^3.22.4",
    "zustand": "^4.5.7"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.1",
    "prettier-plugin-tailwindcss": "^0.5.11"
  }
}
```

### Análise

| Tecnologia | Uso |
|------------|-----|
| **Tailwind utility** | Sim. Estilização principal via classes Tailwind. |
| **CSS Module** | Não. Nenhum arquivo `*.module.css` encontrado. |
| **styled-components** | Não. Não está nas dependências. |
| **Biblioteca UI (shadcn, radix, MUI, Chakra, etc)** | Não. Nenhuma biblioteca de componentes UI nas dependências. |

---

## 7. Conclusão Técnica

### Maturidade visual atual

- **Nível:** Intermediário, parcialmente estruturado.
- **Pontos fortes:** Tailwind configurado, cores primárias/secondary definidas, animações, design-system com Button e Card.
- **Pontos fracos:** Design-system pouco usado, ausência de tokens, variáveis CSS limitadas, sem font global no fluxo principal.

### Base para tokenização

- **Base parcial.** Tokens estão implícitos no Tailwind (`colors`, `animation`) e em variáveis CSS (`--foreground-rgb`, `--background-rgb`).
- Não há camada explícita de tokens (ex.: `theme.ts`, `tokens.ts`, `variables.css`) para compartilhar entre Tailwind e outros contextos.

### Se precisa criar do zero

- **Não.** A base visual já existe.
- **O que falta:** (1) centralizar tokens em arquivos dedicados; (2) definir `font-family` global; (3) integrar `design-system` às páginas do App Router; (4) criar `components/ui` se for adotar um padrão shadcn/radix-style.
