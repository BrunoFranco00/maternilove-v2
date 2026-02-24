'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';
import { getArticlesForPhase } from '@/data/articles';

const CARD_SHADOW = '0 4px 20px rgba(0,0,0,0.04)';

function InicioContent() {
  const nome = 'Mãe';
  const semanas = 24;
  const artigosParaVoce = getArticlesForPhase(semanas, 6);

  return (
    <div className="space-y-8 md:space-y-10 max-w-5xl mx-auto">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl bg-white p-8 md:p-10"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-text-primary mb-1">
            Bem-vinda, {nome}
          </h1>
          <p className="text-text-secondary text-base md:text-lg">
            Hoje você está com {semanas} semanas.
          </p>
        </div>
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-brand-rosa-light to-brand-rosa-soft opacity-60 blur-2xl"
          aria-hidden
        />
      </div>

      {/* Grid: Check-in + Progresso */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Card Check-in */}
        <div
          className="rounded-2xl bg-white p-6 md:p-8 border border-brand-rosa-soft/30 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Como você está?
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Registre seu check-in emocional
          </p>
          <Link
            href="/app/check-in"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-rosa-soft/80 text-text-primary font-medium hover:bg-brand-rosa-soft transition-all duration-200 hover:shadow-sm"
          >
            Fazer check-in
          </Link>
        </div>

        {/* Card Progresso */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 border border-gray-100"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Progresso
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Semana {semanas} da gestação
          </p>
          <div
            className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-brand-rosa-light to-brand-rosa-soft opacity-50 blur-xl -mr-6 -mb-6"
            aria-hidden
          />
        </div>
      </div>

      {/* Para você hoje */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Para você hoje
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          Conteúdos selecionados para sua fase
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artigosParaVoce.map((artigo) => (
            <Link key={artigo.id} href={`/app/conteudo/${artigo.slug}`}>
              <CardPremium>
                <div className="p-5">
                  <span className="text-xs font-medium text-ml-rosa-600 uppercase tracking-wide">
                    {artigo.category}
                  </span>
                  <h3 className="font-semibold text-text-primary mt-2 line-clamp-2">
                    {artigo.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {artigo.excerpt}
                  </p>
                </div>
              </CardPremium>
            </Link>
          ))}
        </div>
      </div>

      {/* Acesso rápido */}
      <div className="rounded-2xl bg-white p-6 md:p-8" style={{ boxShadow: CARD_SHADOW }}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Acesso rápido
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/relief"
            className="px-4 py-2 rounded-xl bg-gray-100 text-text-secondary text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Recursos
          </Link>
          <Link
            href="/app/community"
            className="px-4 py-2 rounded-xl bg-gray-100 text-text-secondary text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Comunidade
          </Link>
          <Link
            href="/app/marketplace"
            className="px-4 py-2 rounded-xl bg-gray-100 text-text-secondary text-sm font-medium hover:bg-gray-200 transition-colors"
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
