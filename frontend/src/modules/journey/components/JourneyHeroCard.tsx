'use client';

import { motion } from 'framer-motion';
import { getCategoryImage } from '@/lib/categoryImages';
import Link from 'next/link';

interface JourneyHeroCardProps {
  currentWeek: number;
  trimester: number;
  emotionalPhrase: string;
}

export function JourneyHeroCard({
  currentWeek,
  trimester,
  emotionalPhrase,
}: JourneyHeroCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-[22px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg, #C2185B 0%, #A8144D 35%, #8E0E3A 100%)',
        boxShadow: '0 12px 40px rgba(142,14,58,0.3), 0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-sm font-medium">
            Semana {currentWeek}
          </span>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white/95"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            {trimester}º trimestre
          </span>
        </div>

        <p className="text-xl md:text-2xl font-semibold text-white leading-tight max-w-[280px]">
          {emotionalPhrase}
        </p>

        <div className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getCategoryImage('GRAVIDEZ')}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <Link
          href="/check-in"
          className="block w-full py-3 px-5 rounded-[16px] font-medium text-center transition-all duration-200 bg-white/95 text-[#8E0E3A] hover:bg-white active:scale-[0.98]"
        >
          E amanhã, como estarei, mamãe?
        </Link>
      </div>

      {/* Inner glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[22px]"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
