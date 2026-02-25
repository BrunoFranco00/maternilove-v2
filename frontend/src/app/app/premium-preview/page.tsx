'use client';

import { PremiumLayout } from '@/premium/PremiumLayout';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';

function InicioPreview() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <GlassCardV2>
        <h1 className="font-title text-2xl md:text-3xl font-semibold text-[#1C1C1C] mb-1">
          Bem-vinda, Mãe
        </h1>
        <p className="text-[#5F5F5F] text-base">
          Hoje você está com 24 semanas.
        </p>
      </GlassCardV2>

      {/* Check-in + Progresso */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCardV2>
          <h2 className="font-title text-lg font-semibold text-[#1C1C1C] mb-2">
            Como você está?
          </h2>
          <p className="text-[#5F5F5F] text-sm mb-6">
            Registre seu check-in emocional
          </p>
          <PremiumButtonV3>Fazer check-in</PremiumButtonV3>
        </GlassCardV2>

        <GlassCardV2>
          <h2 className="font-title text-lg font-semibold text-[#1C1C1C] mb-2">
            Progresso
          </h2>
          <p className="text-[#5F5F5F] text-sm">
            Semana 24 da gestação
          </p>
        </GlassCardV2>
      </div>

      {/* Para você hoje */}
      <section>
        <div className="mb-6">
          <h2 className="font-title text-2xl font-semibold text-[#1C1C1C]">
            Para você hoje
          </h2>
          <p className="text-[#5F5F5F] text-sm mt-1">
            Conteúdos selecionados para sua fase
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <GlassCardV2 key={i}>
              <span className="text-xs font-medium text-[#C2185B] uppercase tracking-wide">
                Gravidez
              </span>
              <h3 className="font-title font-semibold text-[#1C1C1C] mt-2 line-clamp-2 text-lg">
                Artigo de exemplo {i}
              </h3>
              <p className="text-sm text-[#5F5F5F] mt-1 line-clamp-2">
                Resumo do conteúdo selecionado para sua fase atual.
              </p>
            </GlassCardV2>
          ))}
        </div>
      </section>

      {/* Acesso rápido */}
      <GlassCardV2 className="bg-[#FFF1F4]/30 border-[#C2185B]/20">
        <h2 className="font-title text-lg font-semibold text-[#1C1C1C] mb-4">
          Acesso rápido
        </h2>
        <div className="flex flex-wrap gap-3">
          <PremiumButtonV3 variant="ghost">Recursos</PremiumButtonV3>
          <PremiumButtonV3 variant="ghost">Comunidade</PremiumButtonV3>
          <PremiumButtonV3 variant="ghost">Marketplace</PremiumButtonV3>
        </div>
      </GlassCardV2>
    </div>
  );
}

function ProgressoPreview() {
  return (
    <div id="progresso" className="space-y-8 scroll-mt-24">
      <div>
        <h1 className="font-title text-2xl md:text-3xl font-semibold text-[#1C1C1C]">
          Progresso
        </h1>
        <p className="text-[#5F5F5F] mt-1">
          Acompanhe o desenvolvimento da sua gestação
        </p>
      </div>

      <GlassCardV2>
        <h3 className="font-semibold text-[#1C1C1C] mb-2">
          Semana atual
        </h3>
        <p className="text-3xl font-bold text-[#C2185B] mb-4">
          Semana 24
        </p>
        <p className="text-sm text-[#5F5F5F]">
          Dados fictícios para demonstração
        </p>
      </GlassCardV2>

      <GlassCardV2>
        <h3 className="font-medium text-[#1C1C1C] mb-4">
          Placeholder visual 3D
        </h3>
        <div className="h-40 rounded-xl bg-gradient-to-br from-[#FFF1F4] to-[#FFF8F9] flex items-center justify-center border border-[#C2185B]/10">
          <span className="text-[#5F5F5F] text-sm">Gráfico em breve</span>
        </div>
      </GlassCardV2>
    </div>
  );
}

export default function PremiumPreviewPage() {
  return (
    <PremiumLayout>
      <div className="space-y-16 max-w-4xl mx-auto">
        <section>
          <h2 className="sr-only">Início</h2>
          <InicioPreview />
        </section>
        <section>
          <ProgressoPreview />
        </section>
      </div>
    </PremiumLayout>
  );
}
