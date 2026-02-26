'use client';

import { useState } from 'react';
import { getCategoryImage } from '@/lib/categoryImages';
import { getLabelForWeek } from '@/lib/journey/journeyLabels';

interface JourneyTimelineProps {
  currentWeek: number;
  totalWeeks?: number;
}

const TRIMESTER_LABELS: { range: [number, number]; label: string }[] = [
  { range: [1, 13], label: '1º trimestre' },
  { range: [14, 27], label: '2º trimestre' },
  { range: [28, 40], label: '3º trimestre' },
];

const BULLETS_BY_PHASE: Record<string, [string, string]> = {
  early: ['Primeiras transformações do corpo.', 'Pré-natal e ácido fólico em foco.'],
  mid: ['O bebê já ouve sua voz.', 'Movimentos mais perceptíveis.'],
  late: ['Preparação para o parto.', 'Bebê se posicionando.'],
};

function getWeekContent(week: number): { bullets: [string, string]; observe: string } {
  if (week >= 1 && week <= 13) {
    return {
      bullets: BULLETS_BY_PHASE.early,
      observe: 'Observe: enjoos, cansaço e alterações de humor. Mantenha acompanhamento pré-natal.',
    };
  }
  if (week >= 14 && week <= 27) {
    return {
      bullets: BULLETS_BY_PHASE.mid,
      observe: 'Observe: movimentos fetais, inchaço e pressão arterial. Ultrassom morfológico.',
    };
  }
  return {
    bullets: BULLETS_BY_PHASE.late,
    observe: 'Observe: contrações, perda de líquido, sangramento. Sinais de trabalho de parto.',
  };
}

export function JourneyTimeline({
  currentWeek,
  totalWeeks = 40,
}: JourneyTimelineProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const pastWeeks = weeks.filter((w) => w < currentWeek);
  const currentWeekData = weeks.find((w) => w === currentWeek);
  const futureWeeks = weeks.filter((w) => w > currentWeek);

  const getTrimesterForWeek = (w: number) =>
    TRIMESTER_LABELS.find((t) => w >= t.range[0] && w <= t.range[1])?.label ?? '';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-4">
        {pastWeeks.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-[#5F5F5F] uppercase tracking-wide mb-2">Já passou</h4>
            <div className="flex flex-wrap gap-2">
              {pastWeeks.slice(-12).map((week) => (
                <button
                  key={week}
                  type="button"
                  onClick={() => setSelectedWeek(week)}
                  className="flex flex-col items-center gap-0.5 p-2 rounded-lg border border-[#B3124F]/15 bg-[#FFF1F4]/20 hover:bg-[#FFF1F4]/40 transition-all"
                >
                  <span className="text-xs font-semibold text-[#B3124F]/80">{week}</span>
                  <span className="text-[10px] text-[#5F5F5F] max-w-[48px] truncate">{getLabelForWeek(week)}</span>
                  <span className="text-[9px] text-green-600 font-medium">Concluída</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentWeekData && (
          <div>
            <h4 className="text-xs font-semibold text-[#B3124F] uppercase tracking-wide mb-2">Atual</h4>
            <button
              type="button"
              onClick={() => setSelectedWeek(currentWeekData)}
              className="flex flex-col items-center gap-0.5 p-3 rounded-xl border-2 border-[#B3124F] bg-[#FFF1F4]/40 w-full max-w-[120px]"
            >
              <span className="text-lg font-bold text-[#B3124F]">{currentWeekData}</span>
              <span className="text-xs text-[#1C1C1C]">{getLabelForWeek(currentWeekData)}</span>
              <span className="text-[10px] text-[#B3124F] font-semibold">Atual</span>
            </button>
          </div>
        )}

        {futureWeeks.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-[#5F5F5F] uppercase tracking-wide mb-2">Próximos</h4>
            <div className="flex flex-wrap gap-2">
              {futureWeeks.slice(0, 12).map((week) => (
                <button
                  key={week}
                  type="button"
                  onClick={() => setSelectedWeek(week)}
                  className="flex flex-col items-center gap-0.5 p-2 rounded-lg border border-[#B3124F]/10 bg-white/50 hover:bg-[#FFF1F4]/20 transition-all"
                >
                  <span className="text-xs font-semibold text-[#5F5F5F]">{week}</span>
                  <span className="text-[10px] text-[#8E8E8E] max-w-[48px] truncate">{getLabelForWeek(week)}</span>
                  <span className="text-[9px] text-[#8E8E8E]">Em breve</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedWeek !== null && (
        <div className="flex-1 min-w-0">
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
              <h4 className="font-semibold text-[#1C1C1C] mb-2">Semana {selectedWeek}</h4>
              <p className="text-xs text-[#5F5F5F] mb-2">{getTrimesterForWeek(selectedWeek)} • {getLabelForWeek(selectedWeek)}</p>
              <ul className="space-y-1.5 mb-3">
                {getWeekContent(selectedWeek).bullets.map((b, i) => (
                  <li key={i} className="text-sm text-[#5F5F5F] flex items-start gap-2">
                    <span className="text-[#B3124F]">•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#B3124F] font-medium">{getWeekContent(selectedWeek).observe}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
