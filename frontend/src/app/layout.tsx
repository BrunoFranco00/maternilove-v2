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
  themeColor: '#B3124F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="msapplication-TileColor" content="#B3124F" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body suppressHydrationWarning className="focus-visible:outline-none">
        <div className="min-h-screen">
          <ErrorBoundary>
            <Providers>
              {children}
            </Providers>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}