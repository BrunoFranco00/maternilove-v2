'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GlassCardV2 } from '@/premium/GlassCardV2';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { Section } from '@/components/ui/Section';
import { mockMaternalContext } from '@/modules/feed/mock/maternalContext.mock';
import { JourneyHeroCard } from '@/modules/journey/components/JourneyHeroCard';
import { JourneyTimeline } from '@/modules/journey/components/JourneyTimeline';

const DAILY_SUGGESTIONS = [
  { title: 'Nutrição', text: 'Inclua alimentos ricos em ferro hoje.' },
  { title: 'Movimento', text: 'Caminhada leve de 20 minutos.' },
  { title: 'Sono', text: 'Durma 8 horas se possível.' },
] as const;

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getEmotionalPhrase(week: number, baseMood?: string): string {
  if (baseMood === 'ANXIOUS') return 'Você está fazendo um trabalho incrível. Respire fundo.';
  if (baseMood === 'TIRED') return 'Cada dia é uma conquista. Descanse quando precisar.';
  if (week >= 20 && week <= 28) return 'Seu bebê já ouve sua voz. Fale com ele.';
  if (week >= 1 && week <= 12) return 'Os primeiros passos da jornada são especiais.';
  return 'Que etapa especial! Cuide de você.';
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

function JornadaContent() {
  const ctx = mockMaternalContext;
  const currentWeek = ctx.gestationalWeek ?? 24;
  const trimester = ctx.trimester ?? 2;

  const [dailyNote, setDailyNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<{ text: string; date: string }[]>([]);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveDay = () => {
    const trimmed = dailyNote.trim();
    if (!trimmed) return;
    setSavedNotes((prev) => [{ text: trimmed, date: formatDate(0) }, ...prev]);
    setDailyNote('');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const nextWeeks = [currentWeek + 1, currentWeek + 2, currentWeek + 3].filter((w) => w <= 40);

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-2xl mx-auto pb-16">
      {/* Hero 2.5D cinematográfico */}
      <motion.div {...fadeUp}>
        <JourneyHeroCard
          currentWeek={currentWeek}
          trimester={trimester}
          emotionalPhrase={getEmotionalPhrase(currentWeek, ctx.baseMood)}
        />
      </motion.div>

      {/* Timeline semanal */}
      <motion.section
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
      >
        <Section title="Sua linha do tempo" subtitle="Semanas 1 a 40">
          <GlassCardV2 className="py-4">
            <JourneyTimeline currentWeek={currentWeek} />
          </GlassCardV2>
        </Section>
      </motion.section>

      {/* Próximas semanas */}
      {nextWeeks.length > 0 && (
        <motion.section
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
        >
          <Section title="Próximas semanas" subtitle="O que vem pela frente">
            <div className="space-y-3">
              {nextWeeks.map((week) => (
                <GlassCardV2 key={week}>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-[#B3124F]">Semana {week}</span>
                      <p className="text-sm text-[#5F5F5F] mt-0.5">
                        {week <= 12 && '1º trimestre'}
                        {week > 12 && week <= 27 && '2º trimestre'}
                        {week > 27 && '3º trimestre'}
                      </p>
                    </div>
                    <span className="text-xs text-[#8E8E8E]">Em breve</span>
                  </div>
                </GlassCardV2>
              ))}
            </div>
          </Section>
        </motion.section>
      )}

      {/* Mensagem futura */}
      <motion.section
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
      >
        <GlassCardV2 className="bg-[#FFF1F4]/40 border-[#B3124F]/20">
          <p className="text-[#5F5F5F] text-sm text-center">
            Cada semana traz novas descobertas. Continue acompanhando sua evolução aqui.
          </p>
        </GlassCardV2>
      </motion.section>

      {/* Diário */}
      <motion.section
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.25 }}
      >
        <Section title="Diário" subtitle="Registre seus momentos do dia">
          <GlassCardV2>
            <div className="p-6 space-y-4">
              <textarea
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                placeholder="Como foi seu dia? O que você sentiu?"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#B3124F]/20 bg-[#FFF1F4]/30 text-[#1C1C1C] placeholder:text-[#5F5F5F]/70 focus:outline-none focus:ring-2 focus:ring-[#B3124F]/30 focus:border-[#B3124F]/40 transition-all duration-200 resize-none"
              />
              <div className="flex items-center gap-3">
                <PremiumButtonV3
                  onClick={handleSaveDay}
                  disabled={!dailyNote.trim()}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar dia
                </PremiumButtonV3>
                {savedFeedback && (
                  <span className="text-sm text-[#B3124F] font-medium">✓ Dia salvo</span>
                )}
              </div>
            </div>
          </GlassCardV2>
        </Section>
      </motion.section>

      {/* Sugestões do Dia */}
      <motion.section
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.3 }}
      >
        <Section title="Sugestões do dia">
          <div className="grid md:grid-cols-3 gap-4">
            {DAILY_SUGGESTIONS.map((item, i) => (
              <GlassCardV2 key={i}>
                <div className="p-5">
                  <h3 className="font-semibold text-[#B3124F] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#5F5F5F]">{item.text}</p>
                </div>
              </GlassCardV2>
            ))}
          </div>
        </Section>
      </motion.section>

      {/* Histórico */}
      <motion.section
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, delay: 0.35 }}
      >
        <Section title="Histórico" subtitle="Suas notas salvas">
          {savedNotes.length === 0 ? (
            <GlassCardV2>
              <div className="p-8 text-center">
                <p className="text-[#5F5F5F] text-sm">
                  Nenhuma nota salva ainda. Registre seu primeiro dia acima.
                </p>
              </div>
            </GlassCardV2>
          ) : (
            <div className="space-y-3">
              {savedNotes.map((note, i) => (
                <GlassCardV2 key={i}>
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-xs text-[#B3124F] font-medium">{note.date}</span>
                    <p className="text-sm text-[#1C1C1C] flex-1">{note.text}</p>
                  </div>
                </GlassCardV2>
              ))}
            </div>
          )}
        </Section>
      </motion.section>
    </div>
  );
}

export default function JornadaPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <JornadaContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
