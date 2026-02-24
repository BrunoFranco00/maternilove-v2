'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/app/inicio', label: 'Início' },
  { href: '/app/jornada', label: 'Jornada' },
  { href: '/app/progresso', label: 'Progresso' },
  { href: '/app/memorias', label: 'Memórias' },
  { href: '/app/comunidade', label: 'Comunidade' },
  { href: '/app/profissionais', label: 'Profissionais' },
  { href: '/app/mercado', label: 'Mercado' },
  { href: '/app/perfil', label: 'Perfil' },
] as const;

function NavItem({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
        ${isActive
          ? 'text-brand-primary bg-primary-50'
          : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
        }
      `}
    >
      {label}
    </Link>
  );
}

/**
 * Navegação híbrida: sidebar desktop + bottom nav mobile
 * Visual minimalista (LinkedIn + Notion + Apple)
 */
export function AppNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Sidebar Desktop — hidden em mobile */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface border-r border-gray-200 pt-6">
        <Link href="/app/inicio" className="px-5 mb-6">
          <span className="text-lg font-semibold text-text-primary">MaterniLove</span>
        </Link>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={pathname === item.href || pathname?.startsWith(item.href + '/')}
            />
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => router.push('/login')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-red-600 hover:bg-red-50/50 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Bottom Nav Mobile — 5 itens principais para uso confortável */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-gray-200">
        <div className="flex items-center justify-around h-14 px-2">
          {[
            NAV_ITEMS[0], // Início
            NAV_ITEMS[1], // Jornada
            NAV_ITEMS[4], // Comunidade
            NAV_ITEMS[6], // Mercado
            NAV_ITEMS[7], // Perfil
          ].map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center flex-1 min-w-0 py-1.5 text-[10px] font-medium transition-colors
                  ${isActive ? 'text-brand-primary' : 'text-text-secondary'}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
