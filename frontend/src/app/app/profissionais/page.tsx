'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';

function ProfissionaisContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Profissionais
        </h1>
        <p className="text-text-secondary mt-1">
          Encontre especialistas para acompanhar sua gestação
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { titulo: 'Obstetra', desc: 'Acompanhamento pré-natal' },
          { titulo: 'Doula', desc: 'Suporte no parto' },
          { titulo: 'Nutricionista', desc: 'Alimentação na gestação' },
          { titulo: 'Psicólogo', desc: 'Saúde emocional' },
        ].map((item, i) => (
          <CardPremium key={i}>
            <div className="p-6">
              <div className="w-14 h-14 rounded-full bg-ml-rosa-200 mb-4" />
              <h3 className="font-semibold text-text-primary">{item.titulo}</h3>
              <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
            </div>
          </CardPremium>
        ))}
      </div>
    </div>
  );
}

export default function ProfissionaisPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <ProfissionaisContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
