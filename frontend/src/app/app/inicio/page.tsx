'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { getArticlesForPhase } from '@/data/articles';
import type { Article } from '@/data/articles';
import { shadows } from '@/premium/foundation';

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

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return { ref, visible };
}

function ArticleHero({ article }: { article: Article }) {
  const heroImg = getHeroImage(article.category);
  const { ref, visible } = useFadeIn();

  return (
    <Link href={`/app/conteudo/${article.slug}`} className="block">
      <div
        ref={ref}
        className="rounded-[24px] overflow-hidden transition-opacity duration-250 md:hover:opacity-95"
        style={{
          boxShadow: shadows.depthMedium,
          opacity: visible ? 1 : 0,
          transition: 'opacity 250ms ease',
        }}
      >
        <div className="relative aspect-[4/3] sm:aspect-[21/9] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImg}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6 space-y-4">
          <span className="text-xs font-medium text-[#C2185B] uppercase tracking-[0.1em]">
            {article.category}
          </span>
          <h2 className="text-2xl font-semibold text-[#1C1C1C] leading-tight" style={{ fontSize: '24px', fontWeight: 600 }}>
            {article.title}
          </h2>
          <p className="text-[#5F5F5F] text-base leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
          <PremiumButtonV3 variant="ghost">Ler mais</PremiumButtonV3>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const heroImg = getHeroImage(article.category);
  const { ref, visible } = useFadeIn();

  return (
    <Link href={`/app/conteudo/${article.slug}`}>
      <div
        ref={ref}
        className="rounded-[20px] overflow-hidden transition-all duration-250 md:hover:shadow-[0_20px_60px_rgba(142,14,58,0.25)]"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 250ms ease',
        }}
      >
        <GlassCardV2 className="p-0 flex flex-row overflow-hidden">
          <div className="w-24 sm:w-28 shrink-0 aspect-square sm:aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImg}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 p-4 flex flex-col justify-center">
            <span className="text-xs font-medium text-[#C2185B] uppercase tracking-wide">
              {article.category}
            </span>
            <h3 className="font-semibold text-[#1C1C1C] mt-1 line-clamp-2 text-base">
              {article.title}
            </h3>
            <p className="text-sm text-[#5F5F5F] mt-0.5 line-clamp-2">
              {article.excerpt}
            </p>
          </div>
        </GlassCardV2>
      </div>
    </Link>
  );
}

function InicioContent() {
  const nome = 'Mãe';
  const semanas = 24;
  const artigos = getArticlesForPhase(semanas, 7);
  const [heroArticle, ...gridArticles] = artigos;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Hero bem-vinda */}
      <GlassCardV2 className="transition-opacity duration-250">
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold text-[#1C1C1C] mb-1">
            Bem-vinda, {nome}
          </h1>
          <p className="text-[#5F5F5F] text-base">
            Hoje você está com {semanas} semanas.
          </p>
        </div>
      </GlassCardV2>

      {/* Grid: Check-in + Progresso */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCardV2 className="transition-opacity duration-250">
          <h2 className="font-semibold text-base text-[#1C1C1C] mb-2">
            Como você está?
          </h2>
          <p className="text-[#5F5F5F] text-xs mb-4">
            Check-in emocional
          </p>
          <Link href="/app/check-in">
            <PremiumButtonV3>Check-in</PremiumButtonV3>
          </Link>
        </GlassCardV2>

        <Link href="/app/progresso">
          <GlassCardV2 className="transition-opacity duration-250">
            <h2 className="font-semibold text-base text-[#1C1C1C] mb-2">
              Progresso
            </h2>
            <p className="text-[#5F5F5F] text-xs">
              Semana {semanas}
            </p>
          </GlassCardV2>
        </Link>
      </div>

      {/* Feed editorial mobile */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#1C1C1C]">
            Para você hoje
          </h2>
          <p className="text-[#5F5F5F] text-sm">
            Conteúdos para sua fase
          </p>
        </div>

        {heroArticle && (
          <div className="space-y-6" style={{ marginBottom: '24px' }}>
            <ArticleHero article={heroArticle} />
          </div>
        )}

        <div className="space-y-4">
          {gridArticles.map((artigo) => (
            <ArticleCard key={artigo.id} article={artigo} />
          ))}
        </div>
      </section>

      {/* Acesso rápido */}
      <GlassCardV2 className="bg-[#FFF1F4]/30 border-[#C2185B]/20 transition-opacity duration-250">
        <h2 className="font-semibold text-base text-[#1C1C1C] mb-3">
          Acesso rápido
        </h2>
        <div className="flex flex-wrap gap-2">
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
