'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCoreStore } from '@/app/app/(core-emotional)/core.store';
import type { MoodType } from '@/types/dto/checkin.dto';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';

export const dynamic = 'force-dynamic';

const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true';

const MOODS: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'HAPPY', label: 'Feliz', emoji: '😊' },
  { value: 'CALM', label: 'Calma', emoji: '😌' },
  { value: 'TIRED', label: 'Cansada', emoji: '😴' },
  { value: 'ANXIOUS', label: 'Ansiosa', emoji: '😟' },
  { value: 'SAD', label: 'Triste', emoji: '😢' },
  { value: 'OVERWHELMED', label: 'Sobrecarregada', emoji: '😣' },
];

export default function CheckInPage() {
  const router = useRouter();
  const checkIn = useCoreStore((s) => s.checkIn);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async (mood: MoodType) => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkIn({ mood });
      if (result !== null) {
        router.push('/app/relief');
        return;
      }
      setError('Erro ao registrar check-in');
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 401 && !AUTH_DISABLED) {
        router.push('/login');
        return;
      }
      setError('Erro ao registrar check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard>
        <div className="p-4 md:p-6 max-w-2xl mx-auto pb-16">
          <GlassCardV2 className="p-6 md:p-8">
            <h1 className="text-xl font-semibold text-[#1C1C1C] mb-2">
              Como você está se sentindo?
            </h1>
            <p className="text-[#5F5F5F] text-sm mb-6">
              Escolha o que melhor descreve seu momento
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => handleCheckIn(m.value)}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 p-4 rounded-[16px] border border-[#B3124F]/20 bg-[#FFF1F4]/30 hover:bg-[#FFF1F4]/60 hover:border-[#B3124F]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-sm font-medium text-[#1C1C1C]">{m.label}</span>
                </button>
              ))}
            </div>
            {error && (
              <p className="text-[#B3124F] text-sm mt-4">{error}</p>
            )}
          </GlassCardV2>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
