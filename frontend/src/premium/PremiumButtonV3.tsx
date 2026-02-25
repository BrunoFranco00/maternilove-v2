'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { colors, shadows } from './foundation';

interface PremiumButtonV3Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
}

export function PremiumButtonV3({
  children,
  variant = 'primary',
  className = '',
  ...props
}: PremiumButtonV3Props) {
  const base =
    'px-5 py-2.5 rounded-[16px] font-medium transition-all duration-[250ms] ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const ghostClass =
    'bg-transparent text-[#5F5F5F] hover:bg-[#FFF1F4] hover:text-[#B3124F] active:scale-[0.94] active:shadow-[0_2px_8px_rgba(127,14,54,0.12)] focus-visible:ring-[#B3124F]/30 md:hover:bg-[#FFF1F4]/80';

  const primaryClass =
    'text-white md:hover:brightness-105 md:hover:-translate-y-1 md:hover:shadow-[0_0_20px_rgba(179,18,79,0.25)] active:scale-[0.94] active:shadow-[0_2px_8px_rgba(127,14,54,0.12)] active:brightness-100 focus-visible:ring-[#F6A9C4]';

  return (
    <button
      type="button"
      className={`${base} ${variant === 'primary' ? primaryClass : ghostClass} ${className}`}
      style={
        variant === 'primary'
          ? {
              background: `linear-gradient(180deg, ${colors.primaryRose} 0%, ${colors.primaryRoseDark} 100%)`,
              boxShadow: shadows.depthMedium,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </button>
  );
}
