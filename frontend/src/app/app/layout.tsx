'use client';

import { AppNavigation } from '@/components/layout/AppNavigation';

/**
 * Layout da plataforma logada (/app/*)
 * Sidebar desktop + bottom nav mobile — visual LinkedIn + Notion + Apple
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <AppNavigation />

      {/* Conteúdo principal */}
      <main className="flex-1 md:ml-64 pb-16 md:pb-0 px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
