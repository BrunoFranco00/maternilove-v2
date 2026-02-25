'use client';

import { ReactNode } from 'react';
import { PremiumSidebar } from './PremiumSidebar';
import { PremiumTopbar } from './PremiumTopbar';

interface PremiumLayoutProps {
  children: ReactNode;
}

export function PremiumLayout({ children }: PremiumLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF1F4] via-white to-[#FFF8F9] flex">
      <PremiumSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PremiumTopbar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
