'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';

function ProfissionaisContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1C1C1C]">
          Profissionais
        </h1>
        <p className="text-[#5F5F5F] mt-1">
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
          <GlassCardV2 key={i}>
            <div className="p-6">
              <div className="w-14 h-14 rounded-full bg-[#FFF1F4] mb-4" />
              <h3 className="font-semibold text-[#1C1C1C]">{item.titulo}</h3>
              <p className="text-sm text-[#5F5F5F] mt-1">{item.desc}</p>
            </div>
          </GlassCardV2>
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
