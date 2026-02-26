'use client';

import { getPregnancyWeekContent } from '@/lib/progress/progressContent';
import { getSizeComparison } from '@/premium/progressData';
import { getEmotionalContext } from '@/premium/progressData';

interface CinematicProgressHeroProps {
  week: number;
}

export function CinematicProgressHero({ week }: CinematicProgressHeroProps) {
  const content = getPregnancyWeekContent(week);
  const comparacao = getSizeComparison(week);
  const contextoEmocional = getEmotionalContext(week);

  return (
    <div
      className="relative overflow-hidden rounded-[24px] py-12 px-6"
      style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 40%, #F8C7D8 0%, #F5D5E0 40%, #F3E6EB 100%)',
      }}
    >
      {/* Micro partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#B3124F] opacity-30"
            style={{
              left: `${10 + i * 8}%`,
              top: `${15 + (i % 5) * 18}%`,
              animation: 'particlePulse 3s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Glow radial atrás */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(248,199,216,0.5) 0%, transparent 70%)',
        }}
      />

      <div className="relative flex flex-col items-center">
        <div
          className="mb-4 w-full max-w-[280px] aspect-video rounded-xl overflow-hidden"
          style={{ boxShadow: '0 8px 24px rgba(179,18,79,0.15)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-semibold text-[#1C1C1C] mb-1">
          {content.title}
        </h2>
        <p className="text-lg text-[#B3124F] font-medium mb-2">
          Ele está do tamanho de uma {comparacao}
        </p>
        <p className="text-sm text-[#5F5F5F] text-center max-w-md leading-relaxed">
          {contextoEmocional}
        </p>
      </div>
    </div>
  );
}
