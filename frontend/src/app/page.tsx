'use client';

/**
 * Home Page - LOCK FRONTEND 1: Modo Base
 */

import Link from 'next/link';
import { t } from '@/lib/i18n';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('page.home.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('page.home.description')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/check-in"
            aria-label="Fazer check-in emocional"
            className="px-6 py-3 bg-[#B3124F] text-white rounded-md hover:bg-[#9A0E42] focus:outline-none focus:ring-2 focus:ring-[#B3124F] focus:ring-offset-2 transition-colors"
          >
            Check-in emocional
          </Link>
          <Link
            href="/login"
            aria-label="Acessar página de login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {t('nav.login')}
          </Link>
          <Link
            href="/register"
            aria-label="Acessar página de registro"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </div>
  );
}
