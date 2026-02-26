'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { t } from '@/lib/i18n';

export function PrivateLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const homeHref = '/app/inicio';

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href={homeHref} className="text-xl font-bold text-gray-900">
                MaterniLove
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/app/check-in" className="text-gray-700 hover:text-gray-900 text-sm">
                Check-in
              </Link>
              <Link href={homeHref} className="text-gray-700 hover:text-gray-900">
                {t('nav.dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
