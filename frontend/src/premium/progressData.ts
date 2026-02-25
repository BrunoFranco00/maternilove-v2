/**
 * Dados contextuais para a tela de Progresso
 */

export function getSizeComparison(week: number): string {
  const comparisons: Record<number, string> = {
    4: 'semente de papoula', 5: 'semente de gergelim', 6: 'lentilha',
    7: 'mirtilo', 8: 'framboesa', 9: 'cereja', 10: 'morangão',
    11: 'lima', 12: 'ameixa', 13: 'pêssego', 14: 'limão', 15: 'maçã',
    16: 'abacate', 17: 'pera', 18: 'batata-doce', 19: 'manga',
    20: 'banana', 21: 'cenoura', 22: 'mamão papaia', 23: 'toranja',
    24: 'espiga de milho', 25: 'couve-flor', 26: 'alface', 27: 'repolho',
    28: 'coco', 29: 'abóbora', 30: 'pepino', 31: 'coco', 32: 'jicama',
    33: 'abacaxi', 34: 'melão', 35: 'melão amarelo', 36: 'mamão',
    37: 'acelga', 38: 'alho-poró', 39: 'melancia', 40: 'melancia',
  };
  const clamped = Math.max(4, Math.min(40, week));
  return comparisons[clamped] ?? comparisons[24];
}

export function getEmotionalContext(week: number): string {
  if (week < 12) return 'Os primeiros laços emocionais começam a se formar. Reserve momentos de calma para conversar com seu bebê.';
  if (week < 24) return 'Ele já responde a sons e movimentos. Cantar e acariciar a barriga fortalece o vínculo.';
  if (week < 34) return 'O bebê reconhece sua voz. Continue falando com ele e compartilhe suas expectativas.';
  return 'O encontro está próximo. A conexão que vocês construíram vai guiá-lo nos primeiros momentos.';
}

export function getEstimatedLength(week: number): string {
  const cm: Record<number, string> = {
    8: '1,6 cm', 12: '6 cm', 16: '12 cm', 20: '25 cm', 24: '30 cm',
    28: '37 cm', 32: '42 cm', 36: '47 cm', 40: '51 cm',
  };
  const keys = Object.keys(cm).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
  return cm[nearest] ?? '~30 cm';
}

export function getEstimatedWeight(week: number): string {
  const g: Record<number, string> = {
    8: '1 g', 12: '14 g', 16: '100 g', 20: '300 g', 24: '600 g',
    28: '1 kg', 32: '1,7 kg', 36: '2,6 kg', 40: '3,4 kg',
  };
  const keys = Object.keys(g).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
  return g[nearest] ?? '~600 g';
}

export function getWeekMilestone(week: number): string {
  if (week < 12) return 'Formação dos órgãos principais';
  if (week < 20) return 'Movimentos perceptíveis';
  if (week < 28) return 'Sistema nervoso em desenvolvimento';
  if (week < 36) return 'Preparação para o parto';
  return 'Pronto para nascer';
}
