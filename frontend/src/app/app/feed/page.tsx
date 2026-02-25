'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { FeedHero } from '@/modules/feed/components/FeedHero';
import { FeedSection } from '@/modules/feed/components/FeedSection';
import { ContentCard } from '@/modules/feed/components/ContentCard';
import { mockMaternalContext } from '@/modules/feed/mock/maternalContext.mock';

/** Item de conteúdo com metadados para ranking contextual */
interface FeedContentItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  isProfessional?: boolean;
  contentFocus?: string;
  trimester?: number;
  mood?: string;
  priority?: number;
}

// ---- Mock arrays locais ----
const MOCK_PARA_VOCE_HOJE: FeedContentItem[] = [
  { id: '1', title: 'Ansiedade na gravidez: como lidar', summary: 'Estratégias práticas para acalmar a mente no segundo trimestre.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80', contentFocus: 'PREGNANCY', trimester: 2, mood: 'ANXIOUS' },
  { id: '2', title: 'Movimentos do bebê: o que esperar', summary: 'Aprenda a reconhecer os primeiros chutes e o que significam.', image: 'https://images.unsplash.com/photo-1612349316228-2c8c33a7c5f8?w=600&q=80', contentFocus: 'PREGNANCY', trimester: 2 },
  { id: '3', title: 'Nutrição no 2º trimestre', summary: 'Alimentos essenciais para você e o desenvolvimento do bebê.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', contentFocus: 'PREGNANCY', trimester: 2 },
  { id: '4', title: 'Respiração e relaxamento', summary: 'Técnicas simples para momentos de tensão.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', mood: 'ANXIOUS' },
];

const MOCK_BASEADO_NA_FASE: FeedContentItem[] = [
  { id: '5', title: 'Semana 24: desenvolvimento do bebê', summary: 'O que está acontecendo com seu pequeno nesta fase.', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80', contentFocus: 'PREGNANCY', trimester: 2 },
  { id: '6', title: 'Preparando o quarto', summary: 'Checklist e ideias para organizar o espaço.', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80', contentFocus: 'PREGNANCY', trimester: 2 },
  { id: '7', title: 'Sono na gravidez', summary: 'Dicas para dormir melhor no segundo trimestre.', image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=600&q=80', contentFocus: 'PREGNANCY', trimester: 2 },
];

const MOCK_PROFISSIONAIS: FeedContentItem[] = [
  { id: '8', title: 'Pré-natal de alto risco: mitos e verdades', summary: 'Por Dra. Ana Costa, obstetra.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', isProfessional: true, contentFocus: 'PREGNANCY' },
  { id: '9', title: 'Saúde mental na gravidez', summary: 'Por Dr. Pedro Souza, psicólogo perinatal.', image: 'https://images.unsplash.com/photo-1612349317153-e403a0b0f77e?w=600&q=80', isProfessional: true, contentFocus: 'PREGNANCY', mood: 'ANXIOUS' },
  { id: '10', title: 'Exercícios seguros no 2º trimestre', summary: 'Por Dra. Marina Lima, fisioterapeuta.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', isProfessional: true, contentFocus: 'PREGNANCY', trimester: 2 },
];

const MOCK_EXPLORAR: FeedContentItem[] = [
  { id: '11', title: 'Comunidade MaterniLove', summary: 'Conecte-se com outras mães na mesma fase.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
  { id: '12', title: 'Marketplace', summary: 'Produtos curados para gestantes e bebês.', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80' },
  { id: '13', title: 'Minha jornada', summary: 'Acompanhe sua evolução semana a semana.', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80' },
];

/** Engine de ranking: score baseado no contexto materno */
function calculateScore(
  context: { contentFocus: string; trimester?: number | null; baseMood?: string | null },
  item: FeedContentItem
): number {
  let score = 0;
  if (item.contentFocus && item.contentFocus === context.contentFocus) score += 50;
  if (item.trimester != null && item.trimester === context.trimester) score += 20;
  if (item.mood && item.mood === context.baseMood) score += 15;
  return score;
}

/** Ordena array por score (maior primeiro) e retorna cópia */
function rankByContext<T extends FeedContentItem>(
  items: T[],
  context: { contentFocus: string; trimester?: number | null; baseMood?: string | null }
): T[] {
  return [...items].sort((a, b) => calculateScore(context, b) - calculateScore(context, a));
}

function getEmotionalPhrase(ctx: typeof mockMaternalContext): string {
  if (ctx.mode === 'PREGNANT') {
    if (ctx.baseMood === 'ANXIOUS') return 'Você está fazendo um trabalho incrível. Respire fundo.';
    if (ctx.baseMood === 'TIRED') return 'Cada dia é uma conquista. Descanse quando precisar.';
    return 'Que etapa especial! Cuide de você.';
  }
  if (ctx.mode === 'POSTPARTUM' || ctx.mode === 'HAS_CHILD') {
    return 'Cada fase traz novos aprendizados. Você está indo bem.';
  }
  return 'Bem-vinda à sua jornada. Estamos aqui por você.';
}

function FeedContent() {
  const ctx = mockMaternalContext;

  const paraVoceHoje = rankByContext(MOCK_PARA_VOCE_HOJE, ctx);
  const baseadoNaFase = rankByContext(MOCK_BASEADO_NA_FASE, ctx);
  const profissionais = rankByContext(MOCK_PROFISSIONAIS, ctx);

  const weekOrAge =
    ctx.mode === 'PREGNANT' ? ctx.gestationalWeek : ctx.babyAgeMonths;
  const unit =
    ctx.mode === 'PREGNANT'
      ? ('week' as const)
      : ctx.mode === 'POSTPARTUM' || ctx.mode === 'HAS_CHILD'
        ? ('age' as const)
        : null;

  return (
    <div className="space-y-8 max-w-2xl mx-auto px-4 pb-12">
      <FeedHero
        weekOrAge={weekOrAge ?? null}
        unit={unit}
        emotionalPhrase={getEmotionalPhrase(ctx)}
      />

      <FeedSection title="Para você hoje">
        {paraVoceHoje.map((item) => (
          <Link key={item.id} href={`/app/conteudo/${item.id}`}>
            <ContentCard
              title={item.title}
              summary={item.summary}
              image={item.image}
              isProfessional={item.isProfessional}
              priority={item.priority}
            />
          </Link>
        ))}
      </FeedSection>

      <FeedSection title="Baseado na sua fase">
        {baseadoNaFase.map((item) => (
          <Link key={item.id} href={`/app/conteudo/${item.id}`}>
            <ContentCard
              title={item.title}
              summary={item.summary}
              image={item.image}
              isProfessional={item.isProfessional}
              priority={item.priority}
            />
          </Link>
        ))}
      </FeedSection>

      <FeedSection title="Profissionais recomendam">
        {profissionais.map((item) => (
          <Link key={item.id} href={`/app/conteudo/${item.id}`}>
            <ContentCard
              title={item.title}
              summary={item.summary}
              image={item.image}
              isProfessional={item.isProfessional}
              priority={item.priority}
            />
          </Link>
        ))}
      </FeedSection>

      <FeedSection title="Explorar">
        {MOCK_EXPLORAR.map((item) => (
          <Link key={item.id} href={item.id === '11' ? '/app/community' : item.id === '12' ? '/app/marketplace' : '/app/jornada'}>
            <ContentCard
              title={item.title}
              summary={item.summary}
              image={item.image}
              isProfessional={item.isProfessional}
              priority={item.priority}
            />
          </Link>
        ))}
      </FeedSection>
    </div>
  );
}

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <FeedContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
