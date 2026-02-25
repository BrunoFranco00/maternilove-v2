'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoPremiumV3 } from './LogoPremiumV3';

const NAV_ITEMS = [
  { href: '/app/premium-preview', label: 'Início' },
  { href: '/app/premium-preview#progresso', label: 'Progresso' },
  { href: '/app/inicio', label: 'Voltar ao app' },
];

export function PremiumSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white/60 backdrop-blur-xl border-r border-white/50">
      <div className="p-6 border-b border-white/50">
        <Link href="/app/premium-preview" className="flex items-center gap-3">
          <LogoPremiumV3 size={40} />
          <span className="font-semibold text-[#1C1C1C]">MaterniLove</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-[#FFF1F4] text-[#C2185B]' : 'text-[#5F5F5F] hover:bg-[#FFF1F4]/50'}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
