'use client';

import Link from 'next/link';
import { LogoPremiumV3 } from './LogoPremiumV3';

export function MobileTopBar() {
  return (
    <header
      className="flex items-center justify-between h-[56px] px-5 shrink-0 relative z-20"
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.55)',
      }}
    >
      <Link href="/app/inicio" className="flex items-center gap-2">
        <LogoPremiumV3 size={32} />
        <span className="font-semibold text-[#1C1C1C] text-sm">MaterniLove</span>
      </Link>
      <Link
        href="/app/perfil"
        className="p-2 -mr-2 rounded-full text-[#5F5F5F] hover:text-[#B3124F] hover:bg-[#FFF1F4]/50 transition-colors duration-250"
        aria-label="Perfil"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>
    </header>
  );
}
