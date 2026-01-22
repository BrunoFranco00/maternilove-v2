'use client';

import { useMemo } from 'react';

const METRICS = [
  { label: 'Total de Usuários', value: '0' },
  { label: 'Usuários Ativos', value: '0' },
  { label: 'Novos Hoje', value: '0' },
  { label: 'Feature Flags', value: '6' },
] as const;

export default function AdminOverviewPage() {
  const metricsList = useMemo(() => METRICS, []);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Visão Geral
          </h1>
          <p className="text-gray-600">
            Painel administrativo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {metricsList.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.label}</h3>
              <p className="text-3xl font-bold text-gray-900" aria-label={`${metric.label}: ${metric.value}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
