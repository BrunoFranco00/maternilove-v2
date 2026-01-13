'use client';

/**
 * Layout privado (PrivateShell)
 * Estrutura mínima: header simples + container
 * Com botão de logout
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header simples */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                MaterniLove
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600">
                  {user.name}
                </span>
              )}
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900"
              >
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

      {/* Container principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
