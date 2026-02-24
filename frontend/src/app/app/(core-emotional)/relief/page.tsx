'use client';

import { useMemo } from 'react';

const RELIEF_RESOURCES = [
  { title: 'Meditação', icon: '🧘', description: 'Exercícios de respiração e relaxamento' },
  { title: 'Música Relaxante', icon: '🎵', description: 'Playlists para acalmar e tranquilizar' },
  { title: 'Exercícios Físicos', icon: '💪', description: 'Atividades suaves para gestantes' },
  { title: 'Comunidade', icon: '👥', description: 'Acesso à comunidade' },
] as const;

export default function ReliefPage() {
  const resources = useMemo(() => RELIEF_RESOURCES, []);

  return (
    <div className="min-h-full p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-600">
            Recursos de Suporte
          </h1>
          <p className="text-gray-600">
            Recursos disponíveis
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((item, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`Acessar ${item.title}`}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
