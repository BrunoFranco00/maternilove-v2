'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

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
  const base = 'px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ease-out';
  const variants = {
    primary:
      'bg-gradient-to-r from-[#C2185B] to-[#8E0E3A] text-white shadow-[0_4px_14px_rgba(194,24,91,0.35)] hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(194,24,91,0.4)] active:scale-[0.97]',
    ghost:
      'bg-transparent text-[#5F5F5F] hover:bg-[#FFF1F4] hover:text-[#C2185B] active:scale-[0.97]',
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
