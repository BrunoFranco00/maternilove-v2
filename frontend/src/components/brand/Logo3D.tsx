'use client';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { size: 'w-14 h-14', radius: 'rounded-[14px]' },
  md: { size: 'w-20 h-20', radius: 'rounded-[20px]' },
  lg: { size: 'w-24 h-24', radius: 'rounded-[24px]' }, // 96x96 padrão premium
};

export function Logo3D({ size = 'lg', className = '' }: Logo3DProps) {
  const { size: sizeClass, radius } = sizeConfig[size];

  return (
    <div
      className={`
        relative flex items-center justify-center
        bg-[radial-gradient(ellipse_at_center,_#C2185B_0%,_#8E0E3A_100%)]
        shadow-[0_8px_24px_rgba(194,24,91,0.25)]
        ${sizeClass} ${radius} ${className}
      `}
    >
      {/* Coração branco — 85% da área, com drop shadow */}
      <svg
        viewBox="0 0 24 24"
        className="w-[85%] h-[85%] text-white"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        }}
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
}
