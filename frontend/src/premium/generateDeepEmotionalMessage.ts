/**
 * Gera mensagem emocional profunda baseada em semana gestacional,
 * humor e entradas recentes do diário.
 */

export type Mood = 'feliz' | 'ansiosa' | 'cansada' | 'calma' | 'nostálgica' | 'neutra';

export interface DiaryEntry {
  text: string;
  sentiment?: string;
  date: string;
}

const SENTIMENT_KEYWORDS: Record<string, string[]> = {
  gratidao: ['gratidão', 'grata', 'grato', 'agradecida', 'abençoada', 'sorte'],
  amor: ['amor', 'querer', 'amando', 'coração', 'carinho'],
  medo: ['medo', 'preocupada', 'ansiosa', 'nervosa', 'incerteza'],
  cansaco: ['cansada', 'exausta', 'sono', 'fadiga', 'descansar'],
  alegria: ['feliz', 'alegre', 'felicidade', 'sorrindo', 'empolgada'],
  tristeza: ['triste', 'chorando', 'chateada', 'melancolia'],
  calma: ['calma', 'paz', 'serenidade', 'tranquila', 'equilibrada'],
  expectativa: ['ansiosa', 'esperando', 'expectativa', 'próximo', 'chegando'],
};

function extractSentiments(entries: DiaryEntry[]): string[] {
  const counts: Record<string, number> = {};
  for (const entry of entries.slice(-3)) {
    const text = (entry.text || '').toLowerCase();
    for (const [sentiment, keywords] of Object.entries(SENTIMENT_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        counts[sentiment] = (counts[sentiment] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([s]) => s);
}

const MESSAGES_BY_PHASE: Record<string, (sentiments: string[], mood: Mood) => string[]> = {
  early: (sentiments, mood) => [
    'Este começo é único. Cada dia é uma descoberta nova para você e para seu bebê.',
    'Cada pequeno passo conta. Você está construindo a base de um vínculo especial.',
    sentiments.includes('gratidao')
      ? 'Sua gratidão ressoa. Permitir-se sentir cada emoção faz parte do cuidado.'
      : sentiments.includes('medo')
        ? 'É natural ter receios. Você não está sozinha nessa jornada.'
        : 'Respire. Seu corpo está fazendo algo extraordinário.',
  ],
  mid: (sentiments, mood) => [
    'O meio da jornada traz intensidade. Você está mais forte do que imagina.',
    mood === 'cansada'
      ? 'O cansaço é sinal de que você está dando o seu melhor. Reserve momentos para você.'
      : mood === 'feliz'
        ? 'Sua alegria alimenta seu bebê. Celebre esses dias.'
        : 'Cada semana traz novas sensações. Confie no processo.',
    sentiments.includes('amor')
      ? 'O amor que você já sente é a melhor preparação para a maternidade.'
      : 'Você está no caminho certo. Siga confiando em você.',
  ],
  late: (sentiments, mood) => [
    'A reta final exige coragem — e você já mostrou que tem de sobra.',
    'Prepare-se com calma. Sua força e seu instinto vão guiá-la no parto.',
    sentiments.includes('medo') || mood === 'ansiosa'
      ? 'A ansiedade antes do parto é comum. Você está se preparando com sabedoria.'
      : 'Cada contração futura será um passo mais perto do encontro. Você consegue.',
    'Você está pronta. Confie em seu corpo e na equipe ao seu redor.',
  ],
};

export function generateDeepEmotionalMessage(
  week: number,
  mood: Mood,
  diaryEntries: DiaryEntry[]
): string {
  const sentiments = extractSentiments(diaryEntries);
  let phase: keyof typeof MESSAGES_BY_PHASE;
  let messages: string[];

  if (week < 12) {
    phase = 'early';
  } else if (week > 30) {
    phase = 'late';
  } else {
    phase = 'mid';
  }

  messages = MESSAGES_BY_PHASE[phase](sentiments, mood);
  const idx = Math.min(
    Math.floor(Math.random() * messages.length),
    messages.length - 1
  );
  return messages[idx];
}
