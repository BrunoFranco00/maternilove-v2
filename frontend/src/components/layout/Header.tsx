'use client';

/**
 * Header simples para LOCK FRONTEND 1
 */

import Link from 'next/link';
import { t } from '@/lib/i18n';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            MaterniLove
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/register"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              {t('nav.register')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
