'use client';

import { useState, useEffect, useCallback } from 'react';
import { PremiumButtonV3 } from '@/premium/PremiumButtonV3';
import { GlassCardV2 } from '@/premium/GlassCardV2';

const STORAGE_KEY = 'maternilove-emotional-history';

interface HistoryEntry {
  week: number;
  userText: string;
  response: string;
  date: string;
}

function getNarrativePhrases(week: number): string[] {
  const trimestre = week <= 12 ? 1 : week <= 26 ? 2 : 3;
  const base = [
    `Semana ${week} da sua gestação.`,
    `Você está no ${trimestre}º trimestre.`,
    'Cada dia é um passo na sua jornada.',
    'Como você está se sentindo hoje?',
  ];
  if (trimestre === 2) {
    base.push('O bebê já se mexe e responde aos sons.');
  } else if (trimestre === 3) {
    base.push('O encontro está cada vez mais próximo.');
  }
  return base;
}

function generateResponse(week: number, userText: string): string {
  const lower = userText.toLowerCase().trim();
  const trimestre = week <= 12 ? 1 : week <= 26 ? 2 : 3;

  if (lower.includes('cansad') || lower.includes('tired')) {
    return `Na semana ${week}, o cansaço é comum. Descanse quando puder e ouça seu corpo. Você está fazendo um trabalho incrível.`;
  }
  if (lower.includes('ansied') || lower.includes('nervos')) {
    return `A ansiedade na gestação é natural. Respire fundo. Na semana ${week}, seu bebê está seguro. Você não está sozinha.`;
  }
  if (lower.includes('feliz') || lower.includes('bem')) {
    return `Que bom saber que você está bem! Na semana ${week}, celebrar esses momentos faz toda a diferença. Continue assim.`;
  }
  if (lower.includes('medo') || lower.includes('preocup')) {
    return `É normal ter preocupações. Na semana ${week}, muitas mães sentem o mesmo. Converse com sua rede de apoio. Estamos aqui.`;
  }

  return `Obrigada por compartilhar. Na semana ${week} do ${trimestre}º trimestre, cada sentimento que você registra é válido. Cuide-se e permita-se descansar quando precisar.`;
}

export function EmotionalConnection({ week = 24 }: { week?: number }) {
  const [displayedPhrases, setDisplayedPhrases] = useState<string[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const phrases = getNarrativePhrases(week);

  useEffect(() => {
    setDisplayedPhrases([]);
    setCurrentPhraseIndex(0);
    setCurrentCharIndex(0);
    setIsComplete(false);
  }, [week]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    if (currentPhraseIndex >= phrases.length) {
      setIsComplete(true);
      return;
    }

    const phrase = phrases[currentPhraseIndex];
    if (currentCharIndex < phrase.length) {
      const timer = setTimeout(() => {
        setDisplayedPhrases((prev) => {
          const next = [...prev];
          if (!next[currentPhraseIndex]) next[currentPhraseIndex] = '';
          next[currentPhraseIndex] = phrase.slice(0, currentCharIndex + 1);
          return next;
        });
        setCurrentCharIndex((c) => c + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentPhraseIndex((p) => p + 1);
        setCurrentCharIndex(0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentPhraseIndex, currentCharIndex, phrases]);

  const handleRespond = useCallback(() => {
    setUserInput('');
    setResponse('');
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    const generated = generateResponse(week, trimmed);
    setResponse(generated);

    const entry: HistoryEntry = {
      week,
      userText: trimmed,
      response: generated,
      date: new Date().toISOString(),
    };

    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, [userInput, week, history]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setUserInput('');
    setResponse('');
  }, []);

  return (
    <GlassCardV2>
      <div className="p-6 space-y-4">
        <h3 className="font-title text-lg font-semibold text-premium-text-primary">
          Conexão emocional
        </h3>

        <div className="space-y-2 min-h-[120px]">
          {displayedPhrases.map((text, i) => (
            <p
              key={i}
              className="text-premium-text-secondary text-sm leading-relaxed animate-fade-in-up"
              style={{ animation: 'fadeInUp 0.4s ease-out' }}
            >
              {text}
              {i === currentPhraseIndex && currentCharIndex < phrases[i]?.length && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          ))}
        </div>

        {isComplete && (
          <div className="pt-2 animate-fade-in-up">
            <PremiumButtonV3 onClick={handleRespond}>Responder</PremiumButtonV3>
          </div>
        )}

        {history.length > 0 && (
          <details className="mt-4 pt-4 border-t border-premium-soft-bg">
            <summary className="text-sm text-premium-text-secondary cursor-pointer hover:text-premium-primary">
              Ver histórico ({history.length})
            </summary>
            <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {history.slice(0, 5).map((entry, i) => (
                <li key={i} className="text-xs text-premium-text-secondary">
                  <span className="font-medium">Semana {entry.week}:</span>{' '}
                  {entry.userText.slice(0, 50)}
                  {entry.userText.length > 50 ? '...' : ''}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-[20px] shadow-premium-card-hover w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-title text-lg font-semibold text-premium-text-primary mb-4">
              Como você está se sentindo?
            </h4>

            {!response ? (
              <>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Compartilhe o que está no seu coração..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-premium-primary/20 text-premium-text-primary placeholder:text-premium-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-premium-primary/50 resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <PremiumButtonV3 onClick={handleSubmit} disabled={!userInput.trim()}>
                    Enviar
                  </PremiumButtonV3>
                  <PremiumButtonV3 variant="ghost" onClick={handleCloseModal}>
                    Fechar
                  </PremiumButtonV3>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-premium-soft-bg/50 text-premium-text-primary text-sm leading-relaxed">
                  {response}
                </div>
                <PremiumButtonV3 onClick={handleCloseModal} className="mt-4">
                  Fechar
                </PremiumButtonV3>
              </>
            )}
          </div>
        </div>
      )}
    </GlassCardV2>
  );
}
