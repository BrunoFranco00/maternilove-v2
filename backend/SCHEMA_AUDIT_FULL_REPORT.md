# Auditoria Estrutural Completa do Banco de Dados — MaterniLove v2

**Data da auditoria:** 2026-02-25  
**Arquivo analisado:** `backend/prisma/schema.prisma`  
**Objetivo:** Mapear estado atual antes de novas expansões.

---

## 1. MODELOS EXISTENTES (total: 37)

| # | Modelo | Descrição |
|---|--------|-----------|
| 1 | User | Usuário principal |
| 2 | AuthSession | Sessões de autenticação |
| 3 | EmotionalCheckin | Check-ins emocionais |
| 4 | UserFollower | Seguidores (N:N via tabela pivô) |
| 5 | Journey | Jornada (ex: gravidez, pós-parto) |
| 6 | JourneyStage | Estágios da jornada |
| 7 | Moment | Momentos na jornada |
| 8 | MomentComment | Comentários em momentos |
| 9 | SmartSuggestion | Sugestões inteligentes |
| 10 | SocialPost | Postagens sociais |
| 11 | SocialLike | Curtidas |
| 12 | SocialComment | Comentários em posts |
| 13 | Achievement | Conquistas |
| 14 | UserAchievement | Conquistas por usuário |
| 15 | LeaderboardEntry | Entradas no ranking |
| 16 | CommunityCategory | Categorias da comunidade |
| 17 | CommunityPost | Posts da comunidade |
| 18 | CommunityComment | Comentários em posts da comunidade |
| 19 | DirectMessage | Mensagens diretas |
| 20 | Professional | Perfil profissional |
| 21 | Appointment | Agendamentos |
| 22 | Company | Empresas |
| 23 | Product | Produtos |
| 24 | Order | Pedidos |
| 25 | OrderItem | Itens de pedido |
| 26 | Review | Avaliações |
| 27 | BlogPost | Posts do blog |
| 28 | Subscription | Assinaturas |
| 29 | Notification | Notificações |
| 30 | MaternalProfile | Perfil materno (gravidez, stage, dueDate) |
| 31 | MaternalPersonalData | Dados pessoais (nome, CPF, birthDate) |
| 32 | MaternalAddress | Endereço |
| 33 | MaternalHealth | Saúde (condições, medicações, alergias, pré-natal) |
| 34 | MaternalLifestyle | Estilo de vida (sono, atividade, nutrição) |
| 35 | MaternalEmotional | Saúde emocional |
| 36 | ChildProfile | Perfil do bebê/filho |
| 37 | AdminLog | Logs administrativos |

---

## 2. ENUMS EXISTENTES (total: 12)

| Enum | Valores |
|------|---------|
| UserRole | USER, MOTHER, PROFESSIONAL, COMPANY, ADMIN, SUPER_ADMIN, TESTER |
| UserStatus | ACTIVE, INACTIVE, SUSPENDED, DELETED |
| MoodType | HAPPY, CALM, TIRED, ANXIOUS, SAD, OVERWHELMED |
| JourneyType | PREGNANCY, POSTPARTUM, BABY_0_3M, BABY_3_6M, BABY_6_12M, BABY_1_2Y, BABY_2_3Y, BABY_3_5Y |
| PregnancyStage | TRYING, PREGNANT, POSTPARTUM, HAS_CHILD |
| PregnancyType | SINGLE, TWINS, MULTIPLE, UNKNOWN |
| ChildSex | FEMALE, MALE, UNKNOWN |
| ContentFocus | PREGNANCY, NEWBORN, TODDLER_1_2, TODDLER_3_5, POSTPARTUM, GENERAL |
| RiskFlag | DIABETES, HYPERTENSION, THYROID, ANEMIA, DEPRESSION, ANXIETY, OTHER |

---

## 3. RELACIONAMENTOS

### 3.1 Relacionamentos 1:1 (User como pivô)

| Modelo | Campo em User | Observação |
|--------|---------------|------------|
| Journey | journey | userId @unique |
| Professional | professional | userId @unique |
| Company | company | userId @unique |
| LeaderboardEntry | leaderboardEntries | userId @unique |
| MaternalProfile | maternalProfile | userId @unique |
| MaternalPersonalData | maternalPersonal | userId @unique |
| MaternalAddress | maternalAddress | userId @unique |
| MaternalHealth | maternalHealth | userId @unique |
| MaternalLifestyle | maternalLifestyle | userId @unique |
| MaternalEmotional | maternalEmotional | userId @unique |
| ChildProfile | childProfile | userId @unique |

### 3.2 Relacionamentos 1:N (User → muitos)

| Modelo filho | Campo FK | Observação |
|--------------|----------|------------|
| AuthSession | userId | |
| EmotionalCheckin | userId | |
| SocialPost | userId | |
| SocialLike | userId | |
| SocialComment | userId | |
| CommunityPost | userId | |
| CommunityComment | userId | |
| DirectMessage | senderId | |
| Order | userId | |
| Review | userId | |
| Notification | userId | |
| UserAchievement | userId | |
| Moment | userId | |
| UserFollower | followerId / followingId | N:N |

### 3.3 Outros relacionamentos

| Modelo | Relação | Com |
|--------|---------|-----|
| JourneyStage | N:1 | Journey |
| Moment | N:1 | Journey |
| SmartSuggestion | N:1 | Journey |
| SocialLike | N:1 | SocialPost, User |
| SocialComment | N:1 | SocialPost, User |
| CommunityPost | N:1 | CommunityCategory |
| Appointment | N:1 | Professional |
| Product | N:1 | Company |
| OrderItem | N:1 | Order, Product |
| Review | N:1 | Product?, Professional? |
| MomentComment | N:1 | Moment |

---

## 4. CAMPOS RELACIONADOS A: GRAVIDEZ, PERFIL, FILHO, SAÚDE

### 4.1 Gravidez

| Modelo | Campo | Tipo | Obrigatório? |
|--------|-------|------|--------------|
| Journey | type | JourneyType | sim (inclui PREGNANCY) |
| Journey | startDate | DateTime | sim |
| Journey | expectedDate | DateTime? | não |
| MaternalProfile | stage | PregnancyStage | sim (default HAS_CHILD) |
| MaternalProfile | dueDate | DateTime? | não |
| MaternalProfile | lastMenstrualPeriod | DateTime? | não |
| MaternalProfile | gestationalWeek | Int? | não |
| MaternalProfile | gestationalDay | Int? | não |
| MaternalProfile | pregnancyType | PregnancyType? | não |
| MaternalProfile | isHighRisk | Boolean? | não |
| MaternalProfile | riskFlags | RiskFlag[] | não (default []) |

### 4.2 Perfil / Dados Pessoais

| Modelo | Campo | Tipo | Obrigatório? |
|--------|-------|------|--------------|
| User | name | String | sim |
| MaternalPersonalData | fullName | String? | não |
| MaternalPersonalData | phone | String? | não |
| MaternalPersonalData | cpf | String? | não |
| MaternalPersonalData | birthDate | DateTime? | não |
| MaternalPersonalData | city, state, country | String? | não |

### 4.3 Filho / Bebê

| Modelo | Campo | Tipo | Obrigatório? |
|--------|-------|------|--------------|
| JourneyType | BABY_0_3M, BABY_3_6M... | enum | - |
| ChildProfile | childName | String? | não |
| ChildProfile | childSex | ChildSex? | não |
| ChildProfile | birthDate | DateTime? | não |
| ChildProfile | ageMonths | Int? | não |
| ChildProfile | notes | String? | não |

### 4.4 Estágio (stage)

| Modelo | Campo | Tipo | Observação |
|--------|-------|------|------------|
| Journey | currentStage | Int | estágio numérico da jornada |
| JourneyStage | stage | Int | número do estágio |
| MaternalProfile | stage | PregnancyStage | TRYING/PREGNANT/POSTPARTUM/HAS_CHILD |

### 4.5 Datas (dueDate, birthDate)

| Modelo | Campo | Tipo |
|--------|-------|------|
| Journey | expectedDate | DateTime? (similar a dueDate) |
| MaternalProfile | dueDate | DateTime? |
| MaternalPersonalData | birthDate | DateTime? |
| ChildProfile | birthDate | DateTime? |

### 4.6 Saúde

| Modelo | Campo | Tipo |
|--------|-------|------|
| MaternalHealth | conditions | String[] |
| MaternalHealth | medications | String[] |
| MaternalHealth | allergies | String[] |
| MaternalHealth | hasPrenatalCare | Boolean? |
| MaternalHealth | prenatalCareNotes | String? |
| MaternalLifestyle | sleepQuality | Int? |
| MaternalLifestyle | activityLevel | Int? |
| MaternalEmotional | baselineMood | MoodType? |
| MaternalEmotional | stressLevel | Int? |
| MaternalEmotional | supportNetwork | Int? |
| Moment | weight | Float? |
| MaternalProfile | riskFlags | RiskFlag[] |

---

## 5. CAMPOS OBRIGATÓRIOS VS OPCIONAIS

### Principais obrigatórios por modelo

| Modelo | Obrigatórios |
|--------|--------------|
| User | id, email, password, name, role, status, emailVerified, onboardingCompleted, createdAt, updatedAt |
| MaternalProfile | id, userId, stage, createdAt, updatedAt |
| MaternalPersonalData | id, userId, createdAt, updatedAt (resto opcional) |
| MaternalHealth | id, userId, conditions[], medications[], allergies[], createdAt, updatedAt |
| ChildProfile | id, userId, createdAt, updatedAt (resto opcional) |
| Journey | id, userId, type, startDate, currentStage, createdAt, updatedAt |

### Modelos com maioria opcional (exceto id/userId/timestamps)

- MaternalPersonalData, MaternalAddress, MaternalHealth, MaternalLifestyle, MaternalEmotional, ChildProfile

---

## 6. ÍNDICES E @UNIQUE

### @unique

| Modelo | Campo(s) |
|--------|----------|
| User | email |
| AuthSession | tokenHash |
| Journey | userId |
| UserFollower | [followerId, followingId] |
| SocialLike | [postId, userId] |
| Achievement | name |
| UserAchievement | [userId, achievementId] |
| LeaderboardEntry | userId |
| CommunityCategory | name |
| Professional | userId |
| Company | userId |
| BlogPost | slug |
| MaternalProfile | userId |
| MaternalPersonalData | userId |
| MaternalAddress | userId |
| MaternalHealth | userId |
| MaternalLifestyle | userId |
| MaternalEmotional | userId |
| ChildProfile | userId |

### @@index

Cada modelo possui índices em FKs e campos de filtro relevantes (userId, createdAt, etc.).

---

## 7. MIGRATIONS

| Nome da pasta | Descrição |
|---------------|-----------|
| 20260103225947_init | Schema inicial |
| 20250109210000_add_mother_role | Adiciona MOTHER ao UserRole |
| 20250109220000_add_onboarding_fields | onboardingCompleted, onboardingRole, onboardingAt |
| 20250116000000_add_tester_role_to_user_role_enum | Adiciona TESTER ao UserRole |
| 20260126120000_add_emotional_checkin_module | EmotionalCheckin + MoodType |
| 20260225114500_add_maternal_profile_domain | MaternalProfile, Maternal* e ChildProfile |

---

## 8. VERIFICAÇÃO: EXISTÊNCIA DE CONCEITOS

| Conceito | Existe? | Onde |
|----------|---------|------|
| MaternalProfile | ✅ Sim | Modelo MaternalProfile (userId unique) |
| Pregnancy | ❌ Não (modelo) | Conceito coberto por MaternalProfile + Journey (type PREGNANCY) |
| Child | ❌ Não (modelo) | Existe ChildProfile (1:1 User) |
| stage | ✅ Sim | Journey.currentStage (Int), JourneyStage.stage (Int), MaternalProfile.stage (PregnancyStage) |
| dueDate | ✅ Sim | MaternalProfile.dueDate, Journey.expectedDate (similar) |
| birthDate | ✅ Sim | MaternalPersonalData.birthDate, ChildProfile.birthDate |
| Campos de saúde | ✅ Sim | MaternalHealth (conditions, medications, allergies, prenatal), MaternalEmotional (mood, stress) |

---

## 9. RESUMO ESTRUTURAL ATUAL

- **37 modelos**
- **12 enums**
- **11 relacionamentos 1:1 com User** (Journey, Professional, Company, LeaderboardEntry, MaternalProfile + 6 Maternal* / ChildProfile)
- Domínio materno já implementado e integrado a User
- Journey e MaternalProfile coexistem: Journey para "jornada" de alto nível, MaternalProfile para perfil detalhado gestacional e saúde

---

## 10. PONTOS DE CONFLITO POSSÍVEIS

### 10.1 Duplicação conceitual: Journey vs MaternalProfile

| Aspecto | Journey | MaternalProfile |
|---------|---------|-----------------|
| Datas | startDate, expectedDate | dueDate, lastMenstrualPeriod |
| Stage | currentStage (Int) | stage (PregnancyStage enum) |
| Tipo | type (JourneyType: PREGNANCY, POSTPARTUM, BABY_*) | stage + gestationalWeek |

**Risco:** Duas fontes de verdade para "estágio de gravidez" e datas. Possível divergência se não houver sincronização.

**Recomendação:** Definir política clara: Journey = foco em momentos/linha do tempo; MaternalProfile = perfil estático para personalização. Evitar criar novos campos duplicados (ex.: novo dueDate) em outros modelos.

### 10.2 birthDate em múltiplos lugares

- `MaternalPersonalData.birthDate` — data de nascimento da mãe
- `ChildProfile.birthDate` — data de nascimento do bebê

**Recomendação:** Manter separados. Um novo modelo "Child" com múltiplos filhos exigiria ChildProfile virar 1:N (hoje é 1:1 por User).

### 10.3 expectedDate (Journey) vs dueDate (MaternalProfile)

- Journey.expectedDate — data esperada da jornada
- MaternalProfile.dueDate — data prevista do parto

**Recomendação:** Tratar como conceitos distintos mas relacionados. Se precisar unificar, preferir manter ambos e fazer sync no aplicativo, em vez de migrar dados.

---

## 11. PONTOS SEGUROS PARA EXPANSÃO

### 11.1 Novos modelos independentes

- Criar modelos que **não** referenciem User com @unique estável (ex.: tabelas de configuração, catálogos).
- Ex.: `ContentCategory`, `HealthTip`, `PregnancyArticle` (se não forem por usuário).

### 11.2 Expandir MaternalHealth

- Adicionar campos opcionais (ex.: `bloodType`, `rhFactor`) sem quebrar o existente.
- Manter arrays para conditions/medications/allergies; não migrar para relacionamentos sem planejamento.

### 11.3 Múltiplos filhos (ChildProfile → Child)

- Hoje: 1 ChildProfile por User.
- Expansão: criar model `Child` com `userId` e remover @unique em userId, permitindo N filhos por usuário.
- **Cuidado:** Migration para mover dados de ChildProfile → Child e ajustar FKs.

### 11.4 Novos enums

- Adicionar valores a enums existentes exige migration específica (ALTER TYPE ADD VALUE).
- Criar novos enums não conflita com o que já existe.

---

## 12. RECOMENDAÇÕES TÉCNICAS ANTES DE NOVAS TABELAS

1. **Evitar duplicação:** Não criar novo modelo "Pregnancy" ou "Child" genérico sem analisar overlap com MaternalProfile e ChildProfile.

2. **Política Journey vs MaternalProfile:** Documentar qual sistema é fonte de verdade para estágio/datas e onde o frontend deve priorizar cada um.

3. **ChildProfile 1:1 → 1:N:** Se for suportar múltiplos filhos, planejar migration e refatoração de código que usa ChildProfile.

4. **Índices compostos:** Antes de novos índices, medir impacto em volume e padrões de consulta.

5. **Migrations:** Manter estilo incremental; testar em cópia do banco antes de aplicar em produção.

6. **Soft delete:** User.deletedAt existe; Maternal*/ChildProfile não têm. Considerar padrão consistente se precisar de soft delete no domínio materno.

7. **Reuso de enums:** MoodType é compartilhado (EmotionalCheckin, MaternalEmotional). Evitar enums redundantes (ex.: novo "EmotionalState" que replique MoodType).

---

*Fim do relatório. Nenhuma alteração foi feita no schema ou migrations.*
