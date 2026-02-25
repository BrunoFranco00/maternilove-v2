'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoPremiumV3 } from './LogoPremiumV3';

const MOBILE_NAV = [
  { href: '/app/inicio', label: 'Início' },
  { href: '/app/jornada', label: 'Jornada' },
  { href: '/app/comunidade', label: 'Comunidade' },
  { href: '/app/mercado', label: 'Mercado' },
  { href: '/app/perfil', label: 'Perfil' },
];

export function PremiumTopbar() {
  return (
    <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white/60 backdrop-blur-xl border-b border-white/50 relative z-20">
      <Link href="/app/inicio" className="flex items-center gap-2">
        <LogoPremiumV3 size={36} />
        <span className="font-semibold text-[#1C1C1C]">MaterniLove</span>
      </Link>
    </header>
  );
}

export function PremiumBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-t border-white/50">
      <div className="flex items-center justify-around h-14 px-2">
        {MOBILE_NAV.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center flex-1 min-w-0 py-2 text-[10px] font-medium transition-colors
                ${isActive ? 'text-[#C2185B]' : 'text-[#5F5F5F]'}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
