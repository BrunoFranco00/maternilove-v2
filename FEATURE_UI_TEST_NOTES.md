# Feature UI — Notas de Teste

## A) Imagens de categorias

- **Arquivos**: `public/images/categories/*.svg` (nutricao, sono, exercicios, prenatal, parto, emocional, comunidade, marketplace)
- **Mapeamento**: `src/lib/categoryImages.ts` — cada categoria aponta para imagem distinta
- **Teste**: Home `/app/inicio` → cards "Para você hoje" com imagens diferentes (verde nutrição, azul sono, laranja movimento, rosa prenatal, etc.)

## B) Progresso

- **Arquivo**: `src/lib/progress/progressContent.ts`
  - `getPregnancyWeekContent(week)`: trimestre 1–4, imagens diferentes por faixa de 10 semanas
  - `getChildMonthContent(month)`: fases 0–3m, 3–6m, 6–12m, 1–2y, 2–3y, 3–5y com imagens distintas
- **Imagens**: `public/images/progress/pregnancy/trimester-*.svg`, `public/images/progress/child/phase-*.svg`
- **Teste**: Alterar `mockMaternalContext.gestationalWeek` (ex: 8, 18, 32) → imagem e textos mudam

## C) Jornada

- **Arquivo**: `src/lib/journey/journeyLabels.ts` — `getLabelForWeek(week)`
- **Timeline**: blocos "Já passou", "Atual", "Próximos" com labels e status (Concluída/Atual/Em breve)
- **Painel**: ao clicar em semana → título, 2 bullets, "o que observar"
- **Teste**: `/app/jornada` → semanas anteriores com "Concluída", atual destacada, próximas "Em breve" → clicar exibe painel

## D) Perfil (wizard)

- **Ordem**: pessoal → filho → gestação → saúde → estilo → emocional
- **URL**: `/app/perfil?step=pessoal` (ou filho, gestacao, etc.)
- **Gating**:
  - Pessoal incompleto (sem nome+telefone) → bloqueia filho e demais, toast "Complete a etapa anterior"
  - Filho incompleto (sem nome OU sexo OU birthDate) → bloqueia gestação, saúde, estilo, emocional
- **Teste**: Clicar "Completar" em Gestação sem preencher filho → toast e redirect para step=filho
