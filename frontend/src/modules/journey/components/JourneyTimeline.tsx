'use client';

interface JourneyTimelineProps {
  currentWeek: number;
  totalWeeks?: number;
}

export function JourneyTimeline({
  currentWeek,
  totalWeeks = 40,
}: JourneyTimelineProps) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="relative max-h-[320px] overflow-y-auto">
      {/* Linha vertical central */}
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
            <div
              key={week}
              className="flex items-center justify-center relative z-10"
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-200 shrink-0
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
