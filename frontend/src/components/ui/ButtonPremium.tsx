'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

type ButtonPremiumProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function ButtonPremium({
  children,
  variant = 'primary',
  href,
  className = '',
  ...props
}: ButtonPremiumProps) {
  const base =
    'inline-flex items-center justify-center px-5 py-2.5 rounded-ml-lg font-medium transition-all duration-200 ease-out hover:shadow-ml-sm';

  const variants = {
    primary:
      'bg-ml-rosa-300 text-text-primary hover:bg-ml-rosa-400 active:scale-[0.98]',
    secondary:
      'bg-ml-rosa-100 text-text-primary hover:bg-ml-rosa-200 active:scale-[0.98]',
    ghost:
      'bg-transparent text-text-secondary hover:bg-ml-rosa-100 hover:text-text-primary',
  };

  const classes = `${base} ${variants[variant]} ${className}`;

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
