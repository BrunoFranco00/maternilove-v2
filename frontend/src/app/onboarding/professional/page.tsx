'use client';

/**
 * Onboarding Professional - LOCK RBAC 1
 * Onboarding mínimo para role PROFESSIONAL
 */

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function OnboardingProfessionalContent() {
  const router = useRouter();
  const { completeOnboarding, user } = useAuth();

  const handleContinue = () => {
    completeOnboarding();
    router.push('/dashboard');
  };

  if (!user) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Bem-vindo ao MaterniLove!
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Estamos felizes em ter você conosco. Vamos configurar seu perfil profissional.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Próximos passos:</strong>
              </p>
              <ul className="mt-2 space-y-2 text-sm text-green-700 list-disc list-inside">
                <li>Complete seu perfil profissional</li>
                <li>Configure suas especialidades</li>
                <li>Explore oportunidades de atendimento</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Continuar para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingProfessionalPage() {
  return (
    <ProtectedRoute requiredRole="PROFESSIONAL">
      <OnboardingProfessionalContent />
    </ProtectedRoute>
  );
}
