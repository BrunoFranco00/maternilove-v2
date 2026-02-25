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
        hover:-translate-y-[6px]
        hover:shadow-[0_20px_60px_rgba(142,14,58,0.25)]
        ${className}
      `}
      style={{
        background: colors.glassBackground,
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: shadows.depthMedium,
      }}
    >
      {children}
    </div>
  );
}
