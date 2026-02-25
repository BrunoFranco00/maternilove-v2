'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { CinematicProgressHero } from '@/components/CinematicProgressHero';
import { ProgressTimeline } from '@/components/ProgressTimeline';
import { mockMaternalContext } from '@/modules/feed/mock/maternalContext.mock';
import {
  getEstimatedLength,
  getEstimatedWeight,
  getWeekMilestone,
} from '@/premium/progressData';

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/50 border border-[#B3124F]/10">
      <p className="text-xs font-medium text-[#5F5F5F] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-base font-semibold text-[#1C1C1C]">{value}</p>
    </div>
  );
}

function ProgressoContent() {
  const semanaAtual = mockMaternalContext.gestationalWeek ?? 24;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">
          Progresso
        </h1>
        <p className="text-[#5F5F5F] mt-1 text-sm">
          Acompanhe o desenvolvimento da sua gestação
        </p>
      </div>

      {/* Hero 2.5D cinematográfico */}
      <CinematicProgressHero week={semanaAtual} />

      {/* Timeline horizontal */}
      <GlassCardV2>
        <div className="p-4">
          <h3 className="font-medium text-[#1C1C1C] mb-4 text-sm">
            Sua jornada
          </h3>
          <ProgressTimeline currentWeek={semanaAtual} />
        </div>
      </GlassCardV2>

      {/* Micro dados - 3 colunas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DataRow label="Comprimento estimado" value={getEstimatedLength(semanaAtual)} />
        <DataRow label="Peso estimado" value={getEstimatedWeight(semanaAtual)} />
        <DataRow label="Marco da semana" value={getWeekMilestone(semanaAtual)} />
      </div>

      {/* Card Amanhã */}
      <GlassCardV2 className="bg-[#FFF1F4]/40 border-[#B3124F]/20">
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-[#1C1C1C]">
            Amanhã você estará com {semanaAtual} semanas e 1 dia
          </h3>
          <p className="text-sm text-[#5F5F5F]">
            Pequenas mudanças acontecem a cada dia. Descubra o que vem pela frente.
          </p>
          <PremiumButtonV3 variant="ghost">
            Descobrir o que muda amanhã
          </PremiumButtonV3>
        </div>
      </GlassCardV2>
    </div>
  );
}

export default function ProgressoPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <ProgressoContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
