'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoPremiumV3 } from './LogoPremiumV3';
import { PremiumButtonV3 } from './PremiumButtonV3';

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

export function PremiumSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white/60 backdrop-blur-xl border-r border-white/50 relative z-20">
      <div className="p-6 border-b border-white/50">
        <Link href="/app/inicio" className="flex items-center gap-3">
          <LogoPremiumV3 size={40} />
          <span className="font-semibold text-[#1C1C1C]">MaterniLove</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-[#FFF1F4] text-[#B3124F]' : 'text-[#5F5F5F] hover:bg-[#FFF1F4]/50'}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/50">
        <PremiumButtonV3
          variant="ghost"
          onClick={() => router.push('/login')}
          className="w-full text-left"
        >
          Sair
        </PremiumButtonV3>
      </div>
    </aside>
  );
}
