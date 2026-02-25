'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';

const FILTERS = ['Todas', '1º trimestre', '2º trimestre', '3º trimestre', 'Pós-parto'] as const;

function ComunidadeContent() {
  const [activeFilter, setActiveFilter] = useState('Todas');

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1C1C1C]">
          Comunidade
        </h1>
        <p className="text-[#5F5F5F] mt-1">
          Conecte-se com outras mães e compartilhe experiências
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <PremiumButtonV3
            key={f}
            variant={activeFilter === f ? 'primary' : 'ghost'}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </PremiumButtonV3>
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <GlassCardV2 key={i}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFF1F4] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1C1C1C]">Post placeholder {i}</p>
                  <p className="text-sm text-[#5F5F5F] mt-1">
                    Conteúdo em desenvolvimento
                  </p>
                </div>
              </div>
            </div>
          </GlassCardV2>
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
