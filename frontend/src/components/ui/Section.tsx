'use client';

import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Section({ children, title, subtitle, className = '' }: SectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
