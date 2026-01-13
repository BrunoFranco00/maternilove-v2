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
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('nav.login')}
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
          >
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </div>
  );
}
