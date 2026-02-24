'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';
import { ButtonPremium } from '@/components/ui/ButtonPremium';

function MemoriasContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Memórias
        </h1>
        <p className="text-text-secondary mt-1">
          Guarde os momentos especiais da sua gestação
        </p>
      </div>

      <div className="flex justify-end">
        <ButtonPremium variant="primary">Upload</ButtonPremium>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardPremium key={i}>
            <div className="aspect-square rounded-ml-lg bg-ml-rosa-100 flex items-center justify-center">
              <span className="text-ml-rosa-500 text-4xl">+</span>
            </div>
            <div className="p-3">
              <p className="text-sm text-text-secondary">Placeholder</p>
            </div>
          </CardPremium>
        ))}
      </div>
    </div>
  );
}

export default function MemoriasPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <MemoriasContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
