import type { Metadata } from 'next';
import { Providers } from '@/providers/Providers';
import { Header } from '@/components/layout/Header';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'MaterniLove',
  description: 'Sua jornada de maternidade começa aqui',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
