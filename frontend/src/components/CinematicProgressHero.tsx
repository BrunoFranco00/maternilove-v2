'use client';

import { getSizeComparison } from '@/premium/progressData';
import { getEmotionalContext } from '@/premium/progressData';

/**
 * Ilustração 2.5D estilizada - silhueta fetal abstrata em SVG
 */
function FetalSilhouetteSVG() {
  return (
    <svg
      viewBox="0 0 120 160"
      className="w-full max-w-[180px] h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 12px rgba(179,18,79,0.15))' }}
    >
      <defs>
        <linearGradient id="fetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8C7D8" />
          <stop offset="50%" stopColor="#F3A9BF" />
          <stop offset="100%" stopColor="#E891A8" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="38" rx="26" ry="30" fill="url(#fetalGrad)" opacity="0.95" />
      <path
        d="M34 68 Q22 92 38 118 Q52 138 60 142 Q68 138 82 118 Q98 92 86 68 Q72 58 60 58 Q48 58 34 68"
        fill="url(#fetalGrad)"
        opacity="0.92"
      />
      <path d="M86 72 Q92 86 88 94 Q84 88 84 80 Z" fill="url(#fetalGrad)" opacity="0.88" />
    </svg>
  );
}

interface CinematicProgressHeroProps {
  week: number;
}

export function CinematicProgressHero({ week }: CinematicProgressHeroProps) {
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
          className="mb-6"
          style={{
            animation: 'floatGentle 6s ease-in-out infinite',
          }}
        >
          <FetalSilhouetteSVG />
        </div>

        <h2 className="text-2xl font-semibold text-[#1C1C1C] mb-1">
          Semana {week}
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
