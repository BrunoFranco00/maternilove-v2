'use client';

import { ReactNode } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileBottomNav } from './MobileBottomNav';

interface MobileLayoutProps {
  children: ReactNode;
}

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background radial suave */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 0%, #FFF5F8 0%, #FFE6EC 40%, #FFF8F9 70%, #FFF 100%)`,
        }}
      />
      {/* Radial light center */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255,255,255,0.6) 0%, transparent 60%)',
        }}
      />
      {/* Overlay de noise leve */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url(${NOISE_SVG})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <MobileTopBar />

      <main className="flex-1 overflow-y-auto pb-20">
        <div
          className="px-5 py-6 min-h-full"
          style={{ animation: 'pageTransitionSmooth 280ms cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
        >
          {children}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
