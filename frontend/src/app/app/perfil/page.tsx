'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { AvatarPremium } from '@/components/ui/AvatarPremium';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { ProfileCompletionBar } from '@/modules/profile/components/ProfileCompletionBar';
import { ProfileSectionCard, type CompletionLevel } from '@/modules/profile/components/ProfileSectionCard';
import { calculateProfileCompletion, type MockProfileData } from '@/modules/profile/mock/profileCompletion.mock';
import { mockMaternalContext } from '@/modules/feed/mock/maternalContext.mock';

type TabId = 'gestacional' | 'saude' | 'estilo' | 'emocional';

interface ProfileData {
  dataPrevistaParto: string;
  semanasAtuais: string;
  gestacoesPrevias: string;
  partosNormais: string;
  cesareas: string;
  tipoSanguineo: string;
  condicoesCronicas: string;
  alergias: string;
  medicamentos: string;
  exercicios: string;
  alimentacao: string;
  horasSono: string;
  tabagismo: string;
  alcool: string;
  nivelEstresse: string;
  redeApoio: string;
  acompanhamentoPsicologico: string;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'gestacional', label: 'Dados Gestacionais' },
  { id: 'saude', label: 'Saúde' },
  { id: 'estilo', label: 'Estilo de Vida' },
  { id: 'emocional', label: 'Saúde Emocional' },
];

const INITIAL_DATA: ProfileData = {
  dataPrevistaParto: '',
  semanasAtuais: '',
  gestacoesPrevias: '',
  partosNormais: '',
  cesareas: '',
  tipoSanguineo: '',
  condicoesCronicas: '',
  alergias: '',
  medicamentos: '',
  exercicios: '',
  alimentacao: '',
  horasSono: '',
  tabagismo: '',
  alcool: '',
  nivelEstresse: '',
  redeApoio: '',
  acompanhamentoPsicologico: '',
};

function toMockProfileData(data: ProfileData): MockProfileData {
  return {
    dueDate: data.dataPrevistaParto || null,
    stage: mockMaternalContext.mode,
    gestationalWeek: data.semanasAtuais ? parseInt(data.semanasAtuais, 10) || null : null,
    health: {
      conditions: data.condicoesCronicas ? [data.condicoesCronicas] : [],
      medications: data.medicamentos ? [data.medicamentos] : [],
      allergies: data.alergias ? [data.alergias] : [],
      hasPrenatalCare: null,
    },
    lifestyle: {
      sleepQuality: data.horasSono ? parseInt(data.horasSono, 10) || null : null,
      activityLevel: null,
      nutritionFocus: data.alimentacao || null,
    },
    emotional: {
      baselineMood: mockMaternalContext.baseMood ?? null,
      stressLevel: data.nivelEstresse ? (data.nivelEstresse === 'baixo' ? 1 : data.nivelEstresse === 'moderado' ? 2 : 3) : null,
      supportNetwork: data.redeApoio ? (data.redeApoio === 'boa' ? 3 : data.redeApoio === 'limitada' ? 1 : 2) : null,
    },
    child: null,
    personal: null,
  };
}

function getSectionCompletion(data: ProfileData): Record<TabId, { level: CompletionLevel; description: string }> {
  const gestacionalFilled = [data.dataPrevistaParto, data.semanasAtuais].filter(Boolean).length;
  const saudeFilled = [data.tipoSanguineo, data.condicoesCronicas, data.alergias, data.medicamentos].filter(Boolean).length;
  const estiloFilled = [data.exercicios, data.alimentacao, data.horasSono, data.tabagismo, data.alcool].filter(Boolean).length;
  const emocionalFilled = [data.nivelEstresse, data.redeApoio, data.acompanhamentoPsicologico].filter(Boolean).length;

  return {
    gestacional: {
      level: gestacionalFilled >= 2 ? 'complete' : gestacionalFilled >= 1 ? 'partial' : 'pending',
      description: gestacionalFilled >= 2 ? 'Datas e histórico preenchidos' : gestacionalFilled >= 1 ? 'Faltam alguns campos' : 'Adicione data prevista e semanas',
    },
    saude: {
      level: saudeFilled >= 2 ? 'complete' : saudeFilled >= 1 ? 'partial' : 'pending',
      description: saudeFilled >= 2 ? 'Informações de saúde completas' : saudeFilled >= 1 ? 'Complete tipo sanguíneo e condições' : 'Registre tipo sanguíneo e condições',
    },
    estilo: {
      level: estiloFilled >= 3 ? 'complete' : estiloFilled >= 1 ? 'partial' : 'pending',
      description: estiloFilled >= 3 ? 'Estilo de vida registrado' : estiloFilled >= 1 ? 'Adicione exercícios, sono e alimentação' : 'Conte-nos sobre seus hábitos',
    },
    emocional: {
      level: emocionalFilled >= 2 ? 'complete' : emocionalFilled >= 1 ? 'partial' : 'pending',
      description: emocionalFilled >= 2 ? 'Saúde emocional acompanhada' : emocionalFilled >= 1 ? 'Complete nível de estresse e rede de apoio' : 'Como você está se sentindo?',
    },
  };
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-[12px] border border-[#B3124F]/20 bg-white text-[#1C1C1C] placeholder:text-[#5F5F5F]/60 focus:outline-none focus:ring-2 focus:ring-[#B3124F]/30 focus:border-[#B3124F]/40 transition-all"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-[12px] border border-[#B3124F]/20 bg-white text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B3124F]/30 focus:border-[#B3124F]/40 transition-all"
      >
        <option value="">Selecione</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PerfilContent() {
  const [activeTab, setActiveTab] = useState<TabId>('gestacional');
  const [data, setData] = useState<ProfileData>(INITIAL_DATA);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const mockData = toMockProfileData(data);
  const completion = calculateProfileCompletion({ ...mockData, stage: mockMaternalContext.mode });
  const sectionStatus = getSectionCompletion(data);

  const update = (key: keyof ProfileData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const stageLabel =
    mockMaternalContext.mode === 'PREGNANT'
      ? `Semana ${mockMaternalContext.gestationalWeek} • ${mockMaternalContext.trimester}º trimestre`
      : mockMaternalContext.mode === 'POSTPARTUM'
        ? 'Pós-parto'
        : mockMaternalContext.mode === 'HAS_CHILD'
          ? 'Mãe'
          : 'Tentante';

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto pb-16">
      {/* Cabeçalho com nome + estágio */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-start gap-4">
          <AvatarPremium size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1C1C]">Perfil</h1>
            <p className="text-[#5F5F5F] text-sm mt-1">
              {stageLabel}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ProfileCompletionBar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <GlassCardV2>
          <div className="p-5">
            <ProfileCompletionBar percentage={completion} />
          </div>
        </GlassCardV2>
      </motion.div>

      {/* Seções modulares */}
      <div className="space-y-4">
        {TABS.map((tab, i) => (
          <ProfileSectionCard
            key={tab.id}
            title={tab.label}
            description={sectionStatus[tab.id].description}
            isComplete={sectionStatus[tab.id].level === 'complete'}
            completionLevel={sectionStatus[tab.id].level}
            onEdit={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Form com abas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <div className="flex gap-1 p-1 rounded-xl bg-[#FFF1F4]/30 border border-[#B3124F]/15 overflow-x-auto">
          {TABS.map((tab) => (
            <PremiumButtonV3
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label}
            </PremiumButtonV3>
          ))}
        </div>

        <GlassCardV2 className="mt-4 transition-all duration-250 md:hover:shadow-[0_16px_48px_rgba(127,14,54,0.1)]">
          <div className="p-6 md:p-8">
            {activeTab === 'gestacional' && (
              <div className="space-y-4">
                <InputField label="Data prevista do parto" value={data.dataPrevistaParto} onChange={(v) => update('dataPrevistaParto', v)} type="date" />
                <InputField label="Semanas atuais" value={data.semanasAtuais} onChange={(v) => update('semanasAtuais', v)} placeholder="Ex: 24" />
                <InputField label="Gestações anteriores" value={data.gestacoesPrevias} onChange={(v) => update('gestacoesPrevias', v)} placeholder="Ex: 1" />
                <InputField label="Partos normais" value={data.partosNormais} onChange={(v) => update('partosNormais', v)} placeholder="Ex: 0" />
                <InputField label="Cesáreas" value={data.cesareas} onChange={(v) => update('cesareas', v)} placeholder="Ex: 1" />
              </div>
            )}

            {activeTab === 'saude' && (
              <div className="space-y-4">
                <SelectField label="Tipo sanguíneo" value={data.tipoSanguineo} onChange={(v) => update('tipoSanguineo', v)} options={[
                  { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' }, { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' }, { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
                ]} />
                <InputField label="Condições crônicas" value={data.condicoesCronicas} onChange={(v) => update('condicoesCronicas', v)} placeholder="Ex: diabetes, hipertensão" />
                <InputField label="Alergias" value={data.alergias} onChange={(v) => update('alergias', v)} placeholder="Ex: penicilina, látex" />
                <InputField label="Medicamentos em uso" value={data.medicamentos} onChange={(v) => update('medicamentos', v)} placeholder="Liste os medicamentos" />
              </div>
            )}

            {activeTab === 'estilo' && (
              <div className="space-y-4">
                <SelectField label="Prática de exercícios" value={data.exercicios} onChange={(v) => update('exercicios', v)} options={[
                  { value: 'nenhum', label: 'Nenhum' }, { value: 'leve', label: 'Leve (1-2x/semana)' }, { value: 'moderado', label: 'Moderado (3-4x/semana)' }, { value: 'intenso', label: 'Intenso (5+x/semana)' },
                ]} />
                <SelectField label="Alimentação" value={data.alimentacao} onChange={(v) => update('alimentacao', v)} options={[
                  { value: 'regular', label: 'Regular' }, { value: 'saudavel', label: 'Saudável' }, { value: 'restritiva', label: 'Restritiva' },
                ]} />
                <InputField label="Horas de sono por noite" value={data.horasSono} onChange={(v) => update('horasSono', v)} placeholder="Ex: 7" />
                <SelectField label="Tabagismo" value={data.tabagismo} onChange={(v) => update('tabagismo', v)} options={[
                  { value: 'nunca', label: 'Nunca' }, { value: 'parei', label: 'Parei na gestação' }, { value: 'ocasional', label: 'Ocasional' },
                ]} />
                <SelectField label="Consumo de álcool" value={data.alcool} onChange={(v) => update('alcool', v)} options={[
                  { value: 'nunca', label: 'Nunca' }, { value: 'parei', label: 'Parei na gestação' }, { value: 'ocasional', label: 'Ocasional' },
                ]} />
              </div>
            )}

            {activeTab === 'emocional' && (
              <div className="space-y-4">
                <SelectField label="Nível de estresse" value={data.nivelEstresse} onChange={(v) => update('nivelEstresse', v)} options={[
                  { value: 'baixo', label: 'Baixo' }, { value: 'moderado', label: 'Moderado' }, { value: 'alto', label: 'Alto' },
                ]} />
                <SelectField label="Rede de apoio" value={data.redeApoio} onChange={(v) => update('redeApoio', v)} options={[
                  { value: 'boa', label: 'Boa' }, { value: 'regular', label: 'Regular' }, { value: 'limitada', label: 'Limitada' },
                ]} />
                <SelectField label="Acompanhamento psicológico" value={data.acompanhamentoPsicologico} onChange={(v) => update('acompanhamentoPsicologico', v)} options={[
                  { value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }, { value: 'interesse', label: 'Tenho interesse' },
                ]} />
              </div>
            )}

            {/* Feedback contextual */}
            <div className="mt-6 pt-6 border-t border-[#B3124F]/15">
              <PremiumButtonV3 onClick={handleSave}>
                Salvar alterações
              </PremiumButtonV3>
              {savedFeedback && (
                <span className="ml-3 text-sm text-[#B3124F] font-medium">✓ Salvo</span>
              )}
              <p className="text-xs text-[#5F5F5F] mt-3">
                {sectionStatus[activeTab].level === 'complete'
                  ? 'Esta seção está completa. Você pode editar a qualquer momento.'
                  : sectionStatus[activeTab].level === 'partial'
                    ? 'Quase lá! Complete os campos acima para personalizar sua experiência.'
                    : 'Preencha as informações para receber conteúdos personalizados.'}
              </p>
            </div>
          </div>
        </GlassCardV2>
      </motion.div>
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
