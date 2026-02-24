'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';
import { Section } from '@/components/ui/Section';

function JornadaContent() {
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Jornada
        </h1>
        <p className="text-text-secondary mt-1">
          Acompanhe sua trajetória de maternidade
        </p>
      </div>

      <Section title="Diário">
        <CardPremium>
          <div className="p-6">
            <h3 className="font-medium text-text-primary mb-2">Card diário</h3>
            <p className="text-sm text-text-secondary">
              Registre seus momentos do dia
            </p>
          </div>
        </CardPremium>
      </Section>

      <Section title="Timeline">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <CardPremium key={i} hover={false}>
              <div className="p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-ml-rosa-400" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Etapa {i}
                  </p>
                  <p className="text-xs text-text-secondary">Placeholder</p>
                </div>
              </div>
            </CardPremium>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default function JornadaPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <JornadaContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
