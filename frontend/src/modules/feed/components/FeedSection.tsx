'use client';

import { ReactNode } from 'react';

interface FeedSectionProps {
  title: string;
  children: ReactNode;
}

export function FeedSection({ title, children }: FeedSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-lg font-semibold text-[#1C1C1C]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
