'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';
import { AvatarPremium } from '@/components/ui/AvatarPremium';
import { ButtonPremium } from '@/components/ui/ButtonPremium';

function PerfilContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Perfil
        </h1>
        <p className="text-text-secondary mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      <CardPremium>
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <AvatarPremium size="lg" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary">
                Nome placeholder
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                email@exemplo.com
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Informações básicas em desenvolvimento
              </p>
              <ButtonPremium variant="secondary" className="mt-4">
                Editar
              </ButtonPremium>
            </div>
          </div>
        </div>
      </CardPremium>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <PerfilContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
