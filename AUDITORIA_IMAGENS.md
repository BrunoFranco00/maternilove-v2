# Auditoria de Assets - MaterniLove v2

**Data:** 26/01/2025

## PASSO 1 — Resultado da Auditoria

### Pastas existentes

| Pasta | Existe |
|-------|--------|
| `public/images/categories/` | ✅ Sim |
| `public/images/progress/pregnancy/` | ✅ Sim |
| `public/images/progress/child/` | ✅ Sim |

### Categories (SVG, não JPG)

| Arquivo | Existe |
|---------|--------|
| nutricao.svg | ✅ Sim |
| sono.svg | ✅ Sim |
| exercicios.svg | ✅ Sim |
| prenatal.svg | ✅ Sim |
| parto.svg | ✅ Sim |
| emocional.svg | ✅ Sim |
| comunidade.svg | ✅ Sim |
| marketplace.svg | ✅ Sim |

**Não existem:** nutricao.jpg, sono.jpg, etc. (apenas .svg)

### Pregnancy (trimester SVGs, não week-XX.jpg)

| Arquivo | Existe |
|---------|--------|
| trimester-1.svg | ✅ Sim |
| trimester-2.svg | ✅ Sim |
| trimester-3.svg | ✅ Sim |
| trimester-4.svg | ✅ Sim |

**Não existem:** week-01.jpg ... week-40.jpg

### Child (phase SVGs, não month-XX.jpg)

| Arquivo | Existe |
|---------|--------|
| phase-0-3.svg | ✅ Sim |
| phase-3-6.svg | ✅ Sim |
| phase-6-12.svg | ✅ Sim |
| phase-1-2y.svg | ✅ Sim |
| phase-2-3y.svg | ✅ Sim |
| phase-3-5y.svg | ✅ Sim |

**Não existem:** month-00.jpg ... month-60.jpg

---

## Evidência de Debug (NODE_ENV !== "production")

- **Cards (Início):** texto `img: /images/categories/<slug>.svg` ou `img: data:image/svg+xml;...`
- **Progresso pregnancy:** `week: 24 | img: /images/progress/pregnancy/trimester-3.svg`
- **Progresso child:** `month: N | img: /images/progress/child/phase-X.svg`

## Arquivos alterados/criados

- `frontend/src/lib/images/imageResolvers.ts` (criado)
- `frontend/src/data/articles.ts` (getArticlesForPhase com mix de categorias)
- `frontend/src/app/app/inicio/page.tsx` (resolveCategoryVisual + debug)
- `frontend/src/components/CinematicProgressHero.tsx` (resolveProgressVisual + week clamp + debug)
- `frontend/src/app/app/progresso/page.tsx` (resolveProgressVisual + clamp + debug)
