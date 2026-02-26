'use client';

import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import Link from 'next/link';

interface FeedHeroProps {
  /** Semana gestacional ou idade em meses do bebê */
  weekOrAge: number | null;
  /** 'week' | 'age' para ajustar texto */
  unit: 'week' | 'age' | null;
  /** Frase emocional adaptada ao contexto */
  emotionalPhrase: string;
}

export function FeedHero({ weekOrAge, unit, emotionalPhrase }: FeedHeroProps) {
  const displayText =
    unit === 'week' && weekOrAge != null
      ? `Semana ${weekOrAge}`
      : unit === 'age' && weekOrAge != null
        ? `${weekOrAge} ${weekOrAge === 1 ? 'mês' : 'meses'}`
        : null;

  return (
    <GlassCardV2 className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-[#FFF1F4]/95 via-[#FFE8EE]/90 to-[#FDF2F8]/95 border-[#B3124F]/20 shadow-[0_12px_40px_rgba(179,18,79,0.12)]">
      <div className="relative z-10">
        {displayText && (
          <p className="text-sm font-medium text-[#B3124F] uppercase tracking-[0.12em] mb-1">
            {displayText}
          </p>
        )}
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1C1C1C] leading-tight mb-3">
          {emotionalPhrase}
        </h1>
        <Link href="/app/check-in">
          <PremiumButtonV3 variant="ghost" className="mt-2">
            Como você está hoje?
          </PremiumButtonV3>
        </Link>
      </div>
    </GlassCardV2>
  );
}
