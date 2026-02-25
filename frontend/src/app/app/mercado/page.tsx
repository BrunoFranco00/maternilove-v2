'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';

function MercadoContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1C1C1C]">
          Mercado
        </h1>
        <p className="text-[#5F5F5F] mt-1">
          Produtos e serviços para sua jornada
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GlassCardV2 key={i}>
            <div className="aspect-[4/3] bg-[#FFF1F4] rounded-t-xl flex items-center justify-center">
              <span className="text-[#B3124F] text-2xl">Produto</span>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#1C1C1C]">Produto placeholder {i}</h3>
              <p className="text-sm text-[#5F5F5F] mt-1">Em breve</p>
            </div>
          </GlassCardV2>
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
