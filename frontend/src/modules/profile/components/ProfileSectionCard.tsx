'use client';

import { motion } from 'framer-motion';
import { GlassCardV2 } from '@/premium/GlassCardV2';

export type CompletionLevel = 'complete' | 'partial' | 'pending';

interface ProfileSectionCardProps {
  title: string;
  description: string;
  isComplete: boolean;
  completionLevel: CompletionLevel;
  onEdit: () => void;
}

const BADGE_CONFIG: Record<CompletionLevel, { label: string; className: string }> = {
  complete: {
    label: 'Completo',
    className: 'bg-[#B3124F]/15 text-[#B3124F]',
  },
  partial: {
    label: 'Parcial',
    className: 'bg-amber-500/15 text-amber-700',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-[#8E8E8E]/15 text-[#5F5F5F]',
  },
};

export function ProfileSectionCard({
  title,
  description,
  isComplete,
  completionLevel,
  onEdit,
}: ProfileSectionCardProps) {
  const badge = BADGE_CONFIG[completionLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group"
    >
      <GlassCardV2 className="transition-all duration-250 md:hover:shadow-[0_16px_48px_rgba(127,14,54,0.12)] md:hover:-translate-y-0.5">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#1C1C1C]">{title}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-[#5F5F5F]">{description}</p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-medium text-[#B3124F] hover:text-[#8E0E3A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B3124F]/30 focus-visible:ring-offset-2 rounded-lg px-3 py-1.5 -ml-1 transition-colors"
          >
            {isComplete ? 'Editar' : 'Completar'}
          </button>
        </div>
      </GlassCardV2>
    </motion.div>
  );
}
