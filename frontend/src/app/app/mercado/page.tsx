'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';

function MercadoContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Mercado
        </h1>
        <p className="text-text-secondary mt-1">
          Produtos e serviços para sua jornada
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardPremium key={i}>
            <div className="aspect-[4/3] bg-ml-rosa-100 rounded-t-ml-2xl flex items-center justify-center">
              <span className="text-ml-rosa-500 text-2xl">Produto</span>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-text-primary">Produto placeholder {i}</h3>
              <p className="text-sm text-text-secondary mt-1">Em breve</p>
            </div>
          </CardPremium>
        ))}
      </div>
    </div>
  );
}

export default function MercadoPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <MercadoContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
