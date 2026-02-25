'use client';

import { useRef, useEffect } from 'react';

interface ProgressTimelineProps {
  currentWeek: number;
  totalWeeks?: number;
}

export function ProgressTimeline({ currentWeek, totalWeeks = 40 }: ProgressTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pointWidth = 48;
    const scrollPos = Math.max(0, (currentWeek - 2) * pointWidth - el.clientWidth / 2);
    el.scrollTo({ left: scrollPos, behavior: 'smooth' });
  }, [currentWeek]);

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto overflow-y-hidden pb-2 -mx-1 scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex gap-2 min-w-max px-2 py-4">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => {
          const isActive = week === currentWeek;
          const isPast = week < currentWeek;
          return (
            <div
              key={week}
              className="flex flex-col items-center shrink-0"
              style={{ width: 48 }}
            >
              <div
                className={`
                  w-4 h-4 rounded-full border-2 transition-all duration-300
                  ${isActive ? 'scale-[1.2] border-[#B3124F] bg-[#B3124F] shadow-[0_0_12px_rgba(179,18,79,0.5)]' : ''}
                  ${isPast && !isActive ? 'border-[#B3124F]/60 bg-[#B3124F]/30' : ''}
                  ${!isPast && !isActive ? 'border-[#B3124F]/20 bg-transparent' : ''}
                `}
              />
              {week % 4 === 0 && (
                <span className="text-[9px] text-[#5F5F5F] mt-1 font-medium">
                  {week}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Linha progressiva */}
      <div className="h-0.5 mx-4 rounded-full bg-[#B3124F]/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#B3124F]/50 to-[#B3124F] transition-all duration-500"
          style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
        />
      </div>
    </div>
  );
}
