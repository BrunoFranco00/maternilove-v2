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
    'bg-transparent text-[#5F5F5F] hover:bg-[#FFF1F4] hover:text-[#C2185B] active:scale-[0.95] focus-visible:ring-[#C2185B]/30';

  const primaryClass =
    'text-white hover:brightness-105 active:scale-[0.95] focus-visible:ring-[#F8BBD0]';

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
