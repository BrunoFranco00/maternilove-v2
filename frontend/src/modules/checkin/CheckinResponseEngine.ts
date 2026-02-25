/**
 * CheckinResponseEngine — Resposta determinística para check-in emocional.
 * Não usa IA. Contrato futuro: refineWithAI(...) para personalização com IA.
 */

export type MoodType =
  | 'HAPPY'
  | 'CALM'
  | 'TIRED'
  | 'ANXIOUS'
  | 'SAD'
  | 'OVERWHELMED';

export interface CheckinEngineInput {
  weekNumber: number;
  mood: MoodType;
  phase: string;
  riskFlags?: string[];
}

export interface CheckinEngineOutput {
  title: string;
  message: string;
  suggestionLabel: string;
  suggestionAction: string;
  contentCategory: string;
}

const MOOD_MESSAGES: Record<MoodType, { title: string; message: string }> = {
  HAPPY: {
    title: 'Que bom saber!',
    message: 'Manter momentos de bem-estar é importante. Continue cuidando de você e celebrando as pequenas vitórias do dia.',
  },
  CALM: {
    title: 'Estado equilibrado',
    message: 'A calma ajuda no autocuidado e na conexão com o bebê. Respeite seu ritmo e seus limites.',
  },
  TIRED: {
    title: 'O cansaço faz parte',
    message: 'É comum sentir mais cansaço nesta fase. Priorize descanso e pequenas pausas ao longo do dia.',
  },
  ANXIOUS: {
    title: 'Respire fundo',
    message: 'A ansiedade é frequente na gravidez. Tente pausas de respiração lenta e atividades que te acalmem.',
  },
  SAD: {
    title: 'Seu sentimento é válido',
    message: 'É natural ter momentos mais difíceis. Conversar com alguém de confiança ou um profissional pode ajudar.',
  },
  OVERWHELMED: {
    title: 'Um passo de cada vez',
    message: 'Quando tudo parece demais, foque em uma coisa por vez. Peça ajuda quando precisar.',
  },
};

const SUGGESTIONS: Record<MoodType, { label: string; action: string; category: string }> = {
  HAPPY: { label: 'Meditação', action: 'Respirar', category: 'RELAXAMENTO' },
  CALM: { label: 'Leitura', action: 'Ler', category: 'CONTEUDO' },
  TIRED: { label: 'Descanso', action: 'Descansar', category: 'SONO' },
  ANXIOUS: { label: 'Exercício de respiração', action: 'Respirar', category: 'RELAXAMENTO' },
  SAD: { label: 'Conversar', action: 'Recursos', category: 'APOIO' },
  OVERWHELMED: { label: 'Lista de tarefas', action: 'Organizar', category: 'PRATICIDADE' },
};

/**
 * Gera resposta base para check-in. Determinístico, sem IA.
 * TODO: refineWithAI(output, context) para personalização futura com IA.
 */
export function generateCheckinResponse(input: CheckinEngineInput): CheckinEngineOutput {
  const moodData = MOOD_MESSAGES[input.mood];
  const suggestion = SUGGESTIONS[input.mood];

  return {
    title: moodData.title,
    message: moodData.message,
    suggestionLabel: suggestion.label,
    suggestionAction: suggestion.action,
    contentCategory: suggestion.category,
  };
}
