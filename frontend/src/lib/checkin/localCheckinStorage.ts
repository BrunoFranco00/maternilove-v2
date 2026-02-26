/**
 * Persistência local de check-in para fluxo público (sem login).
 */

const STORAGE_KEY = 'maternilove-checkin-local';

export interface LocalCheckinState {
  lastMood: string;
  lastCheckinAt: string;
  streakCount: number;
  points: number;
}

const DEFAULT: LocalCheckinState = {
  lastMood: '',
  lastCheckinAt: '',
  streakCount: 0,
  points: 0,
};

function load(): LocalCheckinState {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<LocalCheckinState>;
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}

function save(state: LocalCheckinState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function isSameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}

/**
 * Registra check-in local e atualiza streak/pontos.
 */
export function persistLocalCheckin(mood: string): LocalCheckinState {
  const now = new Date().toISOString();
  const prev = load();

  let streak = prev.streakCount;
  let points = prev.points;

  if (!prev.lastCheckinAt) {
    streak = 1;
    points += 10;
  } else if (isSameDay(prev.lastCheckinAt, now)) {
    // já fez hoje, não altera streak
  } else if (isYesterday(prev.lastCheckinAt)) {
    streak = prev.streakCount + 1;
    points += 10 + Math.min(streak, 5);
  } else {
    streak = 1;
    points += 10;
  }

  const next: LocalCheckinState = {
    lastMood: mood,
    lastCheckinAt: now,
    streakCount: streak,
    points,
  };
  save(next);
  return next;
}

export function getLocalCheckinState(): LocalCheckinState {
  return load();
}
