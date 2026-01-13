/**
 * Layout privado (PrivateShell)
 * Estrutura mínima: header simples + container
 * SEM sidebar complexa, SEM RBAC, SEM lógica
 */

import Link from 'next/link';
import { t } from '@/lib/i18n';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900"
              >
                {t('nav.dashboard')}
              </Link>
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
