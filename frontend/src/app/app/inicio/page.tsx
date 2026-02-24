'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { getArticlesForPhase } from '@/data/articles';
import type { Article } from '@/data/articles';

const CARD_SHADOW = '0 4px 20px rgba(0,0,0,0.04)';

function getImagePlaceholder(category: string) {
  const gradients: Record<string, string> = {
    gravidez: 'from-premium-primary/20 via-premium-soft-bg to-premium-primary/10',
    'recem-nascido': 'from-premium-primary/15 via-premium-soft-bg to-premium-primary/5',
    '1-2 anos': 'from-premium-primary/10 to-premium-soft-bg',
    '3-5 anos': 'from-premium-soft-bg to-premium-primary/15',
    emocional: 'from-premium-primary/25 via-premium-soft-bg to-premium-primary/5',
  };
  return gradients[category] || 'from-premium-soft-bg to-premium-primary/20';
}

function ArticleHero({ article }: { article: Article }) {
  return (
    <Link href={`/app/conteudo/${article.slug}`}>
      <PremiumCard hover={true}>
        <div className="overflow-hidden rounded-t-[20px]">
          <div
            className={`aspect-[21/9] bg-gradient-to-br ${getImagePlaceholder(article.category)} flex items-center justify-center`}
          >
            <span className="text-6xl opacity-30">♥</span>
          </div>
          <div className="p-8 md:p-10">
            <span className="font-title text-xs font-medium text-premium-primary uppercase tracking-widest">
              {article.category}
            </span>
            <h2 className="font-title text-2xl md:text-3xl font-semibold text-premium-text-primary mt-2 leading-tight">
              {article.title}
            </h2>
            <p className="text-premium-text-secondary mt-4 text-base leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          </div>
        </div>
      </PremiumCard>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/app/conteudo/${article.slug}`}>
      <PremiumCard hover={true}>
        <div
          className={`aspect-[4/3] bg-gradient-to-br ${getImagePlaceholder(article.category)} flex items-center justify-center rounded-t-[20px] overflow-hidden`}
        >
          <span className="text-4xl opacity-25">♥</span>
        </div>
        <div className="p-5">
          <span className="text-xs font-medium text-premium-primary uppercase tracking-wide">
            {article.category}
          </span>
          <h3 className="font-title font-semibold text-premium-text-primary mt-2 line-clamp-2 text-lg">
            {article.title}
          </h3>
          <p className="text-sm text-premium-text-secondary mt-1 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </PremiumCard>
    </Link>
  );
}

function InicioContent() {
  const nome = 'Mãe';
  const semanas = 24;
  const artigos = getArticlesForPhase(semanas, 7);
  const [heroArticle, ...gridArticles] = artigos;

  return (
    <div className="space-y-8 md:space-y-12 max-w-6xl mx-auto">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-[20px] bg-white/75 backdrop-blur-xl p-8 md:p-10 border border-white/50"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div className="relative z-10">
          <h1 className="font-title text-2xl md:text-4xl font-semibold text-premium-text-primary mb-1">
            Bem-vinda, {nome}
          </h1>
          <p className="font-body text-premium-text-secondary text-base md:text-lg">
            Hoje você está com {semanas} semanas.
          </p>
        </div>
        <div
          className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-gradient-to-br from-premium-primary/20 to-premium-soft-bg opacity-60 blur-2xl"
          aria-hidden
        />
      </div>

      {/* Grid: Check-in + Progresso */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div
          className="rounded-[20px] bg-white/75 backdrop-blur-xl p-6 md:p-8 border border-white/50 transition-shadow hover:shadow-premium-card-hover"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <h2 className="font-title text-lg font-semibold text-premium-text-primary mb-2">
            Como você está?
          </h2>
          <p className="text-premium-text-secondary text-sm mb-6">
            Registre seu check-in emocional
          </p>
          <Link
            href="/app/check-in"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-premium-primary to-premium-primary-dark text-white font-medium hover:shadow-premium-button-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            Fazer check-in
          </Link>
        </div>

        <div
          className="relative overflow-hidden rounded-[20px] bg-white/75 backdrop-blur-xl p-6 md:p-8 border border-white/50"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <h2 className="font-title text-lg font-semibold text-premium-text-primary mb-2">
            Progresso
          </h2>
          <p className="text-premium-text-secondary text-sm mb-6">
            Semana {semanas} da gestação
          </p>
          <div
            className="absolute bottom-0 right-0 w-28 h-28 rounded-full bg-gradient-to-br from-premium-primary/20 to-premium-soft-bg opacity-50 blur-xl -mr-8 -mb-8"
            aria-hidden
          />
        </div>
      </div>

      {/* Feed editorial premium */}
      <section>
        <div className="mb-6">
          <h2 className="font-title text-2xl font-semibold text-premium-text-primary">
            Para você hoje
          </h2>
          <p className="text-premium-text-secondary text-sm mt-1">
            Conteúdos selecionados para sua fase
          </p>
        </div>

        {/* Hero article */}
        {heroArticle && <ArticleHero article={heroArticle} />}

        {/* Grid 2 colunas */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {gridArticles.map((artigo) => (
            <ArticleCard key={artigo.id} article={artigo} />
          ))}
        </div>
      </section>

      {/* Bloco de destaque */}
      <div className="rounded-[20px] bg-premium-soft-bg/50 p-6 md:p-8 border border-premium-primary/10">
        <h2 className="font-title text-lg font-semibold text-premium-text-primary mb-4">
          Acesso rápido
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/relief"
            className="px-4 py-2 rounded-xl bg-white/80 text-premium-text-secondary text-sm font-medium hover:bg-white hover:text-premium-primary transition-all border border-white/50"
          >
            Recursos
          </Link>
          <Link
            href="/app/community"
            className="px-4 py-2 rounded-xl bg-white/80 text-premium-text-secondary text-sm font-medium hover:bg-white hover:text-premium-primary transition-all border border-white/50"
          >
            Comunidade
          </Link>
          <Link
            href="/app/marketplace"
            className="px-4 py-2 rounded-xl bg-white/80 text-premium-text-secondary text-sm font-medium hover:bg-white hover:text-premium-primary transition-all border border-white/50"
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InicioPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <InicioContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
