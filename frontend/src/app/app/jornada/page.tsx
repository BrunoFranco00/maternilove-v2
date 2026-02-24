'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CardPremium } from '@/components/ui/CardPremium';
import { ButtonPremium } from '@/components/ui/ButtonPremium';
import { Section } from '@/components/ui/Section';

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

function JornadaContent() {
  const [currentWeek] = useState(24);
  const [dailyNote, setDailyNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<{ text: string; date: string }[]>([]);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveDay = () => {
    const trimmed = dailyNote.trim();
    if (!trimmed) return;

    setSavedNotes((prev) => [
      { text: trimmed, date: formatDate(0) },
      ...prev,
    ]);
    setDailyNote('');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          Jornada
        </h1>
        <p className="text-text-secondary mt-1">
          Acompanhe sua trajetória de maternidade
        </p>
      </div>

      {/* Card Diário Funcional */}
      <Section title="Diário" subtitle="Registre seus momentos do dia">
        <CardPremium>
          <div className="p-6 space-y-4">
            <textarea
              value={dailyNote}
              onChange={(e) => setDailyNote(e.target.value)}
              placeholder="Como foi seu dia? O que você sentiu?"
              rows={4}
              className="w-full px-4 py-3 rounded-ml-lg border border-ml-rosa-200/50 bg-ml-rosa-50/50 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-ml-rosa-300/50 focus:border-ml-rosa-300 transition-all duration-200 resize-none"
            />
            <div className="flex items-center gap-3">
              <ButtonPremium
                onClick={handleSaveDay}
                disabled={!dailyNote.trim()}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar dia
              </ButtonPremium>
              {savedFeedback && (
                <span className="text-sm text-ml-rosa-600 font-medium animate-fade-in-up">
                  ✓ Dia salvo com sucesso
                </span>
              )}
            </div>
          </div>
        </CardPremium>
      </Section>

      {/* Sugestões do Dia */}
      <Section title="Sugestões do dia">
        <div className="grid md:grid-cols-3 gap-4">
          {DAILY_SUGGESTIONS.map((item, i) => (
            <CardPremium key={i}>
              <div className="p-5">
                <h3 className="font-semibold text-ml-rosa-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary">{item.text}</p>
              </div>
            </CardPremium>
          ))}
        </div>
      </Section>

      {/* Histórico */}
      <Section title="Histórico" subtitle="Suas notas salvas">
        {savedNotes.length === 0 ? (
          <CardPremium hover={false}>
            <div className="p-8 text-center">
              <p className="text-text-secondary text-sm">
                Nenhuma nota salva ainda. Registre seu primeiro dia acima.
              </p>
            </div>
          </CardPremium>
        ) : (
          <div className="space-y-3">
            {savedNotes.map((note, i) => (
              <CardPremium key={i} hover={false}>
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs text-ml-rosa-600 font-medium">
                    {note.date}
                  </span>
                  <p className="text-sm text-text-primary flex-1">{note.text}</p>
                </div>
              </CardPremium>
            ))}
          </div>
        )}
      </Section>

      {/* Timeline */}
      <Section title="Timeline">
        <div className="space-y-3">
          {[
            { label: '1º trimestre', desc: 'Semanas 1-12' },
            { label: '2º trimestre', desc: 'Semanas 13-26' },
            { label: '3º trimestre', desc: 'Semanas 27-40' },
          ].map((item, i) => (
            <CardPremium key={i} hover={false}>
              <div className="p-4 flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentWeek <= 12
                      ? i === 0
                        ? 'bg-ml-rosa-500'
                        : 'bg-ml-rosa-200'
                      : currentWeek <= 26
                        ? i === 1
                          ? 'bg-ml-rosa-500'
                          : 'bg-ml-rosa-200'
                        : i === 2
                          ? 'bg-ml-rosa-500'
                          : 'bg-ml-rosa-200'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.label}
                  </p>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              </div>
            </CardPremium>
          ))}
        </div>
      </Section>
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
