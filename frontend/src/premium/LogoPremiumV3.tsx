'use client';

import { colors } from './foundation';

export function LogoPremiumV3({ size = 48 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[12px] overflow-hidden relative"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(ellipse at center, ${colors.primaryRose} 0%, ${colors.primaryRoseDark} 100%)`,
        boxShadow: `0 4px 20px rgba(194, 24, 91, 0.35), 0 0 40px rgba(194, 24, 91, 0.15)`,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="relative z-10"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          filter: `
            drop-shadow(0 1px 2px rgba(0,0,0,0.25))
            drop-shadow(0 -1px 0 rgba(255,255,255,0.4))
            drop-shadow(1px 0 0 rgba(255,255,255,0.25))
          `,
        }}
        fill="white"
      >
        {/* Coração com highlight superior esquerdo + inner shadow simulada */}
        <defs>
          <linearGradient
            id="heart-shine"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="heart-inner" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset in="SourceAlpha" dx="1" dy="1" />
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="white"
        />
        {/* Highlight superior esquerdo */}
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#heart-shine)"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
