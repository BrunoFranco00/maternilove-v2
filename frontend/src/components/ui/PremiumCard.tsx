'use client';

import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function PremiumCard({
  children,
  className = '',
  hover = true,
}: PremiumCardProps) {
  return (
    <div
      className={`
        premium-card
        bg-[rgba(255,255,255,0.75)] backdrop-blur-xl
        rounded-[20px] border border-white/50
        shadow-premium-card
        transition-all duration-200 ease-out
        ${hover ? 'hover:shadow-premium-card-hover' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
