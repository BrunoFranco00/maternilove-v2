'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

type PremiumButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function PremiumButton({
  children,
  variant = 'primary',
  href,
  className = '',
  ...props
}: PremiumButtonProps) {
  const base =
    'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ease-out';

  const variants = {
    primary: `
      bg-gradient-to-r from-[#C2185B] to-[#8E0E3A] text-white
      shadow-[0_4px_14px_rgba(194,24,91,0.35)]
      hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(194,24,91,0.4)]
      active:scale-[0.97] active:translate-y-0
    `,
    secondary: `
      bg-white/80 text-[#C2185B] border-2 border-[#C2185B]/30
      hover:bg-white hover:border-[#C2185B]/50 hover:translate-y-[-2px]
      active:scale-[0.97]
    `,
    ghost: `
      bg-transparent text-[#5F5F5F]
      hover:bg-[#FFF1F4] hover:text-[#C2185B]
      active:scale-[0.97]
    `,
  };

  const classes = `${base} ${variants[variant]} ${className}`.replace(/\s+/g, ' ').trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
