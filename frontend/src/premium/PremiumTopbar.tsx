'use client';

import Link from 'next/link';
import { LogoPremiumV3 } from './LogoPremiumV3';

export function PremiumTopbar() {
  return (
    <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white/60 backdrop-blur-xl border-b border-white/50">
      <Link href="/app/premium-preview" className="flex items-center gap-2">
        <LogoPremiumV3 size={36} />
        <span className="font-semibold text-[#1C1C1C]">MaterniLove</span>
      </Link>
      <Link
        href="/app/inicio"
        className="text-sm text-[#5F5F5F] hover:text-[#C2185B] font-medium"
      >
        Voltar
      </Link>
    </header>
  );
}
