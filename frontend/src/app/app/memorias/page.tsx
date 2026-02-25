'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';

function MemoriasContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1C1C1C]">
          Memórias
        </h1>
        <p className="text-[#5F5F5F] mt-1">
          Guarde os momentos especiais da sua gestação
        </p>
      </div>

      <div className="flex justify-end">
        <PremiumButtonV3>Upload</PremiumButtonV3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GlassCardV2 key={i}>
            <div className="aspect-square rounded-xl bg-[#FFF1F4] flex items-center justify-center">
              <span className="text-[#B3124F] text-4xl">+</span>
            </div>
            <div className="p-3">
              <p className="text-sm text-[#5F5F5F]">Placeholder</p>
            </div>
          </GlassCardV2>
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
