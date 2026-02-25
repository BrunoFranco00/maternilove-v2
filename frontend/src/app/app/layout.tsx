'use client';

import { MobileLayout } from '@/premium/MobileLayout';

/**
 * Layout da plataforma logada (/app/*)
 * Mobile-first premium — TopBar, main, BottomNav, radial gradient, noise
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileLayout>
      {children}
    </MobileLayout>
  );
}
