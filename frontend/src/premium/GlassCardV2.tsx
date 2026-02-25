'use client';

import { ReactNode } from 'react';

interface GlassCardV2Props {
  children: ReactNode;
  className?: string;
}

export function GlassCardV2({ children, className = '' }: GlassCardV2Props) {
  return (
    <div
      className={`
        rounded-[20px] p-6
        bg-white/75 backdrop-blur-xl
        border border-white/50
        shadow-[0_8px_32px_rgba(194,24,91,0.08)]
        hover:shadow-[0_12px_40px_rgba(194,24,91,0.12)]
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
