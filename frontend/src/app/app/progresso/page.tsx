'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { CinematicProgressHero } from '@/components/CinematicProgressHero';
import { ProgressTimeline } from '@/components/ProgressTimeline';
import { mockMaternalContext } from '@/modules/feed/mock/maternalContext.mock';
import { getPregnancyWeekContent, getChildMonthContent } from '@/lib/progress/progressContent';

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
  const ctx = mockMaternalContext;
  const isPregnancy = ctx.mode === 'PREGNANT';
  const semanaAtual = ctx.gestationalWeek ?? 24;
  const childAgeMonths = ctx.babyAgeMonths ?? 0;

  const pregnancyContent = getPregnancyWeekContent(semanaAtual);
  const childContent = getChildMonthContent(childAgeMonths);

  if (!isPregnancy && ctx.babyAgeMonths != null) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Progresso</h1>
          <p className="text-[#5F5F5F] mt-1 text-sm">Acompanhe o desenvolvimento do seu filho</p>
        </div>
        <GlassCardV2 className="overflow-hidden p-0">
          <div className="aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={childContent.image} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#1C1C1C]">{childContent.title}</h2>
            <p className="text-[#B3124F] font-medium mt-1">{childContent.subtitle}</p>
            <p className="text-sm text-[#5F5F5F] mt-2">{childContent.highlight}</p>
          </div>
        </GlassCardV2>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Progresso</h1>
        <p className="text-[#5F5F5F] mt-1 text-sm">Acompanhe o desenvolvimento da sua gestação</p>
      </div>

      <CinematicProgressHero week={semanaAtual} />

      <GlassCardV2>
        <div className="p-4">
          <h3 className="font-medium text-[#1C1C1C] mb-4 text-sm">Sua jornada</h3>
          <ProgressTimeline currentWeek={semanaAtual} />
        </div>
      </GlassCardV2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DataRow label="Comprimento estimado" value={pregnancyContent.lengthCm} />
        <DataRow label="Peso estimado" value={pregnancyContent.weightG} />
        <DataRow label="Destaque da semana" value={pregnancyContent.highlight} />
      </div>

      <GlassCardV2 className="bg-[#FFF1F4]/40 border-[#B3124F]/20">
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-[#1C1C1C]">
            Amanhã você estará com {semanaAtual} semanas e 1 dia
          </h3>
          <p className="text-sm text-[#5F5F5F]">{pregnancyContent.highlight}</p>
          <PremiumButtonV3 variant="ghost">Descobrir o que muda amanhã</PremiumButtonV3>
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
