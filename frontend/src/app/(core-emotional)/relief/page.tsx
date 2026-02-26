'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCheckinResponseForRelief } from '@/lib/checkin/checkinResponseStorage';
import { getLocalCheckinState } from '@/lib/checkin/localCheckinStorage';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';

export const dynamic = 'force-dynamic';

const RELIEF_RESOURCES = [
  { title: 'Meditação', icon: '🧘', description: 'Exercícios de respiração e relaxamento' },
  { title: 'Música Relaxante', icon: '🎵', description: 'Playlists para acalmar e tranquilizar' },
  { title: 'Exercícios Físicos', icon: '💪', description: 'Atividades suaves para gestantes' },
  { title: 'Comunidade', icon: '👥', description: 'Acesso à comunidade' },
] as const;

export default function ReliefPublicPage() {
  const [response, setResponse] = useState<ReturnType<typeof getCheckinResponseForRelief>>(null);
  const [localState, setLocalState] = useState<ReturnType<typeof getLocalCheckinState> | null>(null);

  useEffect(() => {
    setResponse(getCheckinResponseForRelief());
    setLocalState(getLocalCheckinState());
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {response && (
          <GlassCardV2 className="p-6 md:p-8 bg-gradient-to-br from-[#FFF1F4]/90 to-[#FFF8F9] border-[#B3124F]/20">
            <h1 className="text-xl font-semibold text-[#1C1C1C] mb-2">
              {response.title}
            </h1>
            <p className="text-[#5F5F5F] text-base leading-relaxed mb-4">
              {response.message}
            </p>
            <p className="text-sm text-[#B3124F] font-medium mb-4">
              Sugestão: {response.suggestionLabel}
            </p>
            {(localState?.streakCount ?? 0) > 0 && (
              <p className="text-xs text-[#8E8E8E]">
                Sequência: {localState?.streakCount} dia(s) • {localState?.points ?? 0} pts
              </p>
            )}
          </GlassCardV2>
        )}

        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[#1C1C1C]">
            Recursos de Suporte
          </h2>
          <p className="text-[#5F5F5F] text-sm">
            Conteúdos para seu bem-estar
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {RELIEF_RESOURCES.map((item, index) => (
            <GlassCardV2
              key={index}
              className="p-6 transition-all duration-250 md:hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-[#1C1C1C] mb-2">{item.title}</h3>
              <p className="text-[#5F5F5F] text-sm mb-4">{item.description}</p>
              <PremiumButtonV3 variant="ghost">Explorar</PremiumButtonV3>
            </GlassCardV2>
          ))}
        </div>

        <div className="text-center">
          <Link href="/check-in">
            <PremiumButtonV3 variant="ghost">Novo check-in</PremiumButtonV3>
          </Link>
        </div>
      </div>
    </div>
  );
}
