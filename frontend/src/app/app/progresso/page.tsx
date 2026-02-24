'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';

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

      <CardPremium>
        <div className="relative overflow-hidden p-8">
          <h3 className="font-semibold text-text-primary mb-2">
            Semana atual
          </h3>
          <p className="text-3xl font-bold text-ml-rosa-600 mb-4">
            Semana {semanaAtual}
          </p>
          <p className="text-sm text-text-secondary mb-6">
            Dados fictícios para demonstração
          </p>
          <div
            className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-ml-rosa-200 to-ml-rosa-300 opacity-50 blur-2xl"
            aria-hidden
          />
        </div>
      </CardPremium>

      <CardPremium hover={false}>
        <div className="p-6">
          <h3 className="font-medium text-text-primary mb-4">
            Placeholder visual 3D
          </h3>
          <div className="h-40 rounded-ml-lg bg-gradient-to-br from-ml-rosa-100 to-ml-rosa-200 flex items-center justify-center">
            <span className="text-text-secondary text-sm">Gráfico em breve</span>
          </div>
        </div>
      </CardPremium>
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
