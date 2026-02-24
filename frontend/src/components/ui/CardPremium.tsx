'use client';

import { ReactNode } from 'react';

interface CardPremiumProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function CardPremium({ children, className = '', hover = true }: CardPremiumProps) {
  return (
    <div
      className={`
        rounded-ml-2xl bg-white border border-ml-rosa-200/30 shadow-ml-md
        transition-all duration-200 ease-out
        ${hover ? 'hover:shadow-ml-lg hover:border-ml-rosa-300/40' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
