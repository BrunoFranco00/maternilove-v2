'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';

/**
 * Layout da plataforma logada (/app/*)
 * Estrutura pronta para sidebar ou bottom navigation
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-surface border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/app/dashboard" className="text-lg font-semibold text-text-primary">
                MaterniLove
              </Link>
              <nav className="hidden sm:flex items-center gap-4">
                <Link href="/app/dashboard" className="text-sm text-text-secondary hover:text-text-primary">
                  {t('nav.dashboard')}
                </Link>
                <Link href="/app/check-in" className="text-sm text-text-secondary hover:text-text-primary">
                  Check-in
                </Link>
                <Link href="/app/relief" className="text-sm text-text-secondary hover:text-text-primary">
                  Recursos
                </Link>
                <Link href="/app/community" className="text-sm text-text-secondary hover:text-text-primary">
                  Comunidade
                </Link>
                <Link href="/app/marketplace" className="text-sm text-text-secondary hover:text-text-primary">
                  Marketplace
                </Link>
                <Link href="/app/social" className="text-sm text-text-secondary hover:text-text-primary">
                  Social
                </Link>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
