'use client';

import { ReactNode } from 'react';
import { colors, shadows } from './foundation';

interface GlassCardV2Props {
  children: ReactNode;
  className?: string;
}

export function GlassCardV2({ children, className = '' }: GlassCardV2Props) {
  return (
    <div
      className={`
        rounded-[20px] p-6
        backdrop-blur-lg
        transition-all duration-[250ms] ease-out
        relative overflow-hidden
        md:hover:-translate-y-[6px]
        md:hover:shadow-[0_20px_60px_rgba(127,14,54,0.25),0_0_24px_rgba(179,18,79,0.18)]
        ${className}
      `}
      style={{
        background: colors.glassBackground,
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: shadows.depthMedium,
      }}
    >
      {/* Inner highlight top */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
        }}
      />
      {children}
    </div>
  );
}
