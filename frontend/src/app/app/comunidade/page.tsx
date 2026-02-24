'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';

function ComunidadeContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Comunidade
        </h1>
        <p className="text-text-secondary mt-1">
          Conecte-se com outras mães e compartilhe experiências
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button className="px-4 py-2 rounded-ml-lg bg-ml-rosa-200 text-text-primary text-sm font-medium">
          Todas
        </button>
        <button className="px-4 py-2 rounded-ml-lg bg-ml-rosa-50 text-text-secondary text-sm font-medium hover:bg-ml-rosa-100">
          1º trimestre
        </button>
        <button className="px-4 py-2 rounded-ml-lg bg-ml-rosa-50 text-text-secondary text-sm font-medium hover:bg-ml-rosa-100">
          2º trimestre
        </button>
        <button className="px-4 py-2 rounded-ml-lg bg-ml-rosa-50 text-text-secondary text-sm font-medium hover:bg-ml-rosa-100">
          3º trimestre
        </button>
        <button className="px-4 py-2 rounded-ml-lg bg-ml-rosa-50 text-text-secondary text-sm font-medium hover:bg-ml-rosa-100">
          Pós-parto
        </button>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <CardPremium key={i}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-ml-rosa-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary">Post placeholder {i}</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Conteúdo em desenvolvimento
                  </p>
                </div>
              </div>
            </div>
          </CardPremium>
        ))}
      </div>
    </div>
  );
}

export default function ComunidadePage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <ComunidadeContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
