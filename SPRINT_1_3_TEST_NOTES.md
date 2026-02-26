# Sprint 1-3 — Notas de Teste

> **Atualização:** Modo demo removido. Ver `AUTH_ARCHITECTURE.md` para fluxo atual de autenticação.

### 2. Check-in sem login

1. Acesse `/` ou `/check-in`
2. Clique em **Check-in emocional** ou escolha um mood
3. Escolha um mood (ex: Ansiosa)
4. Deve navegar para `/relief` com resposta imediata (título, mensagem, sugestão)
5. **Não** deve redirecionar para `/login`

### 3. Perfil — botão "Completar" leva à aba correta

1. Acesse `/app/perfil`
2. Clique em **Completar** no card "Dados Gestacionais"
3. URL deve mudar para `/app/perfil?tab=gestacional` e o formulário da aba deve aparecer
4. Teste também: `?tab=saude`, `?tab=estilo`, `?tab=emocional`, `?tab=pessoal`, `?tab=filho`

### 4. Persistência local (check-in público)

- **Check-in**: streak e pontos salvos em `localStorage` (chave `maternilove-checkin-local`)
- **Perfil**: seções Pessoal e Filho salvos em `localStorage` (chave `maternilove-profile-local`)

### 5. Toast de sucesso

Ao clicar em **Salvar alterações** no Perfil, um toast deve aparecer na parte inferior: "✓ Alterações salvas com sucesso"

---

## Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `frontend/src/middleware.ts` | Ver `AUTH_ARCHITECTURE.md` |
| `frontend/src/app/app/(core-emotional)/core.store.ts` | Check-in local quando auth desabilitado |
| `frontend/src/app/app/(core-emotional)/check-in/page.tsx` | Redirect para /check-in |
| `frontend/src/app/app/(core-emotional)/relief/page.tsx` | Exibe resposta do check-in + streak/pontos |
| `frontend/src/app/app/inicio/page.tsx` | Mini-dashboard (semana, streak, pontos), `getCategoryImage` |
| `frontend/src/app/app/jornada/page.tsx` | Hero com imagem, timeline com painel ao clicar semana |
| `frontend/src/modules/journey/components/JourneyHeroCard.tsx` | Substitui FetalIllustration2D por imagem |
| `frontend/src/modules/journey/components/JourneyTimeline.tsx` | Trimestre labels, painel "O que acontece" ao clicar |
| `frontend/src/app/app/perfil/page.tsx` | Query `?tab=`, seções Pessoal e Filho, toast, localStorage |
| `frontend/src/modules/checkin/CheckinResponseEngine.ts` | **Novo** — engine determinístico |
| `frontend/src/lib/checkin/localCheckinStorage.ts` | **Novo** — persistência local check-in |
| `frontend/src/lib/checkin/checkinResponseStorage.ts` | **Novo** — resposta para relief |
| `frontend/src/lib/categoryImages.ts` | **Novo** — mapeamento categoria → imagem |
| `frontend/src/lib/profile/localProfileStorage.ts` | **Novo** — persistência local perfil |
| `frontend/src/lib/phases.ts` | **Novo** — estrutura de fases (GRAVIDEZ, POS_PARTO, BEBE, CRIANCA) para futuro 0–5 anos |
| `frontend/src/app/app/progresso/page.tsx` | Usa mockMaternalContext.gestationalWeek para semana atual |
| `frontend/.env.example` | Removido NEXT_PUBLIC_AUTH_DISABLED |
