'use client';

import { GlassCardV2 } from '@/premium/GlassCardV2';

interface ContentCardProps {
  title: string;
  summary: string;
  image: string;
  isProfessional?: boolean;
  priority?: number;
}

export function ContentCard({
  title,
  summary,
  image,
  isProfessional = false,
  priority = 0,
}: ContentCardProps) {
  return (
    <div
      className="group block transition-all duration-250 ease-out rounded-[18px] overflow-hidden md:hover:-translate-y-[3px] md:hover:shadow-[0_16px_48px_rgba(127,14,54,0.18),0_0_20px_rgba(179,18,79,0.1)]"
      style={{
        boxShadow: '0 8px 28px rgba(127,14,54,0.12), 0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <GlassCardV2 className="p-0 overflow-hidden rounded-[18px] border-0">
        <div className="relative">
          <div className="aspect-[16/10] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          {isProfessional && (
            <span
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: 'rgba(179,18,79,0.9)',
                color: 'white',
              }}
            >
              Profissional
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-[#1C1C1C] text-base leading-tight line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-[#5F5F5F] mt-1.5 line-clamp-2 leading-relaxed">
            {summary}
          </p>
        </div>
      </GlassCardV2>
    </div>
  );
}
