'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { getArticlesForPhase } from '@/data/articles';
import type { Article } from '@/data/articles';

const HERO_IMAGES: Record<string, string> = {
  gravidez: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80',
  'recem-nascido': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80',
  '1-2 anos': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
  '3-5 anos': 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=1200&q=80',
  emocional: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80',
};

function getHeroImage(category: string): string {
  return HERO_IMAGES[category] || HERO_IMAGES.gravidez;
}

function ArticleHero({ article }: { article: Article }) {
  const heroImg = getHeroImage(article.category);
  return (
    <Link href={`/app/conteudo/${article.slug}`}>
      <GlassCardV2 className="overflow-hidden p-0">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImg}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-8 md:p-12 space-y-6">
          <span className="text-xs font-medium text-[#C2185B] uppercase tracking-[0.1em]">
            {article.category}
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1C1C1C] leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {article.title}
          </h2>
          <p className="text-lg text-[#5F5F5F] leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
          <PremiumButtonV3 variant="ghost">Ler mais</PremiumButtonV3>
        </div>
      </GlassCardV2>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const heroImg = getHeroImage(article.category);
  return (
    <Link href={`/app/conteudo/${article.slug}`}>
      <GlassCardV2 className="overflow-hidden p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImg}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-medium text-[#C2185B] uppercase tracking-wide">
            {article.category}
          </span>
          <h3 className="font-semibold text-[#1C1C1C] mt-2 line-clamp-2 text-lg">
            {article.title}
          </h3>
          <p className="text-sm text-[#5F5F5F] mt-1 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </GlassCardV2>
    </Link>
  );
}

function InicioContent() {
  const nome = 'Mãe';
  const semanas = 24;
  const artigos = getArticlesForPhase(semanas, 7);
  const [heroArticle, ...gridArticles] = artigos;

  return (
    <div className="space-y-12 md:space-y-16 max-w-6xl mx-auto">
      {/* Hero bem-vinda */}
      <GlassCardV2>
        <div className="relative z-10">
          <h1
            className="text-2xl md:text-4xl font-semibold text-[#1C1C1C] mb-1"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Bem-vinda, {nome}
          </h1>
          <p className="text-[#5F5F5F] text-base md:text-lg">
            Hoje você está com {semanas} semanas.
          </p>
        </div>
        <div
          className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-gradient-to-br from-[#C2185B]/20 to-[#FFF1F4] opacity-60 blur-2xl"
          aria-hidden
        />
      </GlassCardV2>

      {/* Grid: Check-in + Progresso */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <GlassCardV2>
          <h2 className="font-semibold text-lg text-[#1C1C1C] mb-2">
            Como você está?
          </h2>
          <p className="text-[#5F5F5F] text-sm mb-6">
            Registre seu check-in emocional
          </p>
          <Link href="/app/check-in">
            <PremiumButtonV3>Fazer check-in</PremiumButtonV3>
          </Link>
        </GlassCardV2>

        <Link href="/app/progresso">
          <GlassCardV2>
            <h2 className="font-semibold text-lg text-[#1C1C1C] mb-2">
              Progresso
            </h2>
            <p className="text-[#5F5F5F] text-sm">
              Semana {semanas} da gestação
            </p>
            <div
              className="absolute bottom-0 right-0 w-28 h-28 rounded-full bg-gradient-to-br from-[#C2185B]/20 to-[#FFF1F4] opacity-50 blur-xl -mr-8 -mb-8"
              aria-hidden
            />
          </GlassCardV2>
        </Link>
      </div>

      {/* Feed editorial premium */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2
            className="text-2xl md:text-3xl font-semibold text-[#1C1C1C]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Para você hoje
          </h2>
          <p className="text-[#5F5F5F] text-sm">
            Conteúdos selecionados para sua fase
          </p>
        </div>

        {heroArticle && (
          <div className="mb-12">
            <ArticleHero article={heroArticle} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {gridArticles.map((artigo) => (
            <ArticleCard key={artigo.id} article={artigo} />
          ))}
        </div>
      </section>

      {/* Acesso rápido */}
      <GlassCardV2 className="bg-[#FFF1F4]/30 border-[#C2185B]/20">
        <h2 className="font-semibold text-lg text-[#1C1C1C] mb-4">
          Acesso rápido
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/app/relief">
            <PremiumButtonV3 variant="ghost">Recursos</PremiumButtonV3>
          </Link>
          <Link href="/app/community">
            <PremiumButtonV3 variant="ghost">Comunidade</PremiumButtonV3>
          </Link>
          <Link href="/app/marketplace">
            <PremiumButtonV3 variant="ghost">Marketplace</PremiumButtonV3>
          </Link>
        </div>
      </GlassCardV2>
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
