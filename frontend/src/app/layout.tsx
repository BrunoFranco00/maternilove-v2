import type { Metadata, Viewport } from 'next';
import { Providers } from '@/providers/Providers';
import { ErrorBoundary } from '@/components/guards/ErrorBoundary';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'MaterniLove',
  description: 'Sua jornada de maternidade começa aqui',
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ec4899',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body suppressHydrationWarning className="focus-visible:outline-none">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}