'use client';

import { ReactNode } from 'react';
import { PremiumSidebar } from './PremiumSidebar';
import { PremiumTopbar, PremiumBottomNav } from './PremiumTopbar';

interface PremiumLayoutProps {
  children: ReactNode;
}

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

export function PremiumLayout({ children }: PremiumLayoutProps) {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background radial suave */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 0%, #FFF5F8 0%, #FFE6EC 40%, #FFF8F9 70%, #FFF 100%)`,
        }}
      />
      {/* Overlay de noise leve */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url(${NOISE_SVG})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <PremiumSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <PremiumTopbar />
        <main className="flex-1 overflow-auto">
          <div
            className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pb-20 md:pb-12"
            style={{
              paddingTop: '48px',
              paddingBottom: '48px',
            }}
          >
            <div className="grid grid-cols-12 gap-6 md:gap-8">
              <div className="col-span-12">{children}</div>
            </div>
          </div>
        </main>
      </div>
      <PremiumBottomNav />
    </div>
  );
}
