'use client';

interface AvatarPremiumProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
};

export function AvatarPremium({
  src,
  alt = '',
  size = 'md',
  className = '',
}: AvatarPremiumProps) {
  const sizeClass = sizes[size];

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover shadow-ml-sm border-2 border-white ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full bg-gradient-to-br from-ml-rosa-200 to-ml-rosa-300
        flex items-center justify-center text-white font-medium
        shadow-ml-sm border-2 border-white
        ${sizeClass} ${className}
      `}
    >
      ?
    </div>
  );
}
