'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/lib/i18n';
import { LoadingState } from '@/components/feedback/LoadingState';

export default function HomePage() {
  const router = useRouter();
  const { status } = useAuth();

  // Se autenticado, redirecionar para dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'unknown') {
    return <LoadingState />;
  }

  if (status === 'authenticated') {
    return null; // Redirecionando
  }

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
