'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';
import { AvatarPremium } from '@/components/ui/AvatarPremium';
import { ButtonPremium } from '@/components/ui/ButtonPremium';

type TabId = 'gestacional' | 'saude' | 'estilo' | 'emocional';

interface ProfileData {
  // Dados Gestacionais
  dataPrevistaParto: string;
  semanasAtuais: string;
  gestacoesPrevias: string;
  partosNormais: string;
  cesareas: string;
  // Saúde
  tipoSanguineo: string;
  condicoesCronicas: string;
  alergias: string;
  medicamentos: string;
  // Estilo de Vida
  exercicios: string;
  alimentacao: string;
  horasSono: string;
  tabagismo: string;
  alcool: string;
  // Saúde Emocional
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

function getProgress(data: ProfileData): number {
  const values = Object.values(data);
  const filled = values.filter((v) => v && v.trim() !== '').length;
  return Math.round((filled / values.length) * 100);
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
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-ml-lg border border-ml-rosa-200/50 bg-white text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-ml-rosa-300/50 focus:border-ml-rosa-300 transition-all"
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
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-ml-lg border border-ml-rosa-200/50 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-ml-rosa-300/50 focus:border-ml-rosa-300 transition-all"
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

  const progress = getProgress(data);

  const update = (key: keyof ProfileData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

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

      {/* Avatar + Progress */}
      <CardPremium hover={false}>
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <AvatarPremium size="lg" />
          <div className="flex-1 w-full">
            <h3 className="text-lg font-semibold text-text-primary">
              Seu perfil
            </h3>
            <p className="text-text-secondary text-sm mt-1 mb-4">
              Complete suas informações para personalizar sua experiência
            </p>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-text-secondary">Preenchimento</span>
                <span className="font-medium text-ml-rosa-600">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-ml-rosa-100 overflow-hidden">
                <div
                  className="h-full bg-ml-rosa-400 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardPremium>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-ml-lg bg-ml-rosa-50 border border-ml-rosa-200/30 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2.5 rounded-ml-md text-sm font-medium whitespace-nowrap transition-all
              ${
                activeTab === tab.id
                  ? 'bg-white text-ml-rosa-600 shadow-ml-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Sections */}
      <CardPremium hover={false}>
        <div className="p-6 md:p-8">
          {activeTab === 'gestacional' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Dados Gestacionais
              </h3>
              <InputField
                label="Data prevista do parto"
                value={data.dataPrevistaParto}
                onChange={(v) => update('dataPrevistaParto', v)}
                type="date"
              />
              <InputField
                label="Semanas atuais"
                value={data.semanasAtuais}
                onChange={(v) => update('semanasAtuais', v)}
                placeholder="Ex: 24"
              />
              <InputField
                label="Gestações anteriores"
                value={data.gestacoesPrevias}
                onChange={(v) => update('gestacoesPrevias', v)}
                placeholder="Ex: 1"
              />
              <InputField
                label="Partos normais"
                value={data.partosNormais}
                onChange={(v) => update('partosNormais', v)}
                placeholder="Ex: 0"
              />
              <InputField
                label="Cesáreas"
                value={data.cesareas}
                onChange={(v) => update('cesareas', v)}
                placeholder="Ex: 1"
              />
            </div>
          )}

          {activeTab === 'saude' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Saúde
              </h3>
              <SelectField
                label="Tipo sanguíneo"
                value={data.tipoSanguineo}
                onChange={(v) => update('tipoSanguineo', v)}
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' },
                ]}
              />
              <InputField
                label="Condições crônicas"
                value={data.condicoesCronicas}
                onChange={(v) => update('condicoesCronicas', v)}
                placeholder="Ex: diabetes, hipertensão"
              />
              <InputField
                label="Alergias"
                value={data.alergias}
                onChange={(v) => update('alergias', v)}
                placeholder="Ex: penicilina, látex"
              />
              <InputField
                label="Medicamentos em uso"
                value={data.medicamentos}
                onChange={(v) => update('medicamentos', v)}
                placeholder="Liste os medicamentos"
              />
            </div>
          )}

          {activeTab === 'estilo' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Estilo de Vida
              </h3>
              <SelectField
                label="Prática de exercícios"
                value={data.exercicios}
                onChange={(v) => update('exercicios', v)}
                options={[
                  { value: 'nenhum', label: 'Nenhum' },
                  { value: 'leve', label: 'Leve (1-2x/semana)' },
                  { value: 'moderado', label: 'Moderado (3-4x/semana)' },
                  { value: 'intenso', label: 'Intenso (5+x/semana)' },
                ]}
              />
              <SelectField
                label="Alimentação"
                value={data.alimentacao}
                onChange={(v) => update('alimentacao', v)}
                options={[
                  { value: 'regular', label: 'Regular' },
                  { value: 'saudavel', label: 'Saudável' },
                  { value: 'restritiva', label: 'Restritiva' },
                ]}
              />
              <InputField
                label="Horas de sono por noite"
                value={data.horasSono}
                onChange={(v) => update('horasSono', v)}
                placeholder="Ex: 7"
              />
              <SelectField
                label="Tabagismo"
                value={data.tabagismo}
                onChange={(v) => update('tabagismo', v)}
                options={[
                  { value: 'nunca', label: 'Nunca' },
                  { value: 'parei', label: 'Parei na gestação' },
                  { value: 'ocasional', label: 'Ocasional' },
                ]}
              />
              <SelectField
                label="Consumo de álcool"
                value={data.alcool}
                onChange={(v) => update('alcool', v)}
                options={[
                  { value: 'nunca', label: 'Nunca' },
                  { value: 'parei', label: 'Parei na gestação' },
                  { value: 'ocasional', label: 'Ocasional' },
                ]}
              />
            </div>
          )}

          {activeTab === 'emocional' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Saúde Emocional
              </h3>
              <SelectField
                label="Nível de estresse"
                value={data.nivelEstresse}
                onChange={(v) => update('nivelEstresse', v)}
                options={[
                  { value: 'baixo', label: 'Baixo' },
                  { value: 'moderado', label: 'Moderado' },
                  { value: 'alto', label: 'Alto' },
                ]}
              />
              <SelectField
                label="Rede de apoio"
                value={data.redeApoio}
                onChange={(v) => update('redeApoio', v)}
                options={[
                  { value: 'boa', label: 'Boa' },
                  { value: 'regular', label: 'Regular' },
                  { value: 'limitada', label: 'Limitada' },
                ]}
              />
              <SelectField
                label="Acompanhamento psicológico"
                value={data.acompanhamentoPsicologico}
                onChange={(v) => update('acompanhamentoPsicologico', v)}
                options={[
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' },
                  { value: 'interesse', label: 'Tenho interesse' },
                ]}
              />
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-ml-rosa-200/30">
            <ButtonPremium onClick={handleSave}>
              Salvar alterações
            </ButtonPremium>
            {savedFeedback && (
              <span className="ml-3 text-sm text-ml-rosa-600 font-medium">
                ✓ Salvo
              </span>
            )}
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
