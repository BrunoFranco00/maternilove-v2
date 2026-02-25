'use client';

import { useState } from 'react';
import { getCategoryImage } from '@/lib/categoryImages';

interface JourneyTimelineProps {
  currentWeek: number;
  totalWeeks?: number;
}

const TRIMESTER_LABELS: { range: [number, number]; label: string }[] = [
  { range: [1, 13], label: '1º trimestre' },
  { range: [14, 27], label: '2º trimestre' },
  { range: [28, 40], label: '3º trimestre' },
];

const WEEK_PLACEHOLDER = {
  bullets: ['Conteúdo em breve para esta semana.', 'Acompanhe as atualizações.', 'Sua jornada merece atenção especial.'],
};

function getWeekContent(week: number): { bullets: string[] } {
  if (week >= 20 && week <= 28) {
    return { bullets: ['O bebê já ouve sua voz.', 'Movimentos mais perceptíveis.', 'Ótimo momento para criar vínculo.'] };
  }
  if (week >= 1 && week <= 12) {
    return { bullets: ['Primeiras transformações do corpo.', 'Pré-natal no início.', 'Nutrição e ácido fólico em foco.'] };
  }
  if (week >= 28 && week <= 40) {
    return { bullets: ['Preparação para o parto.', 'Últimos ajustes na rotina.', 'Bebê se posicionando.'] };
  }
  return WEEK_PLACEHOLDER;
}

export function JourneyTimeline({
  currentWeek,
  totalWeeks = 40,
}: JourneyTimelineProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const getTrimesterForWeek = (w: number) =>
    TRIMESTER_LABELS.find((t) => w >= t.range[0] && w <= t.range[1])?.label ?? '';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="relative max-h-[280px] overflow-y-auto lg:w-24">
        <div className="flex justify-center gap-2 text-[10px] text-[#5F5F5F] mb-2">
          <span>1º: 1-13</span>
          <span>2º: 14-27</span>
          <span>3º: 28-40</span>
        </div>
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px min-h-full"
          style={{
            background: 'linear-gradient(180deg, rgba(194,24,91,0.1) 0%, rgba(194,24,91,0.4) 50%, rgba(194,24,91,0.1) 100%)',
          }}
        />
        <div className="relative flex flex-col items-center gap-0.5 py-3">
          {weeks.map((week) => {
            const isPast = week < currentWeek;
            const isCurrent = week === currentWeek;
            const isNext = week === currentWeek + 1;

            return (
              <button
                key={week}
                type="button"
                onClick={() => setSelectedWeek(week)}
                className="flex items-center justify-center relative z-10"
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                    transition-all duration-200 shrink-0 cursor-pointer
                    ${isCurrent ? 'scale-110' : ''}
                  `}
                  style={{
                    backgroundColor: isCurrent
                      ? '#C2185B'
                      : isNext
                        ? 'rgba(194,24,91,0.5)'
                        : isPast
                          ? 'rgba(194,24,91,0.12)'
                          : 'rgba(194,24,91,0.06)',
                    color: isCurrent ? '#fff' : isPast ? 'rgba(28,28,28,0.45)' : 'rgba(28,28,28,0.75)',
                    opacity: isPast ? 0.55 : 1,
                    boxShadow: isCurrent ? '0 4px 14px rgba(194,24,91,0.35)' : 'none',
                  }}
                >
                  {week}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedWeek !== null && (
        <div className="flex-1">
          <div className="rounded-[18px] overflow-hidden border border-[#B3124F]/15 bg-[#FFF1F4]/20">
            <div className="aspect-video w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getCategoryImage('GRAVIDEZ')}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-[#1C1C1C] mb-2">
                Semana {selectedWeek}
              </h4>
              <p className="text-xs text-[#5F5F5F] mb-3">{getTrimesterForWeek(selectedWeek)}</p>
              <ul className="space-y-1.5">
                {getWeekContent(selectedWeek).bullets.map((b, i) => (
                  <li key={i} className="text-sm text-[#5F5F5F] flex items-start gap-2">
                    <span className="text-[#B3124F]">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
