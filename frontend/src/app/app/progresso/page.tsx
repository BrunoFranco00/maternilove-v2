'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';

function ProgressoContent() {
  const semanaAtual = 24;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Progresso
        </h1>
        <p className="text-text-secondary mt-1">
          Acompanhe o desenvolvimento da sua gestação
        </p>
      </div>

      <GlassCardV2>
        <div className="relative overflow-hidden p-8">
          <h3 className="font-semibold text-[#1C1C1C] mb-2">
            Semana atual
          </h3>
          <p className="text-3xl font-bold text-[#C2185B] mb-4">
            Semana {semanaAtual}
          </p>
          <p className="text-sm text-[#5F5F5F] mb-6">
            Dados fictícios para demonstração
          </p>
          <div
            className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#FFF1F4] to-[#F8BBD0] opacity-50 blur-2xl"
            aria-hidden
          />
        </div>
      </GlassCardV2>

      <GlassCardV2>
        <div className="p-6">
          <h3 className="font-medium text-[#1C1C1C] mb-4">
            Placeholder visual 3D
          </h3>
          <div className="h-40 rounded-xl bg-gradient-to-br from-[#FFF1F4] to-[#FFF8F9] flex items-center justify-center border border-[#C2185B]/10">
            <span className="text-[#5F5F5F] text-sm">Gráfico em breve</span>
          </div>
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
