'use client';

interface ProfileCompletionBarProps {
  percentage: number;
}

export function ProfileCompletionBar({ percentage }: ProfileCompletionBarProps) {
  const value = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[#5F5F5F]">Perfil completo</span>
        <span className="font-semibold text-[#B3124F]">{value}%</span>
      </div>
      <div
        className="h-2.5 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255,241,244,0.8)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${value}%`,
            background: 'linear-gradient(90deg, #C2185B 0%, #B3124F 50%, #8E0E3A 100%)',
            boxShadow: '0 0 12px rgba(179,18,79,0.3)',
          }}
        />
      </div>
    </div>
  );
}
