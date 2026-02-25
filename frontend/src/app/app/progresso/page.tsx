'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';

const Progress3DModel = lazy(() =>
  import('@/components/Progress3DModel').then((m) => ({ default: m.Progress3DModel }))
);

function Skeleton3D() {
  return (
    <div className="w-full h-[200px] min-h-[200px] rounded-xl bg-gradient-to-br from-[#FFF1F4]/80 to-[#FFF8F9] flex flex-col items-center justify-center gap-3 border border-[#B3124F]/10">
      <div className="w-16 h-16 rounded-full bg-[#B3124F]/10 animate-pulse" />
      <span className="text-[#5F5F5F] text-sm font-medium">Carregando visual...</span>
    </div>
  );
}

function ProgressoContent() {
  const semanaAtual = 24;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1C1C1C]">
          Progresso
        </h1>
        <p className="text-[#5F5F5F] mt-1">
          Acompanhe o desenvolvimento da sua gestação
        </p>
      </div>

      <GlassCardV2>
        <div className="relative overflow-hidden p-8">
          <h3 className="font-semibold text-[#1C1C1C] mb-2">
            Semana atual
          </h3>
          <p className="text-3xl font-bold text-[#B3124F] mb-4">
            Semana {semanaAtual}
          </p>
          <p className="text-sm text-[#5F5F5F] mb-6">
            Dados fictícios para demonstração
          </p>
          <div
            className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#FFF1F4] to-[#F6A9C4] opacity-50 blur-2xl"
            aria-hidden
          />
        </div>
      </GlassCardV2>

      <GlassCardV2>
        <div className="p-6">
          <h3 className="font-medium text-[#1C1C1C] mb-4">
            Seu bebê nesta fase
          </h3>
          <Suspense fallback={<Skeleton3D />}>
            <Progress3DModel week={semanaAtual} />
          </Suspense>
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
